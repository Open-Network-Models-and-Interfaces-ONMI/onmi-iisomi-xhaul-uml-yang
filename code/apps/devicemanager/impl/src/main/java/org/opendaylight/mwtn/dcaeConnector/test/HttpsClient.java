/**
 *
 */
package org.opendaylight.mwtn.dcaeConnector.test;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLPeerUnverifiedException;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.opendaylight.mwtn.dcaeConnector.impl.DcaeProviderClient;

/**
 * @author herbert
 *
 */
public class HttpsClient{

    private static final MyLogger LOG = MyLogger.getLogger(DcaeProviderClient.class);

    void test() {

        TrustManager tm = new X509TrustManager() {

            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType)
                    throws java.security.cert.CertificateException {
                //do nothing, you're the client
            }

            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType)
                    throws java.security.cert.CertificateException {
                /* chain[chain.length -1] is the candidate for the
                 * root certificate.
                 * Look it up to see whether it's in your list.
                 * If not, ask the user for permission to add it.
                 * If not granted, reject.
                 * Validate the chain using CertPathValidator and
                 * your list of trusted roots.
                 */
            }

            @Override
            public X509Certificate[] getAcceptedIssuers() {
                   //also only relevant for servers
                 return null;
            }
        };

        TrustManager tml[] = new TrustManager[1];
        tml[0] = tm;


        try {
            SSLContext ctx = SSLContext.getInstance("TLS");
            ctx.init(null, tml, null);
            @SuppressWarnings("unused")
			SSLSocketFactory sslF = ctx.getSocketFactory();

        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            e.printStackTrace();
        }


    };

    void setupAllTrustingManager() {
        // Create a trust manager that does not validate certificate chains
        TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager(){
            @Override
            public X509Certificate[] getAcceptedIssuers(){return null;}
            @Override
            public void checkClientTrusted(X509Certificate[] certs, String authType){}
            @Override
            public void checkServerTrusted(X509Certificate[] certs, String authType){}
        }};

        // Install the all-trusting trust manager
        try {
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {
            ;
        }
    }

    void testIt(String https_url, String keyStoreName, String keyStorePassword){

        LOG.info("Message to: {} begin.", https_url);

        if (https_url.equals("off")) {
            LOG.info("Function switched off");
            return;
        }

        /*
        KeyManagerFactory keyManagerFactory = null;

        try {
            KeyStore ks = KeyStore.getInstance("JKS");
            FileInputStream in = new FileInputStream(keyStoreName);
            ks.load(in, keyStorePassword.toCharArray());

            CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
            FileInputStream in2 = new FileInputStream("etc/eventprovider.cert");
            X509Certificate cert = (X509Certificate)certFactory.generateCertificate(in2);

            KeyStore.Entry newEntry = new KeyStore.TrustedCertificateEntry(cert);
            ks.setEntry("someAlias", newEntry, null);

            keyManagerFactory = KeyManagerFactory.getInstance("X509");
            keyManagerFactory.init(ks, "yourKeyStorePassword".toCharArray());

        } catch (KeyStoreException e1) {
            LOG.info("Exception: {}", e1.getMessage());
        } catch (FileNotFoundException e1) {
            LOG.info("Exception: {}", e1.getMessage());
        } catch (NoSuchAlgorithmException e1) {
            LOG.info("Exception: {}", e1.getMessage());
        } catch (CertificateException e1) {
            LOG.info("Exception: {}", e1.getMessage());
        } catch (IOException e1) {
            LOG.info("Exception: {}", e1.getMessage());
        } catch (UnrecoverableKeyException e1) {
            LOG.info("Exception: {}", e1.getMessage());
        }

        // Create a trust manager that does not validate certificate chains
        TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager(){
            @Override
            public X509Certificate[] getAcceptedIssuers(){return null;}
            @Override
            public void checkClientTrusted(X509Certificate[] certs, String authType){}
            @Override
            public void checkServerTrusted(X509Certificate[] certs, String authType){}
        }};
         */
        File file = new File(keyStoreName);
        LOG.info("Setup keystore begin "+keyStoreName+" "+keyStorePassword+" Exists: "+file.exists());

        System.setProperty("javax.net.debug","ssl");
        System.setProperty("javax.net.ssl.keyStoreType", "jks");
        System.setProperty("javax.net.ssl.keyStore", keyStoreName);
        System.setProperty("javax.net.ssl.keyStorePassword", keyStorePassword);

        LOG.info("Setup keystore complete");

        javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(
                (hostname, sslSession) -> {
                 LOG.info("Hostname check {}", hostname);
                 return true;
              });
        LOG.info("Setup name verifier.");

        try {
            /*
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(keyManagerFactory.getKeyManagers(), trustAllCerts, null);
            SSLContext.setDefault(sslContext);
            */

            URL url = new URL(https_url);
            LOG.info("Url object created");

            HttpsURLConnection con = (HttpsURLConnection)url.openConnection();

            LOG.info("openConnection");

            //dumpl all cert info
            print_https_cert(con);

            //dump all the content
            print_content(con);

        } catch (MalformedURLException e) {
            LOG.info("Exception: {}", e.getMessage());
        } catch (IOException e) {
            LOG.info("Exception: {}", e.getMessage());
        }

        LOG.info("Message to: {} end.", https_url);

    }

    private void print_https_cert(HttpsURLConnection con){

        StringBuffer logMsg = new StringBuffer();

        if(con!=null){

            try {
                logMsg.append("Response Code : " + con.getResponseCode());
                logMsg.append("Cipher Suite : " + con.getCipherSuite());
                logMsg.append("\n");

                Certificate[] certs = con.getServerCertificates();
                for(Certificate cert : certs){
                    logMsg.append("Cert Type : " + cert.getType());
                    logMsg.append("Cert Hash Code : " + cert.hashCode());
                    logMsg.append("Cert Public Key Algorithm : " + cert.getPublicKey().getAlgorithm());
                    logMsg.append("Cert Public Key Format : " + cert.getPublicKey().getFormat());
                    logMsg.append("\n");
                }


            } catch (SSLPeerUnverifiedException e) {
                logMsg.append(e.getMessage());
            } catch (IOException e){
                logMsg.append(e.getMessage());
            }
        } else {
            logMsg.append("No connection");
        }

        LOG.info(logMsg.toString());
   }

    private void print_content(HttpsURLConnection con){

         StringBuffer logMsg = new StringBuffer();
         if(con!=null){

            try {


                logMsg.append("****** Content of the URL ********");
                BufferedReader br =
                        new BufferedReader(
                                new InputStreamReader(con.getInputStream()));

                String input;

                while ((input = br.readLine()) != null){
                    logMsg.append(input);
                }
                br.close();


            } catch (IOException e) {
                logMsg.append(e.getMessage());
            }

        } else {
            logMsg.append("No connection");
        }

        LOG.info(logMsg.toString());

    }

    private static class MyLogger {

        private void out( String s, Object...oList) {
            StringBuffer sb = new StringBuffer();
            sb.append("-------> ");
            sb.append(s);
            sb.append(" P: ");
            int t = 0;
            for (Object o: oList) {
                sb.append("[");
                sb.append(t++);
                sb.append("](");
                sb.append(o.toString());
                sb.append(")");
            }
            System.out.println(sb.toString());
        }

        void info( String s, Object...o) {
            out(s,o);
        }

        static MyLogger getLogger(Class<?> c) {
            return new MyLogger();
        }
    }
}
