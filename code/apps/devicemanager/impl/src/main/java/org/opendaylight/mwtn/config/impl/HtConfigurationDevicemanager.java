package org.opendaylight.mwtn.config.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;
import javax.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HtConfigurationDevicemanager {

    private static final Logger LOG = LoggerFactory.getLogger(HtConfigurationDevicemanager.class);

    private static final String CONFIGURATIONFILE = "etc/devicemanager.properties";
    private static final String FILECONTENTTEMPLATE =
            "#Properties for devicemanager\n" +
            "#Add parameters without additional spaces after equal sign.\n" +
            "\n" +
            "#Switch on/off performance manager service\n" +
            "performanceManagerEnabled=true\n" +
            "#performanceManagerEnabled=false\n"
            ;

    private boolean performanceManagerEnabled;

    /**
     * @return the performanceManagerEnabled
     */
    public boolean isPerformanceManagerEnabled() {
        return performanceManagerEnabled;
    }

    /**
     * @param performanceManagerEnabled the performanceManagerEnabled to set
     */
    public void setPerformanceManagerEnabled(boolean performanceManagerEnabled) {
        this.performanceManagerEnabled = performanceManagerEnabled;
    }

    /*
     * Print and read
     */

    @Override
    public String toString() {
        return "HtConfigurationDevicemanager [performanceManagerEnabled=" + performanceManagerEnabled + "]";
    }

    /**
     * Get configuration for the service
     * @return HtConfigurationEcompConnector with configuration information
     */
    public static HtConfigurationDevicemanager getConfiguration() {

        HtConfigurationDevicemanager configuration;

        configuration = HtConfigurationDevicemanager.readConfigurationFromFile(CONFIGURATIONFILE);
        if (configuration != null) {
            LOG.info("Got configuration from File");

        }

        if (configuration == null) {
            LOG.info("Use defaultconfigurtion and create default configuration file"+CONFIGURATIONFILE);
            createDefaultConfigurationFromFile(CONFIGURATIONFILE);
            configuration = HtConfigurationDevicemanager.readConfigurationFromFile(CONFIGURATIONFILE);
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
    private static @Nullable HtConfigurationDevicemanager readConfigurationFromFile(String fileName) {

        HtConfigurationDevicemanager fileConfiguration = null;

        try {
            Properties properties = new Properties();
            File file = new File(fileName);

            if (file.exists()) {
                FileInputStream fileInput;

                fileInput = new FileInputStream(file);
                properties.load(fileInput);
                fileInput.close();

                fileConfiguration = new HtConfigurationDevicemanager();
                fileConfiguration.setPerformanceManagerEnabled(properties.getProperty("performanceManagerEnabled","true").toLowerCase().equals("true"));
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

}
