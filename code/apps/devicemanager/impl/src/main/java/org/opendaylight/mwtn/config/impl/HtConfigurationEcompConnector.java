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

    public static final String ESDATATYPENAME = "database";
    private static final String EMPTY = "empty";

    private static final String FILECONTENTTEMPLATE = "#Properties for ecompConnector of devicemanager\n" +
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
            "sourceId=de305d54-75b4-431b-adb2-eb6b9e546014\n";


    private String eventReceiverUrl=EMPTY;
    private String userCredentials=EMPTY;
    private String sourceId = EMPTY;
    private String testCollector = EMPTY;

    public HtConfigurationEcompConnector() {
    }

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

    @Override
    public String toString() {
        return "HtConfigurationEcompConnector [eventReceiverUrl=" + eventReceiverUrl + ", userCredentials="
                + userCredentials + ", sourceId=" + sourceId + ", testCollector=" + testCollector + "]";
    }

    public static @Nullable HtConfigurationEcompConnector readConfigurationFromFile(String fileName) {

        HtConfigurationEcompConnector fileConfiguration = null;

        try {
            Properties properties = new Properties();
            File file = new File(fileName);
            FileInputStream fileInput;

            fileInput = new FileInputStream(file);
            properties.load(fileInput);
            fileInput.close();

            fileConfiguration = new HtConfigurationEcompConnector();
            fileConfiguration.setUserCredentials(properties.getProperty("userCredentials"));
            fileConfiguration.setEventReceiverUrl(properties.getProperty("eventReceiverUrl"));
            fileConfiguration.setSourceId(properties.getProperty("sourceId"));
            fileConfiguration.setTestCollector(properties.getProperty("testCollector"));
        } catch (Exception e) {
            LOG.warn("(..something..) failed", e);
        }

        return fileConfiguration;
    }

    public static String createDefaultConfigurationFromFile( String filename ) {
        try{
            PrintWriter writer = new PrintWriter(filename, "UTF-8");
            writer.print(FILECONTENTTEMPLATE);
            writer.close();
            return "Created: "+filename;
        } catch (IOException e) {
            return "Couldn't write file "+filename+" with reason: "+e.getMessage();
        }
    }


}
