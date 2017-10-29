package org.opendaylight.mwtn.aotsMConnector.test;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;

public class TestSSL {

	//private static final String REMOTE_URL = "http://soapserver.fritz.box/addmobility.php";
	private static final String REMOTE_URL = "https://csi-tst-q26a.it.att.com:26443/Services/com/cingular/csi/aotsremedy/AddMobilityTicket.jws";
	//private static final String REMOTE_URL = "https://git-highstreet-technologies.com";
	private static final int TIMEOUT = 1500;

	public static void HTTPPost() {
		try {
			SSLContext sc = SSLContext.getInstance("TLSv1.2");
			 TrustManager[] trustCerts = null;
			// Init the SSLContext with a TrustManager[] and SecureRandom()
			 sc.init(null, trustCerts, new java.security.SecureRandom());

			 URL url = new URL(REMOTE_URL);
			System.out.println("post request on url="+REMOTE_URL);
			URLConnection http = url.openConnection();
			if(url.toString().startsWith("https"))
	        {
		        ((HttpsURLConnection)http).setSSLSocketFactory(sc.getSocketFactory());
	        }

			((HttpURLConnection) http).setRequestMethod("POST"); // PUT is another valid option
			String s=TestSimpleSoap.getRequestAddMobility();
			byte[] body=s.getBytes(StandardCharsets.UTF_8);
			int postDataLength=body.length;
			http.setRequestProperty( "Content-Length", Integer.toString( postDataLength ));
			http.setDoOutput(true);
			http.setConnectTimeout(TIMEOUT);
			http.setRequestProperty("Content-Type", "text/xml ");
			http.setRequestProperty("charset", "utf-8");
			http.setRequestProperty("SOAPAction","\"\"");
			http.setRequestProperty("Accept","application/xml, application/dime, multipart/related, text/*");
			http.connect();
			System.out.println("request:");
			System.out.println(s);
			DataOutputStream os = new DataOutputStream(http.getOutputStream());
			os.write(body);
			os.flush();

			int respCode=((HttpsURLConnection)http).getResponseCode();
			InputStream is;
			if(respCode>=200 && respCode<300)
			{
				 is = http.getInputStream();
			}
			else
				is=((HttpsURLConnection)http).getErrorStream();
	        InputStreamReader isr = new InputStreamReader(is);
	        BufferedReader br = new BufferedReader(isr);
	        System.out.println("responseCode: "+respCode);
	        System.out.println("response:");

	        String inputLine;

	        while ((inputLine = br.readLine()) != null) {
	            System.out.println(inputLine);
	        }

			is.close();


		} catch (Exception err) {
			err.printStackTrace();
		}
	}

	public static void main(String args[]) {
		TestSSL.HTTPPost();
	}
}
