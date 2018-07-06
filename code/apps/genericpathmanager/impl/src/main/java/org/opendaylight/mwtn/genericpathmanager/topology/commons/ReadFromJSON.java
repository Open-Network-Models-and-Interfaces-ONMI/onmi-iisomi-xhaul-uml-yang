package org.opendaylight.mwtn.genericpathmanager.topology.commons;

import static org.opendaylight.mwtn.genericpathmanager.topology.constants.Constants.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.ForwardingRule;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.RuleType;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.EncapTopology;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.g.EncapTopologyBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.Rule;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.node.rule.group.g.RuleBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.risk.parameter.pac.g.RiskCharacteristic;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.risk.parameter.pac.g.RiskCharacteristicBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class ReadFromJSON {

	//risk-characteristic
	public List<RiskCharacteristic> getRiskCharacteristic(JsonArray array) {
		List<RiskCharacteristic> _list	= new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			RiskCharacteristicBuilder _builder = new RiskCharacteristicBuilder();
			// service-interface-point-id
			_builder.setRiskCharacteristicName(_object.get(RISK_CHARACTERISTIC_NAME).getAsString());
			_builder.setRiskIdentifierList(getRiskIdentifierList(_object.get(RISK_IDENTIFIER_LIST).getAsJsonArray()));
			_list.add(_builder.build());
		}
		return _list;
	}

	//risk-identifier-list
	private List<String> getRiskIdentifierList(JsonArray array) {
		List<String> _list = new ArrayList<>();
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			_list.add(iter.next().getAsString());
		}
		return _list;
	}

	/**
	 * Get Rule
	 * 
	 * @param array
	 * @return
	 */
	public List<Rule> getRule(JsonArray array) {
		List<Rule> _list = new ArrayList<>();
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			RuleBuilder _builder = new RuleBuilder();
			_builder.setLocalId(_object.get(LOCAL_ID).getAsString());
			_builder.setForwardingRule(ForwardingRule.valueOf(_object.get(FORWARDING_RULE).getAsString()));
			_builder.setName((new JsonToName()).getLocalNameFromJson(_object.getAsJsonArray(NAME)));
			_builder.setOverridePriority(_object.get(OVERRIDE_PRIORITY).getAsBigInteger());
			_builder.setRuleType(RuleType.valueOf(_object.get(RULE_TYPE).getAsString()));
			_list.add(_builder.build());
		}
		return _list;
	}

	/**
	 * Get Rule
	 * 
	 * @param array
	 * @return
	 */
	public List<org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.inter.rule.group.g.Rule> getInterRuleGroupRule(JsonArray array) {
		List<org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.inter.rule.group.g.Rule> _list = new ArrayList<>();
		for(Iterator<JsonElement> iter = array.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.inter.rule.group.g.RuleBuilder _builder =
					new org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.inter.rule.group.g.RuleBuilder();
			_builder.setLocalId(_object.get(LOCAL_ID).getAsString());
			_builder.setForwardingRule(ForwardingRule.valueOf(_object.get(FORWARDING_RULE).getAsString()));
			_builder.setName((new JsonToName()).getLocalNameFromJson(_object.getAsJsonArray(NAME)));
			_builder.setOverridePriority(_object.get(OVERRIDE_PRIORITY).getAsBigInteger());
			_builder.setRuleType(RuleType.valueOf(_object.get(RULE_TYPE).getAsString()));
			_list.add(_builder.build());
		}
		return _list;
	}

	public EncapTopology getEncapTopology (JsonObject object) {
		EncapTopologyBuilder builder = new EncapTopologyBuilder();
		Uuid uuid = Uuid.getDefaultInstance(object.get(TOPOLOGY_ID).getAsString());
		builder.setTopologyId(uuid);
		return builder.build();
	}

}
