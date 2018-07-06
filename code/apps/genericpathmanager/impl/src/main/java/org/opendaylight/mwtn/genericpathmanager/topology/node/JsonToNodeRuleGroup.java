package org.opendaylight.mwtn.genericpathmanager.topology.node;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.opendaylight.mwtn.genericpathmanager.topology.constants.Constants.*;

import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToCapacityParameters;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToCostCharacteristic;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToLatencyCharacteristic;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToName;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.ReadFromJSON;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.inter.rule.group.g.AssociatedNodeRuleGroup;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.inter.rule.group.g.AssociatedNodeRuleGroupBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroup;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroupBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroupKey;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.ComposedRuleGroup;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.ComposedRuleGroupBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.InterRuleGroup;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.InterRuleGroupBuilder;
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
			Uuid _uuid = Uuid.getDefaultInstance(object.get(UUID).getAsString());
			_builder.setUuid(_uuid);
			_builder.setKey(new NodeRuleGroupKey(_uuid));
			_builder.setName((new JsonToName()).getGlobalNameFromJson(object.getAsJsonArray(NAME)));

			// total potential capacity
			// available capacity
			JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
			//total-potential-capacity
			_builder.setTotalPotentialCapacity(_tpc.getTotalPotentialCapacityFromJson(object.getAsJsonObject(TOTAL_POTENTIAL_CAPACITY)));
			//available-capacity
			_builder.setAvailableCapacity(_tpc.getAvailableCapacityFromJson(object.getAsJsonObject(AVAILABLE_CAPACITY)));
			//cost-characteristic
			_builder.setCostCharacteristic((new JsonToCostCharacteristic()).getCostCharacteristic(object.getAsJsonArray(COST_CHARACTERISTIC)));
			//latency-characteristic
			_builder.setLatencyCharacteristic((new JsonToLatencyCharacteristic()).getLatencyCharacteristic(object.getAsJsonArray(LATENCY_CHARACTERISTIC)));

			ReadFromJSON read = new ReadFromJSON();
			//risk-characteristic
			_builder.setRiskCharacteristic(read.getRiskCharacteristic(object.getAsJsonArray(RISK_CHARACTERISTIC)));
			//rule
			_builder.setRule(read.getRule(object.getAsJsonArray(RULE)));
			//node-edge-point
			_builder.setNodeEdgePoint(getNodeEdgePoint(object.getAsJsonArray(NODE_EDGE_POINT)));
			//composed-rule-group
			_builder.setComposedRuleGroup(getComposedRuleGroup(object.getAsJsonArray(COMPOSED_RULE_GROUP)));
			//inter-rule-group
			_builder.setInterRuleGroup(getInterRuleGroup(object.getAsJsonArray(INTER_RULE_GROUP)));
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
			Uuid uuid = Uuid.getDefaultInstance(object.get(TOPOLOGY_ID).getAsString());
			builder.setTopologyId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(NODE_ID).getAsString());
			builder.setNodeId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(OWNED_NODE_EDGE_POINT_ID).getAsString());
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
			Uuid uuid = Uuid.getDefaultInstance(object.get(TOPOLOGY_ID).getAsString());
			builder.setTopologyId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(NODE_ID).getAsString());
			builder.setNodeId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(NODE_RULE_GROUP_ID).getAsString());
			builder.setNodeRuleGroupId(uuid);
			composedRuleGroup.add(builder.build());
		}
		return composedRuleGroup;
	}

	private List<InterRuleGroup> getInterRuleGroup(JsonArray array) {
		List<InterRuleGroup> interRuleGroup = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			InterRuleGroupBuilder builder = new InterRuleGroupBuilder();
			Uuid uuid = Uuid.getDefaultInstance(object.get(UUID).getAsString());
			builder.setUuid(uuid);
			builder.setName((new JsonToName()).getGlobalNameFromJson(object.getAsJsonArray(NAME)));
			// total potential capacity
			// available capacity
			JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
			builder.setTotalPotentialCapacity(_tpc.getTotalPotentialCapacityFromJson(object.getAsJsonObject(TOTAL_POTENTIAL_CAPACITY)));
			builder.setAvailableCapacity(_tpc.getAvailableCapacityFromJson(object.getAsJsonObject(AVAILABLE_CAPACITY)));
			builder.setCostCharacteristic((new JsonToCostCharacteristic()).getCostCharacteristic(object.getAsJsonArray(COST_CHARACTERISTIC)));
			builder.setLatencyCharacteristic((new JsonToLatencyCharacteristic()).getLatencyCharacteristic(object.getAsJsonArray(LATENCY_CHARACTERISTIC)));

			ReadFromJSON read = new ReadFromJSON();
			//risk-characteristic
			builder.setRiskCharacteristic(read.getRiskCharacteristic(object.getAsJsonArray(RISK_CHARACTERISTIC)));
			//rule
			builder.setRule(read.getInterRuleGroupRule(object.getAsJsonArray(RULE)));
			//associated-node-rule-group
			builder.setAssociatedNodeRuleGroup(getAssociatedNodeRuleGroup(object.getAsJsonArray(ASSOCIATED_NODE_RULE_GROUP)));

			interRuleGroup.add(builder.build());
		}
		return interRuleGroup;
	}

	private List<AssociatedNodeRuleGroup> getAssociatedNodeRuleGroup (JsonArray array) {
		List<AssociatedNodeRuleGroup> associatedNodeRuleGroup = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			AssociatedNodeRuleGroupBuilder builder = new AssociatedNodeRuleGroupBuilder();
			Uuid uuid = Uuid.getDefaultInstance(object.get(TOPOLOGY_ID).getAsString());
			builder.setTopologyId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(NODE_ID).getAsString());
			builder.setNodeId(uuid);
			uuid = Uuid.getDefaultInstance(object.get(NODE_RULE_GROUP_ID).getAsString());
			builder.setNodeRuleGroupId(uuid);
			associatedNodeRuleGroup.add(builder.build());
		}
		return associatedNodeRuleGroup;
	}
}
