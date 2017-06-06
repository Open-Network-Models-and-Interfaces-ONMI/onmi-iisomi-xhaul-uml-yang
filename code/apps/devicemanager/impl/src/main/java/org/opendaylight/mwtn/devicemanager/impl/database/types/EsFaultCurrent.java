package org.opendaylight.mwtn.devicemanager.impl.database.types;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.opendaylight.mwtn.base.database.EsObject;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;

/**
 * Event from Network to be recorded in the database
 *
 */

public class EsFaultCurrent extends EsObject {

    public static final String ESDATATYPENAME = "faultcurrent";
    private static final Pattern pattern = Pattern.compile(".*\\[layerProtocol=(.*)\\]");
    //private static final String NOALARM = "NonAlarmed";

    private ProblemNotificationXml faultCurrent;

    public ProblemNotificationXml getProblem() {
        return faultCurrent;
    }

    public void setProblem(ProblemNotificationXml fault) {
        this.faultCurrent = fault;
        setEsId(genSpecificEsId(fault));
    }

    public boolean isNoAlarmIndication() {
        return faultCurrent.getSeverity().isNoAlarmIndication();
    }

    public static QueryBuilder getQueryForOneNode( String nodeName) {
        return QueryBuilders.termQuery("faultCurrent.nodeName", nodeName);
    }

    public static QueryBuilder getQueryForOneNodeAndObjectId( String nodeName, String objectId) {
        BoolQueryBuilder bq = QueryBuilders.boolQuery();
        bq.must(QueryBuilders.termQuery("faultCurrent.nodeName", nodeName));
        bq.must(QueryBuilders.termQuery("faultCurrent.objectId", objectId));
        return bq;
        //return QueryBuilders.termQuery("faultCurrent.objectId", objectId);

    }

    public static String getEsdatatypename() {
        return ESDATATYPENAME;
    }

    /**
     * Create a specific ES id for the current log.
     * @param fault is the input.
     * @return a string with the generated ES Id
     */
    private static String genSpecificEsId(ProblemNotificationXml fault) {

        String uuId;

        Matcher matcher = pattern.matcher(fault.getObjectId());
        if (matcher.matches() && matcher.groupCount() == 1) {
            uuId = matcher.group(1);
        } else {
            uuId = fault.getObjectId();
        }

        StringBuffer strBuf = new StringBuffer();
        strBuf.append(fault.getNodeName());
        strBuf.append("/");
        strBuf.append(uuId);
        strBuf.append("/");
        strBuf.append(fault.getProblem());
        return strBuf.toString();
    }



 }
