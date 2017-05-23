/*
 * Copyright © 2017 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.RouteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RouteProvider
{
    private static final Logger LOG = LoggerFactory.getLogger(RouteProvider.class);
    private final DataBroker dataBroker;

    public RouteProvider(
            final DataBroker dataBroker, final RpcProviderRegistry rpcRegistry, final MountPointService mountService)
    {
        this.dataBroker = dataBroker;
        this.rpcRegistry = rpcRegistry;
        this.mountService = mountService;
    }

    private final RpcProviderRegistry rpcRegistry;
    private final MountPointService mountService;
    private BindingAwareBroker.RpcRegistration<RouteService> service;

    /**
     * Method called when the blueprint container is created.
     */
    public void init()
    {
        LOG.info("RouteProvider Session Initiated");
        service = rpcRegistry.addRpcImplementation(RouteService.class, new RouteRPC(dataBroker, mountService));
    }

    /**
     * Method called when the blueprint container is destroyed.
     */
    public void close()
    {
        LOG.info("RouteProvider Closed");
        if (service != null)
            service.close();
    }
}