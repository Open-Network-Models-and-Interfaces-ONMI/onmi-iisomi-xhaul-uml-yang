/**
 * Copyright (c) 2017 highstreet technologies GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.mwtn.devicemanager.api;

import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;

public interface DeviceManagerService {

    /*@Deprecated
    public void startListenerOnNode(String nodeName);*/

    /*@Deprecated
    public void removeListenerOnNode(String nodeName);*/

    /**
     * Managed device is disconnected from node/mountpoint
     * @param nNodeId id of the mountpoint
     * @param nNode mountpoint contents
     */
    public void removeListenerOnNode(NodeId nNodeId, NetconfNode nNode);

    /**
     * Managed device is connected to node/mountpoint
     * @param nNodeId id of the mountpoint
     * @param nNode mountpoint contents
     */
    public void startListenerOnNode(NodeId nNodeId, NetconfNode nNode);

    /**
     * Creation indication of node/mountpoint
     * @param nNodeId id of the mountpoint
     * @param nNode mountpoint contents
     */
    public void mountpointNodeCreation(NodeId nNodeId, NetconfNode nNode);

    /**
     * Removal indication of node/mountpoint
     * @param nNodeId id of the mountpoint
     */
    public void mountpointNodeRemoved(NodeId nNodeId);

}
