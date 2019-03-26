package org.opendaylight.mwtn.devicemanager.impl.database.types.equipment;

import java.util.ArrayList;
import java.util.List;

import org.opendaylight.mwtn.base.database.EsObject;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElement12Equipment;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;

public class EsToplevelEquipment extends EsObject {

    public static final String ESDATATYPENAME = "inventorytoplevel";

    String mountpoint;
	List<String> uuidList;

	public EsToplevelEquipment set(ONFCoreNetworkElement12Equipment coreEquipment) {

		mountpoint = coreEquipment.getMountpoint();
		this.setEsId(mountpoint);

		uuidList = new ArrayList<>();
		for (UniversalId uuid : coreEquipment.getTopLevelEqUuidList()) {
			uuidList.add(uuid.getValue());
		}

		return(this);
	}

}
