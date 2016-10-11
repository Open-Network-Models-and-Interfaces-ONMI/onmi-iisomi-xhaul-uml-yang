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

/**
 * Created by ekis on 11.10.2016.
 */
public class ClosedLoopAutomationCreator implements BindingAwareProvider, AutoCloseable {

    private final Object lock = new Object();
    private final BundleContext bundleContext;
    private ClosedLoopAutomationImpl impl;
    private RpcProviderRegistry rpcProviderRegistry;

    public ClosedLoopAutomationCreator(BundleContext bundleContext, RpcProviderRegistry rpcProviderRegistry) {
        this.bundleContext = bundleContext;
        this.rpcProviderRegistry = rpcProviderRegistry;
    }

    @Override
    public void onSessionInitiated(BindingAwareBroker.ProviderContext providerContext) {
        synchronized (lock) {
            impl = new ClosedLoopAutomationImpl(providerContext, this.rpcProviderRegistry);
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

    public ClosedLoopAutomationImpl getImpl() {
        return impl;
    }
}
