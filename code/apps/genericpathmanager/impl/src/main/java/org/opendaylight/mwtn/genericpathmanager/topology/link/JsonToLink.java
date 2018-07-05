package org.opendaylight.mwtn.genericpathmanager.topology.link;

import org.opendaylight.mwtn.genericpathmanager.topology.commons.JsonToName;
import org.opendaylight.mwtn.genericpathmanager.topology.constants.Constants;
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

	/**
	 * method to translate link of json into link of tapi-topology java object
	 * @param linkObject
	 * @return {@link Link}
	 */
	public Link getLinkFromJson(JsonObject linkObject) {
		LinkBuilder _linkBuilder = new LinkBuilder();
		Uuid _uuid = Uuid.getDefaultInstance(linkObject.get(Constants.UUID).getAsString());
		_linkBuilder.setUuid(_uuid);
		_linkBuilder.setKey(new LinkKey(_uuid));
		JsonToName _name = new JsonToName();
		_linkBuilder.setName(_name.getGlobalNameFromJson(linkObject.getAsJsonArray(Constants.NAME)));
		_linkBuilder.setAdministrativeState(AdministrativeState.valueOf(linkObject.get("administrative-state").getAsString()));

		return _linkBuilder.build();
	}

}
