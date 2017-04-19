/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by lbeles on 11.10.2016.
 */
public class WirelessPowerControlCreator implements BindingAwareProvider, AutoCloseable {
    private static final Logger LOG = LoggerFactory.getLogger(WirelessPowerControlCreator.class);

    private final Object lock = new Object();
    private final BundleContext bundleContext;
    private WirelessPowerControlImpl impl;
    private RpcProviderRegistry rpcProviderRegistry;

    public WirelessPowerControlCreator(BundleContext bundleContext, RpcProviderRegistry rpcProviderRegistry) {
        this.bundleContext = bundleContext;
        this.rpcProviderRegistry = rpcProviderRegistry;
    }

    @Override
    public void onSessionInitiated(BindingAwareBroker.ProviderContext providerContext) {
        LOG.info("xxxxx");
        synchronized (lock) {
            impl = new WirelessPowerControlImpl(providerContext, this.rpcProviderRegistry);
        }
    }

    @Override
    public void close() throws Exception {
        synchronized (lock) {
            if (impl != null) {
                impl.close();
                impl = null;
            }
        }
    }

    public WirelessPowerControlImpl getImpl() {
        return impl;
    }



}
