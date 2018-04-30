package org.opendaylight.mwtn.config.impl;

import java.io.File;
import java.io.IOException;

import org.apache.commons.configuration2.INIConfiguration;
import org.apache.commons.configuration2.builder.fluent.Configurations;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.apache.commons.configuration2.io.FileHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HtDevicemanagerConfiguration {

	public interface ISubConfigHandler {
		void save();
	}

	private static final Logger LOG = LoggerFactory.getLogger(HtDevicemanagerConfiguration.class);

	private static final String CONFIGURATIONFILE = "etc/devicemanager.properties";
	//private static final String CONFIGURATIONFILE = "test.properties"; // for testing

	public static final String SECTION_MARKER_AOTS = "aots";
	public static final String SECTION_MARKER_ES = "es";
	public static final String SECTION_MARKER_ECOMP = "ecomp";
	public static final String SECTION_MARKER_PM = "pm";

	private static HtDevicemanagerConfiguration mObj;

	public static HtDevicemanagerConfiguration getConfiguration() {
		if (mObj == null)
			mObj = new HtDevicemanagerConfiguration();
		return mObj;
	}

	private EcompConfig mEcompConfig;
	private EsConfig mEsConfig;
	private PmConfig mPmConfig;

	private INIConfiguration mConfig;
	private File mFile;

	private HtDevicemanagerConfiguration() {

		try {
			this.mFile = new File(CONFIGURATIONFILE);
			if (!this.mFile.exists())
				this.mFile.createNewFile();

			Configurations configs = new Configurations();
			this.mConfig = configs.ini(this.mFile);
			this.mConfig.setSeparatorUsedInOutput("=");//if not set there will be a whitespace
			FileHandler h = new FileHandler(this.mConfig);
			h.setFile(this.mFile);
			h.load();
		} catch (ConfigurationException e) {
			LOG.error("error loading config values:" + e.getMessage());

		} catch (IOException e) {
			LOG.error("error loading config file " + CONFIGURATIONFILE + ": " + e.getMessage());
		}
	}

	private final ISubConfigHandler subconfigHandler = new ISubConfigHandler() {

		@Override
		public void save() {
			if(HtDevicemanagerConfiguration.this.mConfig!=null)
			{
				FileHandler h = new FileHandler(HtDevicemanagerConfiguration.this.mConfig);
				h.setFile(new File(CONFIGURATIONFILE));
				try {
					h.save();
				} catch (ConfigurationException e) {
					LOG.error("error writing config: " + e.getMessage());
				}
			}
			else	//no config file was loaded
			{

			}
		}
	};

	public EcompConfig getEcomp() {
		if (this.mEcompConfig == null)
			try {
				this.mEcompConfig = new EcompConfig(this.mConfig, this.subconfigHandler);
			} catch (ConfigurationException e) {
				this.mEcompConfig = EcompConfig.getDefaultConfiguration();
			}
		return this.mEcompConfig;
	}

	public EsConfig getEs() {
		if (this.mEsConfig == null)
			try {
				this.mEsConfig = new EsConfig(this.mConfig, this.subconfigHandler);
			} catch (ConfigurationException e) {
				this.mEsConfig = EsConfig.getDefaultConfiguration();
			}
		return this.mEsConfig;
	}

	public PmConfig getPm() {
		if (this.mPmConfig == null)
			try {
				this.mPmConfig = new PmConfig(this.mConfig, this.subconfigHandler);
			} catch (ConfigurationException e) {
				this.mPmConfig = PmConfig.getDefaultConfiguration();
			}
		return this.mPmConfig;
	}

}
