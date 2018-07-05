package org.opendaylight.mwtn.genericpathmanager.topology.commons;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.transfer.cost.pac.g.CostCharacteristic;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.transfer.cost.pac.g.CostCharacteristicBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * {@link JsonToCapacityParameters} class to which takes JsonObject as input and translates it into TAPI Cost Parameters object.
 *  uses cost-characteristic-g;
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 05.06.2018
 */
public class JsonToCostCharacteristic {
	/**
	 * Cost Characteristic parameters
	 * @param ccArray
	 * @return {@link List<CostCharacteristic>}
	 */
	public List<CostCharacteristic> getCostCharacteristic (JsonArray ccArray) {
		List<CostCharacteristic> _cc = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = ccArray.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			CostCharacteristicBuilder _builder = new CostCharacteristicBuilder();
			_builder.setCostName(_object.get("cost-name").getAsString());
			_builder.setCostValue(_object.get("cost-value").getAsString());
			_builder.setCostAlgorithm(_object.get("cost-algorithm").getAsString());
			_cc.add(_builder.build());
		}
		return _cc;
	}
}
