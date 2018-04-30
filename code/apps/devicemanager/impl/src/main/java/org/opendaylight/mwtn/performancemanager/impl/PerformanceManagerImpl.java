package org.opendaylight.mwtn.performancemanager.impl;

import javax.annotation.Nullable;

import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PerformanceManagerImpl implements AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(PerformanceManagerImpl.class);

    private @Nullable PerformanceManagerTask task;

    public PerformanceManagerImpl(long seconds, MicrowaveHistoricalPerformanceWriterService databaseService) {

        LOG.info("Construct begin {} with {} Seconds",PerformanceManagerImpl.class.getSimpleName(), seconds);

        if (MicrowaveHistoricalPerformanceWriterService.isAvailable(databaseService)) {

            LOG.info("Do start of PM task");
            task = new PerformanceManagerTask(seconds, databaseService);
            task.start();
            LOG.info("PM task scheduled");

        } else {
            LOG.info("Database not available. Do not start PM task");
        }

        LOG.info("Construct end {}",PerformanceManagerImpl.class.getSimpleName());
    }

    public void close() {
        LOG.info("Close {}", PerformanceManagerImpl.class.getSimpleName());
        if (task != null) {
            task.stop();
        }
    }

    public void registration(String mountPointNodeName, ONFCoreNetworkElementRepresentation ne) {
        LOG.debug("Register {}",mountPointNodeName);
        if (task != null)
        	task.registration(mountPointNodeName, ne);
    }

    public void deRegistration(String mountPointNodeName) {
        LOG.debug("Deregister {}",mountPointNodeName);
        if (task != null)
        	task.deRegistration(mountPointNodeName);
    }

}
