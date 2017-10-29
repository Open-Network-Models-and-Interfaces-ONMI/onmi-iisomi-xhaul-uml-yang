package org.opendaylight.mwtn.config.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;
import javax.annotation.Nullable;
import org.opendaylight.mwtn.base.database.EsObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HtConfigurationEcompConnector extends EsObject {

    private static final Logger LOG = LoggerFactory.getLogger(HtConfigurationEcompConnector.class);

    private static final String CONFIGURATIONID = "org.opendaylight.mwtn.eventprovider";
    private static final String CONFIGURATIONFILE = "etc/eventprovider.properties";
    private static final int TIMEPERIODSECONDS = 30;

    public static final String ESDATATYPENAME = "database";
    private static final String EMPTY = "empty";

    private static final String FILECONTENTTEMPLATE =
            "#Properties for ecompConnector of devicemanager\n" +
            "#Add parameters without additional spaces after equal sign.\n" +
            "\n" +
            "#Full URL of the receiver of all notifications\n" +
            "#URL to local installed testclient\n" +
            "#eventReceiverUrl=http://127.0.0.1:30000/eventListener/v3\n" +
            "#If there is no receiver available switched of with the off configuration\n" +
            "eventReceiverUrl=off\n" +
            "\n" +
            "#Destination testcollector. Prevent getting intial answer after connect. (yes or no).\n" +
            "testCollector=yes\n" +
            "#testCollector=no\n" +
            "\n" +
            "#userCredentials in the form=username:password\n" +
            "userCredentials=admin:admin\n" +
            "\n" +
            "#SourceId as used in the messages\n" +
            "sourceId=de305d54-75b4-431b-adb2-eb6b9e546014\n" +
            "\n" +
            "#heartBeat Time in seconds\n" +
            "timerPeriodSeconds=30\n";

    private String eventReceiverUrl=EMPTY;
    private String userCredentials=EMPTY;
    private String sourceId = EMPTY;
    private String testCollector = EMPTY;
    private Integer timerPeriodSeconds = TIMEPERIODSECONDS;

    /*
     * Constructor
     */

    public HtConfigurationEcompConnector() {
    }

    /*
     * Setter
     */

    public void setEventReceiverUrl(String eventReveicerUrl) {
        this.eventReceiverUrl = eventReveicerUrl;
    }

    public void setUserCredentials(String userCredentials) {
        this.userCredentials = userCredentials;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public void setTestCollector(String testCollector) {
        this.testCollector = testCollector;
    }

     public void setTimerPeriodSeconds(Integer timerPeriodSeconds) {
        this.timerPeriodSeconds = timerPeriodSeconds;
    }

    /*
     * Getter
     */

    public String getEventReveicerUrl() {
        return eventReceiverUrl;
    }

    public String getUserCredentials() {
        return userCredentials;
    }

    public String getSourceId() {
        return sourceId;
    }

    public boolean isTestCollectorYes() {
        return testCollector.equals("yes");
    }

    public Integer getTimerPeriodSeconds() {
        return timerPeriodSeconds;
    }

    /*
     * Print and read
     */

    @Override
    public String toString() {
        return "HtConfigurationEcompConnector [eventReceiverUrl=" + eventReceiverUrl + ", userCredentials="
                + userCredentials + ", sourceId=" + sourceId + ", testCollector=" + testCollector
                + ", timerPeriodSeconds=" + timerPeriodSeconds + "]";
    }

    /**
     * Get configuration for the service
     * @param configurationService Access to DB configuration section
     * @return HtConfigurationEcompConnector with configuration information
     */
    public static HtConfigurationEcompConnector getConfiguration(HtDatabaseConfigService configurationService) {

        HtConfigurationEcompConnector configuration;

        configuration = HtConfigurationEcompConnector.readConfigurationFromFile(CONFIGURATIONFILE);
        if (configuration != null) {
            LOG.info("Got configuration from File");

        } else if (configurationService != null) {
            configuration = readConfigurationFromDB(configurationService);
        }

        if (configuration == null) {
            LOG.info("Use defaultconfigurtion and create default configuration file"+CONFIGURATIONFILE);
            createDefaultConfigurationFromFile(CONFIGURATIONFILE);
            configuration = HtConfigurationEcompConnector.readConfigurationFromFile(CONFIGURATIONFILE);
        }

        if (configuration == null) {
            throw new IllegalArgumentException("No configuration available.");
        }
        return configuration;
    }

    /**
     * Read configuration from FILE
     * @param fileName of configuration file
     * @return HtConfigurationEcompConnector
     */
    public static @Nullable HtConfigurationEcompConnector readConfigurationFromFile(String fileName) {

        HtConfigurationEcompConnector fileConfiguration = null;

        try {
            Properties properties = new Properties();
            File file = new File(fileName);

            if (file.exists()) {
                FileInputStream fileInput;

                fileInput = new FileInputStream(file);
                properties.load(fileInput);
                fileInput.close();

                fileConfiguration = new HtConfigurationEcompConnector();
                fileConfiguration.setUserCredentials(properties.getProperty("userCredentials"));
                fileConfiguration.setEventReceiverUrl(properties.getProperty("eventReceiverUrl"));
                fileConfiguration.setSourceId(properties.getProperty("sourceId"));
                fileConfiguration.setTestCollector(properties.getProperty("testCollector"));

                int timerPeriodSeconds;
                try {
                    timerPeriodSeconds = Integer.valueOf(properties.getProperty("timerPeriodSeconds"));
                } catch (Exception e) {
                    timerPeriodSeconds = TIMEPERIODSECONDS;
                }
                fileConfiguration.setTimerPeriodSeconds(timerPeriodSeconds);
            }
        } catch (Exception e) {
            LOG.warn("(..something..) failed", e);
        }

        return fileConfiguration;
    }

    /**
     * Create a file with configuration information
     * @param filename of config file
     */
    private static void createDefaultConfigurationFromFile( String filename ) {
        try{
            PrintWriter writer = new PrintWriter(filename, "UTF-8");
            writer.print(FILECONTENTTEMPLATE);
            writer.close();
            LOG.info("Created: "+filename);
        } catch (IOException e) {
            LOG.warn("Couldn't write configuration file "+filename+" with reason: "+e.getMessage());
        }
    }

    /**
     * Read configuration from database
     * @param configurationService to access the config part of the database
     * @return HtConfigurationEcompConnector
     */
    private static @Nullable HtConfigurationEcompConnector readConfigurationFromDB(HtDatabaseConfigService configurationService) {

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
