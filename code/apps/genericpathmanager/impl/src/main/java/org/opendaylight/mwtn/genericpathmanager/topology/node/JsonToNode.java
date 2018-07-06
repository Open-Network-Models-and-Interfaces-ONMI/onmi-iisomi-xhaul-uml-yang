package org.opendaylight.mwtn.genericpathmanager.topology.node;

import static org.opendaylight.mwtn.genericpathmanager.topology.constants.Constants.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToCapacityParameters;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToCostCharacteristic;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToLatencyCharacteristic;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToLayerProtocolName;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToName;
import org.opendaylight.mwtn.genericpathmanager.topology.commons.ReadFromJSON;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.AdministrativeState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LayerProtocolName;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LifecycleState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.OperationalState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.PortDirection;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.PortRole;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.TerminationDirection;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.TerminationState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.edge.point.g.MappedServiceInterfacePoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.edge.point.g.MappedServiceInterfacePointBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.AggregatedNodeEdgePoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.AggregatedNodeEdgePointBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.OwnedNodeEdgePoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.OwnedNodeEdgePointBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.OwnedNodeEdgePointKey;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Node;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.NodeBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.NodeKey;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * {@link JsonToNode} class to which takes JsonObject as input and translates it into TAPI Node object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
public class JsonToNode {
	/**
	 *  grouping node-g {
     *      list owned-node-edge-point {
     *          key 'uuid';
     *          config false;
     *          uses node-edge-point-g;
     *          description "none";
     *      }
     *      list aggregated-node-edge-point {
     *      	uses owned-node-edge-point-ref-g;
     *          key 'topology-id node-id owned-node-edge-point-id';
     *          config false;
     *          description "none";
     *      }
     *      list node-rule-group {
     *          key 'uuid';
     *          uses node-rule-group-g;
     *          description "none";
     *      }
     *      container encap-topology {
     *          uses topology-ref-g;
     *          config false;
     *          description "none";
     *      }
     *      leaf-list layer-protocol-name {
     *          type tapi-common:layer-protocol-name;
     *          config false;
     *          min-elements 1;
     *          description "none";
     *      }
     *      uses tapi-common:resource-spec-g;
     *      uses tapi-common:admin-state-pac-g;
     *      uses tapi-common:capacity-pac-g;
     *      uses transfer-cost-pac-g;
     *      uses transfer-integrity-pac-g;
     *      uses transfer-timing-pac-g;
     *      description "The ForwardingDomain (FD) object class models the ForwardingDomain topological component which is used to effect forwarding of transport characteristic information and offers the potential to enable forwarding. 
     *          At the lowest level of recursion, an FD (within a network element (NE)) represents a switch matrix (i.e., a fabric). Note that an NE can encompass multiple switch matrices (FDs). ";
     *  }
	 */
	
	/**
	 * method to translate node of json into link of tapi-topology java object
	 * @param nodeObject
	 * @return {@link Node}
	 */
	public Node getNodeFromJson(JsonObject nodeObject) {
		NodeBuilder builder = new NodeBuilder();
		/**
		 * uses tapi-common:resource-spec-g;
		 */
		Uuid _uuid = Uuid.getDefaultInstance(nodeObject.get(UUID).getAsString());
		builder.setUuid(_uuid);
		builder.setKey(new NodeKey(_uuid));
		// Node Name
		builder.setName((new JsonToName()).getGlobalNameFromJson(nodeObject.getAsJsonArray(NAME)));

		/**
		 * uses tapi-common:admin-state-pac-g;
		 */
		builder.setAdministrativeState(AdministrativeState.valueOf(nodeObject.get(ADMINISTRATIVE_STATE).getAsString()));
		builder.setOperationalState(OperationalState.valueOf(nodeObject.get(OPERATIONAL_STATE).getAsString()));
		builder.setLifecycleState(LifecycleState.valueOf(nodeObject.get(LIFECYCLE_STATE).getAsString()));

		/**
		 * uses tapi-common:capacity-pac-g;
		 */
		JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
		builder.setTotalPotentialCapacity(_tpc.getTotalPotentialCapacityFromJson(nodeObject.getAsJsonObject(TOTAL_POTENTIAL_CAPACITY)));
		builder.setAvailableCapacity(_tpc.getAvailableCapacityFromJson(nodeObject.getAsJsonObject(AVAILABLE_CAPACITY)));

		/**
		 * uses transfer-cost-pac-g;
		 * 		uses cost-characteristic-g;
		 */
		builder.setCostCharacteristic((new JsonToCostCharacteristic()).getCostCharacteristic(nodeObject.getAsJsonArray(COST_CHARACTERISTIC)));
		
		/**
		 * uses transfer-integrity-pac-g;
		 */
		builder.setErrorCharacteristic(nodeObject.get("error-characteristic").getAsString());
		builder.setLossCharacteristic(nodeObject.get("loss-characteristic").getAsString());
		builder.setRepeatDeliveryCharacteristic(nodeObject.get("repeat-delivery-characteristic").getAsString());
		builder.setDeliveryOrderCharacteristic(nodeObject.get("delivery-order-characteristic").getAsString());
		builder.setUnavailableTimeCharacteristic(nodeObject.get("unavailable-time-characteristic").getAsString());
		builder.setServerIntegrityProcessCharacteristic(nodeObject.get("server-integrity-process-characteristic").getAsString());

		/**
		 * uses transfer-timing-pac-g;
		 * 		list latency-characteristic
		 * 			uses latency-characteristic-g;
		 */
		builder.setLatencyCharacteristic((new JsonToLatencyCharacteristic()).getLatencyCharacteristic(nodeObject.getAsJsonArray(LATENCY_CHARACTERISTIC)));
		/**
		 * list owned-node-edge-point
		 */
		builder.setOwnedNodeEdgePoint(getOwnedNodeEdgePoint(nodeObject.getAsJsonArray(OWNED_NODE_EDGE_POINT)));
		/**
		 * list aggregated-node-edge-point
		 */
		builder.setAggregatedNodeEdgePoint(getAggregatedNodeEdgePointFromJson(nodeObject.getAsJsonArray(AGGREGATED_NODE_EDGE_POINT)));
		/**
		 * list node-rule-group
		 */
		builder.setNodeRuleGroup((new JsonToNodeRuleGroup()).getNodeRuleGroupFromJson(nodeObject.getAsJsonArray(NODE_RULE_GROUP)));
		/**
		 * container encap-topology
		 */
		ReadFromJSON read = new ReadFromJSON();
		builder.setEncapTopology(read.getEncapTopology(nodeObject.getAsJsonObject(ENCAP_TOPOLOGY)));
		/**
		 * leaf-list layer-protocol-name
		 */
		builder.setLayerProtocolName((new JsonToLayerProtocolName()).getLayerProtocolNameFromJson(nodeObject.getAsJsonArray(LAYER_PROTOCOL_NAME)));
		return builder.build();
	}

