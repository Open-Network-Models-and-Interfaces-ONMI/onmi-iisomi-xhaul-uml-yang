/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ClosedLoopAutomationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClosedLoopAutomationProvider implements BindingAwareProvider, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(ClosedLoopAutomationProvider.class);

    private DataBroker dataBroker;
    private BindingAwareBroker bindingAwareBroker;
    
    private RpcRegistration<ClosedLoopAutomationService> closedLoopAutomationService;

    public ClosedLoopAutomationProvider(BindingAwareBroker bindingAwareBroker) {
        this.bindingAwareBroker = bindingAwareBroker;
        LOG.info("ClosedLoopAutomationProvider Constructor");
        System.out.println("ClosedLoopAutomationProvider Constructor  XXXXXXXXXXXXXX");
    }

    /**
     * Method called when the blueprint container is created.
     */
    public void init() {
        LOG.info("ClosedLoopAutomationProvider Init");
        System.out.println("ClosedLoopAutomationProvider Init");
        bindingAwareBroker.registerProvider(this);
    }
    
    @Override
    public void onSessionInitiated(ProviderContext session) {
        LOG.info("ClosedLoopAutomationProvider onSessionInitiated");
        System.out.println("ClosedLoopAutomationProvider onSessionInitiated");
        closedLoopAutomationService = session.addRpcImplementation(ClosedLoopAutomationService.class, new ClosedLoopAutomationImpl());
    }    

    /**
     * Method called when the blueprint container is destroyed.
     */
    public void close() {
        LOG.info("ClosedLoopAutomationProvider Closed");
        if (closedLoopAutomationService != null) {
        	closedLoopAutomationService.close();
        }
    }
}