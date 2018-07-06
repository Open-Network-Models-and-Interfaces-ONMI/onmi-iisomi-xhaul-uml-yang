package org.opendaylight.mwtn.genericpathmanager.topology.link;

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
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.ForwardingDirection;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LifecycleState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.OperationalState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.ProtectionType;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.RestorationPolicy;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.link.g.NodeEdgePoint;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.link.g.NodeEdgePointBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.link.g.ResilienceType;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.link.g.ResilienceTypeBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Link;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.LinkBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.LinkKey;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.validation.pac.g.ValidationMechanism;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.validation.pac.g.ValidationMechanismBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * {@link JsonToLink} class to which takes JsonObject as input and translates it into TAPI Link object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
public class JsonToLink {

	ReadFromJSON read;

	/**
	 * method to translate link of json into link of tapi-topology java object
	 * @param linkObject
	 * @return {@link Link}
	 */
	public Link getLinkFromJson(JsonObject linkObject) {
		read = new ReadFromJSON();
		LinkBuilder builder = new LinkBuilder();
		Uuid _uuid = Uuid.getDefaultInstance(linkObject.get(UUID).getAsString());
		builder.setUuid(_uuid);
		builder.setKey(new LinkKey(_uuid));
		JsonToName _name = new JsonToName();
		builder.setName(_name.getGlobalNameFromJson(linkObject.getAsJsonArray(NAME)));
		builder.setAdministrativeState(AdministrativeState.valueOf(linkObject.get(ADMINISTRATIVE_STATE).getAsString()));
		builder.setOperationalState(OperationalState.valueOf(linkObject.get(OPERATIONAL_STATE).getAsString()));
		builder.setLifecycleState(LifecycleState.valueOf(linkObject.get(LIFECYCLE_STATE).getAsString()));
		/**
		 * uses tapi-common:capacity-pac-g;
		 */
		JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
		builder.setTotalPotentialCapacity(_tpc.getTotalPotentialCapacityFromJson(linkObject.getAsJsonObject(TOTAL_POTENTIAL_CAPACITY)));
		builder.setAvailableCapacity(_tpc.getAvailableCapacityFromJson(linkObject.getAsJsonObject(AVAILABLE_CAPACITY)));
		//cost-characteristic
		builder.setCostCharacteristic((new JsonToCostCharacteristic()).getCostCharacteristic(linkObject.getAsJsonArray(COST_CHARACTERISTIC)));
		
		builder.setErrorCharacteristic(linkObject.get("error-characteristic").getAsString());
		builder.setLossCharacteristic(linkObject.get("loss-characteristic").getAsString());
		builder.setRepeatDeliveryCharacteristic(linkObject.get("repeat-delivery-characteristic").getAsString());
		builder.setDeliveryOrderCharacteristic(linkObject.get("delivery-order-characteristic").getAsString());
		builder.setUnavailableTimeCharacteristic(linkObject.get("unavailable-time-characteristic").getAsString());
		builder.setServerIntegrityProcessCharacteristic(linkObject.get("server-integrity-process-characteristic").getAsString());

		builder.setLatencyCharacteristic((new JsonToLatencyCharacteristic()).getLatencyCharacteristic(linkObject.getAsJsonArray(LATENCY_CHARACTERISTIC)));

		builder.setRiskCharacteristic(read.getRiskCharacteristic(linkObject.getAsJsonArray(RISK_CHARACTERISTIC)));

		builder.setValidationMechanism(getValidationMechanism(linkObject.getAsJsonArray(VALIDATION_MECHANISM)));
		
		builder.setTransitionedLayerProtocolName(getTransitionedLayerProtocolName(linkObject.getAsJsonArray(TRANSITIONED_LAYER_PROTOCOL_NAME)));
		
		builder.setNodeEdgePoint(getNodeEdgePoint(linkObject.getAsJsonArray(NODE_EDGE_POINT)));
		
		builder.setLayerProtocolName((new JsonToLayerProtocolName()).getLayerProtocolNameFromJson(linkObject.getAsJsonArray(LAYER_PROTOCOL_NAME)));
		
		builder.setDirection(ForwardingDirection.valueOf(linkObject.get(DIRECTION).getAsString()));
		
		builder.setResilienceType(getResilienceType(linkObject.getAsJsonObject(RESILIENCE_TYPE)));
		
		return builder.build();
	}

	private List<ValidationMechanism> getValidationMechanism(JsonArray array) {
		List<ValidationMechanism> list = new ArrayList<>();
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject object = iter.next().getAsJsonObject();
			ValidationMechanismBuilder builder = new ValidationMechanismBuilder();
			builder.setValidationMechanism(object.get(VALIDATION_MECHANISM).getAsString());
			builder.setLayerProtocolAdjacencyValidated(object.get(LAYER_PROTOCOL_ADJACENCY_VALIDATED).getAsString());
			builder.setValidationRobustness(object.get(VALIDATION_ROBUSTNESS).getAsString());
			list.add(builder.build());
		}
		return list;
	}

	private List<String> getTransitionedLayerProtocolName(JsonArray array) {
		List<String> list = new ArrayList<>();
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			String object = iter.next().getAsString();
			list.add(object);
		}
		return list;
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

	private ResilienceType getResilienceType(JsonObject object) {
		ResilienceTypeBuilder builder = new ResilienceTypeBuilder();
		builder.setRestorationPolicy(RestorationPolicy.valueOf(object.get(RESTORATION_POLICY).getAsString()));
		builder.setProtectionType(ProtectionType.valueOf(object.get(PROTECTION_TYPE).getAsString()));
		return builder.build();
	}
}
