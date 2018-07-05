/**
 *
 */
package org.opendaylight.mwtn.base.netconf;

import java.util.ArrayList;
import java.util.List;

import org.opendaylight.mwtn.performancemanager.impl.database.types.EsHistoricalPerformance15Minutes;
import org.opendaylight.mwtn.performancemanager.impl.database.types.EsHistoricalPerformance24Hours;

/**
 * @author herbert
 *
 */

public class AllPm {

    static AllPm EMPTY = new AllPm();

    private final List<EsHistoricalPerformance15Minutes> pm15 = new ArrayList<>();
    private final List<EsHistoricalPerformance24Hours> pm24 = new ArrayList<>();

    void add(EsHistoricalPerformance15Minutes pm) {
        pm15.add(pm);
    }

    void add(EsHistoricalPerformance24Hours pm) {
        pm24.add(pm);
    }

    public List<EsHistoricalPerformance15Minutes> getPm15() {
        return pm15;
    }

    public List<EsHistoricalPerformance24Hours> getPm24() {
        return pm24;
    }

    public Object size() {
        return pm15.size()+pm24.size();
    }

}
