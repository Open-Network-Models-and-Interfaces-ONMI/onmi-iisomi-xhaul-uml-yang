package org.opendaylight.mwtn.performancemanager.impl;

import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PerformanceManagerImpl {

    private static final Logger LOG = LoggerFactory.getLogger(PerformanceManagerImpl.class);

    private final ConcurrentLinkedQueue<ONFCoreNetworkElementRepresentation> queue = new ConcurrentLinkedQueue<>();
    private final ScheduledFuture<?> taskHandle;
    private final ScheduledExecutorService scheduler;

    public PerformanceManagerImpl(long seconds, MicrowaveHistoricalPerformanceWriterService databaseService) {

        LOG.info("Construct begin {} with {} Seconds",PerformanceManagerImpl.class.getSimpleName(), seconds);

        if (MicrowaveHistoricalPerformanceWriterService.isAvailable(databaseService)) {

            LOG.info("Do start of PM task");
            this.scheduler = Executors.newSingleThreadScheduledExecutor();

            //Runnable task = new PerformanceManagerTask(queue, databaseService);
            Runnable task = new PerformanceManagerTask(queue, databaseService);
            LOG.info("PM task created");
            taskHandle = this.scheduler.scheduleAtFixedRate(task, 0, seconds, TimeUnit.SECONDS);
            LOG.info("PM task scheduled");


        } else {
            taskHandle = null;
            scheduler = null;
            LOG.info("Database not available. Do not start PM task");
        }

        LOG.info("Construct end {}",PerformanceManagerImpl.class.getSimpleName());
    }

    public void close() {
        LOG.info("Close {}", PerformanceManagerImpl.class.getSimpleName());
        if (taskHandle != null) {
            taskHandle.cancel(true);
        }

        try {
           scheduler.awaitTermination(10, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            LOG.warn(e.toString());
        }

    }

    public void registration(String mountPointNodeName, ONFCoreNetworkElementRepresentation ne) {
        LOG.debug("Register {}",mountPointNodeName);
        queue.add(ne);
    }

    public void deRegistration(String mountPointNodeName) {
        LOG.debug("Deregister {}",mountPointNodeName);
        for (ONFCoreNetworkElementRepresentation ne : queue) {
            if (ne.getMountPointNodeName().equals(mountPointNodeName)) {
                 queue.remove(ne);
                 LOG.debug("Deleted {}",mountPointNodeName);
                 return;
            }
        }
        LOG.warn("Couldn't delete {}",mountPointNodeName);
    }

}
