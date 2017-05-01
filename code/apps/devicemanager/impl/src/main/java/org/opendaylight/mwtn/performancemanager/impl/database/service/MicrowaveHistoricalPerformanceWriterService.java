package org.opendaylight.mwtn.performancemanager.impl.database.service;

import org.opendaylight.mwtn.base.database.HtDataBaseReaderAndWriter;
import org.opendaylight.mwtn.base.database.HtDatabaseClientAbstract;
import org.opendaylight.mwtn.base.netconf.AllPm;
import org.opendaylight.mwtn.performancemanager.impl.database.types.EsHistoricalPerformance15Minutes;
import org.opendaylight.mwtn.performancemanager.impl.database.types.EsHistoricalPerformance24Hours;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MicrowaveHistoricalPerformanceWriterService {

    private static final Logger LOG = LoggerFactory.getLogger(MicrowaveHistoricalPerformanceWriterService.class);


    private HtDatabaseClientAbstract client;
    private HtDataBaseReaderAndWriter<EsHistoricalPerformance15Minutes> historicalPerformance15mRW;
    private HtDataBaseReaderAndWriter<EsHistoricalPerformance24Hours> historicalPerformance24hRW;


    public MicrowaveHistoricalPerformanceWriterService(String esIndex,
            String esNodeserverName, String esClusterName, String esNodeName,
            String configurationId) {

        LOG.info("Create {} start", MicrowaveHistoricalPerformanceWriterService.class);


        client = null;

        try {
            client = new HtDatabaseClientAbstract(esIndex, esNodeserverName, esClusterName, esNodeName);
            historicalPerformance15mRW = new HtDataBaseReaderAndWriter<>(client, EsHistoricalPerformance15Minutes.ESDATATYPENAME, EsHistoricalPerformance15Minutes.class);
            historicalPerformance24hRW = new HtDataBaseReaderAndWriter<>(client, EsHistoricalPerformance24Hours.ESDATATYPENAME, EsHistoricalPerformance24Hours.class);

        } catch (Exception e) {
            client = null;
            LOG.error("Can not start database client. Exception: {}", e.getMessage());
        }

        LOG.info("Create {} finished. DB Service {} started.", MicrowaveHistoricalPerformanceWriterService.class,  client != null ? "sucessfully" : "not" );
    }


    public void writePM(AllPm pm) {

        LOG.debug("Write {} pm records", pm.size());

        LOG.debug("Write 15m write to DB");
        historicalPerformance15mRW.doWrite(pm.getPm15());
        LOG.debug("Write 15m done, Write 24h write to DB");
        historicalPerformance24hRW.doWrite(pm.getPm24());
        LOG.debug("Write 24h done");

    }

    static public boolean isAvailable(MicrowaveHistoricalPerformanceWriterService s) {

        if (s == null || s.client == null) {
            return false;
        }
        return true;
    }

}
