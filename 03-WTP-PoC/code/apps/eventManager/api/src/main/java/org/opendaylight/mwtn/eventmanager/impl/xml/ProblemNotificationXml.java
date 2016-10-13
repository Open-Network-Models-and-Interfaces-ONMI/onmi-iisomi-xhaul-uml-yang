/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.eventmanager.impl.xml;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ProblemNotification;

@XmlRootElement(name = "ProblemNotification")
public class ProblemNotificationXml extends MwtNotificationBase {

	@XmlElement(name = "problem")
	private String problem;

	@XmlElement(name = "severity")
	private String severity;

	public ProblemNotificationXml() {

	}

	public ProblemNotificationXml(String nodeName, ProblemNotification notification) {
		super(nodeName, notification.getCounter().toString(), notification.getTimeStamp().getValue(),
//Avadh				notification.getObjectID().getValue());
				notification.getObjectIdRef().getValue());
		this.problem = notification.getProblem();
		this.severity = notification.getSeverity().toString();
	}

	public String getProblem() {
		return problem;
	}

	public String getSeverity() {
		return severity;
	}

}

