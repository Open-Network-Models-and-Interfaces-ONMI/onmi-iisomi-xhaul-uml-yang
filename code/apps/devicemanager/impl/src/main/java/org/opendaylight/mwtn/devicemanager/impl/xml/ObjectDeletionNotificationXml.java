/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
 terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.devicemanager.impl.xml;

import javax.xml.bind.annotation.XmlRootElement;

import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;

@XmlRootElement(name = "ObjectDeletionNotification")
public class ObjectDeletionNotificationXml extends MwtNotificationBase implements GetEventType {

    private static String EVENTTYPE =  "ObjectDeletionNotification";

    public ObjectDeletionNotificationXml() {

    }

    /**
     * Normalized notification
     * @param nodeName name of mountpoint or instance that owns the problem
     * @param counter of notification
     * @param timeStamp from ne
     * @param objectIdRef from ne
     */
    public ObjectDeletionNotificationXml(String nodeName, String counter, InternalDateAndTime timeStamp, String objectIdRef) {
        super(nodeName, counter, timeStamp,  objectIdRef);
    }

    /*
    public ObjectDeletionNotificationXml(String nodeName, ObjectDeletionNotification notification) {
        super(nodeName, notification.getCounter().toString(), InternalDateAndTime.valueOf(notification.getTimeStamp()),
//                notification.getObjectId().getValue());
                notification.getObjectIdRef().getValue());
    }*/
/*
    public ObjectDeletionNotificationXml(String nodeName, org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ObjectDeletionNotification notification) {
        super(nodeName, notification.getCounter().toString(), InternalDateAndTime.valueOf(notification.getTimeStamp()),
//                notification.getObjectId().getValue());
                notification.getObjectIdRef().getValue());
    }
*/
    @Override
    public String getEventType() {
        return EVENTTYPE;
    }

}
