/**
 * Client for ECOMP notification server
 *
 * Reference: @link http://stackoverflow.com/questions/13022717/java-and-https-url-connection-without-downloading-certificate
 *
 * @author herbert
 */
package org.opendaylight.mwtn.dcaeConnector.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

import javax.net.ssl.SSLContext;

import org.opendaylight.mwtn.base.http.BaseHTTPClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DcaeSenderImpl implements DcaeSender {

    private static final Logger LOG = LoggerFactory.getLogger(DcaeSenderImpl.class);
    private static String EMPTY = "";
    private static final String charset = "UTF-8";

    private final String urlString;
    private final String basicAuth;

	private SSLContext sc = null;
    private URL url = null;
    private HttpURLConnection connection = null;

    public DcaeSenderImpl( String url, String userCredentials)  {

    	LOG.info("DcaeSenderImpl setup start with {} {}", url, userCredentials);

        this.urlString = url;
        this.basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));

        if (urlString != null && !urlString.equals("off")) {
        	try {
        		this.url = new URL(url);
        		sc = BaseHTTPClient.setupSsl(true);
        	} catch (KeyManagementException | NoSuchAlgorithmException | UnrecoverableKeyException | CertificateException | KeyStoreException | InvalidKeySpecException | IOException e) {
        		LOG.warn("SSL setup failed: {}", e.getMessage());
        	}
        }
        LOG.info("DcaeSenderImpl setup ends");
    }

    /**
     * Send message to ECOMP Server
     * @param body for POST message
     */
    @Override
    public String sendDcaePost(String body) {

        if (url != null) {
            try {
                connection = DcaeMessages.openConnection(url, basicAuth, true, sc);
                if (connection != null) {
                    return processPost(connection, body);
                } else {
        			LOG.warn("No SSL context available");
                }
            } catch (IOException e) {
                LOG.warn("Dcae post failed {}", e.getMessage());
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
                connection = DcaeMessages.openConnection(url, null, false, sc);
                if (connection != null) {
                    return receiveInitialAnswer(connection);
                }
            } catch (IOException e) {
                LOG.warn("Dcae post failed {}", e.getMessage());
            }
        }
        return EMPTY;
    }

    /**
     * Show status in readable form for testing
     * @return String with result
     */
    public String getStatusAsString() {
        StringBuffer sb = new StringBuffer();

        sb.append("URL: "+ url.getPath() +" "+ url.getPort() + " Host: "+ url.getHost());
        sb.append("\n");
        if (connection != null) {
            sb.append("Connection setup: ");
            sb.append(connection.getClass().getName());
            sb.append(" ");
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

        LOG.debug("Post message: {}", connection.getURL().toString());
        if (LOG.isTraceEnabled()) {
        	LOG.trace("Body: {} ", body);
        }

        //Send the message to destination
        try (OutputStream output = connection.getOutputStream()) {
            output.write(body.getBytes(charset));
        }

        //Receive answer
		try {
			int responseCode = connection.getResponseCode();
		    LOG.debug("Response code: {}", String.valueOf(responseCode));

		    InputStream response= null;
			if (responseCode >= 200 && responseCode < 300)
				response = connection.getInputStream();
			else {
				response = connection.getErrorStream();
				if (response == null)
					response = connection.getInputStream();
			}

			if (response != null) {
			    BufferedReader rd = new BufferedReader(new InputStreamReader(response));
			    String line;
			    StringBuilder result = new StringBuilder();
			    while ((line = rd.readLine()) != null) {
			     	result.append(line);
			    }
			    rd.close();
			    if (LOG.isTraceEnabled()) {
			      	LOG.trace("Result: {} ", result.toString());
			    }
			    return result.toString();
			}
		} catch (IOException e) {
			LOG.debug("No response received: {}", e.getMessage());
		}
 		return EMPTY;
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
}
