package org.opendaylight.wtg.eventmanager.impl.xml;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification;

@XmlRootElement(name = "AttributeValueChangedNotification")
public class AttributeValueChangedNotificationXml extends MwtNotificationBase {

	@XmlElement(name="attributeName")
	private String attributeName;
	
	@XmlElement(name="newValue")
	private String newValue;

	public AttributeValueChangedNotificationXml() {

	}

	public AttributeValueChangedNotificationXml(String nodeName, AttributeValueChangedNotification notification) {
		super(nodeName, notification.getCounter().toString(), notification.getTimeStamp().getValue(),
				notification.getObjectId().getValue());
		this.attributeName = notification.getAttributeName();
		this.newValue = notification.getNewValue();
	}

	public String getAttributeName() {
		return attributeName;
	}

	public String getNewValue() {
		return newValue;
	}

}
