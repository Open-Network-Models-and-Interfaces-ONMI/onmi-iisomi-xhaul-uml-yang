/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.google.common.base.Optional;
import com.google.common.util.concurrent.CheckedFuture;
import java.util.List;
import java.util.concurrent.Future;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
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
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ClosedLoopAutomationService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ReadTimerOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ReadTimerOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.SaveTimerInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.SaveTimerOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.SaveTimerOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StartOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StartOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.TimerSetting;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.TimerSettingBuilder;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcError;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

public class ClosedLoopAutomationImpl implements AutoCloseable, ClosedLoopAutomationService, TransactionChainListener {

	private static final Boolean TIMER_DEFAULT_ENABLED = Boolean.FALSE;
	private static final int TIMER_DEFAULT_VALUE = 10;
	private static final InstanceIdentifier<TimerSetting> TIMER_SETTING_PATH = InstanceIdentifier.create(TimerSetting.class);

	private DataBroker dataBroker;
	private RpcProviderRegistry rpcProviderRegistry;
	private BindingAwareBroker.RpcRegistration registration;

	public ClosedLoopAutomationImpl(BindingAwareBroker.ProviderContext providerContext,  final RpcProviderRegistry rpcProviderRegistry) {
		this.dataBroker = this.dataBroker = providerContext.getSALService(DataBroker.class);
		this.rpcProviderRegistry = rpcProviderRegistry;

		System.out.println("Register ClosedLoopAutomationImpl");
		this.registration = rpcProviderRegistry.addRpcImplementation(ClosedLoopAutomationService.class, this);

	}

	@Override
	public Future<RpcResult<StartOutput>> start() {
		InstanceIdentifier<Topology> NETCONF_TOPO_IID =
				InstanceIdentifier
						.create(NetworkTopology.class)
						.child(Topology.class,
								new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));

		System.out.println("Backend call start");

		ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();

		CheckedFuture<Optional<Topology>, ReadFailedException> topology = transaction.read(LogicalDatastoreType.OPERATIONAL,NETCONF_TOPO_IID);

		System.out.println("Backend call start 1");
		try {
			Optional<Topology> optTopology = topology.checkedGet();
			List<Node> nodeList = optTopology.get().getNode();
			for (Node node : nodeList) {
				System.out.println("X "+node.getKey());
			}



		} catch (Exception e) {
			System.out.println("Error initializing hwvtep topology "+e);
		}

		System.out.println("Backend call end");

		StartOutputBuilder startBuilder = new StartOutputBuilder();
		startBuilder.setStatus("ok");
		return RpcResultBuilder.success(startBuilder.build()).buildFuture();
	}

	@Override
	public Future<RpcResult<SaveTimerOutput>> saveTimer(SaveTimerInput input) {
		String message = null;

		ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();

		TimerSettingBuilder builder = new TimerSettingBuilder();
		builder.setEnabled(input.isEnabled()).setValue(input.getValue());
		transaction.put(LogicalDatastoreType.CONFIGURATION, TIMER_SETTING_PATH,builder.build());

		try {
			transaction.submit().checkedGet();
			message = "ok";
		} catch (TransactionCommitFailedException e) {
			message = "failed";
		}

		SaveTimerOutputBuilder saveTimerOutputBuilder = new SaveTimerOutputBuilder();
		saveTimerOutputBuilder.setStatus(message);
		return RpcResultBuilder.success(saveTimerOutputBuilder.build()).buildFuture();
	}

	@Override
	public Future<RpcResult<ReadTimerOutput>> readTimer() {
		ReadOnlyTransaction transaction = dataBroker.newReadOnlyTransaction();

		CheckedFuture<Optional<TimerSetting>, ReadFailedException> timerSettingFuture = transaction.read(LogicalDatastoreType.CONFIGURATION,TIMER_SETTING_PATH);
		ReadTimerOutputBuilder readTimerOutputBuilder = new ReadTimerOutputBuilder();
		try {
			Optional<TimerSetting> opt = timerSettingFuture.checkedGet();
			TimerSetting timerSetting = opt.get();
			readTimerOutputBuilder.setEnabled(timerSetting.isEnabled());
			readTimerOutputBuilder.setValue(timerSetting.getValue());
		} catch (Exception e) {
			readTimerOutputBuilder.setEnabled(TIMER_DEFAULT_ENABLED);
			readTimerOutputBuilder.setValue(TIMER_DEFAULT_VALUE);
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
		System.out.println("Close ClosedLoopAutomationImpl");
		if (this.registration != null) {
			this.registration.close();
		}
	}
}