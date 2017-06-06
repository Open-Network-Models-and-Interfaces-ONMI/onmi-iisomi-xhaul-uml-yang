package org.opendaylight.mwtn.ecompConnector.impl;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import org.opendaylight.mwtn.config.impl.HtConfigurationEcompConnector;
import org.opendaylight.mwtn.config.impl.HtDatabaseConfigService;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class EventProviderClient {

    private static final Logger LOG = LoggerFactory.getLogger(EventProviderClient.class);

    private static final String CONFIGURATIONID = "org.opendaylight.mwtn.eventprovider";
    private static final String CONFIGURATIONFILE = "etc/eventprovider.properties";
    private static final int TIMEPERIODSECONDS = 30;



    @SuppressWarnings("unused")
    private final ScheduledFuture<?> taskHandle;
    private final ScheduledExecutorService scheduler;

    //private static final String EVENTRECEIVERURL = "http://127.0.0.1:30000/eventListener/v3";
    private HtConfigurationEcompConnector configuration = new HtConfigurationEcompConnector(); //Default empty configuration
    private HtDatabaseConfigService configurationService = null;
    private final EcompSenderImpl ecompClient;
    private final EcompMessages ecompMessages;

    public EventProviderClient(HtDatabaseConfigService configurationService) {

        //Get configuration
        this.configuration = HtConfigurationEcompConnector.readConfigurationFromFile(CONFIGURATIONFILE);
        if (configuration != null) {
            LOG.info("Got configuration from File");
        } else if (configurationService != null) {
            this.configurationService = configurationService;
            this.configuration = readConfigurationFromDB();
        }
        if (configuration == null) {
            LOG.info("Create defaultconfiguration file"+CONFIGURATIONFILE);

            this.configuration = new HtConfigurationEcompConnector();
            configuration.setEventReceiverUrl("http://127.0.0.1:30000/eventListener/v3");
            configuration.setUserCredentials("admin:admin");
            configuration.setSourceId("id-not-set");
        }

        //Start services
        LOG.info("Configuration: "+configuration);
        ecompClient = new EcompSenderImpl(configuration.getEventReveicerUrl(), configuration.getUserCredentials(),configuration.isTestCollectorYes());
        ecompMessages = new EcompMessages(configuration.getSourceId(), ecompClient);

        //Activate task

        LOG.info("Create Fault manager client Task");
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        Runnable task = new EventProviderTask(ecompMessages);
        LOG.info("Fault task created with "+TIMEPERIODSECONDS+" Seconds");
        this.taskHandle = this.scheduler.scheduleAtFixedRate(task, 0, TIMEPERIODSECONDS, TimeUnit.SECONDS);
        LOG.info("Fault task scheduled");
    }

    public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification) {
        LOG.debug("Notification answer: {}", ecompMessages.postNotification(mountPointName, notification));
    }

    /* ---------------------------------------------------------
     * Private
     */


    private HtConfigurationEcompConnector readConfigurationFromDB() {

        if (configurationService == null) {
            LOG.info("No configuration database Service available");
        } else {
            HtConfigurationEcompConnector newConfiguration = configurationService.getHtConfigurationEcompConnector(CONFIGURATIONID);
            if (newConfiguration != null) {
                return newConfiguration;
            }
        }
        return null;
    }

}



