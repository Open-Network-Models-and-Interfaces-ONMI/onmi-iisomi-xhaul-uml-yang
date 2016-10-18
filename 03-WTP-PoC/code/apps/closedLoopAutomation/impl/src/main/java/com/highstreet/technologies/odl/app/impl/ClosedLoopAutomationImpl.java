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
import java.util.Date;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.DataTreeIdentifier;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.controller.md.sal.binding.api.ReadWriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.AsyncTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChain;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChainListener;
import org.opendaylight.controller.md.sal.common.api.data.TransactionCommitFailedException;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160710.UniversalId;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160811.NetworkElement;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160811.logicalterminationpoint.LpList;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160811.networkelement.LtpRefList;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.airinterface.rev160901.MWAirInterfacePac;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.airinterface.rev160901.MWAirInterfacePacBuilder;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.airinterface.rev160901.MWAirInterfacePacKey;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.airinterface.rev160901.mw_airinterface_pac.AirInterfaceConfigurationBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNodeConnectionStatus;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ClosedLoopAutomationService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ReadTimerOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ReadTimerOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.SaveTimerInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.SaveTimerOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.SaveTimerOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StartOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StartOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.Timer;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.TimerConfig;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.TimerConfigBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.opendaylight.yangtools.concepts.ListenerRegistration;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by lbeles on 11.10.2016.
 * Implement RPC of the closed loop automation
 * Saving and reading data from config datastore
 */
public class ClosedLoopAutomationImpl implements AutoCloseable, ClosedLoopAutomationService, TransactionChainListener {
	private static final Logger LOG = LoggerFactory.getLogger(ClosedLoopAutomationImpl.class);

