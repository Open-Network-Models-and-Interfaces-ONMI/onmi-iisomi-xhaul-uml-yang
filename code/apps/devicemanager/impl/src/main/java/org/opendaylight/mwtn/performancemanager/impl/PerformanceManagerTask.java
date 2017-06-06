package org.opendaylight.mwtn.performancemanager.impl;

import java.util.Iterator;
import java.util.concurrent.ConcurrentLinkedQueue;
import org.opendaylight.mwtn.base.netconf.AllPm;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PerformanceManagerTask implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(PerformanceManagerTask.class);
    private static final String LOGMARKER = "PMTick";

    private int t = 0;

    private final ConcurrentLinkedQueue<ONFCoreNetworkElementRepresentation> queue2;
    private final MicrowaveHistoricalPerformanceWriterService databaseService;

    private Iterator<ONFCoreNetworkElementRepresentation> neIterator = null;
    private ONFCoreNetworkElementRepresentation actualNE = null;


    public PerformanceManagerTask(
            ConcurrentLinkedQueue<ONFCoreNetworkElementRepresentation> queue,
            MicrowaveHistoricalPerformanceWriterService databaseService) {

        LOG.debug("Init task {}", PerformanceManagerTask.class.getSimpleName());
        this.queue2 = queue;
        this.databaseService = databaseService;
    }

    /**
     * Task to read all performance data from Network Elements.
     * Catch exceptions to make sure, that the Task is not stopped.
     */
    @Override
    public void run() {

        LOG.debug("{} start {} Start with mountpoint {}",LOGMARKER, t, actualNE == null ? "No NE" : actualNE.getMountPointNodeName());

        //Proceed to next NE/Interface
        getNextInterface();

        LOG.debug("{} {} Next interface to handle {}", LOGMARKER, t,
                actualNE == null ? "No NE/IF" : actualNE.getMountPointNodeName() + " " + actualNE.pmStatusToString());

        if (actualNE != null) {
            try {
                LOG.debug("{} Start to read PM from NE ({})", LOGMARKER, t);
                AllPm allPm = actualNE.getHistoricalPM();
                LOG.debug("{} {} Got PM list. Start write to DB", LOGMARKER, t);
                databaseService.writePM(allPm);
                LOG.debug("{} {} PM List end.", LOGMARKER, t);
            } catch (Exception e) {
                LOG.warn("{} {} PM read/write failed. Write log entry {}", LOGMARKER, t, e);
                String msg = e.getMessage();
                if (msg == null || msg.isEmpty()) {
                    if (e.getCause() != null) {
                        msg = e.getCause().toString();
                    }
                    if (msg == null || msg.isEmpty()){
                        msg = "No message or cause";
                    }
                }
                databaseService.writePMLog(actualNE.getMountPointNodeName(), actualNE.pmStatusToString(), msg);
            }
        }

        LOG.debug("{} end {}",LOGMARKER, t);
        t++;
    }

    /**
     * Get then next interface in the list.
     * First try to find a next on the actual NE.
     * If not available search next interface at a NE
     * Special Situations to handle: Empty queue, NEs, but no interfaces
     * Viabale to change:
     *
     * @return Interface to scan or null
     */
    private ONFCoreNetworkElementRepresentation getNextInterface() {
        boolean started = false;
        int endless = 0;

        LOG.debug("{} {} getNextInterface enter. Queue size {} ", LOGMARKER, t, queue2.size());


        while (endless++ < 1000) {

                LOG.debug("{} {} Loop ne {} neiterator {} Interfaceiterator {}",
                        LOGMARKER, t,
                        actualNE == null? "null" : actualNE.getMountPointNodeName(),
                        neIterator == null ? "null" : neIterator.hasNext(),
                        actualNE == null ? "null" : actualNE.hasNext()  );

                if (actualNE != null && actualNE.hasNext()) {
                    // Yes, there is an interface, deliver back
                    LOG.debug("{} {} getNextInterface yes 1",LOGMARKER, t);
                    actualNE.next();
                    return actualNE;

                } else {
                    // No element in neInterfaceInterator .. get next NE and try
                    if (neIterator != null && neIterator.hasNext()) {
                        // Set a new NE
                        LOG.debug("{} {} Next NE 1",LOGMARKER, t);
                        actualNE = neIterator.next();
                        actualNE.resetPMIterator();

                    } else {
                         // Goto start condition 1) first entry 2) end of queue reached
                           LOG.debug("{} {} Reset",LOGMARKER, t);
                           actualNE = null;
                           neIterator = null;

                        if (queue2.isEmpty()) {
                            LOG.debug("{} {} no nextInterfac. queue empty",LOGMARKER, t);
                            return null;
                        } else if (!started){
                            LOG.debug("{} {} getNextInterface start condition. Get interator.",LOGMARKER, t);
                            neIterator = queue2.iterator();
                            started = true;
                        } else {
                            LOG.debug("{} {} no nextInterface",LOGMARKER, t);
                            return null;
                        }
                    }
                }
        } //while
        LOG.error("{} {} Problem in PM iteration. endless condition reached", LOGMARKER, t);
        return null;
    }
}
