/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.tools;

import com.google.common.base.Optional;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
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

/**
 * Created by odl on 17-6-3.
 */
public class MountPointServiceHolder
{
    private static MountPointService mountPointService;

    public static void setMountPointService(MountPointService mountPointService)
    {
        MountPointServiceHolder.mountPointService = mountPointService;
    }

    private static final Logger LOG = LoggerFactory.getLogger(MountPointServiceHolder.class);

    public static MountPoint getMountPoint(String nodeName)
    {
        try
        {
            Optional<MountPoint> opMountP = mountPointService.getMountPoint(
                    InstanceIdentifier.create(NetworkTopology.class).child(Topology.class, new TopologyKey(
                            new TopologyId(TopologyNetconf.QNAME.getLocalName()))).child(Node.class, new NodeKey(
                            new NodeId(nodeName))));
            return opMountP.get();
        } catch (Exception e)
        {
            LOG.warn("mount " + nodeName + "failed!");
            return null;
        }
    }
}
