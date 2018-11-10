package org.opendaylight.mwtn.base.netconf;

import org.opendaylight.mwtn.devicemanager.impl.xml.AttributeValueChangedNotificationXml;

public interface ONFCoreNetworkElementCallback {

	public void notificationFromNeListener(AttributeValueChangedNotificationXml notificationXml);

}
