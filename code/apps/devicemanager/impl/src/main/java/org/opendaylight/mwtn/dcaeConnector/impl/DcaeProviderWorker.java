package org.opendaylight.mwtn.dcaeConnector.impl;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import org.opendaylight.mwtn.config.impl.DcaeConfig;
import org.opendaylight.mwtn.devicemanager.impl.DeviceManagerImpl;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class DcaeProviderWorker implements AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(DcaeProviderWorker.class);

    private static final int MIN_HEARTBEAT_TIME_SECONDS = 30;

    private final ScheduledExecutorService scheduler;
    private final DcaeSenderImpl dcaepClient;
    private final DcaeMessages dcaeMessages;
    private final ScheduledFuture<?> taskReference;

    public DcaeProviderWorker(DcaeConfig configuration, String entityName, DeviceManagerImpl deviceManager) {

        //Start services
        LOG.info("Configuration: "+configuration);
        int heartbeatSeconds = configuration.getTimerPeriodSeconds();
        if ( heartbeatSeconds < MIN_HEARTBEAT_TIME_SECONDS ) {
            heartbeatSeconds = MIN_HEARTBEAT_TIME_SECONDS;
            LOG.info("Adjust heartbeat intervall to minimum of { } seconds.",heartbeatSeconds);
        }

        dcaepClient = new DcaeSenderImpl(configuration.getEventReveicerUrl(), configuration.getUserCredentials());
        dcaeMessages = new DcaeMessages(dcaepClient, entityName, heartbeatSeconds, deviceManager);

        //Activate task
        LOG.info("Create Fault manager client Task");
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        Runnable task = new DcaeProviderTask(dcaeMessages);

        LOG.info("Fault task created with "+heartbeatSeconds+" Seconds");
        this.taskReference = this.scheduler.scheduleAtFixedRate(task, 0, heartbeatSeconds, TimeUnit.SECONDS);
        LOG.info("Fault task scheduled");
    }

    public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification) {
        LOG.debug("Notification answer: {}", dcaeMessages.postNotification(mountPointName, notification));
    }

    @Override
    public void close() {
        this.taskReference.cancel(false);
        try {
            this.scheduler.shutdown();
            this.scheduler.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException | SecurityException e) {
            LOG.debug("Schedler shutdown interrupted with exception: ",e);
        }
    }


}
