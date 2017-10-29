/**
 * Client for AOTS-M Ticket server
 *
 * Reference: @link http://stackoverflow.com/questions/13022717/java-and-https-url-connection-without-downloading-certificate
 *
 * @author herbert
 */
package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import javax.annotation.Nullable;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AotsMSenderImpl implements AotsMSender {

    private static final Logger LOG = LoggerFactory.getLogger(AotsMSenderImpl.class);
    private static String EMPTY = "";
    private static final String charset = "UTF-8";
	private static final int DEFAULT_TIMEOUT = 10;


    private final String urlString;
    private final String basicAuth;

    private URL mUrl = null;
    private URLConnection connection = null;
    private final int httpTimeout;
    private static SSLContext sc;
    public AotsMSenderImpl( String url, String httpUserCredentials)  {
    	this(url,httpUserCredentials,DEFAULT_TIMEOUT);
    }

    public AotsMSenderImpl( String url, String httpUserCredentials,int timeout)  {

        this.urlString = url;
        this.httpTimeout = timeout;
        this.basicAuth = "Basic " + new String(Base64.getEncoder().encode(httpUserCredentials.getBytes()));
        try {
            setupSslTrustAll();
        } catch (KeyManagementException | NoSuchAlgorithmException e) {
            LOG.warn("(..something..) failed", e);
        }

        if (urlString != null && !urlString.equals("off")) {
            try {
                this.mUrl = new URL(url);
            } catch (MalformedURLException e1) {
                LOG.warn("(..something..) failed", e1);
                this.mUrl=null;
            }
        }
        else
        	this.mUrl=null;

        LOG.info(String.format("AotsMSenderImpl intiated(url:%s",this.mUrl==null?"off":url));
    }

    /**
     * Send message to SOAP Server
     * @param body for POST message
     */
    @Override
    public String sendAotsMPost(String body) {

        if (mUrl != null) {
            try {
                connection = openConnection(mUrl, basicAuth, true);
                if (connection != null) {
                	connection.setConnectTimeout(this.httpTimeout*1000);
                    return processPost((HttpURLConnection) connection, body);
                }
            } catch (IOException e) {
                LOG.warn("AotsM post failed:"+ e.getMessage());
            }
        }
        return EMPTY;
    }

    /**
     * Connect to Server and expect answer.
     * @return with answer body
     */
    public String testConnectServer() {

       if (mUrl != null) {
            try {
                connection = openConnection(mUrl, null, false);
                if (connection != null) {
                    return receiveInitialAnswer(connection);
                }
            } catch (IOException e) {
                LOG.warn("AotsM post failed: "+e.getMessage());
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

        sb.append("URL: "+ mUrl.getPath() +" "+ mUrl.getPort() + " Host: "+ mUrl.getHost());
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
    private static String processPost( HttpURLConnection connection, String body ) throws IOException {

        LOG.debug("Start send to "+ connection.getURL().toString());

        //Send the message to destination
        try (OutputStream output = connection.getOutputStream()) {
            output.write(body.getBytes(charset));
        }

        int responseCode=connection.getResponseCode();
        LOG.debug("responseCode="+responseCode);
        //Receive answer
        StringBuilder result = new StringBuilder();
        InputStream response;
        if(responseCode>=200 && responseCode < 300)
        	response=connection.getInputStream();
        else
        	response=connection.getErrorStream();

        BufferedReader rd = new BufferedReader(new InputStreamReader(response));
        String line;
        while ((line = rd.readLine()) != null) {
           result.append(line);
        }
        rd.close();
        LOG.debug("response="+result.toString());
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

        LOG.info("Setup connection to "+ url.toString());

        //Prepare the connection
        URLConnection http = url.openConnection();
        if(url.toString().startsWith("https"))
        {
	        ((HttpsURLConnection)http).setSSLSocketFactory(sc.getSocketFactory());
        }


        http.setDoOutput(true); // Triggers POST.
        if (basicAuth != null) {
        	http.setRequestProperty("Authorization", basicAuth);
        }
        http.setRequestProperty("Accept-Charset", charset);
    	http.setRequestProperty("Accept", "text/xml");
        http.setRequestProperty("Content-Type", "text/xml;charset=" + charset);
       	http.setRequestProperty("SOAPAction", "\"\"");
       	((HttpURLConnection) http).setRequestMethod("POST");
        return http;
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
     *
     * @throws NoSuchAlgorithmException
     * @throws KeyManagementException
     */
    private static void setupSslTrustAll() throws NoSuchAlgorithmException, KeyManagementException {

    	sc = SSLContext.getInstance("TLSv1.2");
		 TrustManager[] trustCerts = null;
		// Init the SSLContext with a TrustManager[] and SecureRandom()
		 sc.init(null, trustCerts, new java.security.SecureRandom());

    }
}
