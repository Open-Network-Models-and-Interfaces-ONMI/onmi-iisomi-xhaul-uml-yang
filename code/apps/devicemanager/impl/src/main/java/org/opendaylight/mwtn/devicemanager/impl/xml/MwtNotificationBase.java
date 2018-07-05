/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.devicemanager.impl.xml;

import javax.xml.bind.annotation.XmlElement;

import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MwtNotificationBase {

    private static String EMPTY = "empty";

    private String nodeName;
    private String counter;
    private String timeStamp;
    private String objectId;

    public MwtNotificationBase() {
        // For Jaxb
    }

    public MwtNotificationBase(String nodeName, String counter, InternalDateAndTime timeStamp, String objectId) {
        this.nodeName = nodeName;
        this.counter = counter;
        this.timeStamp = timeStamp.getValue();
        this.objectId = objectId;
        if (this.objectId == null) {
            this.objectId = EMPTY;
        }
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

    /**
     * Type for the Database to document the the same name that is used in the websockets.
     * @return String with type name of child class
     */
    @JsonProperty("type")
    public String getType() {
        return this.getClass().getSimpleName();
    }

    @Override
    public String toString() {
        return "MwtNotificationBase [getType()="+ getType() + ", nodeName=" + nodeName + ", counter=" + counter + ", timeStamp=" + timeStamp
                + ", objectId=" + objectId + "]";
    }


}
