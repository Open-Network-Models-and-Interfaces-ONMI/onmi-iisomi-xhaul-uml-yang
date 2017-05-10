/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.md.sal.common.api.data.AsyncTransaction;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChainListener;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.CreateFCRouteInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.CreateFCRouteOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.CreateFCRouteOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.ReRoutingFCRouteService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

import java.util.concurrent.Future;

/**
 * Created by olinchy on 5/9/17.
 */
public class ReRoutingRPC implements AutoCloseable, TransactionChainListener, ReRoutingFCRouteService
{
    public ReRoutingRPC(BindingAwareBroker.ProviderContext providerContext, RpcProviderRegistry rpcProviderRegistry)
    {
        this.dataBroker = providerContext.getSALService(DataBroker.class);
        this.mountService = providerContext.getSALService(MountPointService.class);
        this.registration = rpcProviderRegistry.addRpcImplementation(ReRoutingFCRouteService.class, this);
    }

    private final DataBroker dataBroker;
    private final MountPointService mountService;
    private final BindingAwareBroker.RpcRegistration<ReRoutingFCRouteService> registration;

    @Override
    public Future<RpcResult<CreateFCRouteOutput>> createFCRoute(
            CreateFCRouteInput input)
    {
        // select route according input

        // get data of every network-element from that route and store origin data

        // handle every network-element (add client-ltp\fc\lp)

        CreateFCRouteOutputBuilder builder = new CreateFCRouteOutputBuilder();
        builder.setUuid("fc_route_1");
        return RpcResultBuilder.success(builder.build()).buildFuture();
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
