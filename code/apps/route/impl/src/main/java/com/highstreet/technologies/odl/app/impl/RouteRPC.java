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
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.*;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Future;

/**
 * Created by olinchy on 5/22/17.
 */
public class RouteRPC implements RouteService
{
    private static final Logger LOG = LoggerFactory.getLogger(RouteRPC.class);
    private final DataBroker dataBroker;
    private final MountPointService mountPointService;

    public RouteRPC(DataBroker dataBroker, MountPointService mountPointService)
    {
        this.dataBroker = dataBroker;
        this.mountPointService = mountPointService;
    }

    @Override
    public Future<RpcResult<StartOutput>> start()
    {
        LOG.info("calling RouteRPC.start");
        StartOutputBuilder builder = new StartOutputBuilder();

        builder.setStatus(StartOutput.Status.Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<CreateOutput>> create(
            CreateInput input)
    {
        return null;
    }
}
