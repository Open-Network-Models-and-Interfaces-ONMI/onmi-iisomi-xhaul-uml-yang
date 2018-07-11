package org.opendaylight.mwtn.genericpathmanager;

import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LayerProtocolName;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.context.g.Topology;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Link;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Node;

import com.google.gson.JsonArray;

public interface JsonToTopology {

	public void addNode(JsonArray nodeArray) throws Exception;

	public void addLink(JsonArray nodeArray) throws Exception;

	public List<LayerProtocolName> getTopologyLayerProtocolNames();

	public List<Link> getTopologyLinks();

	public List<Node> getTopologyNodes();

	public Topology getTopology();
}
