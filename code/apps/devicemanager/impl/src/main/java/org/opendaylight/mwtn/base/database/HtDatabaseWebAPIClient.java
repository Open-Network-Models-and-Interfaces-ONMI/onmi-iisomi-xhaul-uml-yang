package org.opendaylight.mwtn.base.database;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class HtDatabaseWebAPIClient {

	private static Logger LOG = LoggerFactory.getLogger(HtDatabaseWebAPIClient.class);
	private static final int BUFSIZE = 1024;
	private static final String CHARSET = "UTF-8";
	private final String host;
	private final int port;
	public HtDatabaseWebAPIClient()
	{
		this.host="http://localhost";
		this.port=9200;
	}

	public String sendRequest(String uri,String method,JSONObject body) throws IOException
	{
		LOG.debug("try to send request with uri="+uri+" as method="+method);
		if(body!=null)
			LOG.trace("body:"+body.toString());
		String surl=String.format("%s:%d%s",this.host,this.port,uri);
		URL url = new URL(surl);
		URLConnection http = url.openConnection();
		((HttpURLConnection) http).setRequestMethod(method);
		http.setDoOutput(true);
		http.setRequestProperty("Content-Type", "application/json");
		byte[] buffer = new byte[BUFSIZE];
		int len = 0, lensum = 0;
		// send request
		// Send the message to destination
		if(!method.equals("GET"))
		{
			try (OutputStream output = http.getOutputStream()) {
				output.write(body.toString().getBytes(CHARSET));
			}
		}
		int responseCode = ((HttpURLConnection) http).getResponseCode();
		// Receive answer
		InputStream response;
		if (responseCode >= 200 && responseCode < 300)
			response = http.getInputStream();
		else
		{
			response = ((HttpURLConnection) http).getErrorStream();
			if(response==null)
				http.getInputStream();
		}
		String sresponse="";
		if(response!=null)
		{
			while (true) {
				len = response.read(buffer, 0, BUFSIZE);
				if (len <= 0)
					break;
				lensum+=len;
				sresponse+=new String(buffer,0,len,CHARSET);
			}
			response.close();
		}
		else
			LOG.debug("response is null");
		LOG.debug("ResponseCode: " + responseCode);
		LOG.trace("Response: " + sresponse);

		return sresponse;
	}
}
