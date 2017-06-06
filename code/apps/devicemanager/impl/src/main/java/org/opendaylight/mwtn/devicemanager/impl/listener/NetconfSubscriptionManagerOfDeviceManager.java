/**
 * Copyright (c) 2017 highstreet technologies GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.mwtn.devicemanager.impl.listener;

import java.util.Map.Entry;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.DataChangeListener;
import org.opendaylight.controller.md.sal.common.api.data.AsyncDataBroker.DataChangeScope;
import org.opendaylight.controller.md.sal.common.api.data.AsyncDataChangeEvent;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.mwtn.devicemanager.api.DeviceManagerService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNodeConnectionStatus.ConnectionStatus;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yangtools.concepts.ListenerRegistration;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("deprecation")
public class NetconfSubscriptionManagerOfDeviceManager implements DataChangeListener {

    private static final Logger LOG = LoggerFactory.getLogger(NetconfSubscriptionManagerOfDeviceManager.class);

    public static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier.create(NetworkTopology.class)
            .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));

    public static final String CONTROLLER = "controller-config";

    private final DeviceManagerService deviceManagerService;
    private final DataBroker dataBroker;
    private ListenerRegistration<DataChangeListener> dclReg;

    public NetconfSubscriptionManagerOfDeviceManager(DeviceManagerService deviceManagerService, DataBroker dataBroker) {
        this.deviceManagerService = deviceManagerService;
        this.dataBroker = dataBroker;
    }

    public void register() {
        dclReg = dataBroker.registerDataChangeListener(LogicalDatastoreType.OPERATIONAL,
                NETCONF_TOPO_IID.child(Node.class), this, DataChangeScope.SUBTREE);
    }

    public void close() {
        if (dclReg != null) {
            dclReg.close();
        }
    }

    /*---------------------------------------------------------------------------
     * Listener
     */

    @Override
    public void onDataChanged(AsyncDataChangeEvent<InstanceIdentifier<?>, DataObject> change) {
        //LOG.debug("OnDataChange, change: {}", change); //<- Seems to be very long in cases
        if (LOG.isDebugEnabled()) {
        	LOG.debug("OnDataChange, change");
        } else if (LOG.isTraceEnabled()) {
        	LOG.trace("OnDataChange, change {}", change);
        }

        // Created
        for (Entry<InstanceIdentifier<?>, DataObject> entry : change.getCreatedData().entrySet()) {
            if (LOG.isDebugEnabled()) {
                LOG.debug("CreateKey: {}", entry.getKey().toString());
            }
            if (entry.getKey().getTargetType() == NetconfNode.class) {
                NodeId nNodeId = entry.getKey().firstKeyOf(Node.class).getNodeId();
                if (nNodeId != null && !nNodeId.getValue().equals(CONTROLLER)) {
                    NetconfNode nNode = (NetconfNode) entry.getValue();
                    deviceManagerService.mountpointNodeCreation(nNodeId, nNode);
                }
            }
        }

        // Removed
        for (InstanceIdentifier<?> path : change.getRemovedPaths()) {
            if (LOG.isDebugEnabled()) {
                LOG.debug("RemoveKey: {}", path.toString());
            }
            NodeId nNodeId = path.firstKeyOf(Node.class).getNodeId();
            if (nNodeId != null && !nNodeId.getValue().equals(CONTROLLER)) {
                deviceManagerService.mountpointNodeRemoved(nNodeId);
            }
        }


        // Updated
        for (Entry<InstanceIdentifier<?>, DataObject> entry : change.getUpdatedData().entrySet()) {
            if (LOG.isDebugEnabled()) {
                LOG.debug("UpdatedKey: {}", entry.getKey().toString());
            }

            if (entry.getKey().getTargetType() == NetconfNode.class) {
                NodeId nodeId = entry.getKey().firstKeyOf(Node.class).getNodeId();

                if (nodeId != null && !nodeId.getValue().equals(CONTROLLER)) {
                    NetconfNode nnode = (NetconfNode) entry.getValue();
                    ConnectionStatus csts = nnode.getConnectionStatus();

                    switch (csts) {
                        case Connected: {
                            LOG.debug("NETCONF Node: {} is fully connected", nodeId.getValue());
                            //deviceManagerService.startListenerOnNode(nodeId.getValue());
                            deviceManagerService.startListenerOnNode(nodeId, nnode);
                            break;
                        }

                        case Connecting: {
                            LOG.debug("NETCONF Node: {} was disconnected", nodeId.getValue());
                            //deviceManagerService.removeListenerOnNode(nodeId.getValue());
                            deviceManagerService.removeListenerOnNode(nodeId, nnode);
                            break;
                        }
                        case UnableToConnect: {
                            LOG.debug("NETCONF Node: {} connection failed", nodeId.getValue());
                            //deviceManagerService.removeListenerOnNode(nodeId.getValue());
                            deviceManagerService.removeListenerOnNode(nodeId, nnode);
                            break;
                        }
                    }
                }

            }
        }
    }


}
