package org.opendaylight.mwtn.genericpathmanager.topology;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.AdministrativeState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LifecycleState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.OperationalState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Node;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.NodeBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.NodeKey;

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
		JsonToName _name = new JsonToName();
		_nodeBuilder.setName(_name.setNameFromJson(nodeObject.getAsJsonArray("name")));

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
		_nodeBuilder.setAvailableCapacity(_tpc.setAvailableCapacityFromJson(nodeObject.getAsJsonObject("total-potential-capacity")));

		/**
		 * uses transfer-cost-pac-g;
		 * 		uses cost-characteristic-g;
		 */
		JsonToCostCharacteristic _cc = new JsonToCostCharacteristic();
		_nodeBuilder.setCostCharacteristic(_cc.setCostCharacteristic(nodeObject.getAsJsonArray("cost-characteristic")));
		
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
		JsonToLatencyCharacteristic _lc = new JsonToLatencyCharacteristic();
		_nodeBuilder.setLatencyCharacteristic(_lc.setLatencyCharacteristic(nodeObject.getAsJsonArray("latency-characteristic")));
		
		/**
		 * list owned-node-edge-point
		 */
		/**
		 * list aggregated-node-edge-point
		 */
		/**
		 * list node-rule-group
		 */
		/**
		 * container encap-topology
		 */
		/**
		 * leaf-list layer-protocol-name
		 */
		return _nodeBuilder.build();
	}

	
}
