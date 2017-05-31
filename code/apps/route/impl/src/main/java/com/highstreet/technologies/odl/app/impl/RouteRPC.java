/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.google.common.base.Optional;
import org.opendaylight.controller.md.sal.binding.api.*;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.LayerProtocolName;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElementBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.FdBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointList;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.Fc;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.Future;

import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.CONFIGURATION;
import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.OPERATIONAL;
import static org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.StatusG.Status.Successful;

/**
 * Created by olinchy on 5/22/17.
 */
public class RouteRPC implements RouteService
{
    public RouteRPC(DataBroker dataBroker, MountPointService mountPointService)
    {
        this.dataBroker = dataBroker;
        this.mountPointService = mountPointService;
    }

    private static final LayerProtocolName LAYER_PROTOCOL_NAME = new LayerProtocolName("ETH");
    private static final Logger LOG = LoggerFactory.getLogger(RouteRPC.class);
    private final DataBroker dataBroker;
    private final MountPointService mountPointService;

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
    public Future<RpcResult<CreateOutput>> create(
            CreateInput input)
    {
        CreateOutputBuilder builder = new CreateOutputBuilder();

        try
        {
            PathDelegate holder = new PathDelegate(dataBroker, input);

            input.getFc().forEach(
                    (fc -> holder.add(process(fc, input.getVlanid()))));
            holder.commit();
        }
        catch (Exception e)
        {
            LOG.warn("creating LtpPath caught exception", e);
            builder.setStatus(CreateOutput.Status.Failure);
        }

        builder.setStatus(Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    private List<LogicalTerminationPointList> process(Fc fc, int vlanId)
    {
        Optional<MountPoint> opMountP = mountPointService.getMountPoint(
                InstanceIdentifier.create(NetworkTopology.class).child(Topology.class, new TopologyKey(
                        new TopologyId(TopologyNetconf.QNAME.getLocalName()))).child(Node.class, new NodeKey(
                        new NodeId(fc.getNodeName()))));
        if (!opMountP.isPresent())
        {
            throw new IllegalArgumentException(" ne " + fc.getNodeName() + " is not mounted!");
        }
        ArrayList<LogicalTerminationPointList> clientLtpsInFC = null;
        try
        {
            NetworkElement ne = getNe(opMountP.get());
            NetworkElementBuilder neBuilder = new NetworkElementBuilder(ne);

            LtpInOdlCreator ltpInOdlCreator = new LtpInOdlCreator(fc.getNodeName());

            // start the creation of fc
            // add client ltps
            clientLtpsInFC = new ArrayList<>();
            clientLtpsInFC.add(ltpInOdlCreator.create(addClientLtpTo(neBuilder, vlanId, fc.getAEnd()), fc.getAEnd()));
            clientLtpsInFC.add(ltpInOdlCreator.create(addClientLtpTo(neBuilder, vlanId, fc.getZEnd()), fc.getZEnd()));

            // add fc into fd
            FdBuilder fdBuilder = new FdBuilder(neBuilder.getFd().remove(0));
            if (fdBuilder.getFc() == null)
                fdBuilder.setFc(new ArrayList<>());

            fdBuilder.getFc().add(new UniversalId(buildFcName(clientLtpsInFC)));

            neBuilder.getFd().add(fdBuilder.build());

            // submit to network element
            ReadWriteTransaction neCommitTrans = opMountP.get().getService(
                    DataBroker.class).get().newReadWriteTransaction();
            neCommitTrans.put(CONFIGURATION, InstanceIdentifier.create(NetworkElement.class), neBuilder.build());

            neCommitTrans.submit();
        }
        catch (Exception e)
        {
            LOG.warn(e.getMessage(), e);
        }

        return clientLtpsInFC;
    }

    private NetworkElement getNe(MountPoint mountPoint) throws ReadFailedException
    {
        DataBroker neDataBroker = mountPoint.getService(DataBroker.class).get();
        InstanceIdentifier<NetworkElement> path = InstanceIdentifier.create(NetworkElement.class);
        ReadOnlyTransaction networkElementTransaction = neDataBroker.newReadOnlyTransaction();
        Optional<NetworkElement> networkElementOpt = networkElementTransaction.read(
                OPERATIONAL, path).checkedGet();
        if (networkElementOpt.isPresent())
            return networkElementOpt.get();
        return null;
    }

    private String addClientLtpTo(NetworkElementBuilder ne, int vlanid, String ltpName)
    {
        String clientLtpName = ltpFrom(ltpName);
        String lpName = lpFrom(clientLtpName, vlanid);

        // add client ltp to ltp
        Ltp serverLTP = null;
        Iterator<Ltp> iterator = ne.getLtp().iterator();
        while (iterator.hasNext())
        {
            Ltp temp = iterator.next();
            if (temp.getUuid().getValue().equalsIgnoreCase(ltpName))
            {
                iterator.remove();
                serverLTP = temp;
                break;
            }
        }

        LtpBuilder serverBuilder = new LtpBuilder(serverLTP);

        if (serverBuilder.getClientLtp() == null)
            serverBuilder.setClientLtp(new ArrayList<>());
        serverBuilder.getClientLtp().add(new UniversalId(clientLtpName));

        // add client ltp to ltps
        LtpBuilder clientLtpBuilder = new LtpBuilder();
        clientLtpBuilder.setKey(new LtpKey(new UniversalId(clientLtpName)));
        clientLtpBuilder.setServerLtp(Arrays.asList(new UniversalId(serverLTP.getKey().getUuid())));
        // add lp to client ltp
        LpBuilder lpBuilder = new LpBuilder();
        lpBuilder.setKey(new LpKey(new UniversalId(lpName)));
        lpBuilder.setLayerProtocolName(new LayerProtocolName(LAYER_PROTOCOL_NAME));
        clientLtpBuilder.setLp(Arrays.asList(lpBuilder.build()));

        ne.getLtp().add(clientLtpBuilder.build());
        ne.getLtp().add(serverBuilder.build());

        return clientLtpName;
    }

    private String buildFcName(ArrayList<LogicalTerminationPointList> clientLtpsInFC)
    {
//        String fcName = "FC-LTP-ETY-1.1.1-ETH-23- LTP-ETC-1.3.1-ETH-23"
        StringBuilder fcName = new StringBuilder("FC");
        for (LogicalTerminationPointList ltp : clientLtpsInFC)
        {
            fcName.append("-").append(ltp.getKey().getLtpIndex());
        }
        return fcName.toString();
    }

    private String ltpFrom(String ltpName)
    {
        return ltpName + "-LP-1";
    }

    private String lpFrom(String ltpName, int vlanid)
    {
        return String.format(ltpName + "-%1$s-%2$d", LAYER_PROTOCOL_NAME.getValue(), vlanid);
    }
}
