package org.opendaylight.mwtn.performancemanager.impl.database.types;

import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160811.logicalterminationpoint.LpList;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.object_classes.rev160710.OTNHistoryData;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EsHistoricalPerformance15Minutes extends EsHistoricalPerformanceBase {

    public static final String ESDATATYPENAME = "historicalperformance15min";

    private static final Logger LOG = LoggerFactory.getLogger(EsHistoricalPerformance15Minutes.class);

    public EsHistoricalPerformance15Minutes(String nodeName, LpList lp) {
        super(nodeName, lp);
    }

    public EsHistoricalPerformance15Minutes(String nodeName, Lp lp) {
        super(nodeName, lp);
    }

    public <T extends OTNHistoryData> EsHistoricalPerformance15Minutes setHistoricalRecord15Minutes(T record) {
        if (record.getGranularityPeriod() != org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.type_definitions.rev160710.GranularityPeriodType.PERIOD15MIN) {
            LOG.warn("Granularity mismatch for {} expected {} found {}", getNodeName(),getUuidInterface(), org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.type_definitions.rev160710.GranularityPeriodType.PERIOD15MIN, record.getGranularityPeriod());
        }
        set(record);
        return this;
    }

    public <T extends OtnHistoryDataG> EsHistoricalPerformance15Minutes setHistoricalRecord15Minutes(OtnHistoryDataG record) {
        if (record.getGranularityPeriod() != org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.GranularityPeriodType.Period15Min) {
            LOG.warn("Granularity mismatch for {} expected {} found {}", getNodeName(),getUuidInterface(), org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.GranularityPeriodType.Period15Min, record.getGranularityPeriod());
        }
        set(record);
        return this;
    }

}
