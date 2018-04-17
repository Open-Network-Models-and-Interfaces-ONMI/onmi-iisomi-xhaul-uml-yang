/**
 * Client for ECOMP notification server
 *
 * Reference: @link http://stackoverflow.com/questions/13022717/java-and-https-url-connection-without-downloading-certificate
 *
 * @author herbert
 */
package org.opendaylight.mwtn.ecompConnector.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.Base64;
import javax.annotation.Nullable;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EcompSenderImpl implements EcompSender {

    private static final Logger LOG = LoggerFactory.getLogger(EcompSenderImpl.class);
    private static String EMPTY = "";
    private static final String charset = "UTF-8";


    private final String urlString;
    @SuppressWarnings("unused")
	private final boolean isTestCollectorYes;
    private final String basicAuth;

    private URL url = null;
    private URLConnection connection = null;

    public EcompSenderImpl( String url, String userCredentials, boolean isTestCollectorYes)  {

        this.urlString = url;
        this.isTestCollectorYes = isTestCollectorYes;
        this.basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

        if (urlString != null && !urlString.equals("off")) {
        	try {
        		this.url = new URL(url);
        		setupSshTrustAll();
        	} catch (MalformedURLException | KeyManagementException | NoSuchAlgorithmException e) {
        		LOG.warn("ssh setup failed", e);
        	}
        }
        LOG.info("EcompSenderImpl setup ends");
    }

    /**
     * Send message to ECOMP Server
     * @param body for POST message
     */
    @Override
    public String sendEcompPost(String body) {

        if (url != null) {
        	LOG.trace(body);
            try {
                connection = openConnection(url, basicAuth, true);
                if (connection != null) {
                	String response=processPost(connection, body);
                    LOG.trace( "Response {}: ",String.valueOf(response) );
                    return response;
                }
            } catch (IOException e) {
                LOG.warn("Ecomp post failed", e.getMessage());
            }
        }
        return EMPTY;
    }

    /**
     * Connect to Server and expect answer.
     * @return with answer body
     */
    public String testConnectServer() {

       if (url != null) {
            try {
                connection = openConnection(url, null, false);
                if (connection != null) {
                    return receiveInitialAnswer(connection);
                }
            } catch (IOException e) {
                LOG.warn("Ecomp post failed", e.getMessage());
            }
        }
        return EMPTY;
    }

    /**
     * Show status in presentable form
     * @return String with result
     */
    public String getStatusAsString() {
        StringBuffer sb = new StringBuffer();

        sb.append("URL: "+ url.getPath() +" "+ url.getPort() + " Host: "+ url.getHost());
        sb.append("\n");
        if (connection != null) {
            sb.append("Connection setup: "+connection.getClass().getName()+" ");
         } else {
            sb.append("Connection setup: No connection (server problem or switched off)");
        }
        return sb.toString();

    }


    /*------------------------------------------------------------------------------
     * Private functions
     */


    /**
     * Send Post and wait for answer
     * @param connection
     * @param body
     * @return
     * @throws IOException
     */
    private static String processPost( URLConnection connection, String body ) throws IOException {

        LOG.trace("Start send to {} ", connection.getURL().toString());

        //Send the message to destination
        try (OutputStream output = connection.getOutputStream()) {
            output.write(body.getBytes(charset));
        }

        //Receive answer
        StringBuilder result = new StringBuilder();
        InputStream response = connection.getInputStream();

        BufferedReader rd = new BufferedReader(new InputStreamReader(response));
        String line;
        while ((line = rd.readLine()) != null) {
           result.append(line);
        }
        rd.close();
        return result.toString();
    }



    /**
     * Setup a connection to URL with authorization header
     * @param url e.g. "https://plan.fritz.box:9092/ux/#" or "
     * @param autorization header like "Basic SGVyYmVydDpIZXJiZXJ0"
     * @return Null in case of error or the URLConnection
     * @throws IOException
     * @throws MalformedURLException
     */
    private static @Nullable URLConnection openConnection( URL url, String basicAuth, boolean insertContentHeader ) throws MalformedURLException, IOException {

        LOG.info("Setup connection to {} ", url.getPath());

        //Prepare the connection
        URLConnection newConnection = url.openConnection();

        newConnection.setDoOutput(true); // Triggers POST.
        newConnection.setRequestProperty("Accept-Charset", charset);
        if (basicAuth != null) {
            newConnection.setRequestProperty("Authorization", basicAuth);
        }
        if (insertContentHeader) {
            newConnection.setRequestProperty("Content-Type", "application/json;charset=" + charset);
        }

        return newConnection;
    }

    /**
     * Read initial answer from Server after connect
     * @param connection that was opened
     * @return String with answer message
     * @throws IOException
     */
    private static String receiveInitialAnswer(URLConnection iConnection) throws IOException {


        final StringBuffer response = new StringBuffer();

        if (iConnection != null) {

            final Reader reader = new InputStreamReader(iConnection.getInputStream());
            final BufferedReader br = new BufferedReader(reader);
            String line = "";
            while ((line = br.readLine()) != null) {
                response.append(line);
                response.append("\n");
            }
            br.close();
        }

        return response.toString();
    }


    /**
     * Setup SSH subsystem environment to accept all certificates that are presented by the server
     * Risk: Should be used only in secure environments
     *
     * @throws NoSuchAlgorithmException
     * @throws KeyManagementException
     */
    private static void setupSshTrustAll() throws NoSuchAlgorithmException, KeyManagementException {
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
        final SSLContext sc = SSLContext.getInstance("SSL");
        sc.init(null, trustAllCerts, new java.security.SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = (hostname, session) -> true;

        // Install the all-trusting host verifier
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
    }
}
