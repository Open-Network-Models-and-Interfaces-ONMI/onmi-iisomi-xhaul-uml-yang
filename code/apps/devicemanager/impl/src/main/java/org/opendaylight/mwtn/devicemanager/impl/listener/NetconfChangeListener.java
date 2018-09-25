/**
 * Copyright (c) 2017 highstreet technologies GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.mwtn.devicemanager.impl.listener;

import java.util.Collection;

import org.opendaylight.controller.md.sal.binding.api.ClusteredDataTreeChangeListener;
//import org.opendaylight.controller.md.sal.binding.api.ClusteredDataTreeChangeListener;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.DataObjectModification;
import org.opendaylight.controller.md.sal.binding.api.DataObjectModification.ModificationType;
import org.opendaylight.controller.md.sal.binding.api.DataTreeIdentifier;
import org.opendaylight.controller.md.sal.binding.api.DataTreeModification;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.mwtn.devicemanager.api.DeviceManagerService;
import org.opendaylight.mwtn.devicemanager.api.DeviceManagerService.Action;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNodeConnectionStatus.ConnectionStatus;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.opendaylight.yangtools.concepts.ListenerRegistration;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// 07.09.18 Switched to DataTreeChangeListener from ClusteredDataTreeChangeListener -> DM Service is running at all nodes
// This is not correct
public class NetconfChangeListener implements ClusteredDataTreeChangeListener<Node>, AutoCloseable {

	private static final Logger LOG = LoggerFactory.getLogger(NetconfChangeListener.class);

	private static final InstanceIdentifier<Node> NETCONF_NODE_TOPO_IID = InstanceIdentifier
			.create(NetworkTopology.class)
			.child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())))
			.child(Node.class);
	// Name of ODL controller NETCONF instance
	private static final String CONTROLLER = "controller-config";

	private final DeviceManagerService deviceManagerService;
	private final DataBroker dataBroker;
	private ListenerRegistration<NetconfChangeListener> dlcReg;

	public NetconfChangeListener(DeviceManagerService deviceManagerService, DataBroker dataBroker) {
		this.deviceManagerService = deviceManagerService;
		this.dataBroker = dataBroker;
	}

	public void register() {
		DataTreeIdentifier<Node> treeId = new DataTreeIdentifier<Node>(LogicalDatastoreType.OPERATIONAL,
				NETCONF_NODE_TOPO_IID);
		dlcReg = dataBroker.registerDataTreeChangeListener(treeId, this);
	}

	public void close() {
		if (dlcReg != null) {
			dlcReg.close();
		}
	}
	/*---------------------------------------------------------------------------
	 * Listener
	 */

	@Override
	public void onDataTreeChanged(Collection<DataTreeModification<Node>> changes) {
		if (LOG.isTraceEnabled()) {
			LOG.trace("OnDataChange, TreeChange {}", changes);
		} else if (LOG.isDebugEnabled()) {
			LOG.debug("OnDataChange, TreeChange");
		}

		for (final DataTreeModification<Node> change : changes) {
			final DataObjectModification<Node> root = change.getRootNode();
			final ModificationType modificationType = root.getModificationType();
			if (LOG.isTraceEnabled()) {
				LOG.trace("Handle this modificatoinType:{} path:{} root:{}", modificationType, change.getRootPath(), root);
			}
			switch (modificationType) {
				case SUBTREE_MODIFIED:
					// Change of subtree information
					// update(change); OLD
					doProcessing(Action.UPDATE, root.getDataAfter());
					break;
				case WRITE:
					// Create or modify top level node
					// Treat an overwrite as an update
					boolean update = root.getDataBefore() != null;
					if (update) {
						//update(change);
						doProcessing(Action.UPDATE, root.getDataAfter());
					} else {
						//add(change);
						doProcessing(Action.ADD, root.getDataAfter());
					}
					break;
				case DELETE:
					// Node removed
					//remove(change);
					doProcessing(Action.REMOVE, root.getDataBefore());
					break;
			}
		}
	}

	/* ----------------------------------------------------------------
	 * Functions to select the right node from DataObjectModification
	 */

	/**
	 * Process event and forward to clients
	 * @param action
	 * @param node   Basis node
	 */
	private void doProcessing(Action action, Node node) {

		NodeId nodeId;
		NetconfNode nnode;
		try {
			NodeKey nodeKey = node.getKey();
			nodeId = nodeKey.getNodeId();
			nnode = node.getAugmentation(NetconfNode.class);
		} catch (NullPointerException e) {
			LOG.warn("Unexpected null .. stop processing.", e);
			return;
		}

		LOG.debug("doProcessing action {} {}",action, nodeId);
		String nodeIdString = nodeId.getValue();
		// Do not forward any controller related events to devicemanager
		if (nodeIdString.equals(CONTROLLER)) {
			LOG.debug("Stop processing for [{}]", nodeIdString);
			return;
		}

        // Related to action
		if (action == Action.REMOVE) {
			deviceManagerService.mountpointNodeRemoved(nodeId); //Stop Monitor
			deviceManagerService.leaveConnectedState(nodeId, nnode); //Remove Mountpoint handler
			return;
		}

        // Related to Mountpoint status
		ConnectionStatus csts = nnode.getConnectionStatus();
		LOG.debug("NETCONF Node handled with status: {} {}", csts, nnode.getClusteredConnectionStatus());
		if (csts != null) {
			switch (csts) {
				case Connected: {
					deviceManagerService.startListenerOnNodeForConnectedState(action, nodeId, nnode);
					break;
				}
				case UnableToConnect:
				case Connecting: {
					deviceManagerService.leaveConnectedState(nodeId, nnode);
					break;
				}
			}
		} else {
			LOG.debug("NETCONF Node handled with null status");
		}
	}
}
