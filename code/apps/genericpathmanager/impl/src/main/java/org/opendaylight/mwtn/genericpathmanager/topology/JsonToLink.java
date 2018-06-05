package org.opendaylight.mwtn.genericpathmanager.topology;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.AdministrativeState;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.Uuid;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.Link;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.LinkBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.topology.rev180307.topology.g.LinkKey;

import com.google.gson.JsonObject;

/**
 * {@link JsonToLink} class to which takes JsonObject as input and translates it into TAPI Link object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
public class JsonToLink {
	public Link getLinkFromJson(JsonObject linkObject) {
		LinkBuilder _linkBuilder = new LinkBuilder();
		Uuid _uuid = Uuid.getDefaultInstance(linkObject.get("uuid").getAsString());
		_linkBuilder.setUuid(_uuid);
		_linkBuilder.setKey(new LinkKey(_uuid));
		JsonToName _name = new JsonToName();
		_linkBuilder.setName(_name.setNameFromJson(linkObject.getAsJsonArray("name")));
		System.out.println("administrative-state: " + linkObject.get("administrative-state"));
		_linkBuilder.setAdministrativeState(AdministrativeState.valueOf(linkObject.get("administrative-state").getAsString()));
		return _linkBuilder.build();
	}

}
