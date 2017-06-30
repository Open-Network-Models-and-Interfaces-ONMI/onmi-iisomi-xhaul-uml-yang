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
import com.highstreet.technologies.odl.app.impl.tools.MountPointServiceHolder;
import com.highstreet.technologies.odl.app.impl.tools.NeExecutor;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfiguration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceStatus;
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

import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.CONFIGURATION;
import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.OPERATIONAL;
import static org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.StatusG.Status;
import static org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.StatusG.Status.Successful;

/**
 * Created by olinchy on 5/22/17.
 */
public class RouteRPC implements RouteService
{
    public RouteRPC(DataBroker dataBroker)
    {
        this.dataBroker = dataBroker;
        fc2Executor = new FC2Executor();
    }

    private static final Logger LOG = LoggerFactory.getLogger(RouteRPC.class);
    public static HashMap<String, NeExecutor> ne_map = new HashMap<>();
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
    public Future<RpcResult<Void>> readAirInterface(
            ReadAirInterfaceInput input)
    {
        String lpName = input.getLpId();
        String nodeName = input.getNodeName();
        NeExecutor executor = ne_map.computeIfAbsent(
                nodeName, n -> new NeExecutor(MountPointServiceHolder.getMountPoint(n)));
        try
        {
            AirInterfaceConfiguration airInterfaceConfiguration = executor.getUnderAirPac(
                    lpName, AirInterfaceConfiguration.class, CONFIGURATION);
            AirInterfaceStatus airInterfaceStatus = executor.getUnderAirPac(
                    lpName, AirInterfaceStatus.class, OPERATIONAL);
            LOG.info(airInterfaceConfiguration.toString());
            LOG.info(airInterfaceStatus != null ? airInterfaceStatus.toString() : "airInterfaceStatus is null");
        }
        catch (Exception e)
        {
            LOG.warn("", e);
        }

        return null;
    }

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
        LOG.info("creation follow the topology finished");
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
        LOG.info("switch follow the topology finished");
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<DeleteOutput>> delete(
            DeleteInput input)
    {
        DeleteOutputBuilder builder = new DeleteOutputBuilder();
        builder.setStatus(this.delete(input.getVlanid()));
        LOG.info("delete finished");
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
        this.delete(vlanId);
        ArrayList<Fc> listFc = new ArrayList<>();
        list.forEach(
                fc -> listFc.add(fc.toFc()));
        return this.create(vlanId, listFc);
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
        }
        toClear.put(vlanId, pathHolder);

        return Successful;
    }
}
