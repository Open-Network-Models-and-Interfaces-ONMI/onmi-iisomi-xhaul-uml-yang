package org.opendaylight.mwtn.devicemanager.impl.database.types.equipment;

import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.Equipment;

public class ExtendedEquipment {

	private final String parentUuid;
	private final int treeLevel;
	private final Equipment equipment;

	/**
	 * Equipment with additional information beside netconf equipment
	 * @param parentUuid
	 * @param equipment Netconf Equipment
	 * @param treeLevel
	 */
	public ExtendedEquipment(String parentUuid, Equipment equipment, int treeLevel) {
		super();
		this.parentUuid = parentUuid;
		this.equipment = equipment;
		this.treeLevel = treeLevel;
	}

	public String getParentUuid() {
		return parentUuid;
	}

	public Equipment getEquipment() {
		return equipment;
	}

	public int getTreeLevel() {
		return treeLevel;
	}



}
