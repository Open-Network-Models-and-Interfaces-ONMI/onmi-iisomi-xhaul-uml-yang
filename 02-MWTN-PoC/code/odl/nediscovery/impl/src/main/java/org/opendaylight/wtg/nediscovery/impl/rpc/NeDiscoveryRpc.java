/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.wtg.nediscovery.impl.rpc;

import java.util.concurrent.Future;

import org.opendaylight.wtg.netconfconnector.api.NetconfConnectorService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.ConnectInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.ConnectOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.ConnectOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.NediscoveryApiService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElementBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElementKey;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NeDiscoveryRpc implements NediscoveryApiService {

	private static final Logger LOG = LoggerFactory.getLogger(NeDiscoveryRpc.class);
	private NetconfConnectorService netconfconnectorService;

	public NeDiscoveryRpc(NetconfConnectorService netconfconnectorService) {
		this.netconfconnectorService = netconfconnectorService;
	}

	@Override
	public Future<RpcResult<ConnectOutput>> connect(ConnectInput input) {
		LOG.info("Netconf device discovered :: Name : {}, IP : {} ", input.getName(), input.getIp());

		NetworkElementBuilder networkElementBuilder = new NetworkElementBuilder();
		networkElementBuilder.setIp(input.getIp());
		networkElementBuilder.setConnected(false);
		networkElementBuilder.setName(input.getName());
		networkElementBuilder.setPassword(input.getPassword());
		networkElementBuilder.setPort(input.getPort());
		networkElementBuilder.setUsername(input.getUsername());
		networkElementBuilder.setKey(new NetworkElementKey(input.getName()));
		netconfconnectorService.nodeConnected(networkElementBuilder.build());

		// TODO
		// Result Logic
		ConnectOutputBuilder connectOutputBuilder = new ConnectOutputBuilder();
		connectOutputBuilder.setResult("success");
		return RpcResultBuilder.success(connectOutputBuilder).buildFuture();
	}

	@Override
	public Future<RpcResult<DisconnectOutput>> disconnect(DisconnectInput input) {
		LOG.info("Netconf device disconnected :: Name : {}, IP : {} ", input.getName(), input.getIp());
		NetworkElementBuilder networkElementBuilder = new NetworkElementBuilder();
		networkElementBuilder.setIp(input.getIp());
		networkElementBuilder.setConnected(true);
		networkElementBuilder.setName(input.getName());
		networkElementBuilder.setPassword(input.getPassword());
		networkElementBuilder.setPort(input.getPort());
		networkElementBuilder.setUsername(input.getUsername());
		networkElementBuilder.setKey(new NetworkElementKey(input.getName()));
		netconfconnectorService.nodeDisconnected(networkElementBuilder.build());

		// TODO
		// Result Logic
		DisconnectOutputBuilder disconnectOutputBuilder = new DisconnectOutputBuilder();
		disconnectOutputBuilder.setResult("success");
		return RpcResultBuilder.success(disconnectOutputBuilder).buildFuture();
	}
}
