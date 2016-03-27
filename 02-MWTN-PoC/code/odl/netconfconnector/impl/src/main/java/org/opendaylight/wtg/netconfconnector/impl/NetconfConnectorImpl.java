/*
	
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
	
*
	
* This program and the accompanying materials are made available under the
	
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
	
* and is available at http://www.eclipse.org/legal/epl-v10.html
	
*/

package org.opendaylight.wtg.netconfconnector.impl;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.wtg.eventmanager.api.EventManagerService;
import org.opendaylight.wtg.netconfconnector.api.NetconfConnectorService;
import org.opendaylight.wtg.netconfconnector.impl.connect.NetconfConnectionManager;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElementBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//TODO 
//Implement NetconfConnectorService in another class
public class NetconfConnectorImpl implements NetconfConnectorService, BindingAwareProvider, AutoCloseable {

	private static final Logger LOG = LoggerFactory.getLogger(NetconfConnectorImpl.class);

	private EventManagerService eventmanagerService;

	public NetconfConnectorImpl(EventManagerService eventmanagerService) {
		this.eventmanagerService = eventmanagerService;
	}

	@Override
	public void onSessionInitiated(ProviderContext session) {
		LOG.info("NetconfConnectorImpl Session Initiated");
	}

	@Override
	public void nodeConnected(NetworkElement networkElement) {
		boolean isConnected = NetconfConnectionManager.initiateConnection(networkElement, eventmanagerService);
		if (isConnected) {
			LOG.info("Netconf Session establisted with Netconf device :: Name : {}, IP : {} ", networkElement.getName(),
					networkElement.getIp());
			NetworkElementBuilder networkElementBuilder = new NetworkElementBuilder(networkElement);
			networkElementBuilder.setConnected(true);
		}
	}

	@Override
	public void nodeDisconnected(NetworkElement networkElement) {
		if (networkElement.isConnected()) {
			boolean isTerminated = NetconfConnectionManager.terminateConnection(networkElement, eventmanagerService);
			if (isTerminated) {
				LOG.info("Netconf Session terminated with Netconf device :: Name : {}, IP : {} ",
						networkElement.getName(), networkElement.getIp());
				NetworkElementBuilder networkElementBuilder = new NetworkElementBuilder(networkElement);
				networkElementBuilder.setConnected(false);
			}
		}
	}

	@Override
	public void close() throws Exception {
		LOG.info("NetconfConnectorImpl closing");
	}
}
