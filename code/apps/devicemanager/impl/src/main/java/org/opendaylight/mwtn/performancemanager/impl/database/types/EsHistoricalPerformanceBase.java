package org.opendaylight.mwtn.performancemanager.impl.database.types;

import org.opendaylight.mwtn.base.database.EsObject;
import org.opendaylight.mwtn.base.netconf.LinkIdentifyingObject;
import org.opendaylight.mwtn.base.netconf.NetconfTimeStamp;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160811.logicalterminationpoint.LpList;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.object_classes.rev160710.OTNHistoryData;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.type_definitions.rev160710.GranularityPeriodType;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class EsHistoricalPerformanceBase extends EsObject {

    private static final Logger LOG = LoggerFactory.getLogger(EsHistoricalPerformanceBase.class);

    @JsonIgnore private final String nodeName;
    @JsonIgnore private final String uuidInterface;
    @JsonIgnore private final String layerProtocolName;

    @JsonIgnore private String radioSignalId = null;  //Meaning of connection Id
    @JsonIgnore private String timeStamp = null;
    @JsonIgnore private Boolean suspectIntervalFlag = null;
    @JsonIgnore private String granularityPeriod = null;  //Representation of GranularityPeriodType
    @JsonIgnore private String scannerId = null;
    @JsonIgnore private Object performanceData = null;


    public EsHistoricalPerformanceBase(String nodeName, LpList actualInterface) {
        this.nodeName = nodeName;
        this.uuidInterface = actualInterface.getUuid().getValue();
        this.layerProtocolName = actualInterface.getLayerProtocolName().getValue();

    }

    public EsHistoricalPerformanceBase(String nodeName, Lp actualInterface) {
        this.nodeName = nodeName;
        this.uuidInterface = actualInterface.getUuid().getValue();
        this.layerProtocolName = actualInterface.getLayerProtocolName().getValue();

    }


    protected <T extends OTNHistoryData> void set(T record) {
        if (record == null) {
            LOG.warn("PM Record: null record. Can not handle");
            return;
        }

        if (LOG.isTraceEnabled()) {
            LOG.trace("PM Record: class {} '{}' ", record.getClass().getSimpleName(), record);
        }

        timeStamp = NetconfTimeStamp.getTimeStampFromNetconf(record.getPeriodEndTime().getValue());
        suspectIntervalFlag = record.isSuspectIntervalFlag();
        granularityPeriod = getYangGranularityPeriodString( record.getGranularityPeriod() );
        scannerId = record.getHistoryDataId();

        if (record instanceof LinkIdentifyingObject) {
            radioSignalId = ((LinkIdentifyingObject) record).getSignalId();
        }

        performanceData = new EsPerformanceData10( record );
        setEsId(genSpecificEsId(record.getPeriodEndTime().getValue()));
    }

    protected <T extends OtnHistoryDataG> void set(T record) {
        if (record == null) {
            LOG.warn("PM Record: null record. Can not handle");
            return;
        }

        if (LOG.isTraceEnabled()) {
            LOG.trace("PM Record: class {} '{}' ", record.getClass().getSimpleName(), record);
        }

        timeStamp = NetconfTimeStamp.getTimeStampFromNetconf(record.getPeriodEndTime().getValue());
        suspectIntervalFlag = record.isSuspectIntervalFlag();
        granularityPeriod = getYangGranularityPeriodString( record.getGranularityPeriod() );
        scannerId = record.getHistoryDataId();

        if (record instanceof LinkIdentifyingObject) {
            radioSignalId = ((LinkIdentifyingObject) record).getSignalId();
        }

        performanceData = new EsPerformanceData12( record );
        setEsId(genSpecificEsId(record.getPeriodEndTime().getValue()));
    }


    @JsonGetter("node-name")
    public String getNodeName() {
        return nodeName;
    }

    @JsonGetter("uuid-interface")
    public String getUuidInterface() {
        return uuidInterface;
    }

    @JsonGetter("layer-protocol-name")
    public String getLayerProtocolName() {
        return layerProtocolName;
    }

    @JsonGetter("radio-signal-id")
    public String getRadioSignalId() {
        return radioSignalId;
    }

    @JsonGetter("time-stamp")
    public String getTimeStamp() {
        return timeStamp;
    }

    @JsonGetter("suspect-interval-flag")
    public Boolean getSuspect() {
        return suspectIntervalFlag;
    }

    @JsonGetter("granularity-period")
    public String getGranularityPeriod() {
        return granularityPeriod;
    }

    @JsonGetter("scanner-id")
    public String getScannerId() {
        return scannerId;
    }

    @JsonGetter("performance-data")
    public Object getData() {
        return performanceData;
    }



    //Adapt JSON Text
    //@JsonGetter("granularityPeriod")
    private static String getYangGranularityPeriodString(GranularityPeriodType yangGanularityPeriod) {
        switch(yangGanularityPeriod == null ? GranularityPeriodType.UNKNOWN : yangGanularityPeriod) {
            case PERIOD15MIN:
                return "PERIOD_15MIN";
            case PERIOD24HOURS:
                return "PERIOD_24HOURS";
            default:
                return "PERIOD_UNKOWN";
        }
    }

    private static String getYangGranularityPeriodString(org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.GranularityPeriodType yangGanularityPeriod) {
        switch(yangGanularityPeriod == null ? org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.GranularityPeriodType.Unknown : yangGanularityPeriod) {
            case Period15Min:
                return "PERIOD_15MIN";
            case Period24Hours:
                return "PERIOD_24HOURS";
            default:
                return "PERIOD_UNKOWN";
        }
    }

    /**
     * Create a specific ES id for the current log.
     * @param time is the input.
     * @return a string with the generated ES Id
     */
    protected String genSpecificEsId(String time) {

        StringBuffer strBuf = new StringBuffer();
        strBuf.append(nodeName);
        strBuf.append("/");
        strBuf.append(uuidInterface);
        strBuf.append("/");
        strBuf.append(time == null || time.isEmpty() ? "Empty" : time);

        return strBuf.toString();
    }

    @Override
    public String toString() {
        return "EsHistoricalPerformanceBase [nodeName=" + nodeName + ", uuidInterface=" + uuidInterface
                + ", layerProtocolName=" + layerProtocolName + ", radioSignalId=" + radioSignalId + ", timeStamp="
                + timeStamp + ", suspectIntervalFlag=" + suspectIntervalFlag + ", granularityPeriod="
                + granularityPeriod + ", scannerId=" + scannerId + ", performanceData=" + performanceData + "]";
    }

}
