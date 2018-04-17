package org.opendaylight.mwtn.ecompConnector.impl;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.opendaylight.mwtn.config.impl.EcompConfig;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class EcompProviderClient {

    private static final Logger LOG = LoggerFactory.getLogger(EcompProviderClient.class);


    @SuppressWarnings("unused")
    private final ScheduledFuture<?> taskHandle;
    private final ScheduledExecutorService scheduler;

    private final EcompConfig configuration;
    private final EcompSenderImpl ecompClient;
    private final EcompMessages ecompMessages;

    public EcompProviderClient(EcompConfig config) {

        this.configuration = config;

        //Start services
        LOG.info("Configuration: "+configuration);
        ecompClient = new EcompSenderImpl(configuration.getEventReveicerUrl(), configuration.getUserCredentials(),configuration.isTestCollectorYes());
        ecompMessages = new EcompMessages(configuration.getSourceId(), ecompClient);

        //Activate task

        LOG.info("Create Fault manager client Task");
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        Runnable task = new EcompProviderTask(ecompMessages);
        LOG.info("Fault task created with "+configuration.getTimerPeriodSeconds()+" Seconds");
        this.taskHandle = this.scheduler.scheduleAtFixedRate(task, 0, configuration.getTimerPeriodSeconds(), TimeUnit.SECONDS);
        LOG.info("Fault task scheduled");
    }

    public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification) {
        LOG.debug("Notification answer: {}", ecompMessages.postNotification(mountPointName, notification));
    }

    /* ---------------------------------------------------------
     * Private
     */



}



