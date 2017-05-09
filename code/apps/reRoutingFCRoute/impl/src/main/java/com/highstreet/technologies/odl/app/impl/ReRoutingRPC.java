/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.md.sal.common.api.data.AsyncTransaction;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChainListener;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.CreateFCRouteInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.CreateFCRouteOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.ReRoutingFCRouteService;
import org.opendaylight.yangtools.yang.common.RpcResult;

import java.util.concurrent.Future;

/**
 * Created by olinchy on 5/9/17.
 */
public class ReRoutingRPC implements AutoCloseable, TransactionChainListener, ReRoutingFCRouteService
{
    public ReRoutingRPC(BindingAwareBroker.ProviderContext providerContext, RpcProviderRegistry rpcProviderRegistry)
    {

    }

    @Override
    public Future<RpcResult<CreateFCRouteOutput>> createFCRoute(
            CreateFCRouteInput input)
    {
        return null;
    }

    @Override
    public void close() throws Exception
    {

    }

    @Override
    public void onTransactionChainFailed(
            org.opendaylight.controller.md.sal.common.api.data.TransactionChain<?, ?> transactionChain,
            AsyncTransaction<?, ?> asyncTransaction, Throwable throwable)
    {

    }

    @Override
    public void onTransactionChainSuccessful(
            org.opendaylight.controller.md.sal.common.api.data.TransactionChain<?, ?> transactionChain)
    {

    }
}
