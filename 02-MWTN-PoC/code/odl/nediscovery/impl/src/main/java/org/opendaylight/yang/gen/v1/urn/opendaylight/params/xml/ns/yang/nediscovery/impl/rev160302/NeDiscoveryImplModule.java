/*
	
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
	
*
	
* This program and the accompanying materials are made available under the
	
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
	
* and is available at http://www.eclipse.org/legal/epl-v10.html
	
*/

package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302;

import org.opendaylight.wtg.nediscovery.impl.NeDiscoveryProvider;
import org.opendaylight.wtg.netconfconnector.api.NetconfConnectorService;

public class NeDiscoveryImplModule extends
		org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.AbstractNeDiscoveryImplModule {
	public NeDiscoveryImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier,
			org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
		super(identifier, dependencyResolver);
	}

	public NeDiscoveryImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier,
			org.opendaylight.controller.config.api.DependencyResolver dependencyResolver,
			org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.NeDiscoveryImplModule oldModule,
			java.lang.AutoCloseable oldInstance) {
		super(identifier, dependencyResolver, oldModule, oldInstance);
	}

	@Override
	public void customValidation() {
		// add custom validation form module attributes here.
	}

	@Override
	public java.lang.AutoCloseable createInstance() {
		NetconfConnectorService netconfconnectorService = getNetconfconnectorServiceDependency();
		NeDiscoveryProvider discoveryProvider = new NeDiscoveryProvider(netconfconnectorService);
		getBrokerDependency().registerProvider(discoveryProvider);
		return discoveryProvider;
	}
}
