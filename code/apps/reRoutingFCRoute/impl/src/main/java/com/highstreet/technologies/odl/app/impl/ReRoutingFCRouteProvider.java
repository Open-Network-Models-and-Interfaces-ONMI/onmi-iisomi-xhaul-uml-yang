/*
 * Copyright © 2016 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.ReRoutingFCRouteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.Authenticator;
import java.net.PasswordAuthentication;

public class ReRoutingFCRouteProvider implements BindingAwareProvider, AutoCloseable
{
    static
    {
        Authenticator.setDefault(new Authenticator()
        {
            @Override
            protected PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication("admin", "admin".toCharArray());
            }
        });
    }

    private static final Logger LOG = LoggerFactory.getLogger(ReRoutingFCRouteProvider.class);
    private BindingAwareBroker.RpcRegistration<ReRoutingFCRouteService> reroutingService;

    /**
     * Method called when the blueprint container is destroyed.
     */
    public void close()
    {
        LOG.info("ReRoutingFCRouteProvider Closed");
        if (reroutingService != null)
        {
            reroutingService.close();
        }
    }

    @Override
    public void onSessionInitiated(
            BindingAwareBroker.ProviderContext providerContext)
    {
        reroutingService = providerContext.addRpcImplementation(
                ReRoutingFCRouteService.class, new ReRoutingRPC(providerContext));
    }
}