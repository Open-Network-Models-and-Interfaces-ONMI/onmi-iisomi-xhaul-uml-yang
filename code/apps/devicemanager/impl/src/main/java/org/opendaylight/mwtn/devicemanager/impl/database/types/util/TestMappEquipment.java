package org.opendaylight.mwtn.devicemanager.impl.database.types.util;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.List;

import org.opendaylight.mwtn.base.database.HtMapper;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElement12Equipment;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.AdministrativeState;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.Equipment;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.EquipmentCategory;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.equipment.g.CategoryBuilder;

public class TestMappEquipment<T> {



	public static void main(String[] args) {

		/*
		MyEquipmentBuilder eb = new MyEquipmentBuilder();
		eb.setAdministrativeState(AdministrativeState.Unlocked);
		eb.setCategory((new CategoryBuilder()).setCategory(EquipmentCategory.Rack).build());

		Equipment e2 = eb.build();

		String inspect = HtDatabaseEventsService.inspect(e2,0);
		System.out.println("Inspect: "+inspect);

		String json = HtDatabaseEventsService.toJson(e2);
		System.out.println("JSON: "+json);
		 */

	}


}
