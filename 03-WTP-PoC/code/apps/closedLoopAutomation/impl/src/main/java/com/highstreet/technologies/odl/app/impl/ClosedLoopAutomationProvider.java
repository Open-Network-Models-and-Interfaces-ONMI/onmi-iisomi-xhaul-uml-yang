/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160815.ClosedLoopAutomationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClosedLoopAutomationProvider implements BindingAwareProvider, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(ClosedLoopAutomationProvider.class);

    private final DataBroker dataBroker;
    
    private RpcRegistration<ClosedLoopAutomationService> closedLoopAutomationService;

    public ClosedLoopAutomationProvider(final DataBroker dataBroker) {
        this.dataBroker = dataBroker;
    }

    /**
     * Method called when the blueprint container is created.
     */
    public void init() {
        LOG.info("ClosedLoopAutomationProvider Session Initiated");
    }
    
    @Override
    public void onSessionInitiated(ProviderContext session) {
        LOG.info("HelloProvider Session Initiated");
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