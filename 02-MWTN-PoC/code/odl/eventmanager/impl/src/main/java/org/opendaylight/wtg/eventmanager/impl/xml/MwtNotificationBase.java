/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.wtg.eventmanager.impl.xml;

import javax.xml.bind.annotation.XmlElement;

public class MwtNotificationBase {

	private String nodeName;
	private String counter;
	private String timeStamp;
	private String objectId;

	public MwtNotificationBase() {
		// For Jaxb
	}

	public MwtNotificationBase(String nodeName, String counter, String timeStamp, String objectId) {
		this.nodeName = nodeName;
		this.counter = counter;
		this.timeStamp = timeStamp;
		this.objectId = objectId;
	}

	@XmlElement(name = "nodeName")
	public String getNodeName() {
		return nodeName;
	}

	@XmlElement(name = "counter")
	public String getCounter() {
		return counter;
	}

	@XmlElement(name = "timeStamp")
	public String getTimeStamp() {
		return timeStamp;
	}

	@XmlElement(name = "objectId")
	public String getObjectId() {
		return objectId;
	}
}
