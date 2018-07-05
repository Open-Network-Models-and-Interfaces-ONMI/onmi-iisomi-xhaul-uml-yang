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
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.DataObjectModification;
import org.opendaylight.controller.md.sal.binding.api.DataTreeIdentifier;
import org.opendaylight.controller.md.sal.binding.api.DataTreeModification;
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
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
		if (LOG.isDebugEnabled()) {
			LOG.debug("OnDataChange, TreeChange");
		} else if (LOG.isTraceEnabled()) {
			LOG.trace("OnDataChange, TreeChange {}", changes);
		}
		for (final DataTreeModification<Node> change : changes) {
			final DataObjectModification<Node> root = change.getRootNode();
			switch (root.getModificationType()) {
			case SUBTREE_MODIFIED:
				// Change of subtree information
				update(change);
				break;
			case WRITE:
				// Create or modify top level node
				// Treat an overwrite as an update
				boolean update = change.getRootNode().getDataBefore() != null;
				if (update) {
					update(change);
				} else {
					add(change);
				}
				break;
			case DELETE:
				// Node removed
				remove(change);
				break;
			default:
				break;
			}
		}
	}

	public void add(DataTreeModification<Node> newDataObject) {
		Node node = newDataObject.getRootNode().getDataAfter();
		NodeId nodeId = node.getKey().getNodeId();
		LOG.info("Node {} added to topology-netconf", nodeId.getValue());
		NetconfNode netconfAugment = node.getAugmentation(NetconfNode.class);
		if (nodeId != null) {
			if (!nodeId.getValue().equals(CONTROLLER)) {
				deviceManagerService.mountpointNodeCreation(nodeId, netconfAugment);
			}
		}
		doProcessing(nodeId, netconfAugment);
	}

	public void remove(DataTreeModification<Node> removedDataObject) {
		Node node = removedDataObject.getRootNode().getDataBefore();
		NodeId nodeId = node.getKey().getNodeId();
		LOG.info("Node {} removed from topology-netconf", nodeId.getValue());
		NetconfNode netconfAugment = node.getAugmentation(NetconfNode.class);
		if (nodeId != null) {
			if (!nodeId.getValue().equals(CONTROLLER)) {
				deviceManagerService.mountpointNodeRemoved(nodeId);
			}
		}
		doProcessingRemove(nodeId, netconfAugment);
	}

	public void update(DataTreeModification<Node> modifiedDataObject) {
		// Node node = modifiedDataObject.getRootNode().getDataBefore();
		Node node = modifiedDataObject.getRootNode().getDataAfter();
		NodeId nodeId = node.getKey().getNodeId();
		LOG.info("Node {} modified in topology-netconf", nodeId.getValue());
		NetconfNode netconfAugment = node.getAugmentation(NetconfNode.class);
		doProcessing(nodeId, netconfAugment);
	}

	/**
	 * Process event and forward to clients
	 *
	 * @param nodeId
	 *            Id of node
	 * @param nnode
	 *            Netconf node
	 */
	private void doProcessing(NodeId nodeId, NetconfNode nnode) {

		if (nodeId == null || nnode == null) {
			LOG.warn("Empty node .. stop processing");
		}

		String nodeIdString = nodeId.getValue();

		if (nodeIdString.equals(CONTROLLER)) {
			LOG.debug("Stop processing for [{}]", CONTROLLER);
			return;
		}

		ConnectionStatus csts = nnode.getConnectionStatus();
		LOG.debug("NETCONF Node handled with status: {}", csts.toString());
		switch (csts) {
		case Connected: {
			deviceManagerService.startListenerOnNode(nodeId, nnode);
			break;
		}
		case Connecting: {
			deviceManagerService.removeListenerOnNode(nodeId, nnode);
			break;
		}
		case UnableToConnect: {
			deviceManagerService.removeListenerOnNode(nodeId, nnode);
			break;
		}
		}
	}

	/**
	 * Remove node
	 *
	 * @param nodeId
	 * @param nnode
	 */
	private void doProcessingRemove(NodeId nodeId, NetconfNode nnode) {

		if (nodeId == null || nnode == null) {
			LOG.warn("Empty node .. stop processing");
		}

		String nodeIdString = nodeId.getValue();

		if (nodeIdString.equals(CONTROLLER)) {
			LOG.debug("Stop processing for [{}]", CONTROLLER);
			return;
		}

		deviceManagerService.removeListenerOnNode(nodeId, nnode);

	}

}
