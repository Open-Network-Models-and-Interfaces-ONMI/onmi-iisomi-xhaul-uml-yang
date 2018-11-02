package org.opendaylight.mwtn.base.netconf;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.mwtn.base.internalTypes.InventoryInformation;
import org.opendaylight.mwtn.base.netconf.container.Capabilities;
import org.opendaylight.mwtn.base.netconf.container.ValueNameList;
import org.opendaylight.mwtn.base.netconf.util.GenericTransactionUtils;
import org.opendaylight.mwtn.base.netconf.wrapperc.OnfInterfacePac;
import org.opendaylight.mwtn.base.netconf.wrapperc.WrapperEquipmentPacRev170402;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.Equipment;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.EquipmentKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.equipment.g.ContainedHolder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.manufactured.thing.g.EquipmentType;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.manufactured.thing.g.ManufacturerProperties;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Contains equipment related information of ONFCore Network Element
 */
public class ONFCoreNetworkElement12Equipment {

    private static final Logger LOG = LoggerFactory.getLogger(ONFCoreNetworkElement12Equipment.class);

    private final ONFCOreNetworkElementCoreData coreData;
    private final OnfInterfacePac equipmentPac;

	private final ValueNameList extensions;
	private final List<UniversalId> topLevelEqUuidList;
	private final List<ProblemNotificationXml> problemList;
	private final List<Equipment> equipmentList;

    public ONFCoreNetworkElement12Equipment(ONFCOreNetworkElementCoreData coreData, Capabilities capabilities) {
    	LOG.debug("Initialize "+ONFCoreNetworkElement12Equipment.class.getName());
    	this.coreData = coreData;
        if (capabilities.isSupportingNamespaceAndRevision(WrapperEquipmentPacRev170402.QNAME)) {
        	this.equipmentPac = new WrapperEquipmentPacRev170402(coreData);
        	LOG.debug("Equipement pac supported {}", WrapperEquipmentPacRev170402.QNAME);
        } else {
        	this.equipmentPac = null;
        	LOG.debug("Equipement pac not supported {}", WrapperEquipmentPacRev170402.QNAME);
        }

        extensions = new ValueNameList();
		topLevelEqUuidList = new ArrayList<>();
		problemList = new ArrayList<>();
		equipmentList = new ArrayList<>();

        initClassVars();
    }

	public void addProblemsofNode(List<ProblemNotificationXml> resultList) {
		resultList.addAll(problemList);
	}

    public @Nonnull InventoryInformation getInventoryInformation(List<String> uuids) {
    	return getInventoryInformation(this.extensions, uuids);
    }

    protected void readNetworkElementEquipment() {
    	doSyncNetworkElementEquipmentToClassVars();
    }


    /* ---------------------------------------------------------------------------------
     * private functions
     */

    private void initClassVars() {
     	this.problemList.clear();
    	this.equipmentList.clear();
    	this.extensions.clear();
    	this.topLevelEqUuidList.clear();
    }

    private void doSyncNetworkElementEquipmentToClassVars() {

    	NetworkElement optionalNe = coreData.getOptionalNetworkElement();
    	initClassVars();

        if ( optionalNe != null) {
            // extract Inventory
        	extensions.put(optionalNe.getExtension());

            if (! extensions.isEmpty()) {

            	/* Loop through network element extension to get
            	 *   "top-level-equipment"
            	 * 			<extension>
            	 *        		<value-name>top-level-equipment</value-name>
            	 *        		<value>1.0.BKP,1.0.WCS</value>
                 * 			</extension>
                 *   "ipv4" address
                */
                extensions.getAsUniversalIdList("top-level-equipment", topLevelEqUuidList);

                // If top-level-equipment exists get further information
                if (topLevelEqUuidList.isEmpty()) {
                    LOG.debug("no top level equipment found");
                } else {
                	//Read equipment and problems
                	for (UniversalId uuid : topLevelEqUuidList ) {
                		recurseReadEquipmentProblems(uuid, problemList, equipmentList);
                	}
                }
            } else {
                LOG.debug("extension list is null");
            }
        }
    }

    private void recurseReadEquipmentProblems(UniversalId uuid, List<ProblemNotificationXml> problemList, List<Equipment> equipmentList) {
    	Equipment equipment = this.readEquipment(uuid);
    	if (equipment != null) {
    		equipmentList.add(equipment);

    		if (this.equipmentPac != null) {
    			this.equipmentPac.readTheFaults(uuid, problemList);

    			List<ContainedHolder> containedHolderListe = equipment.getContainedHolder();
    			if (containedHolderListe != null ) {
    				for (ContainedHolder containedHolder : containedHolderListe) {
    					recurseReadEquipmentProblems(containedHolder.getKey().getUuid(), problemList, equipmentList);
    				}
    			}
    		}
    	}
    }


    private @Nonnull InventoryInformation getInventoryInformation(ValueNameList extensions, List<String> uuids) {

    	InventoryInformation inventoryInformation = new InventoryInformation();

    	// uuids
    	inventoryInformation.setInterfaceUuidList(uuids);

    	if (!extensions.isEmpty()) {

    		inventoryInformation.setDeviceIpv4(extensions.getOrNull("neIpAddress"));

    		// If top-level-equipment exists get further information
    		if (topLevelEqUuidList.isEmpty()) {
    			LOG.debug("no top level equipment found");
    		} else {
    			//
    			if (!equipmentList.isEmpty()) {
    				Equipment e = equipmentList.get(0);
    				if (e.getManufacturedThing() != null) {
    					EquipmentType et;
    					if ((et = e.getManufacturedThing().getEquipmentType()) != null) {
    						inventoryInformation.setType(et.getTypeName());
    						inventoryInformation.setModel(et.getModelIdentifier());
    					}
    					ManufacturerProperties em;
    					if ((em = e.getManufacturedThing().getManufacturerProperties()) != null) {
    						inventoryInformation.setVendor(em.getManufacturerIdentifier());
    					}
    				}
    			}
        	}
  		} else {
   			LOG.debug("extension list is null");
  		}

    	LOG.debug("Inventory: {}", inventoryInformation);
    	return inventoryInformation;

    }


    /**
     * Read equipment information
     * @param interfacePacUuid uuid as key for Equipment.
     * @return Equipment or null
     */
    private @Nullable Equipment readEquipment(UniversalId interfacePacUuid) {

        final Class<?> clazzPac = Equipment.class;

        LOG.info("DBRead Get problems for class {} from mountpoint {} for uuid {}", clazzPac.getSimpleName(),
        		coreData.getMountpoint(), interfacePacUuid.getValue());

        InstanceIdentifier<Equipment> equipmentIID = InstanceIdentifier
                .builder(Equipment.class, new EquipmentKey(interfacePacUuid)).build();

        Equipment res = GenericTransactionUtils.readData(coreData.getDataBroker(), LogicalDatastoreType.OPERATIONAL,
                equipmentIID);

        return res;
    }

}
