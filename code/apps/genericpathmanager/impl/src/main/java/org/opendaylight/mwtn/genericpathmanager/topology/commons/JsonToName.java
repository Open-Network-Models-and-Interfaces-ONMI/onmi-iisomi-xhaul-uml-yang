package org.opendaylight.mwtn.genericpathmanager.topology.commons;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.global._class.g.Name;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.global._class.g.NameBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * {@link JsonToName} class to which takes JsonObject as input and translates it into TAPI Name object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
public class JsonToName {
	/**
	 * Translate the Json Name Object to Tapi-Common Java Name Object
	 * 
	 * @param nameArray
	 * @return {@link List<Name>}
	 */
	public List<Name> getGlobalNameFromJson(JsonArray nameArray) {
		List<Name> name = new ArrayList<>();

		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = nameArray.iterator(); iter.hasNext(); ) {
			JsonObject nameObject = iter.next().getAsJsonObject();
			NameBuilder _nameBuilder = new NameBuilder();
			_nameBuilder.setValueName(nameObject.get("value-name").getAsString());
			_nameBuilder.setValue(nameObject.get("value").getAsString());
			name.add(_nameBuilder.build());
		}
		return name;
	}

	public List<org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.local._class.g.Name> getLocalNameFromJson(JsonArray nameArray){
		List<org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.local._class.g.Name> name = new ArrayList<>();

		// Iterate over all the JsonArray elements
		for(Iterator<JsonElement> iter = nameArray.iterator(); iter.hasNext(); ) {
			JsonObject nameObject = iter.next().getAsJsonObject();
			org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.local._class.g.NameBuilder _nameBuilder = new org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.local._class.g.NameBuilder();
			_nameBuilder.setValueName(nameObject.get("value-name").getAsString());
			_nameBuilder.setValue(nameObject.get("value").getAsString());
			name.add(_nameBuilder.build());
		}
		return name;
	}
}