/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.devicemanager.impl.xml;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "ProblemNotification")
public class ProblemNotificationXml extends MwtNotificationBase {

    @XmlElement(name = "problem")
    private String problem;

    @XmlElement(name = "severity")
    private String severity;

    public ProblemNotificationXml() {

    }

    /**
     * Generic Problem.
     * All the parameters are of type Strings according to YANG specification.
     * @param nodeName Name of mountpoint
     * @param uuId Name of Interface Pac
     * @param problemNameString Name of the problem
     * @param problemSeverityString Severitycode of the problem
     * @param counterString Counter from device
     * @param timeStampString Timestamp according to YANG format.
     */
    public ProblemNotificationXml(String nodeName, String uuId, String problemNameString, String problemSeverityString,
            String counterString, String timeStampString) {
        super(nodeName, counterString, timeStampString, uuId);
        this.problem = problemNameString;
        this.severity = problemSeverityString;
    }

    /**
     * Create problem from Notification
     * @param nodeName Name of mountpoint
     * @param notification ONF1.0 Notification
     */
    public ProblemNotificationXml(String nodeName, org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ProblemNotification notification) {
        super(nodeName, notification.getCounter().toString(), notification.getTimeStamp().getValue(),
                notification.getObjectIdRef().getValue());
        this.problem = notification.getProblem();
        this.severity = notification.getSeverity().toString();
    }

    /**
     * Create problem from Notification
     * @param nodeName Name of mountpoint
     * @param notification via NETCONF received notification object
     */
    public ProblemNotificationXml(String nodeName, org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification notification) {
        super(nodeName, notification.getCounter().toString(), notification.getTimeStamp().getValue(),
                notification.getObjectIdRef().getValue());
        this.problem = notification.getProblem();
        this.severity = notification.getSeverity().toString();
    }


    /*
    public ProblemNotificationXml(String nodeName, String uuId, ContainerCurrentProblemType currentProblem) {
        super(nodeName, currentProblem.getSequenceNumber().toString(), currentProblem.getTimeStamp().getValue(),
                uuId);
        this.problem = currentProblem.getProblemName();
        this.severity = currentProblem.getProblemSeverity().toString();
    }

    /*
    public ProblemNotificationXml(String nodeName, String uuId, AirInterfaceCurrentProblemType currentProblem) {
        super(nodeName, currentProblem.getSequenceNumber().toString(), currentProblem.getTimeStamp().getValue(),
                uuId);
        this.problem = currentProblem.getProblemName();
        this.severity = currentProblem.getProblemSeverity().toString();
    }

    /*
    public ProblemNotificationXml(String nodeName, String uuId, AirInterfaceCurrentProblemTypeG currentProblem) {
        super(nodeName, currentProblem.getSequenceNumber().toString(), currentProblem.getTimeStamp().getValue(),
                uuId);
        this.problem = currentProblem.getProblemName();
        this.severity = currentProblem.getProblemSeverity().toString();
    }

    public ProblemNotificationXml(String nodeName, String uuId, ContainerCurrentProblemTypeG currentProblem) {
        super(nodeName, currentProblem.getSequenceNumber().toString(), currentProblem.getTimeStamp().getValue(),
                uuId);
        this.problem = currentProblem.getProblemName();
        this.severity = currentProblem.getProblemSeverity().toString();
    }

    public ProblemNotificationXml(String nodeName, String uuId, CurrentProblemList currentProblem) {
        super(nodeName, currentProblem.getSequenceNumber().toString(), currentProblem.getTimeStamp().getValue(),
                uuId);
        this.problem = currentProblem.getProblemName();
        this.severity = currentProblem.getProblemSeverity().toString();
    } */


    public String getProblem() {
        return problem;
    }

    public String getSeverity() {
        return severity;
    }

    @Override
    public String toString() {
        return "ProblemNotificationXml [problem=" + problem + ", severity=" + severity + ", toString()="
                + super.toString() + "]";
    }

}
