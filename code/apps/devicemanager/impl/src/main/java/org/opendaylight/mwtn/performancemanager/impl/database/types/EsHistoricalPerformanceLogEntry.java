package org.opendaylight.mwtn.performancemanager.impl.database.types;

import org.opendaylight.mwtn.base.database.EsObject;

/**
 *
 * Event from Network to be recorded in the database
 *
 */

public class EsHistoricalPerformanceLogEntry extends EsObject {

    public static final String ESDATATYPENAME = "performancelog";

    private String mountpoint;
    private String interfaceIdx;
    private String timeStamp;
    private String logText;

    /**
     * Create Log entry for NE/Interfaceproblems during PM execution
     * @param mountpoint Name of
     * @param interfaceIdx Name of
     * @param timeStamp Time and date of occurence
     * @param logText to write
     */
    public EsHistoricalPerformanceLogEntry(String mountpoint, String interfaceIdx, String timeStamp, String logText) {
        super();
        this.mountpoint = mountpoint;
        this.interfaceIdx = interfaceIdx;
        this.timeStamp = timeStamp;
        this.logText = logText;
    }

    /**
     * For jackson purpose
     */
    EsHistoricalPerformanceLogEntry() {
    }

    /**
     * @return the mountpoint
     */
    public String getMountpoint() {
        return mountpoint;
    }

    /**
     * @return the interfaceIdx
     */
    public String getInterfaceIdx() {
        return interfaceIdx;
    }

    /**
     * @return the timeStamp
     */
    public String getTimeStamp() {
        return timeStamp;
    }

    /**
     * @return the logText
     */
    public String getLogText() {
        return logText;
    }



    public static String getEsdatatypename() {
        return ESDATATYPENAME;
    }

 }
