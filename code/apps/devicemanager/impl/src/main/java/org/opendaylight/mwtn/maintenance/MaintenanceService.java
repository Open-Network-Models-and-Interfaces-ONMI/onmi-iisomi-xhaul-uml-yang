package org.opendaylight.mwtn.maintenance;

public interface MaintenanceService {

	/**
	 * Verify maintenance state of given object according to the filter settings.
	 * The object is specified by the criteria provided in the parameters.
	 * The data _id (uuid) is equal to the mountpointReference.
	 * @param mountpointReference used as reference, to query the data from database.
	 * @param objectIdRef first level id in onf core model, delivered by notification objectid
	 * @param problem problem name of device, delivered in problem notification
	 * @return boolean indication
	 */
	boolean isONFObjectInMaintenance(String mountpointReference, String objectIdRef, String problem);

}