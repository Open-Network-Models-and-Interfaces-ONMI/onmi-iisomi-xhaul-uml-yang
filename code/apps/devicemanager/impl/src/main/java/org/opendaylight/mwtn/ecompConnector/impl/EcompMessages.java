/**
        ecompProvider.sendProblemNotification(ownKeyName, notificationXml);
 * ECOMP Messages are generated an send to destination
 *
 * @author herbert
 */
package org.opendaylight.mwtn.ecompConnector.impl;

import java.text.ParseException;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.base.netconf.NetconfTimeStamp;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EcompMessages {

    private static final Logger LOG = LoggerFactory.getLogger(EcompSenderImpl.class);

    private static final String ECOMP_NORMAL =  "NORMAL";
    private static final String ECOMP_MINOR =  "MINOR";
    private static final String ECOMP_WARNING =  "WARNING";
    private static final String ECOMP_CRITICAL =  "CRITICAL";
    private static final String ECOMP_MAJOR =  "MAJOR";


    private final String sourceId;
    private final EcompSender ecompSender;

    private int heartbeatsequence = 0;


    public EcompMessages(String getSourceId, EcompSender ecompSender) {
        this.sourceId= getSourceId;
        this.ecompSender = ecompSender;
    }

    /**
     * Create a heartbeat message.
     * @return Result string with answer from server
     */
    public String postHeartBeat() {

        String epochTimeMicrosecondsString = getEpochTimeMicroseconds();
        String body = assembleHeartbeatFromTemplate(null, epochTimeMicrosecondsString, heartbeatsequence++).toString();

        LOG.debug(body);
        return ecompSender.sendEcompPost( body);
    }

    /**
     * ONF 1.2 Problem Notification
     * @param mountPointName self-explaining
     * @param notification Notification input
     * @return String with answer
     */

    public String postNotification(String mountPointName, ProblemNotificationXml notification) {

        String problemName = notification.getProblem();
        String sequence = notification.getCounter();
        String objId = notification.getObjectId();
        String nodeName = mountPointName;
        String severity = convert( notification.getSeverity());
        String timeStamp = convert( notification.getTimeStamp() );

        String body = assembleEventNotificationFromTemplate(null,
                timeStamp, sequence,
                nodeName, objId, problemName, severity ).toString();

        LOG.debug(body);
        return ecompSender.sendEcompPost( body);
    }


    /* -----------------
     * Private function for message creation and with templates
     */

    /**
     * Get actual microseconds
     * @return String
     */
    private String getEpochTimeMicroseconds() {
        long microseconds = System.nanoTime() / 1000;
        return String.valueOf(microseconds);
    }

    /**
     * Assemble heartbeat message
     * @param sb StringBuffer to be used or null to allocate
     * @param epochTimeMicrosecondsString Text with time stamp
     * @param sequence integer sequence number
     * @return StringBuffer with result
     */
    private StringBuffer assembleHeartbeatFromTemplate(StringBuffer sb, String epochTimeMicrosecondsString, int sequence) {

        if (sb == null) {
          sb = new StringBuffer();
        }
        sb.append("{\n" +
                "    \"event\": {\n" +
                "        \"commonEventHeader\": {\n" +
                "            \"domain\": \"heartbeat\",\n" +
                "            \"eventType\": \"Heartbeat_vIsbcMmc\",\n" +
                "            \"eventId\": \"testpattern-ab305d54-85b4-a31b-7db2-fb6b9e546015\",\n" +
                "            \"sequence\": "+String.valueOf(sequence)+",\n" +
                "            \"priority\": \"Normal\",\n" +
                "            \"reportingEntityId\": \"testpattern-cc305d54-75b4-431b-adb2-eb6b9e541234\",\n" +
                "            \"reportingEntityName\": \"SDN-R\",\n" +
                "            \"sourceId\": \""+sourceId+"\",\n" +
                "            \"sourceName\": \"SDN-R\",\n" +
                "            \"functionalRole\": \"SDN-Controller\",\n" +
                "            \"startEpochMicrosec\": "+epochTimeMicrosecondsString+",\n" +
                "            \"lastEpochMicrosec\": "+epochTimeMicrosecondsString+"\n" +
                "        }\n" +
                "    }\n" +
                "}\n" +
                "");

        return sb;
    }

    /**
     * Assemble notification message
     * @param sb StringBuffer to be used or null to allocate
     * @param epochTimeMicrosecondsString Text with time stamp
     * @param sequence integer sequence number
     * @param nodeName
     * @param objId
     * @param problemName
     * @param severity
     * @return StringBuffer with result
     */
    private StringBuffer assembleEventNotificationFromTemplate(StringBuffer sb,
            String epochTimeMicrosecondsString, String sequence,
            String nodeName, String objId, String problemName, String severity ) {

        if (sb == null) {
            sb = new StringBuffer();
        }
        sb.append("{\n" +
                "    \"event\": {\n" +
                "        \"commonEventHeader\": {\n" +
                "            \"domain\": \"fault\",\n" +
                "            \"eventId\": \""+problemName+"\",\n" +
                "            \"eventType\": \""+problemName+"\",\n" +
                "            \"functionalRole\": \"wireless x-haul\",\n" +
                "            \"sequence\": "+sequence+",\n" +
                "            \"priority\": \"High\",\n" +
                "            \"reportingEntityId\": \""+objId+"\",\n" +
                "            \"reportingEntityName\": \""+nodeName+"\",\n" +
                "            \"sourceId\": \""+sourceId+"\",\n" +
                "            \"sourceName\": \"SDN-R\",\n" +
                "            \"startEpochMicrosec\": "+epochTimeMicrosecondsString+",\n" +
                "            \"lastEpochMicrosec\": "+epochTimeMicrosecondsString+"\n" +
                "        },\n" +
                "        \"faultFields\": {\n" +
                "            \"faultFieldsVersion\":1.1,\n" +
                "            \"alarmCondition\": \""+problemName+"\",\n" +
                "            \"alarmInterfaceA\": \""+objId+"\",\n" +
                "            \"eventSourceType\": \"other\",\n" +
                "            \"specificProblem\": \""+problemName+"\",\n" +
                "            \"eventSeverity\": \""+severity+"\",\n" +
                "            \"vfStatus\": \"Active\"\n" +
                "        }\n" +
                "    }\n" +
                "}\n" +
                "");

        return sb;
    }

    /* -----------------
     * Convert internal type formats into the Ecomp format
     */

    private String convert(InternalSeverity severity ) {
         switch( severity ) {
            case NonAlarmed:
                break;
            case Warning:
                return ECOMP_WARNING;
            case Minor:
                return ECOMP_MINOR;
            case Major:
                return ECOMP_MAJOR;
            case Critical:
                return ECOMP_CRITICAL;
        }
        return ECOMP_NORMAL;
    }


    /**
     * Time has to be converted into milliseconds
     * @param timeAsString time as string
     * @return
     */
    private String convert(String timeAsString) {

        long microseconds = -1;
        try {
            microseconds = NetconfTimeStamp.getTimeStampFromNetconfAsMilliseconds(timeAsString) * 1000;
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return String.valueOf(microseconds);
    }


}
