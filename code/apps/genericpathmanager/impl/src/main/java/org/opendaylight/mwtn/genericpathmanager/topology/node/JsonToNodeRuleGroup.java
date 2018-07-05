package org.opendaylight.mwtn.genericpathmanager.topology.node;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToCapacityParameters;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToCostCharacteristic;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToLatencyCharacteristic;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToName;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.ReadFromJSON;
import org.opendaylight.mwtn.genericpathmanager.topology.constants.Constants;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroup;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroupBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroupKey;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.ComposedRuleGroup;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.ComposedRuleGroupBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.NodeEdgePoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.NodeEdgePointBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * {@link JsonToNodeRuleGroup} class to which takes JsonObject as input and translates it into TAPI node-rule-group object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 12.06.2018
 */
public class JsonToNodeRuleGroup {
	private ReadFromJSON read;
	public JsonToNodeRuleGroup() {
		read = new ReadFromJSON();
	}
	/**
	 * Translate the Json NodeRuleGroup Object to Tapi-Common Java NodeRuleGroup Object
	 * 
	 * @param _array
	 * @return
	 */
	public List<NodeRuleGroup> getNodeRuleGroupFromJson(JsonArray _array) {
		List<NodeRuleGroup> nodeRuleGroup = new ArrayList<>();

		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = _array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			NodeRuleGroupBuilder _builder = new NodeRuleGroupBuilder();
			Uuid _uuid = Uuid.getDefaultInstance(object.get(Constants.UUID).getAsString());
			_builder.setUuid(_uuid);
			_builder.setKey(new NodeRuleGroupKey(_uuid));
			_builder.setName((new JsonToName()).getGlobalNameFromJson(object.getAsJsonArray(Constants.NAME)));

			// total potential capacity
			// available capacity
			JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
			//total-potential-capacity
			_builder.setTotalPotentialCapacity(_tpc.getTotalPotentialCapacityFromJson(object.getAsJsonObject("total-potential-capacity")));
			//available-capacity
			_builder.setAvailableCapacity(_tpc.getAvailableCapacityFromJson(object.getAsJsonObject("available-capacity")));
			//cost-characteristic
			_builder.setCostCharacteristic((new JsonToCostCharacteristic()).getCostCharacteristic(object.getAsJsonArray("cost-characteristic")));
			//latency-characteristic
			_builder.setLatencyCharacteristic((new JsonToLatencyCharacteristic()).getLatencyCharacteristic(object.getAsJsonArray(Constants.LATENCY_CHARACTERISTIC)));
			//risk-characteristic
			_builder.setRiskCharacteristic(read.getRiskCharacteristic(object.getAsJsonArray(Constants.RISK_CHARACTERISTIC)));
			//rule
			_builder.setRule(read.getRule(object.getAsJsonArray(Constants.RULE)));
			//node-edge-point
			_builder.setNodeEdgePoint(getNodeEdgePoint(object.getAsJsonArray(Constants.NODE_EDGE_POINT)));
			//composed-rule-group
			_builder.setComposedRuleGroup(getComposedRuleGroup(object.getAsJsonArray(Constants.COMPOSED_RULE_GROUP)));
			//inter-rule-group
//			_builder.setInterRuleGroup();
			nodeRuleGroup.add(_builder.build());
		}
		return nodeRuleGroup;
	}

	private List<NodeEdgePoint> getNodeEdgePoint(JsonArray array) {
		List<NodeEdgePoint> nodeEdgePoint = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			NodeEdgePointBuilder builder = new NodeEdgePointBuilder();
			Uuid uuid = Uuid.getDefaultInstance(object.get(Constants.TOPOLOGY_ID).getAsString());
			builder.setTopologyId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(Constants.NODE_ID).getAsString());
			builder.setNodeId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(Constants.OWNED_NODE_EDGE_POINT_ID).getAsString());
			builder.setOwnedNodeEdgePointId(uuid);
			nodeEdgePoint.add(builder.build());
		}
		return nodeEdgePoint;
	}

	private List<ComposedRuleGroup> getComposedRuleGroup(JsonArray array) {
		List<ComposedRuleGroup> composedRuleGroup = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			ComposedRuleGroupBuilder builder = new ComposedRuleGroupBuilder();
			Uuid uuid = Uuid.getDefaultInstance(object.get(Constants.TOPOLOGY_ID).getAsString());
			builder.setTopologyId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(Constants.NODE_ID).getAsString());
			builder.setNodeId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(Constants.NODE_RULE_GROUP_ID).getAsString());
			builder.setNodeRuleGroupId(uuid);
			composedRuleGroup.add(builder.build());
		}
		return composedRuleGroup;
	}
}
