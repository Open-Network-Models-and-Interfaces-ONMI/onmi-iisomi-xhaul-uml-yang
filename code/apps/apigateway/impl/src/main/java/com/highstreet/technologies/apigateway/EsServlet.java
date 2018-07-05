package com.highstreet.technologies.apigateway;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EsServlet extends HttpServlet {

	/**
	 *
	 */
	private static final long serialVersionUID = -3996363343749995011L;
	private static Logger LOG = LoggerFactory.getLogger(EsServlet.class);
	private static final int BUFSIZE = 1024;
	private static final byte[] OFFLINE_RESPONSE_BYTES = "Database interface is offline"
			.getBytes(StandardCharsets.UTF_8);
	private static SSLContext sc;
	private static boolean TRUSTALL = false;

	/**
	 *
	 * @throws NoSuchAlgorithmException
	 * @throws KeyManagementException
	 */
	private static void setupSslTrustAll() throws NoSuchAlgorithmException, KeyManagementException {

		sc = SSLContext.getInstance("TLSv1.2");
		TrustManager[] trustCerts = null;
		if (TRUSTALL) {
			trustCerts = new TrustManager[] { new javax.net.ssl.X509TrustManager() {
				public java.security.cert.X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
				}

				public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
				}
			} };

		}
		// Init the SSLContext with a TrustManager[] and SecureRandom()
		sc.init(null, trustCerts, new java.security.SecureRandom());

	}

	public EsServlet() {

		try {
			MyProperties.Instantiate(MyProperties.PROPFILE);
		} catch (Exception e) {
			LOG.error(e.getMessage());
		}

		TRUSTALL = MyProperties.getInstance().trustInsecure();
		try {
			setupSslTrustAll();
		} catch (Exception e) {
			LOG.error("error setting up SSL: " + e.getMessage());
		}
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		if (MyProperties.getInstance().isEsOff()) {
			this.sendOffResponse(resp);
		} else {
			HttpURLConnection http = (HttpURLConnection) this.getConnection(req, "PUT");
			this.handleRequest(http, req, resp, "PUT");
			http.disconnect();
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		if (MyProperties.getInstance().isEsOff()) {
			this.sendOffResponse(resp);
		} else {
			HttpURLConnection http = (HttpURLConnection) this.getConnection(req, "GET");
			this.handleRequest(http, req, resp, "GET");
			http.disconnect();
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		if (MyProperties.getInstance().isEsOff()) {
			this.sendOffResponse(resp);
		} else {
			HttpURLConnection http = (HttpURLConnection) this.getConnection(req, "POST");
			this.handleRequest(http, req, resp, "POST");
			http.disconnect();
		}
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		if (MyProperties.getInstance().isEsOff()) {
			this.sendOffResponse(resp);
		} else {
			HttpURLConnection http = (HttpURLConnection) this.getConnection(req, "DELETE");
			this.handleRequest(http, req, resp, "DELETE");
			http.disconnect();
		}

	}

	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		if (MyProperties.getInstance().corsEnabled()) {
			resp.addHeader("Access-Control-Allow-Origin", "*");
			resp.addHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
			resp.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		}
		super.doOptions(req, resp);
	}

	private void sendOffResponse(HttpServletResponse response) {
		response.setStatus(200);// HTML/OK
		response.setHeader("Content-Type", "text/html; charset=utf-8");
		try {
			response.getOutputStream().write(OFFLINE_RESPONSE_BYTES);
		} catch (IOException e) {
			LOG.debug("problem writing offline response");
		}

	}

	private URLConnection getConnection(HttpServletRequest req, final String method) throws IOException {

		LOG.debug(method + " Request");
		// String query = req.getQueryString();
		String uri = req.getRequestURI();
		if (uri != null && uri.length() > 0)
			uri = uri.substring("/database".length());
		String surl = MyProperties.getInstance().getEsBaseUrl() + uri;
		// if (query != null && query.length() > 0)
		// surl += "?" + query;
		LOG.debug("RemoteURL: " + surl);
		URL url = new URL(surl);
		URLConnection http = url.openConnection();
		((HttpURLConnection) http).setRequestMethod(method);
		if (url.toString().startsWith("https")) {
			((HttpsURLConnection) http).setSSLSocketFactory(sc.getSocketFactory());
			if (TRUSTALL) {
				HostnameVerifier allHostsValid = new HostnameVerifier() {
					public boolean verify(String hostname, SSLSession session) {
						return true;
					}
				};
				((HttpsURLConnection) http).setHostnameVerifier(allHostsValid);
			}
		}
		http.setDoOutput(true);
		// copy request headers
		String s = "";
		Enumeration<String> headers = req.getHeaderNames();
		while (headers.hasMoreElements()) {
			String h = headers.nextElement();
			String v = req.getHeader(h);
			if (h != null && h.equals("Host"))
				v = url.getAuthority();
			s += String.format("%s:%s;", h, v);
			http.setRequestProperty(h, v);
		}
		LOG.debug("Request Headers: " + s);
		return http;
	}

	private void handleRequest(HttpURLConnection http, HttpServletRequest req, HttpServletResponse resp, String method)
			throws IOException {
		byte[] buffer = new byte[BUFSIZE];
		int len = 0, lensum = 0;
		// send request
		// Send the message to destination
		if (!method.equals("GET")) {
			try (OutputStream output = http.getOutputStream()) {
				while (true) {
					len = req.getInputStream().read(buffer, 0, BUFSIZE);
					if (len <= 0)
						break;
					lensum += len;
					output.write(buffer, 0, len);
				}
			}
		}
		LOG.debug("written " + lensum + " data out");
		int responseCode = ((HttpURLConnection) http).getResponseCode();
		// Receive answer
		InputStream response;
		if (responseCode >= 200 && responseCode < 300)
			response = http.getInputStream();
		else {
			response = http.getErrorStream();
			if (response == null)
				http.getInputStream();
		}

		LOG.debug("ResponseCode: " + responseCode);
		resp.setStatus(responseCode);
		Map<String, List<String>> set = http.getHeaderFields();
		String s = "";
		if (set != null) {
			for (Map.Entry<String, List<String>> entry : set.entrySet()) {
				if (entry.getKey() == null)
					continue;
				for (String v : entry.getValue()) {
					resp.setHeader(entry.getKey(), v);
					s += String.format("%s:%s;", entry.getKey(), v);
				}
				if (MyProperties.getInstance().corsEnabled()) {
					resp.setHeader("Access-Control-Allow-Origin", "*");
					//resp.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
					resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
				}

			}
		}
		LOG.debug("Received Headers: " + s);
		lensum = 0;
		if (response != null) {
			while (true) {
				len = response.read(buffer, 0, BUFSIZE);
				if (len <= 0)
					break;
				lensum += len;
				resp.getOutputStream().write(buffer, 0, len);
			}
		} else
			LOG.debug("response is null");
		LOG.debug("Received " + lensum + " bytes");
	}
}
