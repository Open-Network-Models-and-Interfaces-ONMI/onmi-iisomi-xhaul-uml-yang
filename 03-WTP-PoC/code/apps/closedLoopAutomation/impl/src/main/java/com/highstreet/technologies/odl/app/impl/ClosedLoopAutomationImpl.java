/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import java.util.concurrent.Future;

import org.opendaylight.controller.md.sal.common.api.data.AsyncTransaction;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChain;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChainListener;
import org.opendaylight.controller.md.sal.dom.api.DOMDataBroker;
import org.opendaylight.controller.md.sal.dom.api.DOMTransactionChain;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ClosedLoopAutomationService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.MiddleOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.MiddleOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StartOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StartOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StopOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.StopOutputBuilder;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.osgi.framework.BundleContext;

public class ClosedLoopAutomationImpl implements AutoCloseable, ClosedLoopAutomationService, TransactionChainListener {

	private final DOMDataBroker domDataBroker;
	private final DOMTransactionChain domChain;
	private final BundleContext bundleContext;

	public ClosedLoopAutomationImpl(final DOMDataBroker domDataBroker, final BundleContext bundleContext) {
		this.domDataBroker = domDataBroker;
		this.domChain = createPeerChain(this);
		this.bundleContext = bundleContext;

	}

	@Override
	public Future<RpcResult<MiddleOutput>> middle() {
		MiddleOutputBuilder middleBuilder = new MiddleOutputBuilder();
		middleBuilder.setStatus("disabled");
		return RpcResultBuilder.success(middleBuilder.build()).buildFuture();
	}

	@Override
	public Future<RpcResult<StopOutput>> stop() {
		StopOutputBuilder stopBuilder = new StopOutputBuilder();
		stopBuilder.setStatus("disabled");
		return RpcResultBuilder.success(stopBuilder.build()).buildFuture();
	}

	@Override
	public Future<RpcResult<StartOutput>> start() {
		StartOutputBuilder startBuilder = new StartOutputBuilder();
		startBuilder.setStatus("running xxx");
		return RpcResultBuilder.success(startBuilder.build()).buildFuture();
	}


	private DOMTransactionChain createPeerChain(final TransactionChainListener listener) {
		return this.domDataBroker.createTransactionChain(listener);
	}

	@Override
	public void onTransactionChainFailed(TransactionChain<?, ?> transactionChain, AsyncTransaction<?, ?> asyncTransaction, Throwable throwable) {

	}

	@Override
	public void onTransactionChainSuccessful(TransactionChain<?, ?> transactionChain) {

	}

	@Override
	public void close() throws Exception {

	}
}