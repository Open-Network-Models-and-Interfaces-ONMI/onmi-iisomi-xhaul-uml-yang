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

@XmlRootElement(name = "AttributeValueChangedNotification")
public class AttributeValueChangedNotificationXml extends MwtNotificationBase implements GetEventType {

    private static String EVENTTYPE =  "AttributeValueChangedNotification";

    @XmlElement(name = "attributeName")
    private String attributeName;

    @XmlElement(name = "newValue")
    private String newValue;

    public AttributeValueChangedNotificationXml() {

    }

    /**
     * Normalized notification
     * @param nodeName name of mountpoint
     * @param counter of notification
     * @param timeStamp from ne
     * @param objectIdRef from ne
     * @param attributeName from ne
     * @param newValue from ne
     */
    public AttributeValueChangedNotificationXml(String nodeName, String counter, InternalDateAndTime timeStamp, String objectIdRef,
            String attributeName, String newValue) {
        super(nodeName, counter, timeStamp, objectIdRef);
        this.attributeName = attributeName;
        this.newValue = newValue;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public String getNewValue() {
        return newValue;
    }

    @Override
    public String getEventType() {
        return EVENTTYPE;
    }

}
