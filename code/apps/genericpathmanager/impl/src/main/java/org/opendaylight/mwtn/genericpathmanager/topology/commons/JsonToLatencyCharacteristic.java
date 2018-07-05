package org.opendaylight.mwtn.genericpathmanager.topology.commons;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.transfer.timing.pac.g.LatencyCharacteristic;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.transfer.timing.pac.g.LatencyCharacteristicBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * {@link JsonToLatencyCharacteristic} class to which takes JsonObject as input and translates it into TAPI Latency Parameters object.
 *  uses latency-characteristic-g
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 05.06.2018
 */
public class JsonToLatencyCharacteristic {
	/**
	 * Latency Characteristic parameters
	 * @param lcArray
	 * @return {@link List<LatencyCharacteristic>}
	 */
	public List<LatencyCharacteristic> getLatencyCharacteristic (JsonArray lcArray) {
		List<LatencyCharacteristic> _lc = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = lcArray.iterator(); iter.hasNext(); ) {
			JsonObject _object = iter.next().getAsJsonObject();
			LatencyCharacteristicBuilder _builder = new LatencyCharacteristicBuilder();
			_builder.setTrafficPropertyName(_object.get("traffic-property-name").getAsString());
			_builder.setFixedLatencyCharacteristic(_object.get("fixed-latency-characteristic").getAsString());
			_builder.setQueingLatencyCharacteristic(_object.get("queing-latency-characteristic").getAsString());
			_builder.setJitterCharacteristic(_object.get("jitter-characteristic").getAsString());
			_builder.setWanderCharacteristic(_object.get("wander-characteristic").getAsString());
			_lc.add(_builder.build());
		}
		return _lc;
	}
}
