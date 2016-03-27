package org.opendaylight.wtg.eventmanager.impl.xml;

import javax.xml.bind.annotation.XmlRootElement;

import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectCreationNotification;

@XmlRootElement(name = "ObjectCreationNotification")
public class ObjectCreationNotificationXml extends MwtNotificationBase {

	public ObjectCreationNotificationXml() {

	}

	public ObjectCreationNotificationXml(String nodeName, ObjectCreationNotification notification) {
		super(nodeName, notification.getCounter().toString(), notification.getTimeStamp().getValue(),
				notification.getObjectId().getValue());
	}

}
