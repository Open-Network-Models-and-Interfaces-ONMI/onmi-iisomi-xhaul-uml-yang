/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

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
