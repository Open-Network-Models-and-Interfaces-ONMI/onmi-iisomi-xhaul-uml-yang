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
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.LayerProtocolName;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpKey;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.*;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.Fc;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev130712.NodeId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev130712.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev130712.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev130712.network.topology.topology.NodeKey;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.Future;

/**
 * Created by olinchy on 5/22/17.
 */
public class RouteRPC implements RouteService
{
    private static final LayerProtocolName LAYER_PROTOCOL_NAME = new LayerProtocolName("ETH");
    private static final Logger LOG = LoggerFactory.getLogger(RouteRPC.class);
    private final DataBroker dataBroker;
    private final MountPointService mountPointService;

    public RouteRPC(DataBroker dataBroker, MountPointService mountPointService)
    {
        this.dataBroker = dataBroker;
        this.mountPointService = mountPointService;
    }

    @Override
    public Future<RpcResult<SwitchToOutput>> switchTo(SwitchToInput input)
    {
        input.getFc().forEach((fc -> process(fc, input.getVlanid())));
        SwitchToOutputBuilder builder = new SwitchToOutputBuilder();
        builder.setStatus(SwitchToOutput.Status.Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<CreateOutput>> create(
            CreateInput input)
    {
        input.getFc().forEach((fc -> process(fc, input.getVlanid())));
        CreateOutputBuilder builder = new CreateOutputBuilder();
        builder.setStatus(CreateOutput.Status.Successful);
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    private void process(Fc fc, int vlanId)
    {
        Optional<MountPoint> opMountP = mountPointService.getMountPoint(
                InstanceIdentifier.create(Topology.class).child(Node.class, new NodeKey(new NodeId(fc.getNodeName()))));
        if (!opMountP.isPresent())
        {
            throw new IllegalArgumentException(" ne " + fc.getNodeName() + " is not mounted!");
        }
        try
        {
            NetworkElement ne = getNe(opMountP.get());
            // save it
//        currentNeOnPath.put(opMountP.get(), ne);

            // start the creation of fc
            // add client ltps
            ArrayList<String> clientLtpsInFC = new ArrayList<>();
            addClientLtpTo(ne, vlanId, clientLtpsInFC, fc.getAEnd());
            addClientLtpTo(ne, vlanId, clientLtpsInFC, fc.getZEnd());
            // add fc into fd
            ne.getFd().get(0).getFc().add(new UniversalId(buildFcName(clientLtpsInFC)));

            // submit to network element
            ReadWriteTransaction neCommitTrans = opMountP.get().getService(
                    DataBroker.class).get().newReadWriteTransaction();
            neCommitTrans.put(LogicalDatastoreType.OPERATIONAL, InstanceIdentifier.create(NetworkElement.class), ne);

            neCommitTrans.submit();
        } catch (Exception e)
        {
            LOG.warn(e.getMessage(), e);
        }
    }

    private NetworkElement getNe(MountPoint mountPoint) throws ReadFailedException
    {
        DataBroker neDataBroker = mountPoint.getService(DataBroker.class).get();
        InstanceIdentifier<NetworkElement> path = InstanceIdentifier.create(NetworkElement.class);
        ReadOnlyTransaction networkElementTransaction = neDataBroker.newReadOnlyTransaction();
        Optional<NetworkElement> networkElementOpt = networkElementTransaction.read(
                LogicalDatastoreType.OPERATIONAL, path).checkedGet();
        if (networkElementOpt.isPresent())
            return networkElementOpt.get();
        return null;
    }

    private void addClientLtpTo(NetworkElement ne, int vlanid, ArrayList<String> clientLtpsInFC, String ltpName)
    {
        String clientLtpName = ltpFrom(ltpName, vlanid);
        String lpName = lpFrom(clientLtpName, vlanid);

        clientLtpsInFC.add(clientLtpName);

        // add clien ltp to ltp
        Ltp serverLTP = null;
        for (Ltp ltp : ne.getLtp())
        {
            if (ltp.getKey().getUuid().getValue().equalsIgnoreCase(ltpName))
            {
                serverLTP = ltp;
                break;
            }
        }
        serverLTP.getClientLtp().add(new UniversalId(clientLtpName));
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
    }

    private String buildFcName(ArrayList<String> clientLtpsInFC)
    {
//        String fcName = "FC-LTP-ETY-1.1.1-ETH-23- LTP-ETC-1.3.1-ETH-23"
        StringBuilder fcName = new StringBuilder("FC");
        for (String ltpName : clientLtpsInFC)
        {
            fcName.append("-").append(ltpName);
        }
        return fcName.toString();
    }

    private String ltpFrom(String ltpName, int vlanid)
    {
        return ltpName + "-LP-1";
    }

    private String lpFrom(String ltpName, int vlanid)
    {
        return String.format(ltpName + "-%1$s-%2$d", LAYER_PROTOCOL_NAME, vlanid);
    }

}
