/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.highstreet.technologies.odl.app.impl.delegates.FC;
import com.highstreet.technologies.odl.app.impl.delegates.PredefinePath;
import com.highstreet.technologies.odl.app.impl.tools.FC2Executor;
import com.highstreet.technologies.odl.app.impl.tools.JsonUtil;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.Fc;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.Future;

import static org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.StatusG.Status;
import static org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.StatusG.Status.Failure;
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
                RouteRPC.class.getClassLoader().getResource("topology.json"), PredefinePath.class);
    }

    private final DataBroker dataBroker;
    private FC2Executor fc2Executor;

    @Override
    public Future<RpcResult<RestoreFollowTopoOutput>> restoreFollowTopo(
            RestoreFollowTopoInput input)
    {
        RestoreFollowTopoOutputBuilder builder = new RestoreFollowTopoOutputBuilder();
        builder.setStatus(switchTo(
                input.getVlanid(),
                Arrays.asList(predefinePath.paths.get(String.valueOf(input.getVlanid())).main_ltps)));
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<CreateFollowTopoOutput>> createFollowTopo(
            CreateFollowTopoInput input)
    {
        CreateFollowTopoOutputBuilder builder = new CreateFollowTopoOutputBuilder();
        int vlanId = input.getVlanid();
        ArrayList<Fc> listFc = new ArrayList<>();
        Arrays.stream(predefinePath.paths.get(String.valueOf(vlanId)).main_ltps).forEach(fc -> listFc.add(fc.toFc()));

        builder.setStatus(this.create(vlanId, listFc));
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<SwitchFollowTopoOutput>> switchFollowTopo(
            SwitchFollowTopoInput input)
    {
        SwitchFollowTopoOutputBuilder builder = new SwitchFollowTopoOutputBuilder();
        builder.setStatus(
                switchTo(
                        input.getVlanid(),
                        Arrays.asList(predefinePath.paths.get(String.valueOf(input.getVlanid())).backup_ltps)));
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<DeleteOutput>> delete(
            DeleteInput input)
    {
        DeleteOutputBuilder builder = new DeleteOutputBuilder();
        builder.setStatus(this.delete(input.getVlanid()));
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<CreateOutput>> create(
            CreateInput input)
    {
        CreateOutputBuilder builder = new CreateOutputBuilder();
        builder.setStatus(this.create(input.getVlanid(), input.getFc()));
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    private Status switchTo(int vlanId, List<FC> list)
    {
        Status deleteOrigin = this.delete(vlanId);
        if (deleteOrigin.equals(Successful))
        {
            ArrayList<Fc> listFc = new ArrayList<>();
            list.forEach(
                    fc -> listFc.add(fc.toFc()));
            return this.create(vlanId, listFc);
        }
        else
        {
            return Failure;
        }
    }

    public Status delete(int vlanId)
    {
        try
        {
            toClear.remove(vlanId).clear(vlanId);
        }
        catch (Exception e)
        {
            LOG.warn("execute delete caught exception", e);
            return Failure;
        }

        return Successful;
    }

    private Status create(int vlanId, List<Fc> fcList)
    {
        PathHolder pathHolder = new PathHolder(dataBroker, vlanId);
        try
        {
            fcList.forEach(
                    fc ->
                    {
                        try
                        {
                            pathHolder.add(fc2Executor.to(fc, vlanId, pathHolder.getLtpCreator()));
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
            return Failure;
        }
        toClear.put(vlanId, pathHolder);

        return Successful;
    }
}
