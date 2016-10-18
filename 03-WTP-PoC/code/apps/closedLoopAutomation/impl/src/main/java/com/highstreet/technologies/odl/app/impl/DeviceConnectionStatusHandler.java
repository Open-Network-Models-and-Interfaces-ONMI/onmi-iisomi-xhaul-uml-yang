/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nonnull;
import org.opendaylight.controller.md.sal.binding.api.DataObjectModification;
import org.opendaylight.controller.md.sal.binding.api.DataTreeChangeListener;
import org.opendaylight.controller.md.sal.binding.api.DataTreeModification;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNodeConnectionStatus;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by lbeles on 17.10.2016.
 * Listerner which listens when in the netconf topology are something changed. We notice only the connection status of the device.
 * If device changes the connection status then we log it
 */
public class DeviceConnectionStatusHandler implements DataTreeChangeListener<Topology> {
    private static final Logger LOG = LoggerFactory.getLogger(DeviceConnectionStatusHandler.class);

    @Override
    public void onDataTreeChanged(@Nonnull Collection<DataTreeModification<Topology>> changes) {
        for (DataTreeModification<Topology> change : changes) {
            DataObjectModification<Topology> rootNode = change.getRootNode();
            Map<NodeKey, NetconfNodeConnectionStatus.ConnectionStatus> mapChanges = new HashMap<>();

            // loop all data before change
            if (rootNode.getDataBefore() != null && rootNode.getDataBefore().getNode() != null) {
                for (Node node : rootNode.getDataBefore().getNode()) {
                    NetconfNode  nnode = node.getAugmentation(NetconfNode.class);
                    if (nnode != null) {
                        //LOG.info("Before: device {} status {}",node.getKey(),nnode.getConnectionStatus());
                        mapChanges.put(node.getKey(),nnode.getConnectionStatus());

                    }
                }
            }
            // loop the new data after change
            if (rootNode.getDataAfter() != null && rootNode.getDataAfter().getNode() != null) {
                for (Node node : rootNode.getDataAfter().getNode()) {
                    NetconfNode  nnode = node.getAugmentation(NetconfNode.class);
                    if (nnode != null) {
                        //LOG.info("After: device {} status {}",node.getKey(),nnode.getConnectionStatus());
                        NetconfNodeConnectionStatus.ConnectionStatus oldConnection = mapChanges.get(node.getKey());
                        if (oldConnection != nnode.getConnectionStatus()) { // if the connection status is changed, then we log this information
                            LOG.info("Device {} has been changed. Previously connection status was {} and currently is {}",node.getKey(),oldConnection,nnode.getConnectionStatus());
                        }
                    }
                }
            }
        }
    }

}
