package org.opendaylight.mwtn.performancemanager.impl.database.service;

import org.opendaylight.mwtn.base.database.HtDataBaseReaderAndWriter;
import org.opendaylight.mwtn.base.database.HtDatabaseClientAbstract;
import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.base.database.IndexClientBuilder;
import org.opendaylight.mwtn.base.netconf.AllPm;
import org.opendaylight.mwtn.base.netconf.NetconfTimeStamp;
import org.opendaylight.mwtn.performancemanager.impl.database.types.EsHistoricalPerformance15Minutes;
import org.opendaylight.mwtn.performancemanager.impl.database.types.EsHistoricalPerformance24Hours;
import org.opendaylight.mwtn.performancemanager.impl.database.types.EsHistoricalPerformanceLogEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MicrowaveHistoricalPerformanceWriterService {

    private static final Logger LOG = LoggerFactory.getLogger(MicrowaveHistoricalPerformanceWriterService.class);
    private static final String INDEX = "sdnperformance";
    private static final String MAPPING = "/elasticsearch/index/sdnperformance/sdnperformanceMapping.json";


    private HtDatabaseClientAbstract client;
    private HtDataBaseReaderAndWriter<EsHistoricalPerformance15Minutes> historicalPerformance15mRW;
    private HtDataBaseReaderAndWriter<EsHistoricalPerformance24Hours> historicalPerformance24hRW;
    private HtDataBaseReaderAndWriter<EsHistoricalPerformanceLogEntry> historicalPerformanceLogRW;

    public MicrowaveHistoricalPerformanceWriterService(HtDatabaseNode database) {

    	LOG.info("Create {} start", MicrowaveHistoricalPerformanceWriterService.class);

    	try {

    		IndexClientBuilder clientBuilder = IndexClientBuilder.getBuilder(INDEX).setMappingSettingJsonFileName(MAPPING);
    		client = clientBuilder.create(database);

    		historicalPerformance15mRW = new HtDataBaseReaderAndWriter<>(client, EsHistoricalPerformance15Minutes.ESDATATYPENAME, EsHistoricalPerformance15Minutes.class);
    		historicalPerformance24hRW = new HtDataBaseReaderAndWriter<>(client, EsHistoricalPerformance24Hours.ESDATATYPENAME, EsHistoricalPerformance24Hours.class);
    		historicalPerformanceLogRW = new HtDataBaseReaderAndWriter<>(client, EsHistoricalPerformanceLogEntry.ESDATATYPENAME, EsHistoricalPerformanceLogEntry.class);

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

    public void writePMLog(String mountpointName, String layerProtocolName, String msg) {

        LOG.debug("Write PM Log: {}", msg);
        EsHistoricalPerformanceLogEntry logEntry = new EsHistoricalPerformanceLogEntry(mountpointName,layerProtocolName,NetconfTimeStamp.getTimeStamp().getValue() , msg );
        historicalPerformanceLogRW.doWrite(logEntry);
        LOG.debug("Write PM Log done");

    }


    static public boolean isAvailable(MicrowaveHistoricalPerformanceWriterService s) {

        if (s == null || s.client == null) {
            return false;
        }
        return true;
    }

}
