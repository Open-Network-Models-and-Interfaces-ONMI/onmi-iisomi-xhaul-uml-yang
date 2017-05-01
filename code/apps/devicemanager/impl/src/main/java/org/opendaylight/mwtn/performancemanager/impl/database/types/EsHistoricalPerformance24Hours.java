package org.opendaylight.mwtn.performancemanager.impl.database.types;

import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160811.logicalterminationpoint.LpList;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.object_classes.rev160710.OTNHistoryData;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;

public class EsHistoricalPerformance24Hours extends EsHistoricalPerformanceBase {

    public static final String ESDATATYPENAME = "historicalperformance24h";

    public EsHistoricalPerformance24Hours(String nodeName, LpList lp) {
        super(nodeName, lp);
    }

    public EsHistoricalPerformance24Hours(String nodeName, Lp lp) {
        super(nodeName, lp);
    }

    public <T extends OTNHistoryData> EsHistoricalPerformance24Hours setHistoricalRecord24Hours(T record) {
        set(record);
        return this;
    }

    public <T extends OtnHistoryDataG> EsHistoricalPerformance24Hours setHistoricalRecord24Hours(T record) {
        set(record);
        return this;
    }

}
