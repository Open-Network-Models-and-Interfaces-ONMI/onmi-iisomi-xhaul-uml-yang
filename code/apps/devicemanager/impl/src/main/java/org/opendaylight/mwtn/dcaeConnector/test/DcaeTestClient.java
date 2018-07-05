/**
 *
 * @author herbert
 *
 */
package org.opendaylight.mwtn.dcaeConnector.test;

import org.opendaylight.mwtn.config.impl.DcaeConfig;
import org.opendaylight.mwtn.dcaeConnector.impl.DcaeMessages;
import org.opendaylight.mwtn.dcaeConnector.impl.DcaeSenderImpl;

public class DcaeTestClient {

    private static final boolean TESTCOLLECTOR_YES = true;

	public static void main(String[] args) {

        System.out.println("Test program to verify DCAE https connectivity");

        //Get configuration
        DcaeConfig configuration = DcaeConfig.getDefaultConfiguration();

        if (configuration != null) {

            //Start services
            System.out.println("Configuration: "+configuration);

            DcaeSenderImpl dcaeClient = new DcaeSenderImpl(configuration.getEventReveicerUrl(), configuration.getUserCredentials());

            if (TESTCOLLECTOR_YES) {
                System.out.println("Connect to testclient and send notifications");

                DcaeMessages dcaeMessages = new DcaeMessages(dcaeClient, "ControllerName", 31, null);

                for (int t=0; t < 2; t++) {
                    try {
                        Thread.sleep(1000);                 //1000 milliseconds is one second.
                    } catch(InterruptedException ex) {
                        Thread.currentThread().interrupt();
                    }
                    System.out.println(t+". Send notification and receive answer message");
                    System.out.println("Heartbeat message: "+dcaeMessages.postHeartBeat());
                    System.out.println("Status of ECOMP Client: "+dcaeClient.getStatusAsString());
                }

            } else {

                System.out.println("Connect to server and receive initial answer.");
                System.out.println("Message: "+dcaeClient.testConnectServer());

            }

        }
   }

}
