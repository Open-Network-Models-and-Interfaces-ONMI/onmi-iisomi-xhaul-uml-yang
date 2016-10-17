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
import java.util.Collections;
import java.util.Date;
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
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClosedLoopAutomationImpl implements AutoCloseable, ClosedLoopAutomationService, TransactionChainListener {
	private static final Logger LOG = LoggerFactory.getLogger(ClosedLoopAutomationImpl.class);

	private static final Boolean TIMER_DEFAULT_ENABLED = Boolean.FALSE;
	private static final Timer.Option TIMER_DEFAULT_OPTION = Timer.Option._5seconds;
	private static final InstanceIdentifier<TimerConfig> TIMER_SETTING_PATH = InstanceIdentifier.create(TimerConfig.class);
	private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
						 .create(NetworkTopology.class)
			     		 .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));

	private DataBroker dataBroker;
	private BindingAwareBroker.RpcRegistration registration;
	private MountPointService mountService;

	private ScheduledExecutorService scheduledExecutorService;
	private ScheduledFuture scheduledFuture;

	public ClosedLoopAutomationImpl(BindingAwareBroker.ProviderContext providerContext,  final RpcProviderRegistry rpcProviderRegistry) {
		System.out.println("Register ClosedLoopAutomationImpl");
		this.dataBroker = providerContext.getSALService(DataBroker.class);
		this.mountService = providerContext.getSALService(MountPointService.class);
		this.registration = rpcProviderRegistry.addRpcImplementation(ClosedLoopAutomationService.class, this);

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

	@Override
	public Future<RpcResult<StartOutput>> start() {
		LOG.info("Backend call start");

		boolean result = processDevices();

		StartOutputBuilder startBuilder = new StartOutputBuilder();
		startBuilder.setStatus(result ? "ok" : "failed");
		return RpcResultBuilder.success(startBuilder.build()).buildFuture();
	}

	private boolean processDevices() {
		ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();

		CheckedFuture<Optional<Topology>, ReadFailedException> topology = transaction.read(LogicalDatastoreType.OPERATIONAL,NETCONF_TOPO_IID);

		try {
			Optional<Topology> optTopology = topology.checkedGet();
			List<Node> nodeList = optTopology.get().getNode();
			Collections.reverse(nodeList);
			nodeList.remove(0);
			for (Node node : nodeList) {
				LOG.info("Node: {}", node.getKey().getNodeId());
				NetconfNode nnode = node.getAugmentation(NetconfNode.class);
				if (nnode != null) {
					LOG.info("We have a Netconf device");
					NetconfNodeConnectionStatus.ConnectionStatus csts = nnode.getConnectionStatus();
					if (csts == NetconfNodeConnectionStatus.ConnectionStatus.Connected) {
						LOG.info("Device is connected");
						processNode(node.getKey());
					} else {
						LOG.info("Device is off");
					}
				}
			}
		} catch (Exception e) {
			LOG.error(e.getMessage(),e);
			return false;
		}
		return true;
	}

	private void processNode(NodeKey nodeKey) {
		final Optional<MountPoint> xrNodeOptional = mountService.getMountPoint(NETCONF_TOPO_IID.child(Node.class, nodeKey));

		Preconditions.checkArgument(xrNodeOptional.isPresent(), "Unable to locate mountpoint: %s, not mounted yet or not configured", nodeKey.getNodeId().getValue());
		final MountPoint xrNode = xrNodeOptional.get();
		final DataBroker xrNodeBroker = xrNode.getService(DataBroker.class).get();

		List<UniversalId> universalIdList = retrieveUniversalId(xrNodeBroker);
		if (universalIdList != null && universalIdList.size() > 0) {
			for (UniversalId uuid : universalIdList) {
				ReadWriteTransaction xrNodeReadTx = null;
				try {
					xrNodeReadTx = xrNodeBroker.newReadWriteTransaction();
					InstanceIdentifier<MWAirInterfacePac> path = InstanceIdentifier.builder(MWAirInterfacePac.class, new MWAirInterfacePacKey(uuid)).build();

					MWAirInterfacePac airInterfacePac = readNode(xrNodeReadTx, path);
					if (airInterfacePac != null) {
						LOG.info("AirInterfaceName {} ",airInterfacePac.getAirInterfaceConfiguration().getAirInterfaceName());
						MWAirInterfacePacBuilder mWAirInterfacePacBuilder = new MWAirInterfacePacBuilder(airInterfacePac);
						AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(airInterfacePac.getAirInterfaceConfiguration());
						configurationBuilder.setAirInterfaceName("AirName "+new Date());

						mWAirInterfacePacBuilder.setAirInterfaceConfiguration(configurationBuilder.build());

						xrNodeReadTx.merge(LogicalDatastoreType.CONFIGURATION, path, mWAirInterfacePacBuilder.build());
						xrNodeReadTx.submit();
					} else {
						xrNodeReadTx.cancel();
					}

				} catch (Exception e) {
					if (xrNodeReadTx != null) {
						xrNodeReadTx.cancel();
					}
				}
			}

		}

	}


	private List<UniversalId> retrieveUniversalId(DataBroker xrNodeBroker) {
		List<UniversalId> list = new ArrayList<>();
		ReadOnlyTransaction readElementTx = null;
		try {
			readElementTx = xrNodeBroker.newReadOnlyTransaction();
			InstanceIdentifier<NetworkElement> path = InstanceIdentifier.create(NetworkElement.class);

			Optional<NetworkElement> networkElementOpt;
			networkElementOpt = readElementTx.read(LogicalDatastoreType.OPERATIONAL, path).checkedGet();

			if (networkElementOpt.isPresent()) {
				NetworkElement networkElement = networkElementOpt.get();
				if (networkElement.getLtpRefList() != null) {
					for (LtpRefList ltp : networkElement.getLtpRefList()) {
						for (LpList lp : ltp.getLpList()) {
							if ("MWPS".equals(lp.getLayerProtocolName().getValue())) {
								LOG.info("UUID: "+lp.getKey().getUuid());
								list.add(lp.getKey().getUuid());
							}

						}
					}
				}
			}
			readElementTx.close();

		} catch (Exception e) {
			if (readElementTx != null) {
				readElementTx.close();
			}

		}

		return list;
	}

	private MWAirInterfacePac readNode(ReadWriteTransaction xrNodeReadTx, InstanceIdentifier<MWAirInterfacePac> path) throws ReadFailedException {
		Optional<MWAirInterfacePac> airInterfaceOpt;
		airInterfaceOpt = xrNodeReadTx.read(LogicalDatastoreType.CONFIGURATION, path).checkedGet();
		if (airInterfaceOpt.isPresent()) {
            return airInterfaceOpt.get();
        }
		return null;
	}

	@Override
	public Future<RpcResult<SaveTimerOutput>> saveTimer(SaveTimerInput input) {
		LOG.info("Received data. Enabled {}, Option: {} ", input.isEnabled(), input.getOption());

		String message = null;
		if (input.isEnabled()==null || input.getOption() == null) {
			message =  "Enabled or option is empty";
		} else {
			ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();

			TimerConfigBuilder builder = new TimerConfigBuilder();
			builder.setEnabled(input.isEnabled()).setOption(input.getOption());
			transaction.put(LogicalDatastoreType.CONFIGURATION, TIMER_SETTING_PATH,builder.build());

			try {
				transaction.submit().checkedGet();
				if (scheduledFuture != null) {
					scheduledFuture.cancel(false);
				}

				if  (input.isEnabled()) {
					scheduledFuture = createNewTimerJob(input.getOption());
				}

				LOG.info("Schdeduler has been changed");
				message = "ok";
			} catch (TransactionCommitFailedException e) {
				message = "failed";
			}
		}

		SaveTimerOutputBuilder saveTimerOutputBuilder = new SaveTimerOutputBuilder();
		saveTimerOutputBuilder.setStatus(message);
		return RpcResultBuilder.success(saveTimerOutputBuilder.build()).buildFuture();
	}

	private ScheduledFuture createNewTimerJob(Timer.Option option) {
		switch (option) {
			case _5seconds: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this,option),10, 5, TimeUnit.SECONDS);
			case _30seconds: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this,option),10, 30, TimeUnit.SECONDS);
			case _1minute: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this,option),10, 1, TimeUnit.MINUTES);
			case _30minutes: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this,option),10, 30, TimeUnit.MINUTES);
			case _1hour: return scheduledExecutorService.scheduleAtFixedRate(new TimerJob(this,option),10, 1, TimeUnit.HOURS);
			default: {
				throw new IllegalArgumentException("Wrong option");
			}
		}

	}

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
			readTimerOutputBuilder.setEnabled(TIMER_DEFAULT_ENABLED);
			readTimerOutputBuilder.setOption(TIMER_DEFAULT_OPTION);
		}
		return RpcResultBuilder.success(readTimerOutputBuilder.build()).buildFuture();
	}


	@Override
	public void onTransactionChainFailed(TransactionChain<?, ?> transactionChain, AsyncTransaction<?, ?> asyncTransaction, Throwable throwable) {

	}

	@Override
	public void onTransactionChainSuccessful(TransactionChain<?, ?> transactionChain) {

	}

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
}

class TimerJob implements Runnable {
	private static final Logger LOG = LoggerFactory.getLogger(TimerJob.class);
	private ClosedLoopAutomationImpl impl;
	private Timer.Option option;

	public TimerJob(ClosedLoopAutomationImpl impl, Timer.Option option) {
		this.impl = impl;
		this.option = option;
	}

	@Override
	public void run() {
		LOG.info("Timer JOB start " + this.option);
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		LOG.info("Timer JOB end " + this.option);
	}
}