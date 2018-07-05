package org.opendaylight.mwtn.genericpathmanager.topology.node;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.edge.point.g.AggregatedNodeEdgePoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.edge.point.g.AggregatedNodeEdgePointBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * {@link JsonToAggregatedNodeEdgePoint} class which takes JsonObject as input and translates it into TAPI Aggregated Node Edge Points Group object.
 *  uses owned-node-edge-point-ref-g;
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 06.06.2018
 */
public class JsonToAggregatedNodeEdgePoint {
	/**
	 * 
	 * @param {@link JsonArray}array
	 * @return {@link List<AggregatedNodeEdgePoint>}
	 */
	public List<AggregatedNodeEdgePoint> getAggregatedNodeEdgePointFromJson(JsonArray array) {
		List<AggregatedNodeEdgePoint> _list = new ArrayList<>();
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			AggregatedNodeEdgePointBuilder _builder = new AggregatedNodeEdgePointBuilder();
			
			_builder.setNodeId(Uuid.getDefaultInstance(_object.get("node-id").getAsString()));
			_builder.setOwnedNodeEdgePointId(Uuid.getDefaultInstance(_object.get("owned-node-edge-point-id").getAsString()));
			_builder.setTopologyId(Uuid.getDefaultInstance(_object.get("topology-id").getAsString()));
			_list.add(_builder.build());
		}
		return _list;
	}
}
