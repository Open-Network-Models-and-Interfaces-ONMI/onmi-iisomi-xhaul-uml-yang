package org.opendaylight.mwtn.devicemanager.impl.database.types;

import org.opendaylight.mwtn.base.database.EsObject;
import org.opendaylight.mwtn.devicemanager.impl.xml.MwtNotificationBase;

/**
 *
 * Event from Network to be recorded in the database
 *
 */

public class EsEventBase extends EsObject {

    public static final String ESDATATYPENAME = "eventlog";

    private MwtNotificationBase event;

    public MwtNotificationBase getProblem() {
        return event;
    }

    public void setProblem(MwtNotificationBase event) {
        this.event = event;
    }

    public static String getEsdatatypename() {
        return ESDATATYPENAME;
    }

 }
