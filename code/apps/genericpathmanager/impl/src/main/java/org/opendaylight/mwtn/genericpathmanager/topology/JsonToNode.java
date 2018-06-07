package org.opendaylight.mwtn.genericpathmanager.topology;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
		NodeBuilder _nodeBuilder = new NodeBuilder();
		/**
		 * uses tapi-common:resource-spec-g;
		 */
		Uuid _uuid = Uuid.getDefaultInstance(nodeObject.get("uuid").getAsString());
		_nodeBuilder.setUuid(_uuid);
		_nodeBuilder.setKey(new NodeKey(_uuid));
		// Node Name
		_nodeBuilder.setName((new JsonToName()).setNameFromJson(nodeObject.getAsJsonArray("name")));

		/**
		 * uses tapi-common:admin-state-pac-g;
		 */
		_nodeBuilder.setAdministrativeState(AdministrativeState.valueOf(nodeObject.get("administrative-state").getAsString()));
		_nodeBuilder.setOperationalState(OperationalState.valueOf(nodeObject.get("operational-state").getAsString()));
		_nodeBuilder.setLifecycleState(LifecycleState.valueOf(nodeObject.get("lifecycle-state").getAsString()));

		/**
		 * uses tapi-common:capacity-pac-g;
		 */
		JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
		_nodeBuilder.setTotalPotentialCapacity(_tpc.setTotalPotentialCapacityFromJson(nodeObject.getAsJsonObject("total-potential-capacity")));
		_nodeBuilder.setAvailableCapacity(_tpc.setAvailableCapacityFromJson(nodeObject.getAsJsonObject("available-capacity")));

		/**
		 * uses transfer-cost-pac-g;
		 * 		uses cost-characteristic-g;
		 */
		_nodeBuilder.setCostCharacteristic((new JsonToCostCharacteristic()).setCostCharacteristic(nodeObject.getAsJsonArray("cost-characteristic")));
		
		/**
		 * uses transfer-integrity-pac-g;
		 */
		_nodeBuilder.setErrorCharacteristic(nodeObject.get("error-characteristic").getAsString());
		_nodeBuilder.setLossCharacteristic(nodeObject.get("loss-characteristic").getAsString());
		_nodeBuilder.setRepeatDeliveryCharacteristic(nodeObject.get("repeat-delivery-characteristic").getAsString());
		_nodeBuilder.setDeliveryOrderCharacteristic(nodeObject.get("delivery-order-characteristic").getAsString());
		_nodeBuilder.setUnavailableTimeCharacteristic(nodeObject.get("unavailable-time-characteristic").getAsString());
		_nodeBuilder.setServerIntegrityProcessCharacteristic(nodeObject.get("server-integrity-process-characteristic").getAsString());

		/**
		 * uses transfer-timing-pac-g;
		 * 		list latency-characteristic
		 * 			uses latency-characteristic-g;
		 */
		_nodeBuilder.setLatencyCharacteristic((new JsonToLatencyCharacteristic()).setLatencyCharacteristic(nodeObject.getAsJsonArray("latency-characteristic")));
		/**
		 * list owned-node-edge-point
		 */
		_nodeBuilder.setOwnedNodeEdgePoint(this.setOwnedNodeEdgePoint(nodeObject.getAsJsonArray("owned-node-edge-point")));
		/**
		 * list aggregated-node-edge-point
		 */
		_nodeBuilder.setAggregatedNodeEdgePoint(getAggregatedNodeEdgePointFromJson(nodeObject.getAsJsonArray("aggregated-node-edge-point")));
		/**
		 * list node-rule-group
		 */
		
		/**
		 * container encap-topology
		 */
		
		/**
		 * leaf-list layer-protocol-name
		 */
		_nodeBuilder.setLayerProtocolName((new JsonToLayerProtocolName()).setLayerProtocolNameFromJson(nodeObject.getAsJsonArray("layer-protocol-name")));
		return _nodeBuilder.build();
	}

	private List<OwnedNodeEdgePoint> setOwnedNodeEdgePoint(JsonArray array) {
		List<OwnedNodeEdgePoint> _onep	= new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			OwnedNodeEdgePointBuilder _onepBuilder = new OwnedNodeEdgePointBuilder();
			Uuid _uuid = Uuid.getDefaultInstance(_object.get("uuid").getAsString());
			_onepBuilder.setUuid(_uuid);
			_onepBuilder.setKey(new OwnedNodeEdgePointKey(_uuid));
			// Name
			_onepBuilder.setName((new JsonToName()).setNameFromJson(_object.getAsJsonArray("name")));

			// "administrative-state"
			_onepBuilder.setAdministrativeState(AdministrativeState.valueOf(_object.get("administrative-state").getAsString()));
			// "operational-state"
			_onepBuilder.setOperationalState(OperationalState.valueOf(_object.get("operational-state").getAsString()));
			// "lifecycle-state"
			_onepBuilder.setLifecycleState(LifecycleState.valueOf(_object.get("lifecycle-state").getAsString()));
			// "termination-direction"
			_onepBuilder.setTerminationDirection(TerminationDirection.valueOf(_object.get("termination-direction").getAsString()));
			// "termination-state"
			_onepBuilder.setTerminationState(TerminationState.valueOf(_object.get("termination-state").getAsString()));

			// total potential capacity
			// available capacity
			JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
			_onepBuilder.setTotalPotentialCapacity(_tpc.setTotalPotentialCapacityFromJson(_object.getAsJsonObject("total-potential-capacity")));
			_onepBuilder.setAvailableCapacity(_tpc.setAvailableCapacityFromJson(_object.getAsJsonObject("available-capacity")));

			// layer-protocol-name
			_onepBuilder.setLayerProtocolName(LayerProtocolName.valueOf(_object.get("layer-protocol-name").getAsString()));
			// aggregated-node-edge-point
			_onepBuilder.setAggregatedNodeEdgePoint((new JsonToAggregatedNodeEdgePoint()).setAggregatedNodeEdgePointFromJson(_object.getAsJsonArray("aggregated-node-edge-point")));
			// mapped-service-interface-point
			_onepBuilder.setMappedServiceInterfacePoint(this.getMappedServiceInterfacePoint(_object.getAsJsonArray("mapped-service-interface-point")));
			// link-port-direction
			_onepBuilder.setLinkPortDirection(PortDirection.valueOf(_object.get("link-port-direction").getAsString()));
			// link-port-role
			_onepBuilder.setLinkPortRole(PortRole.valueOf(_object.get("link-port-role").getAsString()));

			_onep.add(_onepBuilder.build());
		}
		return _onep;
	}
	
	private List<MappedServiceInterfacePoint> getMappedServiceInterfacePoint(JsonArray array) {
		List<MappedServiceInterfacePoint> _msip	= new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			MappedServiceInterfacePointBuilder _builder = new MappedServiceInterfacePointBuilder();
			// service-interface-point-id
			_builder.setServiceInterfacePointId(Uuid.getDefaultInstance(_object.get("service-interface-point-id").getAsString()));
			_msip.add(_builder.build());
		}
		return _msip;
	}

	private List<AggregatedNodeEdgePoint> getAggregatedNodeEdgePointFromJson(JsonArray array) {
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
