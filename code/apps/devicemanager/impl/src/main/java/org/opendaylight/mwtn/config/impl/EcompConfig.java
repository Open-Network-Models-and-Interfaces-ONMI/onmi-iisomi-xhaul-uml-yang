package org.opendaylight.mwtn.config.impl;

import org.apache.commons.configuration2.INIConfiguration;
import org.apache.commons.configuration2.SubnodeConfiguration;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;

public class EcompConfig
{
	@Override
	public String toString() {
		return "EcompConfig [eventReceiverUrl=" + eventReceiverUrl + ", userCredentials=" + userCredentials
				+ ", sourceId=" + sourceId + ", testCollector=" + testCollector + ", timerPeriodSeconds="
				+ timerPeriodSeconds + "]";
	}
	private static final String EMPTY="empty";
	private static final int TIMEPERIODSECONDS = 30;

	private static final String PROPERTY_KEY_EVENTRECEIVERURL="eventReceiverUrl";
	private static final String PROPERTY_KEY_TESTCOLLECTOR="testCollector";
	private static final String PROPERTY_KEY_USERCREDENTIALS="userCredentials";
	private static final String PROPERTY_KEY_SOURCEID="sourceId";
	private static final String PROPERTY_KEY_TIMERPERIOD="timerPeriodSeconds";
	private static final String DEFAULT_VALUE_EVENTRECEIVERURL="off";
	private static final String DEFAULT_VALUE_TESTCOLLECTOR="no";
	private static final String DEFAULT_VALUE_USERCREDENTIALS="admin:admin";
	private static final String DEFAULT_VALUE_SOURCEID="de305d54-75b4-431b-adb2-eb6b9e546014";
	private static final int DEFAULT_VALUE_TIMERPERIOD=TIMEPERIODSECONDS;

	private String eventReceiverUrl=EMPTY;
    private String userCredentials=EMPTY;
    private String sourceId = EMPTY;
    private String testCollector = EMPTY;
    private Integer timerPeriodSeconds = TIMEPERIODSECONDS;

    /*
     * Setter
     */

    public void setEventReceiverUrl(String eventReveicerUrl) {
        this.eventReceiverUrl = eventReveicerUrl;
    }

    public void setUserCredentials(String userCredentials) {
        this.userCredentials = userCredentials;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public void setTestCollector(String testCollector) {
        this.testCollector = testCollector;
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

    public String getSourceId() {
        return sourceId;
    }

    public boolean isTestCollectorYes() {
        return testCollector.equals("yes");
    }

    public Integer getTimerPeriodSeconds() {
        return timerPeriodSeconds;
    }
    private EcompConfig()
    {

    }
	public EcompConfig(INIConfiguration config,ISubConfigHandler configHandler) throws ConfigurationException {

		SubnodeConfiguration subconfig=config.getSection(HtDevicemanagerConfiguration.SECTION_MARKER_ECOMP);
		if(subconfig.isEmpty())  //create defaults
		{
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_ECOMP,PROPERTY_KEY_EVENTRECEIVERURL),DEFAULT_VALUE_EVENTRECEIVERURL);
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_ECOMP,PROPERTY_KEY_TESTCOLLECTOR),DEFAULT_VALUE_TESTCOLLECTOR);
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_ECOMP,PROPERTY_KEY_USERCREDENTIALS),DEFAULT_VALUE_USERCREDENTIALS);
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_ECOMP,PROPERTY_KEY_SOURCEID),DEFAULT_VALUE_SOURCEID);
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_ECOMP,PROPERTY_KEY_TIMERPERIOD),DEFAULT_VALUE_TIMERPERIOD);
			configHandler.save();
		}

		//load
		this.eventReceiverUrl=subconfig.getString(PROPERTY_KEY_EVENTRECEIVERURL,DEFAULT_VALUE_EVENTRECEIVERURL);
		this.testCollector=subconfig.getString(   PROPERTY_KEY_TESTCOLLECTOR,DEFAULT_VALUE_TESTCOLLECTOR);
		this.userCredentials=subconfig.getString( PROPERTY_KEY_USERCREDENTIALS,DEFAULT_VALUE_USERCREDENTIALS);
		this.sourceId=subconfig.getString(        PROPERTY_KEY_SOURCEID,DEFAULT_VALUE_SOURCEID);
		this.timerPeriodSeconds=subconfig.getInt( PROPERTY_KEY_TIMERPERIOD,DEFAULT_VALUE_TIMERPERIOD);


	}

	public static EcompConfig getDefaultConfiguration() {
		EcompConfig c=new EcompConfig();
		c.eventReceiverUrl=DEFAULT_VALUE_EVENTRECEIVERURL;
		c.testCollector=DEFAULT_VALUE_TESTCOLLECTOR;
		c.userCredentials=DEFAULT_VALUE_USERCREDENTIALS;
		c.sourceId=DEFAULT_VALUE_SOURCEID;
		c.timerPeriodSeconds=DEFAULT_VALUE_TIMERPERIOD;
		return c;
	}


}