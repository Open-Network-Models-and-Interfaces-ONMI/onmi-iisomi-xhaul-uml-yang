package org.opendaylight.mwtn.genericpathmanager.topology.commons;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.LayerProtocolName;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

/**
 * {@link JsonToLayerProtocolName} class to which takes JsonObject as input and translates it into TAPI LayerProtocolName object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
public class JsonToLayerProtocolName {

	/**
	 * Translate the Json LayerProtocolName to Java LayerProtocolName Object
	 * 
	 * @param layerProtocolNameArray
	 * @return {@link List<LayerProtocolName>}
	 */
	public List<LayerProtocolName> getLayerProtocolNameFromJson(JsonArray layerProtocolNameArray) {
		List<LayerProtocolName> _layerProtocolName = new ArrayList<>();
		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = layerProtocolNameArray.iterator(); iter.hasNext(); ) {
			String lpnObject = iter.next().getAsString();
			_layerProtocolName.add(LayerProtocolName.valueOf(lpnObject));
		}
		return _layerProtocolName;
	}
}
