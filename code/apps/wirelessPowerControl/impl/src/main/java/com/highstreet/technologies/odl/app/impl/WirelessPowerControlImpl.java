/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
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
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.ChannelPlanType;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePacBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwEthernetContainerPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwEthernetContainerPacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ethernet.container.current.performance.g.CurrentPerformanceDataList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ethernet.container.historical.performances.g.HistoricalPerformanceDataList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfiguration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfigurationBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNodeConnectionStatus;
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
	private static final Logger LOG = LoggerFactory.getLogger(WirelessPowerControlImpl.class);

	private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
			.create(NetworkTopology.class)
			.child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));
	public static final String SUITABLE_CAPABILITY = "MicrowaveModel-ObjectClasses-AirInterface";
	public static final String LAYER_PROTOCOL = "MWPS";
	public static final String CONTROLLER_CONFIG = "controller-config";

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
			scheduledFuture = scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this),10, 5, TimeUnit.SECONDS);
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

		boolean result = processNetworkDevices();

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
//				if (canProcessDevice(node)) { // check if we can process it
					processNode(node.getKey());
//				}
			}
		} catch (Exception e) {
			LOG.error(e.getMessage(),e);
			return false;
		}
		return true;
	}

	/**
	 * If device is connected and has specifically capability then this device is suitable for the process
	 * @param deviceNode
	 * @return
	 */
	private boolean canProcessDevice(Node deviceNode) {
		NetconfNode nnode = deviceNode.getAugmentation(NetconfNode.class);
		String deviceName = deviceNode.getKey().getNodeId().getValue();
		if (nnode != null && !CONTROLLER_CONFIG.equalsIgnoreCase(deviceName) && nnode.getAvailableCapabilities() != null
				&& nnode.getAvailableCapabilities().getAvailableCapability() != null) {

			boolean hasCapability = false;
			for (String capability : nnode.getAvailableCapabilities().getAvailableCapability()) {
				if (capability.contains(SUITABLE_CAPABILITY)) {
					hasCapability = true;
				}
			}

			if (hasCapability && nnode.getConnectionStatus() == NetconfNodeConnectionStatus.ConnectionStatus.Connected) {
				return true;
			}
		}
		return false;

	}

	/**
	 * Process device which has MWAirInterfacePac
	 * @param nodeKey
	 */
	private void processNode(NodeKey nodeKey) {
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

                    if (ethernetContainerPac != null && airInterfacePac != null) {
                        WirelessPowerControlInputData input = prepareInputData(ethernetContainerPac, airInterfacePac);

                        MwAirInterfacePac output = calculateWirelessPowerControl(input, airInterfacePac);

                        merge(mwTransaction, pathAirInterface, output);
                    } else {
                        LOG.info("Cannot process power control, because the required data is missing");
                        mwTransaction.submit();
                    }


                } catch (Exception e) {
					// in case if something strange was happened
					if (mwTransaction != null) {
						mwTransaction.cancel();
					}
					LOG.error(e.getMessage(),e);
				}
			}

		}

	}

    private WirelessPowerControlInputData prepareInputData(MwEthernetContainerPac ethernetContainerPac, MwAirInterfacePac airInterfacePac) {
        WirelessPowerControlInputData inputData = new WirelessPowerControlInputData();

        List<CurrentPerformanceDataList> currentPerformanceDataLists = ethernetContainerPac.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList();
        List<HistoricalPerformanceDataList> historicalPerformanceDataList = ethernetContainerPac.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList();

        inputData.setCurrentPerformanceDataLists(currentPerformanceDataLists);
        inputData.setHistoricalPerformanceDataList(historicalPerformanceDataList);

        inputData.setTxChannelBandwidth(airInterfacePac.getAirInterfaceConfiguration().getTxChannelBandwidth());
        inputData.setModulationCur(airInterfacePac.getAirInterfaceStatus().getModulationCur());
        inputData.setCodeRateCur(airInterfacePac.getAirInterfaceStatus().getCodeRateCur());
        inputData.setRxLevelCur(airInterfacePac.getAirInterfaceStatus().getRxLevelCur());
        inputData.setModulationMin(airInterfacePac.getAirInterfaceConfiguration().getModulationMin());
        inputData.setModulationMax(airInterfacePac.getAirInterfaceConfiguration().getModulationMax());
        inputData.setTxPower(airInterfacePac.getAirInterfaceConfiguration().getTxPower());

//        AirInterfaceCapability::ChannelPlanType::TransmissionModeType::rxThreshold
//        TransmissionModeType::channelBandwidth	Used to calculate the capacity   of each modulation
//        TransmissionModeType::modulationScheme	Used to calculate the capacity   of each modulation
//        TransmissionModeType::codeRate	Used to calculate the capacity   of each modulation
//        TransmissionModeType::rxThreshold	Used to calculate the rx level   needed by a modulation scheme, by formula: ExpectedReceivedLevel =   rxThreshold + GuaranteedMargin
//        TransmissionModeType::txPowerMin	Used to decide the min power can   be set
//        TransmissionModeType::txPowerMax

//        airInterfacePac.getAirInterfaceCapability().getSupportedChannelPlanList().get(0).getTransmissionModeList().get(0).getTxPowerMin();


        return inputData;
    }

    private void merge(ReadWriteTransaction mwTransaction, InstanceIdentifier<MwAirInterfacePac> pathAirInterface, MwAirInterfacePac output) {
        // store new information to config datastore
        LOG.info("Start merging data to device");
        mwTransaction.merge(LogicalDatastoreType.CONFIGURATION, pathAirInterface, output);
        LOG.info("Start submiting data to device");
        mwTransaction.submit();
        LOG.info("Device was changed");
    }

    private MwAirInterfacePac calculateWirelessPowerControl(WirelessPowerControlInputData input, MwAirInterfacePac oldAirInterfacePac) {
        short modulationMin = input.getModulationMin();
        byte txPower = input.getTxPower();

        Double txCapacity = input.getTxChannelBandwidth() * log2(input.getModulationCur()) * input.getCodeRateCur()/ 1.15;

        return createOutput(oldAirInterfacePac, modulationMin, txPower);
    }

    private MwAirInterfacePac createOutput(MwAirInterfacePac oldAirInterfacePac, short modulationMin, byte txPower) {
        MwAirInterfacePacBuilder mWAirInterfacePacBuilder = new MwAirInterfacePacBuilder(oldAirInterfacePac);
        AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(oldAirInterfacePac.getAirInterfaceConfiguration());
        configurationBuilder.setModulationMin(modulationMin);
        configurationBuilder.setTxPower(txPower);
        mWAirInterfacePacBuilder.setAirInterfaceConfiguration(configurationBuilder.build());
        return mWAirInterfacePacBuilder.build();
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

    private double log2( double a) {
        return Math.log(a) / Math.log(2);
    }
}

