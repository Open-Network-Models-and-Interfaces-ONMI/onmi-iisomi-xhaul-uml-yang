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
	public Node getNodeFromJson(JsonObject nodeObject) {
		NodeBuilder _nodeBuilder = new NodeBuilder();
		Uuid _uuid = Uuid.getDefaultInstance(nodeObject.get("uuid").getAsString());
		_nodeBuilder.setUuid(_uuid);
		_nodeBuilder.setKey(new NodeKey(_uuid));

		_nodeBuilder.setAdministrativeState(AdministrativeState.valueOf(nodeObject.get("administrative-state").getAsString()));
		_nodeBuilder.setOperationalState(OperationalState.valueOf(nodeObject.get("operational-state").getAsString()));
		_nodeBuilder.setLifecycleState(LifecycleState.valueOf(nodeObject.get("lifecycle-state").getAsString()));
		_nodeBuilder.setErrorCharacteristic(nodeObject.get("error-characteristic").getAsString());
		_nodeBuilder.setLossCharacteristic(nodeObject.get("loss-characteristic").getAsString());
		_nodeBuilder.setRepeatDeliveryCharacteristic(nodeObject.get("repeat-delivery-characteristic").getAsString());
		_nodeBuilder.setDeliveryOrderCharacteristic(nodeObject.get("delivery-order-characteristic").getAsString());
		_nodeBuilder.setUnavailableTimeCharacteristic(nodeObject.get("unavailable-time-characteristic").getAsString());
		_nodeBuilder.setServerIntegrityProcessCharacteristic(nodeObject.get("server-integrity-process-characteristic").getAsString());

		// Node Name
		JsonToName _name = new JsonToName();
		_nodeBuilder.setName(_name.setNameFromJson(nodeObject.getAsJsonArray("name")));

		
		System.out.println("lifecycle-state: " + nodeObject.get("server-integrity-process-characteristic").getAsString());
		return _nodeBuilder.build();
	}
}
