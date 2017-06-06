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
import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;

@XmlRootElement(name = "ProblemNotification")
public class ProblemNotificationXml extends MwtNotificationBase implements GetEventType {

    private static String EVENTTYPE =  "ProblemNotification";

    @XmlElement(name = "problem")
    private String problem;

    @XmlElement(name = "severity")
    private InternalSeverity severity;

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
     * @param internaltimeStampString Timestamp according to internal format.
     */
    public ProblemNotificationXml(String nodeName, String uuId, String problemNameString, InternalSeverity problemSeverityString,
            String counterString, InternalDateAndTime internaltimeStampString) {
        super(nodeName, counterString, internaltimeStampString, uuId);
        this.problem = problemNameString;
        this.severity = problemSeverityString;
    }

    public String getProblem() {
        return problem;
    }

    public InternalSeverity getSeverity() {
        return severity;
    }

    @Override
    public String toString() {
        return "ProblemNotificationXml [problem=" + problem + ", severity=" + severity + ", toString()="
                + super.toString() + "]";
    }

    @Override
    public String getEventType() {
        return EVENTTYPE;
    }

}
