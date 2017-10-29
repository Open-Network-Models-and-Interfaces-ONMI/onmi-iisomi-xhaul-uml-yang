package org.opendaylight.mwtn.performancemanager.impl;

import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.opendaylight.mwtn.base.netconf.AllPm;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PerformanceManagerTask implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(PerformanceManagerTask.class);
    private static final String LOGMARKER = "PMTick";

    private int tickCounter = 0;

    private final ConcurrentHashMap<String, ONFCoreNetworkElementRepresentation> queue = new ConcurrentHashMap<>();
    private final MicrowaveHistoricalPerformanceWriterService databaseService;
    private final ScheduledExecutorService scheduler;
    private long seconds;

    private ScheduledFuture<?> taskHandle = null;
    private Iterator<ONFCoreNetworkElementRepresentation> neIterator = null;
    private ONFCoreNetworkElementRepresentation actualNE = null;

    /**
     * Constructor of PM Task
     * @param seconds seconds to call PM Task
     * @param databaseService DB Service to load PM data to
     */

    public PerformanceManagerTask(long seconds, MicrowaveHistoricalPerformanceWriterService databaseService) {

        LOG.debug("Init task {}", PerformanceManagerTask.class.getSimpleName());
        this.seconds = seconds;
        this.databaseService = databaseService;
        this.scheduler = Executors.newSingleThreadScheduledExecutor();

    }

    /**
     * Start PM Task
     */
    public void start() {
        LOG.info("PM task created");
        taskHandle = this.scheduler.scheduleAtFixedRate(this, 0, seconds, TimeUnit.SECONDS);
        LOG.info("PM task scheduled");
    }

    /**
     * Stop everything
     */
    public void stop() {
        LOG.info("Stop {}", PerformanceManagerImpl.class.getSimpleName());
        if (taskHandle != null) {
            taskHandle.cancel(true);
            try {
                scheduler.awaitTermination(10, TimeUnit.SECONDS);
             } catch (InterruptedException e) {
                 LOG.warn(e.toString());
             }
        }
    }

    /**
     * Add NE/Mountpoint to PM Processig
     * @param mountPointNodeName to be added
     * @param ne that is connected to the mountpoint
     */
    public void registration(String mountPointNodeName, ONFCoreNetworkElementRepresentation ne) {
    	queue.put(mountPointNodeName, ne);
    }

    /**
     * Remove mountpoint/NE from PM process
     * @param mountPointNodeName that has to be removed
     */
    public void deRegistration(String mountPointNodeName) {
        LOG.debug("Deregister {}",mountPointNodeName);
        ONFCoreNetworkElementRepresentation removedNE = queue.remove(mountPointNodeName);

        if ( removedNE == null) {
            LOG.warn("Couldn't delete {}",mountPointNodeName);
        }
    }


    /*--------------------------------------------------------------
     * Task to read PM data from NE
     */

    /**
     * Task runner to read all performance data from Network Elements.
     * Catch exceptions to make sure, that the Task is not stopped.
     */
    @Override
    public void run() {

        LOG.debug("{} start {} Start with mountpoint {}",LOGMARKER, tickCounter, actualNE == null ? "No NE" : actualNE.getMountPointNodeName());

		//Proceed to next NE/Interface
		getNextInterface();

		LOG.debug("{} {} Next interface to handle {}", LOGMARKER, tickCounter,
		        actualNE == null ? "No NE/IF" : actualNE.getMountPointNodeName() + " " + actualNE.pmStatusToString());

		if (actualNE != null) {
		    try {
		        LOG.debug("{} Start to read PM from NE ({})", LOGMARKER, tickCounter);
		        AllPm allPm = actualNE.getHistoricalPM();
		        LOG.debug("{} {} Got PM list. Start write to DB", LOGMARKER, tickCounter);
		        databaseService.writePM(allPm);
		        LOG.debug("{} {} PM List end.", LOGMARKER, tickCounter);
		    } catch (Exception e) {
		        LOG.warn("{} {} PM read/write failed. Write log entry {}", LOGMARKER, tickCounter, e);
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

		LOG.debug("{} end {}",LOGMARKER, tickCounter);
		tickCounter++;
    }

    /**
     * Reset queue to start from beginning
     */
    private void resetQueue() {
        actualNE = null;
        neIterator = null;
    }

    /**
     * Get then next interface in the list.
     * First try to find a next on the actual NE.
     * If not available search next interface at a NE
     * Special Situations to handle: Empty queue, NEs, but no interfaces
     */
    private void getNextInterface() {
        boolean started = false;
        int loopCounter = 0;

        LOG.debug("{} {} getNextInterface enter. Queue size {} ", LOGMARKER, tickCounter, queue.size());

        if ((actualNE != null) && !queue.containsValue(actualNE)) {
    		LOG.debug("{} {} NE Removed duringprocessing A",LOGMARKER, tickCounter);
        	resetQueue();
        }

        while (true) {

        	if (loopCounter++ >= 1000) {
        		LOG.error("{} {} Problem in PM iteration. endless condition reached", LOGMARKER, tickCounter);
            	resetQueue();
        		break;
        	}

        	LOG.debug("{} {} Loop ne {}:neiterator {}:Interfaceiterator:{} Loop:{}",
        			LOGMARKER,
        			tickCounter,
        			actualNE == null? "null" : actualNE.getMountPointNodeName(),
        			neIterator == null ? "null" : neIterator.hasNext(),
        			actualNE == null ? "null" : actualNE.hasNext(),
        			loopCounter);

        	if (actualNE != null && actualNE.hasNext()) {
        		// Yes, there is an interface, deliver back
        		LOG.debug("{} {} getNextInterface yes A",LOGMARKER, tickCounter);
        		actualNE.next();
        		break;

        	} else {
        		// No element in neInterfaceInterator .. get next NE and try
        		if (neIterator != null && neIterator.hasNext()) {
        			// Set a new NE
        			LOG.debug("{} {} Next NE A",LOGMARKER, tickCounter);
        			actualNE = neIterator.next();
        			actualNE.resetPMIterator();

        		} else {
        			// Goto start condition 1) first entry 2) end of queue reached
        			LOG.debug("{} {} Reset",LOGMARKER, tickCounter);
        			resetQueue();

        			if (queue.isEmpty()) {
        				LOG.debug("{} {} no nextInterfac. queue empty",LOGMARKER, tickCounter);
        				break;
        			} else if (!started){
        				LOG.debug("{} {} getNextInterface start condition. Get interator.",LOGMARKER, tickCounter);
        				neIterator = queue.values().iterator();
        				started = true;
        			} else {
        				LOG.debug("{} {} no nextInterface",LOGMARKER, tickCounter);
        				break;
        			}
        		}
        	}
        } //while

        if ((actualNE != null) && !queue.containsValue(actualNE)) {
    		LOG.debug("{} {} NE Removed duringprocessing B",LOGMARKER, tickCounter);
        	resetQueue();
        }

    }
}
