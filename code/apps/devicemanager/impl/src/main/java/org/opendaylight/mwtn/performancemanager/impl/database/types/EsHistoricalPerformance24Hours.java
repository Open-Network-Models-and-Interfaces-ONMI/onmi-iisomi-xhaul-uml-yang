package org.opendaylight.mwtn.performancemanager.impl.database.types;

import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;

public class EsHistoricalPerformance24Hours extends EsHistoricalPerformanceBase {

    public static final String ESDATATYPENAME = "historicalperformance24h";

    public EsHistoricalPerformance24Hours(String nodeName, Lp lp) {
        super(nodeName, lp);
    }

    public <T extends OtnHistoryDataG> EsHistoricalPerformance24Hours setHistoricalRecord24Hours(T record) {
        set(record);
        return this;
    }

}
