package org.opendaylight.mwtn.devicemanager.impl;

import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;

public interface ProviderClient extends AutoCloseable {

	/**
	 * Send out problem notification, that was created by a device/ or NE
	 * @param mountPointName related
	 * @param notification xml description
	 */
    public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification);

	/**
	 * Send out problem notification
	 * @param mountPointName related
	 * @param notification xml description
	 * @param neDeviceAlarm  true indicates an NE originated alarm, false an sdncontroller generated alarm
	 */
	public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification, boolean neDeviceAlarm);

}
