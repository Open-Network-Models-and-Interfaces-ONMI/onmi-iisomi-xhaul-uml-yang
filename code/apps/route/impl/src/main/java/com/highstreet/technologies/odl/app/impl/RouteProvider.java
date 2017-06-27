/*
 * Copyright © 2017 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.highstreet.technologies.odl.app.impl.tools.DataBrokerHolder;
import com.highstreet.technologies.odl.app.impl.tools.MountPointServiceHolder;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.RouteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.highstreet.technologies.odl.app.impl.tools.RPCHolder.rpc;

public class RouteProvider
{
    public RouteProvider(
            final DataBroker dataBroker, final RpcProviderRegistry rpcRegistry, final MountPointService mountService)
    {
        this.dataBroker = dataBroker;
        this.rpcRegistry = rpcRegistry;
        this.mountService = mountService;
    }

    private static final Logger LOG = LoggerFactory.getLogger(RouteProvider.class);
    private final DataBroker dataBroker;
    private final RpcProviderRegistry rpcRegistry;
    private final MountPointService mountService;
    private BindingAwareBroker.RpcRegistration<RouteService> service;

    /**
     * Method called when the blueprint container is created.
     */
    public void init()
    {
        LOG.info("RouteProvider Session Initiated --- created at 16:29-0627-2017");
        service = rpcRegistry.addRpcImplementation(
                RouteService.class, rpc = new RouteRPC(dataBroker));
        MountPointServiceHolder.setMountPointService(mountService);
        DataBrokerHolder.setDataBroker(dataBroker);
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