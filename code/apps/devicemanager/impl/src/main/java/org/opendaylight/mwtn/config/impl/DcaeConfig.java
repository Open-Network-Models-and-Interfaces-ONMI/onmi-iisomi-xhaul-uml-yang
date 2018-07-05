package org.opendaylight.mwtn.config.impl;

import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile.ConfigurationException;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;

public class DcaeConfig extends BaseSubConfig {
	private static final String SECTION_MARKER_DCAE = "dcae";

	private static final String PROPERTY_KEY_EVENTRECEIVERURL = "dcaeUrl";
	//private static final String PROPERTY_KEY_TESTCOLLECTOR = "dcaeTestCollector";
	private static final String PROPERTY_KEY_USERCREDENTIALS = "dcaeUserCredentials";
	private static final String PROPERTY_KEY_TIMERPERIOD = "dcaeHeartbeatPeriodSeconds";

	private static final String DEFAULT_VALUE_EVENTRECEIVERURL = "off";
	private static final String DEFAULT_VALUE_TESTCOLLECTOR = "no";
	private static final String DEFAULT_VALUE_USERCREDENTIALS = "admin:admin";
	private static final int DEFAULT_VALUE_TIMERPERIOD = 120;

	private static DcaeConfig dcaeConfig = null; // Singleton of configuration data

	private String eventReceiverUrl;
	private String userCredentials;
	private Integer timerPeriodSeconds;

	private DcaeConfig() {
		super();
		this.eventReceiverUrl = DEFAULT_VALUE_EVENTRECEIVERURL;
		this.userCredentials = DEFAULT_VALUE_USERCREDENTIALS;
		this.timerPeriodSeconds = DEFAULT_VALUE_TIMERPERIOD;
	}

	private DcaeConfig(IniConfigurationFile config, ISubConfigHandler configHandler) throws ConfigurationException {
		this(config, configHandler, true);
	}

	private DcaeConfig(IniConfigurationFile config, ISubConfigHandler configHandler, boolean save)
			throws ConfigurationException {

		super(config, configHandler, SECTION_MARKER_DCAE);

		this.eventReceiverUrl = this.getString(PROPERTY_KEY_EVENTRECEIVERURL, DEFAULT_VALUE_EVENTRECEIVERURL);
		this.userCredentials = this.getString(PROPERTY_KEY_USERCREDENTIALS, DEFAULT_VALUE_USERCREDENTIALS);
		this.timerPeriodSeconds = this.getInt(PROPERTY_KEY_TIMERPERIOD, DEFAULT_VALUE_TIMERPERIOD);
		if (save) {
			config.setProperty(SECTION_MARKER_DCAE + "." + PROPERTY_KEY_EVENTRECEIVERURL, this.eventReceiverUrl);
			config.setProperty(SECTION_MARKER_DCAE + "." + PROPERTY_KEY_USERCREDENTIALS, this.userCredentials);
			config.setProperty(SECTION_MARKER_DCAE + "." + PROPERTY_KEY_TIMERPERIOD, this.timerPeriodSeconds);

			this.save();
		}
	}

	/*
	 * Setter
	 */

	public void setEventReceiverUrl(String eventReveicerUrl) {
		this.eventReceiverUrl = eventReveicerUrl;
	}

	public void setUserCredentials(String userCredentials) {
		this.userCredentials = userCredentials;
	}



	public void setTimerPeriodSeconds(Integer timerPeriodSeconds) {
		this.timerPeriodSeconds = timerPeriodSeconds;
	}

	/*
	 * Getter
	 */

	public String getEventReveicerUrl() {
		return eventReceiverUrl;
	}

	public String getUserCredentials() {
		return userCredentials;
	}


	public Integer getTimerPeriodSeconds() {
		return timerPeriodSeconds;
	}

	@Override
	public String toString() {
		return "DcaeConfig [eventReceiverUrl=" + eventReceiverUrl + ", userCredentials=" + userCredentials
				+ ", timerPeriodSeconds=" + timerPeriodSeconds + "]";
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof DcaeConfig) {
			DcaeConfig cobj = (DcaeConfig) obj;
			if (!((cobj.eventReceiverUrl == null && this.eventReceiverUrl == null)
					|| cobj.eventReceiverUrl.equals(this.eventReceiverUrl)))
				return false;
			if (!((cobj.userCredentials == null && this.userCredentials == null)
					|| cobj.userCredentials.equals(this.userCredentials)))
				return false;
			if (cobj.timerPeriodSeconds != this.timerPeriodSeconds)
				return false;
			return true;
		}
		return super.equals(obj);
	}

	/*-------------------------------------
	 * static Functions
	 */

	public static DcaeConfig getDefaultConfiguration() {
		return (new DcaeConfig());
	}

	public static DcaeConfig getDcae(IniConfigurationFile config, ISubConfigHandler configHandler) {
		if (dcaeConfig == null)
			try {
				dcaeConfig = new DcaeConfig(config, configHandler);
			} catch (ConfigurationException e) {
				dcaeConfig = DcaeConfig.getDefaultConfiguration();
			}
		return dcaeConfig;
	}

	public static boolean isInstantiated() {
		return dcaeConfig != null;
	}

	public static DcaeConfig reload() {
		if (dcaeConfig == null)
			return null;
		DcaeConfig tmpConfig;
		try {
			tmpConfig = new DcaeConfig(dcaeConfig.getConfig(), dcaeConfig.getConfigHandler(), false);
		} catch (ConfigurationException e) {
			tmpConfig = DcaeConfig.getDefaultConfiguration();
		}
		dcaeConfig = tmpConfig;
		return dcaeConfig;
	}
}