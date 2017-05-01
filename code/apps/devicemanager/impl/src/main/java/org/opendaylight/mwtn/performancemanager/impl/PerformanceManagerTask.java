package org.opendaylight.mwtn.performancemanager.impl;

import java.util.Iterator;
import java.util.concurrent.ConcurrentLinkedQueue;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PerformanceManagerTask implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(PerformanceManagerTask.class);

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

    @Override
    public void run() {

        LOG.debug("PM Tick {} start", t);

        //Proceed to next NE/Interface
        getNextInterface();

        LOG.debug("PM Tick {} Handle Interface {}", t, actualNE == null ? "No NE" : actualNE.pmStatusToString());

        if (actualNE != null) {

            LOG.debug("read/write PM List start");
            databaseService.writePM( actualNE.getHistoricalPM() );
            LOG.debug("read/write PM List Write to DB end.");

        }

        LOG.debug("PM Tick end {}", t++);
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

        LOG.debug("PM Tick {} getNextInterface enter. Queue size {} ", t, queue2.size());


        while (endless++ < 1000) {

                LOG.debug("PM Tick Loop ne {} neiterator {} Interfaceiterator {}",
                        actualNE == null? "null" : actualNE.getMountPointNodeName(),
                        neIterator == null ? "null" : neIterator.hasNext(),
                        actualNE == null ? "null" : actualNE.hasNext()  );

                if (actualNE != null && actualNE.hasNext()) {
                    // Yes, there is an interface, deliver back
                    LOG.debug("getNextInterface yes 1");
                    actualNE.next();
                    return actualNE;

                } else {
                    // No element in neInterfaceInterator .. get next NE and try
                    if (neIterator != null && neIterator.hasNext()) {
                        // Set a new NE
                        LOG.debug("Next NE 1");
                        actualNE = neIterator.next();
                        actualNE.resetPMIterator();

                    } else {
                         // Goto start condition 1) first entry 2) end of queue reached
                           LOG.debug("Reset");
                           actualNE = null;
                           neIterator = null;

                        if (queue2.isEmpty()) {
                            LOG.debug("getNextInterface null 1");
                            return null;
                        } else if (!started){
                            LOG.debug("getNextInterface start condition. Get interator.");
                            neIterator = queue2.iterator();
                            started = true;
                        } else {
                            LOG.debug("getNextInterface null 2");
                            return null;
                        }
                    }
                }
        } //while
        LOG.error("Wrong PM interation. Reached endless condition");
        return null;
    }
}
