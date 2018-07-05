package com.highstreet.technologies.apigateway;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyProperties {

	private static Logger LOG = LoggerFactory.getLogger(MyProperties.class);
	public static final String PROPFILE = "etc/apigateway.properties";
	private static final String DEFAULT_AAI_HEADERS = "[\"X-FromAppId:SDNR\",\"Authorization: Basic QUFJOkFBSQ==\"]";

	@Override
	public String toString() {
		return "MyProperties [aaiBase=" + aaiBase + ", aaiHeaders=" + aaiHeaders + ", esBase=" + esBase
				+ ", trustInsecure=" + trustInsecure + ", corsEnabled=" + corsEnabled + "]";
	}

	private static MyProperties mObj;

	private String aaiBase;
	private Map<String, String> aaiHeaders;
	private String esBase;

	private boolean trustInsecure;

	private boolean corsEnabled;

	public boolean isAAIOff() {
		return this.aaiBase == null ? true : this.aaiBase.equals("off");
	}

	public boolean isEsOff() {
		return this.esBase == null ? true : this.esBase.equals("off");
	}

	public String getAAIBaseUrl() {
		return this.aaiBase;
	}

	public String getEsBaseUrl() {
		return this.esBase;
	}

	public Map<String, String> getAAIHeaders() {
		return this.aaiHeaders;
	}

	public boolean trustInsecure() {
		return this.trustInsecure;
	}

	public boolean corsEnabled() {
		return this.corsEnabled;
	}

	public static MyProperties Instantiate(String filename) throws IOException, NumberFormatException {
		mObj = new MyProperties(filename);
		if (mObj != null)
			LOG.debug("instantiated:" + mObj.toString());
		return mObj;
	}

	private MyProperties(String filename) throws IOException, NumberFormatException {
		this.aaiBase = "off";
		this.trustInsecure = false;
		File f = new File(filename);
		if (!f.exists()) {
			this.writeDefaults(f);
		}
		Properties defaultProps = new Properties();
		FileInputStream in = new FileInputStream(filename);
		defaultProps.load(in);
		in.close();

		this.aaiBase = defaultProps.getProperty("aai", "off");
		this.aaiHeaders = _parseHeadersMap(defaultProps.getProperty("aaiHeaders", DEFAULT_AAI_HEADERS));
		this.esBase = defaultProps.getProperty("database", "off");
		this.trustInsecure = Integer.parseInt(defaultProps.getProperty("insecure", "0")) == 1;
		this.corsEnabled = Integer.parseInt(defaultProps.getProperty("cors", "0")) == 1;
	}

	private static Map<String, String> _parseHeadersMap(String s) {
		Map<String, String> r = new HashMap<String, String>();
		try {
			JSONArray a = new JSONArray(s);
			if (a != null && a.length() > 0) {
				for (int i = 0; i < a.length(); i++) {
					String item = a.getString(i);
					String[] hlp = item.split(":");
					if (hlp.length > 1) {
						r.put(hlp[0], hlp[1]);
					}
				}
			}
		} catch (Exception e) {
			LOG.warn("problem loading headers map:" + e.getMessage());
		}
		return r;
	}

	private void writeDefaults(File f) throws IOException {
		FileWriter fw = new FileWriter(f);
		final String LR = "\n";
		fw.write("aai=off" + LR);
		fw.write("aaiHeaders=" + DEFAULT_AAI_HEADERS + LR);
		fw.write("database=http://localhost:9200" + LR);
		fw.write("insecure=1" + LR);
		fw.write("cors=1");
		fw.close();

	}

	public static MyProperties getInstance() {
		return mObj;
	}

}