class WirelessPowerControlInputData {
    private List<CurrentPerformanceDataList> currentPerformanceDataLists = null; //currentPerformanceDataLists.get(0).getPerformanceData().getTxEthernetBytesMaxS();
    private List<HistoricalPerformanceDataList> historicalPerformanceDataList = null; //historicalPerformanceDataList.get(0).getPerformanceData().getTxEthernetBytesMaxS();
    private Integer txChannelBandwidth;
    private Short modulationCur;
    private Byte codeRateCur;
    private Byte rxLevelCur;
    private short modulationMin;
    private short modulationMax;
    private byte txPower;


    public List<CurrentPerformanceDataList> getCurrentPerformanceDataLists() {
        return currentPerformanceDataLists;
    }

    public void setCurrentPerformanceDataLists(List<CurrentPerformanceDataList> currentPerformanceDataLists) {
        this.currentPerformanceDataLists = currentPerformanceDataLists;
    }

    public List<HistoricalPerformanceDataList> getHistoricalPerformanceDataList() {
        return historicalPerformanceDataList;
    }

    public void setHistoricalPerformanceDataList(List<HistoricalPerformanceDataList> historicalPerformanceDataList) {
        this.historicalPerformanceDataList = historicalPerformanceDataList;
    }

    public Integer getTxChannelBandwidth() {
        return txChannelBandwidth;
    }

    public void setTxChannelBandwidth(Integer txChannelBandwidth) {
        this.txChannelBandwidth = txChannelBandwidth;
    }

    public Short getModulationCur() {
        return modulationCur;
    }

    public void setModulationCur(Short modulationCur) {
        this.modulationCur = modulationCur;
    }

    public Byte getCodeRateCur() {
        return codeRateCur;
    }

    public void setCodeRateCur(Byte codeRateCur) {
        this.codeRateCur = codeRateCur;
    }

    public Byte getRxLevelCur() {
        return rxLevelCur;
    }

    public void setRxLevelCur(Byte rxLevelCur) {
        this.rxLevelCur = rxLevelCur;
    }

    public short getModulationMin() {
        return modulationMin;
    }

    public void setModulationMin(short modulationMin) {
        this.modulationMin = modulationMin;
    }

    public short getModulationMax() {
        return modulationMax;
    }

    public void setModulationMax(short modulationMax) {
        this.modulationMax = modulationMax;
    }

    public byte getTxPower() {
        return txPower;
    }

    public void setTxPower(byte txPower) {
        this.txPower = txPower;
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
//		LOG.info("Timer start ");
//		impl.processNetworkDevices();
//		LOG.info("Timer end ");
	}
}