/*
 * Copyright (c) 2017 Frinx s.r.o. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.google.common.base.Optional;
import com.google.common.base.Preconditions;
import com.google.common.util.concurrent.CheckedFuture;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.controller.md.sal.binding.api.ReadWriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.AsyncTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChain;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChainListener;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwEthernetContainerPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwEthernetContainerPacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.air._interface.capability.g.SupportedChannelPlanList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.channel.plan.type.g.TransmissionModeList;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.wirelesspowercontrol.rev160919.StartOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.wirelesspowercontrol.rev160919.StartOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.wirelesspowercontrol.rev160919.WirelessPowerControlService;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by lbeles on 20.4.2017.
 * Implement RPC of the Power Control Implementation
 * Saving and reading data from config datastore
 */
public class WirelessPowerControlImpl implements AutoCloseable, WirelessPowerControlService, TransactionChainListener {
	private Object lock = new Object();
	private static final Logger LOG = LoggerFactory.getLogger(WirelessPowerControlImpl.class);

	private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
			.create(NetworkTopology.class)
			.child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));
	public static final String LAYER_PROTOCOL = "MWPS";

	private DataBroker dataBroker;
	private BindingAwareBroker.RpcRegistration registration;
	private MountPointService mountService;

	private ScheduledExecutorService scheduledExecutorService;
	private ScheduledFuture scheduledFuture;

	/**
	 * Here everything are initialized. Databroker, executor scheduler for timer and registration for datatree changelistener.
	 * @param providerContext
	 * @param rpcProviderRegistry
     */
	public WirelessPowerControlImpl(BindingAwareBroker.ProviderContext providerContext, final RpcProviderRegistry rpcProviderRegistry) {
		this.dataBroker = providerContext.getSALService(DataBroker.class);
		this.mountService = providerContext.getSALService(MountPointService.class);
		this.registration = rpcProviderRegistry.addRpcImplementation(WirelessPowerControlService.class, this);

		// config executor scheduler, where will be maximally one job.
		scheduledExecutorService = Executors.newScheduledThreadPool(10);
		try {
			scheduledFuture = scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this),15, 15, TimeUnit.SECONDS);
		} catch (Exception e) {
			LOG.error(e.getMessage(),e);
		}
	}


	/**
	 * Clean up information
	 * @throws Exception
     */
	@Override
	public void close() throws Exception {
		if (this.registration != null) {
			this.registration.close();
		}

		if (scheduledFuture != null) {
			scheduledFuture.cancel(false);
		}

		if (scheduledExecutorService != null) {
			scheduledExecutorService.shutdown();
		}
	}


	@Override
	public void onTransactionChainFailed(TransactionChain<?, ?> transactionChain, AsyncTransaction<?, ?> asyncTransaction, Throwable throwable) {

	}

	@Override
	public void onTransactionChainSuccessful(TransactionChain<?, ?> transactionChain) {

	}

	@Override
	public Future<RpcResult<StartOutput>> start() {
        LOG.info("Start Power Control System");
		boolean result = false;
		synchronized (lock) {
			result = processNetworkDevices();
		}


        StartOutputBuilder startBuilder = new StartOutputBuilder();
        startBuilder.setStatus(result ? "ok" : "failed");
        return RpcResultBuilder.success(startBuilder.build()).buildFuture();
	}

	/**
	 * Start wireless power control process.
	 * @return
	 */
	public boolean processNetworkDevices() {
		ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();
		CheckedFuture<Optional<Topology>, ReadFailedException> topology = transaction.read(LogicalDatastoreType.OPERATIONAL,NETCONF_TOPO_IID);

		try {
			Optional<Topology> optTopology = topology.checkedGet();
			List<Node> nodeList = optTopology.get().getNode();
			for (Node node : nodeList) { // loop all nodes from topology
				LOG.info("Node : {}", node.getKey().getNodeId());
				processNode(node.getKey());
			}
		} catch (Exception e) {
			LOG.error(e.getMessage(),e);
			return false;
		}
		return true;
	}



	/**
	 * Process device which has MWAirInterfacePac
	 * @param nodeKey
	 */
	private void processNode(NodeKey nodeKey) throws Exception {
		final Optional<MountPoint> xrNodeOptional = mountService.getMountPoint(NETCONF_TOPO_IID.child(Node.class, nodeKey));

		// try to mount the device
		Preconditions.checkArgument(xrNodeOptional.isPresent(), "Unable to locate mountpoint: %s, not mounted yet or not configured", nodeKey.getNodeId().getValue());
		final MountPoint xrNode = xrNodeOptional.get();
		final DataBroker xrNodeBroker = xrNode.getService(DataBroker.class).get();


		LOG.info("We found the suitable device : {}", nodeKey);
		// retrieve list of universal IDs which need to retrieve MWAirInterfacePac
		List<UniversalId> universalIdList = retrieveUniversalId(xrNodeBroker);
		LOG.info("We found universalIds, the list is {} ",universalIdList);
		if (universalIdList != null && universalIdList.size() > 0) {
			for (UniversalId uuid : universalIdList) {
				LOG.info("Process uuid {} ",uuid);
				ReadWriteTransaction mwTransaction = null;
				try {
                    mwTransaction = xrNodeBroker.newReadWriteTransaction();
                    InstanceIdentifier<MwEthernetContainerPac> pathEthernetContainer = InstanceIdentifier.builder(MwEthernetContainerPac.class, new MwEthernetContainerPacKey(uuid)).build();
                    MwEthernetContainerPac ethernetContainerPac = readEthernetContainer(mwTransaction, pathEthernetContainer);

                    InstanceIdentifier<MwAirInterfacePac> pathAirInterface = InstanceIdentifier.builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(uuid)).build();
                    MwAirInterfacePac airInterfacePac = readAirInterface(mwTransaction, pathAirInterface);
					mwTransaction.submit();

                    if (ethernetContainerPac != null && airInterfacePac != null) {
                        WirelessPowerControlInputData input = prepareInputDataFake(ethernetContainerPac, airInterfacePac);
						WirelessPowerCalculator calculator = new WirelessPowerCalculator(input,airInterfacePac);
						while (calculator.isNeededChangeModulationAndPower()) {
							LOG.info("We are going to change modulation: {} and power: {} ", calculator.getModulationMin(),calculator.getTxPower());
							mwTransaction = xrNodeBroker.newReadWriteTransaction();
							merge(mwTransaction, pathAirInterface, calculator.getAirInterfacePac());

							Thread.sleep(1000); // we tune air interface step by step
						}
                    }
                } catch (Exception e) {
					// in case if something strange was happened
					if (mwTransaction != null) {
						mwTransaction.cancel();
					}
					LOG.error(e.getMessage(),e);
					throw e;
				}
			}

		}
	}

	private WirelessPowerControlInputData prepareInputDataFake(MwEthernetContainerPac ethernetContainerPac, MwAirInterfacePac airInterfacePac) {
		WirelessPowerControlInputData inputData = new WirelessPowerControlInputData();

		// read the current throughput
		Integer currentThroughput = 500;
		inputData.setCurrentThroughput(currentThroughput);

		// read the historical throughput
		Integer historicalThroughput = 500;
		inputData.setHistoricalThroughput(historicalThroughput);


		// read data to calculate the current capacity
		inputData.setTxChannelBandwidth(500000);
		inputData.setModulationCur((short)64);
		inputData.setCodeRateCur((byte)1);

		//read data in order to tune down the power step by step,
		inputData.setRxLevelCur((byte)10);

		// read the current power
		inputData.setTxPower((byte)100);

		inputData.setModulationMin((short)1000);

		// read rx Threshold
		Short rxThreshold = (short)50;
		inputData.setRxThreshold(rxThreshold);

		return inputData;
	}

    private WirelessPowerControlInputData prepareInputData(MwEthernetContainerPac ethernetContainerPac, MwAirInterfacePac airInterfacePac) {
        WirelessPowerControlInputData inputData = new WirelessPowerControlInputData();

		// read the current throughput
		Integer currentThroughput = ethernetContainerPac.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList().get(0).getPerformanceData().getTxEthernetBytesMaxS();
		inputData.setCurrentThroughput(currentThroughput);

		// read the historical throughput
		Integer historicalThroughput = ethernetContainerPac.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList().get(0).getPerformanceData().getTxEthernetBytesMaxS();
		inputData.setHistoricalThroughput(historicalThroughput);


		// read data to calculate the current capacity
		inputData.setTxChannelBandwidth(airInterfacePac.getAirInterfaceConfiguration().getTxChannelBandwidth());
        inputData.setModulationCur(airInterfacePac.getAirInterfaceStatus().getModulationCur());
        inputData.setCodeRateCur(airInterfacePac.getAirInterfaceStatus().getCodeRateCur());

		//read data in order to tune down the power step by step,
        inputData.setRxLevelCur(airInterfacePac.getAirInterfaceStatus().getRxLevelCur());

        // read current min and max modulation
		inputData.setModulationMin(airInterfacePac.getAirInterfaceConfiguration().getModulationMin());
        inputData.setModulationMax(airInterfacePac.getAirInterfaceConfiguration().getModulationMax());

		// read the current power
        inputData.setTxPower(airInterfacePac.getAirInterfaceConfiguration().getTxPower());


		// read rx Threshold
		Short rxThreshold = getRxThreshold(airInterfacePac, inputData.getTxChannelBandwidth(), inputData.getModulationCur(), inputData.getCodeRateCur());
		inputData.setRxThreshold(rxThreshold);

        return inputData;
    }

	private Short getRxThreshold(MwAirInterfacePac airInterfacePac,Integer txChannelBandwidth, Short modulationCur, Byte codeRateCur) {
		for (SupportedChannelPlanList supportedChannelPlanList :  airInterfacePac.getAirInterfaceCapability().getSupportedChannelPlanList()) {
			if (supportedChannelPlanList.getTransmissionModeList() == null) {
				continue;
			}
			for (TransmissionModeList transmissionModeList : supportedChannelPlanList.getTransmissionModeList()) {
				if (transmissionModeList.getChannelBandwidth().equals(txChannelBandwidth) &&  transmissionModeList.getModulationScheme().equals(modulationCur)
					&& transmissionModeList.getCodeRate().equals(codeRateCur)) {
					return transmissionModeList.getRxThreshold();
				}
			}
		}
		return null;
	}

	private void merge(ReadWriteTransaction mwTransaction, InstanceIdentifier<MwAirInterfacePac> pathAirInterface, MwAirInterfacePac output) {
        // store new information to config datastore
        LOG.info("Start merging data to device");
        mwTransaction.merge(LogicalDatastoreType.CONFIGURATION, pathAirInterface, output);
        LOG.info("Start submiting data to device");
        mwTransaction.submit();
        LOG.info("Device was changed");
    }


    /**
	 * Read information from mounted node. Result is MWAirInterfacePac
	 * @param xrNodeReadTx
	 * @param path
	 * @return
	 * @throws ReadFailedException
	 */
	private MwAirInterfacePac readAirInterface(ReadWriteTransaction xrNodeReadTx, InstanceIdentifier<MwAirInterfacePac> path) throws ReadFailedException {
		Optional<MwAirInterfacePac> data;
		data = xrNodeReadTx.read(LogicalDatastoreType.CONFIGURATION, path).checkedGet();
		if (data.isPresent()) {
			return data.get();
		}
		return null;
	}

    /**
     * Read information from mounted node. Result is MwEthernetContainerPac
     * @param xrNodeReadTx
     * @param path
     * @return
     * @throws ReadFailedException
     */
    private MwEthernetContainerPac readEthernetContainer(ReadWriteTransaction xrNodeReadTx, InstanceIdentifier<MwEthernetContainerPac> path) throws ReadFailedException {
        Optional<MwEthernetContainerPac> data;
        data = xrNodeReadTx.read(LogicalDatastoreType.CONFIGURATION, path).checkedGet();
        if (data.isPresent()) {
            return data.get();
        }
        return null;
    }

	/**
	 * Search UUID in has already mounted device. Loop all Logical Termination Point and then loop all Layer Protocol.
	 * We search layer protocols which are MWPS
	 * @param xrNodeBroker
	 * @return
	 */
	private List<UniversalId> retrieveUniversalId(DataBroker xrNodeBroker) {
		List<UniversalId> list = new ArrayList<>();
		ReadOnlyTransaction networkElementTransaction = null;
		try {
			// read network elements
			InstanceIdentifier<NetworkElement> path = InstanceIdentifier.create(NetworkElement.class);
			networkElementTransaction = xrNodeBroker.newReadOnlyTransaction();
			Optional<NetworkElement> networkElementOpt = networkElementTransaction.read(LogicalDatastoreType.OPERATIONAL, path).checkedGet();

			if (networkElementOpt.isPresent()) {
				NetworkElement networkElement = networkElementOpt.get();
				LOG.debug("Network element. An uuid {}",networkElement.getUuid());
				if (networkElement.getLtp() != null) { // loop Logical Termination Point
					for (Ltp ltp : networkElement.getLtp()) {
						LOG.debug("Logical Termination Point. An uuid {}",ltp.getUuid());
						for (Lp lp : ltp.getLp()) { // loop Layer Protocol
							LOG.debug("Layer Protocol. An uuid {}",ltp.getUuid());
							if (LAYER_PROTOCOL.equals(lp.getLayerProtocolName().getValue())) { //if it is MWPS we have one
								LOG.info("We found the MWPS, An uuid: "+lp.getKey().getUuid());
								list.add(lp.getKey().getUuid());
							}

						}
					}
				}
			}
			networkElementTransaction.close();

		} catch (Exception e) {
			if (networkElementTransaction != null) {
				networkElementTransaction.close();
			}
			LOG.error(e.getMessage(),e);

		}

		return list;
	}
}

/**
 * This is the timer job. Class which is based on the Runnable. The asynchronic job execute process on the devices
 */
class TimerJob implements Runnable {
	private static final Logger LOG = LoggerFactory.getLogger(TimerJob.class);
	private WirelessPowerControlImpl impl;

	public TimerJob(WirelessPowerControlImpl impl) {
		this.impl = impl;
	}

	@Override
	public void run() {
		LOG.info("Timer start ");
		impl.processNetworkDevices();
		LOG.info("Timer end ");
	}
}