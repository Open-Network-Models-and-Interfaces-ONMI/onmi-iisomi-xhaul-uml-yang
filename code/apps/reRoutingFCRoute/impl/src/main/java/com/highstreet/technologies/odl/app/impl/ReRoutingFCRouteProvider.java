/*
 * Copyright © 2016 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ReRoutingFCRouteProvider implements BindingAwareProvider, AutoCloseable
{
    public ReRoutingFCRouteProvider(BundleContext bundleContext, RpcProviderRegistry rpcProviderRegistry)
    {
        this.bundleContext = bundleContext;
        this.rpcProviderRegistry = rpcProviderRegistry;
    }

    public ReRoutingFCRouteProvider(final DataBroker dataBroker)
    {
        this.dataBroker = dataBroker;
    }
    private static final Logger LOG = LoggerFactory.getLogger(ReRoutingFCRouteProvider.class);
    private static Object lock = new Object();
    private BundleContext bundleContext;
    private RpcProviderRegistry rpcProviderRegistry;
    private DataBroker dataBroker;
    private ReRoutingRPC impl;

    public ReRoutingRPC getImpl()
    {
        return impl;
    }

    /**
     * Method called when the blueprint container is created.
     */
    public void init()
    {
        LOG.info("ReRoutingFCRouteProvider Session Initiated");
    }

    /**
     * Method called when the blueprint container is destroyed.
     */
    public void close()
    {
        LOG.info("ReRoutingFCRouteProvider Closed");
    }

    @Override
    public void onSessionInitiated(
            BindingAwareBroker.ProviderContext providerContext)
    {
        synchronized (lock)
        {
            impl = new ReRoutingRPC(providerContext, this.rpcProviderRegistry);
        }
    }
}