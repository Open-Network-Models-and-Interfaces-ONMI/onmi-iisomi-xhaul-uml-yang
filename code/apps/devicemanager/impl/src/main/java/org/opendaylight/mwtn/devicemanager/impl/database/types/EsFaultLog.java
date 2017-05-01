package org.opendaylight.mwtn.devicemanager.impl.database.types;

import org.opendaylight.mwtn.base.database.EsObject;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;

/**
 *
 * Event from Network to be recorded in the database
 *
 */

public class EsFaultLog extends EsObject {

    public static final String ESDATATYPENAME = "faultlog";

    private ProblemNotificationXml fault;

    public ProblemNotificationXml getProblem() {
        return fault;
    }

    public void setProblem(ProblemNotificationXml fault) {
        this.fault = fault;
    }

    public static String getEsdatatypename() {
        return ESDATATYPENAME;
    }

 }
