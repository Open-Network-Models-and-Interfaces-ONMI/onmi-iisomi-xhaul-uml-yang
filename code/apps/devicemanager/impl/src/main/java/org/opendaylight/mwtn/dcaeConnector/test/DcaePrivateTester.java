/**
 *
 */
package org.opendaylight.mwtn.dcaeConnector.test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.net.URLConnection;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

/**
 * @author herbert
 *
 */
public class DcaePrivateTester {


    public static void test(URL url, boolean readFromServer) throws Exception {
        // Create a trust manager that does not validate certificate chains
        TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
            @Override
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return null;
            }
            @Override
            public void checkClientTrusted(X509Certificate[] certs, String authType) {
            }
            @Override
            public void checkServerTrusted(X509Certificate[] certs, String authType) {
            }
        } };
        // Install the all-trusting trust manager
        final SSLContext sc = SSLContext.getInstance("TLS");
        sc.init(null, trustAllCerts, new java.security.SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = (hostname, session) -> true;

        // Install the all-trusting host verifier
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);

        //URL url = new URL("https://www.google.com");
        URLConnection con = url.openConnection();
        System.out.println("Connection background: "+con.getClass().getName()+" "+url.getHost());

        if (readFromServer) {
            final Reader reader = new InputStreamReader(con.getInputStream());
            final BufferedReader br = new BufferedReader(reader);
            String line = "";
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
            br.close();
        } /**/
    } // End of main



//    httpTestUrl=https://plan.fritz.box:9092/ux/#
//    keyStore=etc/clientkeystore
//    keyStorePassword=daylight2016
    public static void main(String[] args) {

        String urlString = "https://www.google.de";
        //String urlString = "https://plan.fritz.box:9092/ux/#";
        //String urlString = "http://plan.fritz.box:9091/ux/#";
        //String urlString = "http://127.0.0.1:30000/eventListener/v3";

        try {
            test(new URL(urlString), true);
        } catch (Exception e) {
            System.out.println("(..something..) failed");
            e.printStackTrace();
        }
        /*
        System.out.println("Test HTTPS");

        final HttpsClient httpTestClient;
        httpTestClient = new HttpsClient();

        httpTestClient.testIt(
                //"https://plan.fritz.box:9092/ux/#",
                "https://www.google.de",
                "/home/herbert/odl/distribution-karaf-0.5.1-Boron-SR1/etc/clientkeystore",
                "daylight2016"
        );/**/

    }

}
