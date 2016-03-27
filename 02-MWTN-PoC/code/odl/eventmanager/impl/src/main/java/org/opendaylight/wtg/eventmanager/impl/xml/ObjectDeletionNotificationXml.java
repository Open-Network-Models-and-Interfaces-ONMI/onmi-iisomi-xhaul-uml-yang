package org.opendaylight.wtg.eventmanager.impl.xml;

import javax.xml.bind.annotation.XmlRootElement;

import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification;

@XmlRootElement(name = "ObjectDeletionNotification")
public class ObjectDeletionNotificationXml extends MwtNotificationBase {

	public ObjectDeletionNotificationXml() {

	}

	public ObjectDeletionNotificationXml(String nodeName, ObjectDeletionNotification notification) {
		super(nodeName, notification.getCounter().toString(), notification.getTimeStamp().getValue(),
				notification.getObjectId().getValue());
	}

}
