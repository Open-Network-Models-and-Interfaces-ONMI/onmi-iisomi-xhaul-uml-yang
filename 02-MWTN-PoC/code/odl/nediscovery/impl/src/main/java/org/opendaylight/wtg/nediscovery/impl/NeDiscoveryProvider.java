/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.wtg.nediscovery.impl;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.wtg.nediscovery.impl.rpc.NeDiscoveryRpc;
import org.opendaylight.wtg.netconfconnector.api.NetconfConnectorService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.NediscoveryApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NeDiscoveryProvider implements BindingAwareProvider, AutoCloseable {

	private static final Logger LOG = LoggerFactory.getLogger(NeDiscoveryProvider.class);
	private NeDiscoveryRpc neDiscoveryRpc;
	private RpcRegistration<NediscoveryApiService> rpcReg;

	public NeDiscoveryProvider(NetconfConnectorService netconfconnectorService) {
		neDiscoveryRpc = new NeDiscoveryRpc(netconfconnectorService);
	}

	@Override
	public void onSessionInitiated(ProviderContext session) {
		LOG.info("NeDiscoveryProvider Session Initiated");
		rpcReg = session.addRpcImplementation(NediscoveryApiService.class, neDiscoveryRpc);
	}

	@Override
	public void close() throws Exception {
		LOG.info("NeDiscoveryProvider closing");
		if (rpcReg != null) {
			rpcReg.close();
		}
	}
}