	private List<OwnedNodeEdgePoint> getOwnedNodeEdgePoint(JsonArray array) {
		List<OwnedNodeEdgePoint> list	= new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			OwnedNodeEdgePointBuilder builder = new OwnedNodeEdgePointBuilder();
			Uuid _uuid = Uuid.getDefaultInstance(object.get(UUID).getAsString());
			builder.setUuid(_uuid);
			builder.setKey(new OwnedNodeEdgePointKey(_uuid));
			// Name
			builder.setName((new JsonToName()).getGlobalNameFromJson(object.getAsJsonArray(NAME)));

			// "administrative-state"
			builder.setAdministrativeState(AdministrativeState.valueOf(object.get(ADMINISTRATIVE_STATE).getAsString()));
			// "operational-state"
			builder.setOperationalState(OperationalState.valueOf(object.get("operational-state").getAsString()));
			// "lifecycle-state"
			builder.setLifecycleState(LifecycleState.valueOf(object.get("lifecycle-state").getAsString()));
			// "termination-direction"
			builder.setTerminationDirection(TerminationDirection.valueOf(object.get("termination-direction").getAsString()));
			// "termination-state"
			builder.setTerminationState(TerminationState.valueOf(object.get("termination-state").getAsString()));

			// total potential capacity
			// available capacity
			JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
			builder.setTotalPotentialCapacity(_tpc.getTotalPotentialCapacityFromJson(object.getAsJsonObject(TOTAL_POTENTIAL_CAPACITY)));
			builder.setAvailableCapacity(_tpc.getAvailableCapacityFromJson(object.getAsJsonObject(AVAILABLE_CAPACITY)));

			// layer-protocol-name
			builder.setLayerProtocolName(LayerProtocolName.valueOf(object.get(LAYER_PROTOCOL_NAME).getAsString()));
			// aggregated-node-edge-point
			builder.setAggregatedNodeEdgePoint((new JsonToAggregatedNodeEdgePoint()).getAggregatedNodeEdgePointFromJson(object.getAsJsonArray(AGGREGATED_NODE_EDGE_POINT)));
			// mapped-service-interface-point
			builder.setMappedServiceInterfacePoint(getMappedServiceInterfacePoint(object.getAsJsonArray("mapped-service-interface-point")));
			// link-port-direction
			builder.setLinkPortDirection(PortDirection.valueOf(object.get("link-port-direction").getAsString()));
			// link-port-role
			builder.setLinkPortRole(PortRole.valueOf(object.get("link-port-role").getAsString()));

			list.add(builder.build());
		}
		return list;
	}
	
	private List<MappedServiceInterfacePoint> getMappedServiceInterfacePoint(JsonArray array) {
		List<MappedServiceInterfacePoint> list	= new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			MappedServiceInterfacePointBuilder builder = new MappedServiceInterfacePointBuilder();
			// service-interface-point-id
			builder.setServiceInterfacePointId(Uuid.getDefaultInstance(_object.get(SERVICE_INTERFACE_POINT_ID).getAsString()));
			list.add(builder.build());
		}
		return list;
	}

	private List<AggregatedNodeEdgePoint> getAggregatedNodeEdgePointFromJson(JsonArray array) {
		List<AggregatedNodeEdgePoint> list = new ArrayList<>();
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			AggregatedNodeEdgePointBuilder builder = new AggregatedNodeEdgePointBuilder();
			
			builder.setNodeId(Uuid.getDefaultInstance(object.get(NODE_ID).getAsString()));
			builder.setOwnedNodeEdgePointId(Uuid.getDefaultInstance(object.get(OWNED_NODE_EDGE_POINT_ID).getAsString()));
			builder.setTopologyId(Uuid.getDefaultInstance(object.get(TOPOLOGY_ID).getAsString()));
			list.add(builder.build());
		}
		return list;
	}
}
