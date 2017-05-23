/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.google.common.base.Optional;
import com.google.common.util.concurrent.CheckedFuture;
import com.highstreet.technologies.odl.app.impl.policy.Policies;
import com.highstreet.technologies.odl.app.impl.topology.Graph;
import com.highstreet.technologies.odl.app.impl.topology.Vertex;
import org.opendaylight.controller.md.sal.binding.api.*;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.LayerProtocolName;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.LpKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.Ltp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.network.element.LtpKey;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.*;
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

import java.util.*;
import java.util.concurrent.Future;

/**
 * Created by olinchy on 5/9/17.
 */
public class ReRoutingRPC implements ReRoutingFCRouteService
{
    public ReRoutingRPC(BindingAwareBroker.ProviderContext providerContext)
    {
        this.dataBroker = providerContext.getSALService(DataBroker.class);
        this.mountService = providerContext.getSALService(MountPointService.class);
//        this.registration = rpcProviderRegistry.addRpcImplementation(ReRoutingFCRouteService.class, this);
    }

    private static final LayerProtocolName LAYER_PROTOCOL_NAME = new LayerProtocolName("ETH");
    private static final Logger logger = LoggerFactory.getLogger(ReRoutingRPC.class);
    private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
            .create(NetworkTopology.class)
            .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));
    private final DataBroker dataBroker;
    private final MountPointService mountService;
    //    private final BindingAwareBroker.RpcRegistration<ReRoutingFCRouteService> registration;
    private HashMap<MountPoint, NetworkElement> currentNeOnPath = new HashMap<>();
    private CreateFCRouteInput currentInput;

    @Override
    public Future<RpcResult<CreateFCRouteForTestOutput>> createFCRouteForTest(CreateFCRouteForTestInput input)
    {
        CreateFCRouteForTestOutputBuilder builder = new CreateFCRouteForTestOutputBuilder();
        try
        {
            processNe("zte", Arrays.asList(new Vertex("ZTE-1-LTP-ETY-1.1.1"), new Vertex("ZTE-1-LTP-ETY-1.1.2")), 23);
            builder.setStatus(CreateFCRouteForTestOutput.Status.Successful);
        }
        catch (ReadFailedException e)
        {
            builder.setStatus(CreateFCRouteForTestOutput.Status.Failure);
            logger.warn("test failed", e);
        }
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<CreateFCRouteOutput>> createFCRoute(
            CreateFCRouteInput input)
    {
        CreateFCRouteOutputBuilder builder = new CreateFCRouteOutputBuilder();
        List<List<Vertex>> paths = Graph.instance().routes(new Vertex(input.getSrc()), new Vertex(input.getDst()));
        try
        {
            currentInput = input;
            for (List<Vertex> path : paths)
            {
                if (Policies.consent(path))
                {
                    create_fc_route_on(path, input.getVlanid());
                }
            }
            builder.setUuid("fc_route_1");
            builder.setStatus(CreateFCRouteOutput.Status.Successful);
        }
        catch (Exception e)
        {
            currentNeOnPath.clear();
            currentInput = null;
            logger.warn("create fc-route caught exception!", e);
            builder.setStatus(CreateFCRouteOutput.Status.Failure);
            builder.setUuid("");
        }

        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    @Override
    public Future<RpcResult<StartOutput>> start()
    {
        StartOutputBuilder builder = new StartOutputBuilder();
        try
        {
            ReadOnlyTransaction transaction = dataBroker.newReadOnlyTransaction();
            CheckedFuture<Optional<Topology>, ReadFailedException> futureTopo = transaction.read(
                    LogicalDatastoreType.OPERATIONAL, NETCONF_TOPO_IID);

            Optional<Topology> opTopo = futureTopo.get();
            if (opTopo.isPresent())
            {
                Topology topology = opTopo.get();

                // build graph by links
                Graph.instance(topology.getLink());
            }
            builder.setStatus(StartOutput.Status.Successful);
        }
        catch (Exception e)
        {
            builder.setStatus(StartOutput.Status.Failure);
        }
        return RpcResultBuilder.success(builder.build()).buildFuture();
    }

    private void processNe(String neid, List<Vertex> vertices, int vlanid) throws ReadFailedException
    {
        Optional<MountPoint> opMountP = mountService.getMountPoint(
                InstanceIdentifier.create(Topology.class).child(Node.class, new NodeKey(new NodeId(neid))));
        if (!opMountP.isPresent())
        {
            throw new IllegalArgumentException(" ne " + neid + " is not mounted!");
        }
        NetworkElement ne = getNe(opMountP.get());
        // save it
        currentNeOnPath.put(opMountP.get(), ne);

        // start the creation of fc
        // add client ltps
        ArrayList<String> clientLtpsInFC = new ArrayList<>();
        vertices.forEach(vertex -> addClientLtpTo(ne, vlanid, clientLtpsInFC, vertex));
        // add fc into fd
        ne.getFd().get(0).getFc().add(new UniversalId(buildFcName(clientLtpsInFC)));

        // submit to network element
        ReadWriteTransaction neCommitTrans = opMountP.get().getService(
                DataBroker.class).get().newReadWriteTransaction();
        neCommitTrans.put(LogicalDatastoreType.OPERATIONAL, InstanceIdentifier.create(NetworkElement.class), ne);

        neCommitTrans.submit();
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

    private void addClientLtpTo(NetworkElement ne, int vlanid, ArrayList<String> clientLtpsInFC, Vertex vertex)
    {
        String ltpName = vertex.getLTPUUid();
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

    private void reRoute()
    {
        // clear current
        for (Map.Entry<MountPoint, NetworkElement> entry : currentNeOnPath.entrySet())
        {
            NetworkElement ne = entry.getValue();
            MountPoint mountPoint = entry.getKey();

            // clear fc
            ne.getFd().get(0).getFc().clear();
            // clear client ltp
            Iterator<Ltp> iterator = ne.getLtp().iterator();
            while (iterator.hasNext())
            {
                Ltp ltp = iterator.next();
                if (ltp.getClientLtp().size() > 0)
                    ltp.getClientLtp().clear();
                else if (ltp.getServerLtp().size() > 0)
                    iterator.remove();
            }
            ReadWriteTransaction neTrans = mountPoint.getService(DataBroker.class).get().newReadWriteTransaction();
            neTrans.put(LogicalDatastoreType.OPERATIONAL, InstanceIdentifier.create(NetworkElement.class), ne);
            neTrans.submit();
        }
        // re create
        createFCRoute(currentInput);
    }

    private void create_fc_route_on(List<Vertex> path, int vlanid) throws ReadFailedException
    {
        createFCs(sortVertexByNE(path), vlanid);
    }

    private void createFCs(HashMap<String, List<Vertex>> verticesUnderNe, int vlanid) throws ReadFailedException
    {
        for (Map.Entry<String, List<Vertex>> entry : verticesUnderNe.entrySet())
        {
            processNe(entry.getKey(), entry.getValue(), vlanid);
        }
    }

    private HashMap<String, List<Vertex>> sortVertexByNE(List<Vertex> path)
    {
        HashMap<String, List<Vertex>> verticesInOneNe = new HashMap<>();
        for (Vertex vertex : path)
        {
            List<Vertex> vertices;
            String uuidOfNe = vertex.getNEUUid();
            if (verticesInOneNe.containsKey(uuidOfNe))
                vertices = verticesInOneNe.get(uuidOfNe);
            else
            {
                vertices = new ArrayList<>();
                verticesInOneNe.put(uuidOfNe, vertices);
            }
            vertices.add(vertex);
        }
        return verticesInOneNe;
    }
}
