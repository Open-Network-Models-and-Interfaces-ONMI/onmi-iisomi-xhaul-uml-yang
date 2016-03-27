/*
	
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
	
*
	
* This program and the accompanying materials are made available under the
	
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
	
* and is available at http://www.eclipse.org/legal/epl-v10.html
	
*/


package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302;

import org.opendaylight.wtg.eventmanager.impl.EventManagerImpl;

public class EventManagerImplModule extends
		org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.AbstractEventManagerImplModule {
	public EventManagerImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier,
			org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
		super(identifier, dependencyResolver);
	}

	public EventManagerImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier,
			org.opendaylight.controller.config.api.DependencyResolver dependencyResolver,
			org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.EventManagerImplModule oldModule,
			java.lang.AutoCloseable oldInstance) {
		super(identifier, dependencyResolver, oldModule, oldInstance);
	}

	@Override
	public void customValidation() {
		// add custom validation form module attributes here.
	}

	@Override
	public java.lang.AutoCloseable createInstance() {
		EventManagerImpl eventManagerImpl = new EventManagerImpl();
		getBrokerDependency().registerProvider(eventManagerImpl);
		return eventManagerImpl;
	}
}