	private static final Boolean TIMER_DEFAULT_ENABLED = Boolean.FALSE;
	private static final Timer.Option TIMER_DEFAULT_OPTION = Timer.Option._5seconds;
	private static final InstanceIdentifier<TimerConfig> TIMER_SETTING_PATH = InstanceIdentifier.create(TimerConfig.class);
	private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
						 .create(NetworkTopology.class)
			     		 .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));
	public static final String SUITABLE_CAPABILITY = "http://netconfcentral.org/ns/yuma-proc";
	public static final String LAYER_PROTOCOL = "MWPS";

	private DataBroker dataBroker;
	private BindingAwareBroker.RpcRegistration registration;
	private MountPointService mountService;

	private ScheduledExecutorService scheduledExecutorService;
	private ScheduledFuture scheduledFuture;
	private ListenerRegistration dataTreeChangeHandler;

	/**
	 * Here everything are initialized. Databroker, executor scheduler for timer and registration for datatree changelistener.
	 * @param providerContext
	 * @param rpcProviderRegistry
     */
	public ClosedLoopAutomationImpl(BindingAwareBroker.ProviderContext providerContext,  final RpcProviderRegistry rpcProviderRegistry) {
		this.dataBroker = providerContext.getSALService(DataBroker.class);
		this.mountService = providerContext.getSALService(MountPointService.class);
		this.registration = rpcProviderRegistry.addRpcImplementation(ClosedLoopAutomationService.class, this);

		// registration for data tree change lister. Listener listens whether some device is connected or disconnected
		dataTreeChangeHandler = dataBroker.registerDataTreeChangeListener(new DataTreeIdentifier<Topology>(LogicalDatastoreType.OPERATIONAL, NETCONF_TOPO_IID), new DeviceConnectionStatusHandler());

		// config executor scheduler, where will be maximally one job.
		scheduledExecutorService = Executors.newScheduledThreadPool(10);
		try {
			Timer timer = readTimer().get().getResult();
			LOG.info("Init timer. isEnabled {} and option {}",timer.isEnabled(), timer.getOption());
			if (timer.isEnabled()) {
				scheduledFuture = createNewTimerJob(timer.getOption());
			}
		} catch (Exception e) {
			LOG.error(e.getMessage(),e);
		}
	}

	/**
	 * Immediately execute closed loop process
	 * @return
     */
	@Override
	public Future<RpcResult<StartOutput>> start() {
		LOG.info("Call close loop automation");

		boolean result = processNetworkDevices();

		StartOutputBuilder startBuilder = new StartOutputBuilder();
		startBuilder.setStatus(result ? "ok" : "failed");
		return RpcResultBuilder.success(startBuilder.build()).buildFuture();
	}

	/**
	 * Save new configuration of the timer to the config datastore. According this config, reschedule actually timer.
	 * If it needs, run new job
	 * @param input
	 * @return
     */
	@Override
	public Future<RpcResult<SaveTimerOutput>> saveTimer(SaveTimerInput input) {
		LOG.info("Received data. Enabled {}, Option: {} ", input.isEnabled(), input.getOption());

		String message = null;
		if (input.isEnabled()==null || input.getOption() == null) {
			message =  "Value of enabled or option is empty";
		} else {
			// save data to config datastore
			TimerConfigBuilder builder = new TimerConfigBuilder();
			ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();
			builder.setEnabled(input.isEnabled()).setOption(input.getOption());
			transaction.put(LogicalDatastoreType.CONFIGURATION, TIMER_SETTING_PATH,builder.build());

			try {
				transaction.submit().checkedGet();

				// remove last instance of the job
				if (scheduledFuture != null) {
					scheduledFuture.cancel(false);
				}

				//if timer is enabled, run a new job
				if  (input.isEnabled()) {
					scheduledFuture = createNewTimerJob(input.getOption());
				}

				LOG.info("Schdeduler has been changed");
				message = "ok";
			} catch (TransactionCommitFailedException e) {
				LOG.error(e.getMessage(),e);
				message = "failed";
			}
		}

		// create and send message as response of this RPC
		SaveTimerOutputBuilder saveTimerOutputBuilder = new SaveTimerOutputBuilder();
		saveTimerOutputBuilder.setStatus(message);
		return RpcResultBuilder.success(saveTimerOutputBuilder.build()).buildFuture();
	}

	/**
	 * Read configuration of the Timer from the config datastore
	 * @return
     */
	@Override
	public Future<RpcResult<ReadTimerOutput>> readTimer() {
		ReadOnlyTransaction transaction = dataBroker.newReadOnlyTransaction();

		CheckedFuture<Optional<TimerConfig>, ReadFailedException> timerSettingFuture = transaction.read(LogicalDatastoreType.CONFIGURATION,TIMER_SETTING_PATH);
		ReadTimerOutputBuilder readTimerOutputBuilder = new ReadTimerOutputBuilder();
		try {
			Optional<TimerConfig> opt = timerSettingFuture.checkedGet();
			TimerConfig timerSetting = opt.get();
			readTimerOutputBuilder.setEnabled(timerSetting.isEnabled());
			readTimerOutputBuilder.setOption(timerSetting.getOption());
		} catch (Exception e) {
			// if node of the config datastore is empty, we will return default timer setting
			readTimerOutputBuilder.setEnabled(TIMER_DEFAULT_ENABLED);
			readTimerOutputBuilder.setOption(TIMER_DEFAULT_OPTION);
		}
		return RpcResultBuilder.success(readTimerOutputBuilder.build()).buildFuture();
	}

	/**
	 * If device is connected and has specifically capability then this device is suitable for closed loop process
	 * @param deviceNode
	 * @return
     */
	private boolean canProcessDevice(Node deviceNode) {
		NetconfNode nnode = deviceNode.getAugmentation(NetconfNode.class);
		if (nnode != null && nnode.getAvailableCapabilities() != null && nnode.getAvailableCapabilities().getAvailableCapability() != null) {
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
	 * Start closed loop process. Read all possible devices from topology. Read airinterface name. Modify it on another name.
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
				if (canProcessDevice(node)) { // check if we can process it
					processNode(node.getKey());
				}
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
	private void processNode(NodeKey nodeKey) {
		final Optional<MountPoint> xrNodeOptional = mountService.getMountPoint(NETCONF_TOPO_IID.child(Node.class, nodeKey));

		// try to mount the device
		Preconditions.checkArgument(xrNodeOptional.isPresent(), "Unable to locate mountpoint: %s, not mounted yet or not configured", nodeKey.getNodeId().getValue());
		final MountPoint xrNode = xrNodeOptional.get();
		final DataBroker xrNodeBroker = xrNode.getService(DataBroker.class).get();


		LOG.info("We found the suitable device : {}", nodeKey);
		// retrieve list of universal IDs which need to retrieve MWAirInterfacePac
		List<UniversalId> universalIdList = retrieveUniversalId(xrNodeBroker);
		if (universalIdList != null && universalIdList.size() > 0) {
			for (UniversalId uuid : universalIdList) {
				ReadWriteTransaction airInterfaceTransaction = null;
				try {
					// read MWAirInterfacePac
					airInterfaceTransaction = xrNodeBroker.newReadWriteTransaction();
					InstanceIdentifier<MWAirInterfacePac> path = InstanceIdentifier.builder(MWAirInterfacePac.class, new MWAirInterfacePacKey(uuid)).build();
					MWAirInterfacePac airInterfacePac = readNode(airInterfaceTransaction, path);

					if (airInterfacePac != null) {
						String newAirInterfaceName = "AirName "+new Date();
						LOG.info("Old AirInterfaceName {} - New AirInterfaceName {}",airInterfacePac.getAirInterfaceConfiguration().getAirInterfaceName(), newAirInterfaceName);

						// modify AirInterface name.
						MWAirInterfacePacBuilder mWAirInterfacePacBuilder = new MWAirInterfacePacBuilder(airInterfacePac);
						AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(airInterfacePac.getAirInterfaceConfiguration());
						configurationBuilder.setAirInterfaceName(newAirInterfaceName);
						mWAirInterfacePacBuilder.setAirInterfaceConfiguration(configurationBuilder.build());

						// store new information to config datastore
						airInterfaceTransaction.merge(LogicalDatastoreType.CONFIGURATION, path, mWAirInterfacePacBuilder.build());
						airInterfaceTransaction.submit();

					} else {
						// in case if there is nothing
						airInterfaceTransaction.cancel();
					}

				} catch (Exception e) {
					// in case if something strange was happened
					if (airInterfaceTransaction != null) {
						airInterfaceTransaction.cancel();
					}
				}
			}

		}

	}

	/**
	 * Read information from mounted node. Result is MWAirInterfacePac
	 * @param xrNodeReadTx
	 * @param path
	 * @return
	 * @throws ReadFailedException
     */
	private MWAirInterfacePac readNode(ReadWriteTransaction xrNodeReadTx, InstanceIdentifier<MWAirInterfacePac> path) throws ReadFailedException {
		Optional<MWAirInterfacePac> airInterfaceOpt;
		airInterfaceOpt = xrNodeReadTx.read(LogicalDatastoreType.CONFIGURATION, path).checkedGet();
		if (airInterfaceOpt.isPresent()) {
			return airInterfaceOpt.get();
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
				if (networkElement.getLtpRefList() != null) { // loop Logical Termination Point
					for (LtpRefList ltp : networkElement.getLtpRefList()) {
						for (LpList lp : ltp.getLpList()) { // loop Layer Protocol
							if (LAYER_PROTOCOL.equals(lp.getLayerProtocolName().getValue())) { //if it is MWPS we have one
								LOG.info("UUID: "+lp.getKey().getUuid());
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

		}

		return list;
	}

	/**
	 * Create new job according the timer option
	 * @param option
	 * @return
     */
	private ScheduledFuture createNewTimerJob(Timer.Option option) {
		switch (option) {
			case _5seconds: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this),10, 5, TimeUnit.SECONDS);
			case _30seconds: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this),10, 30, TimeUnit.SECONDS);
			case _1minute: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this),10, 1, TimeUnit.MINUTES);
			case _30minutes: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this),10, 30, TimeUnit.MINUTES);
			case _1hour: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this),10, 1, TimeUnit.HOURS);
			default: {
				throw new IllegalArgumentException("Wrong option");
			}
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

		if (dataTreeChangeHandler != null) {
			dataTreeChangeHandler.close();
		}
	}


	@Override
	public void onTransactionChainFailed(TransactionChain<?, ?> transactionChain, AsyncTransaction<?, ?> asyncTransaction, Throwable throwable) {

	}

	@Override
	public void onTransactionChainSuccessful(TransactionChain<?, ?> transactionChain) {

	}
}

/**
 * This is the timer job. Class which is based on the Runnable. The asynchronic job execute closed loop process on the devices
 */
class TimerJob implements Runnable {
	private static final Logger LOG = LoggerFactory.getLogger(TimerJob.class);
	private ClosedLoopAutomationImpl impl;

	public TimerJob(ClosedLoopAutomationImpl impl) {
		this.impl = impl;
	}

	@Override
	public void run() {
		LOG.info("Timer start ");
		impl.processNetworkDevices();
		LOG.info("Timer end ");
	}
}