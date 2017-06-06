/**
 *
 * @author herbert
 *
 */
package org.opendaylight.mwtn.ecompConnector.test;

import org.opendaylight.mwtn.config.impl.HtConfigurationEcompConnector;
import org.opendaylight.mwtn.ecompConnector.impl.EcompMessages;
import org.opendaylight.mwtn.ecompConnector.impl.EcompSenderImpl;

public class EcompTestClient {

    private static final String CONFIGURATIONFILE = "eventprovider.properties";

    public static void main(String[] args) {

        System.out.println("Test program to verify ECOMP https connectivity");

        //Get configuration
        HtConfigurationEcompConnector configuration = HtConfigurationEcompConnector.readConfigurationFromFile(CONFIGURATIONFILE);
        if (configuration != null) {

            //Start services
            System.out.println("Configuration: "+configuration);

            EcompSenderImpl ecompClient = new EcompSenderImpl(configuration.getEventReveicerUrl(), configuration.getUserCredentials(), configuration.isTestCollectorYes());

            if (configuration.isTestCollectorYes()) {
                System.out.println("Connect to testclient and send notifications");

                EcompMessages ecompMessages = new EcompMessages(configuration.getSourceId(), ecompClient);

                for (int t=0; t < 2; t++) {
                    try {
                        Thread.sleep(1000);                 //1000 milliseconds is one second.
                    } catch(InterruptedException ex) {
                        Thread.currentThread().interrupt();
                    }
                    System.out.println(t+". Send notification and receive answer message");
                    System.out.println("Heartbeat message: "+ecompMessages.postHeartBeat());
                    System.out.println("Status of ECOMP Client: "+ecompClient.getStatusAsString());
                }

            } else {

                System.out.println("Connect to server and receive initial answer.");
                System.out.println("Message: "+ecompClient.testConnectServer());

            }

        } else {

            //File missing
            System.out.println("Configuration file "+CONFIGURATIONFILE+" is missing. Create a new one ....");

            HtConfigurationEcompConnector.createDefaultConfigurationFromFile(CONFIGURATIONFILE);
        }
    }

}
