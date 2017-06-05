/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.highstreet.technologies.odl.app.impl.delegates.PredefinePath;
import com.highstreet.technologies.odl.app.impl.tools.FC2Executor;
import com.highstreet.technologies.odl.app.impl.tools.JsonUtil;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.*;
import org.opendaylight.yangtools.yang.common.RpcError;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.concurrent.Future;

import static org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.StatusG.Status.Successful;

/**
 * Created by olinchy on 5/22/17.
 */
public class RouteRPC implements RouteService
{
    public RouteRPC(DataBroker dataBroker, MountPointService mountPointService)
    {
        this.dataBroker = dataBroker;
        fc2Executor = new FC2Executor(dataBroker, mountPointService);
    }

    private static final Logger LOG = LoggerFactory.getLogger(RouteRPC.class);
    private static HashMap<Integer, PathHolder> toClear = new HashMap<>();
    private static PredefinePath predefinePath;

    static
    {
        predefinePath = JsonUtil.toObject(
                RouteRPC.class.getClassLoader().getResource("toplogy.json"), PredefinePath.class);
    }

    private final DataBroker dataBroker;
    private FC2Executor fc2Executor;

    @Override
    public Future<RpcResult<RestoreFollowTopoOutput>> restoreFollowTopo(
            RestoreFollowTopoInput input)
    {
        RestoreFollowTopoOutputBuilder builder = new RestoreFollowTopoOutputBuilder();
        builder.setStatus(Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<CreateFollowTopoOutput>> createFollowTopo(
            CreateFollowTopoInput input)
    {

        CreateFollowTopoOutputBuilder builder = new CreateFollowTopoOutputBuilder();
        int vlanId = input.getVlanid();
//        predefinePath.paths;

        builder.setStatus(Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<SwitchFollowTopoOutput>> switchFollowTopo(
            SwitchFollowTopoInput input)
    {

        SwitchFollowTopoOutputBuilder builder = new SwitchFollowTopoOutputBuilder();
        builder.setStatus(Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<DeleteOutput>> delete(
            DeleteInput input)
    {
        DeleteOutputBuilder builder = new DeleteOutputBuilder();
        Integer vlanid = input.getVlanid();
        try
        {
            toClear.remove(vlanid).clear(input.getVlanid());
        }
        catch (Exception e)
        {
            LOG.warn("execute delete caught exception", e);
            builder.setStatus(CreateOutput.Status.Failure);
            return RpcResultBuilder.success(builder.build()).withError(
                    RpcError.ErrorType.APPLICATION, e.getMessage()).buildFuture();
        }

        builder.setStatus(Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<CreateOutput>> create(
            CreateInput input)
    {
        CreateOutputBuilder builder = new CreateOutputBuilder();

        PathHolder pathHolder = new PathHolder(dataBroker, input.getVlanid());
        try
        {
            input.getFc().forEach(
                    fc ->
                    {
                        try
                        {
                            pathHolder.add(fc2Executor.to(fc, input.getVlanid(), pathHolder.getLtpCreator()));
                        }
                        catch (ReadFailedException e)
                        {
                            LOG.warn("read failed", e);
                        }
                    });
            pathHolder.commit();
        }
        catch (Exception e)
        {
            LOG.warn("creating LtpPath caught exception", e);
            builder.setStatus(CreateOutput.Status.Failure);
            return RpcResultBuilder.success(builder.build()).withError(
                    RpcError.ErrorType.APPLICATION, e.getMessage()).buildFuture();
        }
        toClear.put(input.getVlanid(), pathHolder);

        builder.setStatus(Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }
}
