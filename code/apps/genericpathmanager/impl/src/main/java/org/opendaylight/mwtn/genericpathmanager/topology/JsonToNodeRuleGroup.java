package org.opendaylight.mwtn.genericpathmanager.topology;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroup;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroupBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.NodeRuleGroupKey;

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
			Uuid _uuid = Uuid.getDefaultInstance(object.get("uuid").getAsString());
			_builder.setUuid(_uuid);
			_builder.setKey(new NodeRuleGroupKey(_uuid));
			_builder.setName((new JsonToName()).getNameFromJson(object.getAsJsonArray("name")));
			
			// total potential capacity
			// available capacity
			JsonToCapacityParameters _tpc = new JsonToCapacityParameters();
			_builder.setTotalPotentialCapacity(_tpc.getTotalPotentialCapacityFromJson(object.getAsJsonObject("total-potential-capacity")));
			_builder.setAvailableCapacity(_tpc.getAvailableCapacityFromJson(object.getAsJsonObject("available-capacity")));

			System.out.println("_builder.getTotalPotentialCappacity()" + _builder.getTotalPotentialCapacity());
//			_nameBuilder.setValueName(nameObject.get("value-name").getAsString());
//			_nameBuilder.setValue(nameObject.get("value").getAsString());
			nodeRuleGroup.add(_builder.build());
		}
		return nodeRuleGroup;
	}

}
