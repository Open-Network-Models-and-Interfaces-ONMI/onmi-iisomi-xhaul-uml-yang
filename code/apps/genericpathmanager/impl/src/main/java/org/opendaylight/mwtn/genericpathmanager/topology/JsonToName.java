package org.opendaylight.mwtn.genericpathmanager.topology;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.global._class.g.Name;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.global._class.g.NameBuilder;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class JsonToName {
	public List<Name> setNameFromJson(JsonArray nameArray) {
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
}