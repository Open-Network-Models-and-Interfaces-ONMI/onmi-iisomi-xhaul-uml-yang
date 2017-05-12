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
import com.highstreet.technologies.odl.app.impl.topology.Graph;
import com.highstreet.technologies.odl.app.impl.topology.Vertex;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.controller.md.sal.common.api.data.AsyncTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.controller.md.sal.common.api.data.TransactionChainListener;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.RpcProviderRegistry;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.rev170509.*;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

import java.util.List;
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

    private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
            .create(NetworkTopology.class)
            .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));
    private final DataBroker dataBroker;
    private final MountPointService mountService;
    private final BindingAwareBroker.RpcRegistration<ReRoutingFCRouteService> registration;

    @Override
    public Future<RpcResult<CreateFCRouteOutput>> createFCRoute(
            CreateFCRouteInput input)
    {

        List<List<Vertex>> routes = Graph.instance().routes(new Vertex(input.getSrc()), new Vertex(input.getDst()));
        // select route according input
//        List<LogicalTerminationPoint> routes = selectRoute(input);

        // get data of every network-element from that route and store origin data

        // handle every network-element (add client-ltp\fc\lp)

//        try
//        {
//            Optional<Topology> optTopology = topology.checkedGet();
//            List<Node> nodeList = optTopology.get().getNode();
//            for (Node node : nodeList)
//            { // loop all nodes from topology
//                LOG.info("Node : {}", node.getKey().getNodeId());
//                if (canProcessDevice(node))
//                { // check if we can process it
//                    processNode(node.getKey());
//                }
//            }
//        }
//        catch (Exception e)
//        {
//            LOG.error(e.getMessage(), e);
//            return false;
//        }
//        return true;

        CreateFCRouteOutputBuilder builder = new CreateFCRouteOutputBuilder();
        builder.setUuid("fc_route_1");
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

    private <T> T get_under_node(String path, Class<T> clazz)
    {
        // nodeid_obj
//        String[] ids = path.split("_");
//        String nodeUUid = ids[0];
//        String ltpUUid = ids[1];
//
//        ReadOnlyTransaction transaction = dataBroker.newReadOnlyTransaction();
//        InstanceIdentifier<Node> instanceIdentifierNode =
//                create(NetworkTopology.class)
//                        .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())))
//                        .child(Node.class, new NodeKey(new NodeId(nodeUUid)));
//        CheckedFuture<Optional<Node>, ReadFailedException> checked = transaction.read(
//                LogicalDatastoreType.OPERATIONAL, instanceIdentifierNode);
//
//        Optional<Node> optional = checked.checkedGet();
//        if (optional.isPresent())
//        {
//            InstanceIdentifier<Ltp> idLtp = create(NetworkElement.class).child(Ltp.class, new LtpKey(
//                    new UniversalId(ltpUUid)));
//            Optional<MountPoint> mountPoint = mountService.getMountPoint(instanceIdentifierNode);
//            DataBroker mountPointBroker = mountPoint.get().getService(DataBroker.class).get();
//
//            ReadOnlyTransaction ltpTrans = mountPointBroker.newReadOnlyTransaction();
//            ltpTrans.read(LogicalDatastoreType.CONFIGURATION, idLtp).checkedGet().get().getKey();
//        }
//
        return null;
    }

    private <T> T get_under(Node node, String uuid, Class<T> clazz)
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
