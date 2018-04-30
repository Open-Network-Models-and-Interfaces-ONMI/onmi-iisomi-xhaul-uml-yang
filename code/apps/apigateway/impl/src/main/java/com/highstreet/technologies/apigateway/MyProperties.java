package com.highstreet.technologies.apigateway;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;

public class MyProperties {

	public static final String PROPFILE = "etc/apigateway.properties";

	@Override
	public String toString() {
		return "MyProperties [aaiBase=" + aaiBase + ", esBase=" + esBase + ", trustInsecure=" + trustInsecure + "]";
	}

	private static MyProperties mObj;

	private String aaiBase;
	private String esBase;

	private boolean trustInsecure;

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

	public boolean trustInsecure() {
		return this.trustInsecure;
	}

	public static MyProperties Instantiate(String filename) throws IOException, NumberFormatException {
		mObj = new MyProperties(filename);
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
		this.esBase = defaultProps.getProperty("database", "off");
		this.trustInsecure = Integer.parseInt(defaultProps.getProperty("insecure", "0")) == 1;
	}

	private void writeDefaults(File f) throws IOException {
		FileWriter fw = new FileWriter(f);
		final String LR = "\n";
		fw.write("aai=off" + LR);
		fw.write("database=http://localhost:9200" + LR);
		fw.write("insecure=1");
		fw.close();

	}

	public static MyProperties getInstance() {
		return mObj;
	}

}
