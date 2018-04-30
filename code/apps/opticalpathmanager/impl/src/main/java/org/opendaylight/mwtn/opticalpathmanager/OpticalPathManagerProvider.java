/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.opticalpathmanager;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import com.google.common.base.Optional;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import javax.annotation.Nonnull;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.rev180119.OpticalpathmanagerService;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OpticalPathManagerProvider implements MountpointChangeListener, BindingAwareProvider, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(OpticalPathManagerProvider.class);

    private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
            .create(NetworkTopology.class)
            .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));

    private RpcRegistration<OpticalpathmanagerService> opticalpathmanagerService;
    private ProviderContext session;
    private DataBroker dataBroker;
    private DataChangeHandler dataChangeHandleronfSubscriptionManager;
    private final Map<String, ONFCoreNetworkElementRepresentation> neMap = new HashMap<>();

    @Override
    public void onSessionInitiated(ProviderContext pSession) {

        this.session = pSession;
        this.dataBroker = pSession.getSALService(DataBroker.class);

        LOG.info("OpticalPathManagerProvider Session Initiated");
        opticalpathmanagerService = session.addRpcImplementation(OpticalpathmanagerService.class, new OpticalPathManagerServiceImpl());

        // netconfSubscriptionManager should be the last because calling back this service
        this.dataChangeHandleronfSubscriptionManager = new DataChangeHandler(this, dataBroker);
        this.dataChangeHandleronfSubscriptionManager.register();

    }

    @Override
    public void close() throws Exception {
        LOG.info("OpticalPathManagerProvider Closed");
        if (opticalpathmanagerService != null) {
            opticalpathmanagerService.close();
        }
    }

    @Override
    public void removeListenerOnNode(NodeId nNodeId, NetconfNode nNode) {
        this.neMap.remove(nNodeId.getValue());
        LOG.info("Remove event listener on Netconf device :: Name : {}", nNodeId.getValue());
    }

    @Override
    public void startListenerOnNode(NodeId nNodeId, NetconfNode nNode) {

        String mountPointNodeName = nNodeId.getValue();
        LOG.info("Starting event listener on Netconf device :: Name : {}", mountPointNodeName);

        MountPointService mountService = session.getSALService(MountPointService.class);

        InstanceIdentifier<Node> instanceIdentifier = NETCONF_TOPO_IID.child(Node.class,
                new NodeKey(new NodeId(mountPointNodeName)));

        Optional<MountPoint> optionalMountPoint = null;
        int timeout = 10000;
        while ( !(optionalMountPoint = mountService.getMountPoint(instanceIdentifier)).isPresent() && timeout > 0) {

            LOG.info("Event listener waiting for mount point for Netconf device :: Name : {}", mountPointNodeName);
            try {
                Thread.sleep(1000);
                timeout -= 1000;
            } catch (InterruptedException e) {
                LOG.info("Event listener waiting for mount point for Netconf device :: Name : {} Time: {}", mountPointNodeName, timeout);
            }
        }

        if (!optionalMountPoint.isPresent()) {
            LOG.warn("Event listener timeout while waiting for mount point for Netconf device :: Name : {} ", mountPointNodeName);
            return;
        }

        //Mountpoint is present for sure
        MountPoint mountPoint = optionalMountPoint.get();

        DataBroker netconfNodeDataBroker = mountPoint.getService(DataBroker.class).get();
        LOG.info("Databroker service 1:{} 2:{}", dataBroker.hashCode(), netconfNodeDataBroker.hashCode());

        neMap.put(mountPointNodeName, new ONFCoreNetworkElementRepresentation(mountPointNodeName, netconfNodeDataBroker));

    }

    @Override
    public void mountpointNodeCreation(NodeId nNodeId, NetconfNode nNode) {
        LOG.info("Create mountpoint for Netconf device :: Name : {}", nNodeId.getValue());
    }

    @Override
    public void mountpointNodeRemoved(NodeId nNodeId) {
        LOG.info("Remove mountpoint for Netconf device :: Name : {}", nNodeId.getValue());
    }
}
