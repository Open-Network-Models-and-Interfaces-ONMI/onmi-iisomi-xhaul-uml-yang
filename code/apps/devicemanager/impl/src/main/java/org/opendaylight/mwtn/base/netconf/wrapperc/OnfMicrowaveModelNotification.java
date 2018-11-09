package org.opendaylight.mwtn.base.netconf.wrapperc;

import org.opendaylight.mwtn.devicemanager.impl.xml.AttributeValueChangedNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;

/**
 * Abstraction of YANG specified notifications
 * Each method converts from internal specific class to model unspecific class
 * @author herbert
 *
 */
public interface OnfMicrowaveModelNotification {

	void onObjectCreationNotification(ObjectCreationNotificationXml notificationXml);
    void onObjectDeletionNotification(ObjectDeletionNotificationXml notificationXml);
    void onProblemNotification(ProblemNotificationXml notificationXml);
    void onAttributeValueChangedNotification(AttributeValueChangedNotificationXml notificationXml);

}
