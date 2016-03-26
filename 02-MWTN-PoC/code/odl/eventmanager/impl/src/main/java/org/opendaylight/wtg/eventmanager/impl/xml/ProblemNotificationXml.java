package org.opendaylight.wtg.eventmanager.impl.xml;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ProblemNotification;

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
				notification.getObjectID().getValue());
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
