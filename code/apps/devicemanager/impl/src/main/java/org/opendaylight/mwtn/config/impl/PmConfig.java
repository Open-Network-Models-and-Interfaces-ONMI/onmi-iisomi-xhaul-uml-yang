package org.opendaylight.mwtn.config.impl;

import org.apache.commons.configuration2.INIConfiguration;
import org.apache.commons.configuration2.SubnodeConfiguration;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.opendaylight.mwtn.base.internalTypes.Environment;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;

public class PmConfig {

	private static final String PROPERTY_KEY_ENABLED = "performanceManagerEnabled";
	private static final String PROPERTY_KEY_CLUSTER = "cluster";

	private static final boolean DEFAULT_VALUE_ENABLED = true;
	private static final String DEFAULT_VALUE_CLUSTER = "";

	private boolean enabled;

	public static final String ESDATATYPENAME = "database";

    private static final String EMPTY = "empty";


    private String cluster=EMPTY;
    private String host=EMPTY;
    private String node=EMPTY;

    public static String getESDATATYPENAME() {
        return ESDATATYPENAME;
    }

    public String getCluster() {
        return cluster;
    }

    public void setCluster(String cluster) {
        this.cluster = cluster;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

	public boolean isPerformanceManagerEnabled()
	{return this.enabled;}


	public PmConfig(INIConfiguration config,ISubConfigHandler configHandler) throws ConfigurationException {

		SubnodeConfiguration subconfig=config.getSection(HtDevicemanagerConfiguration.SECTION_MARKER_PM);
		String clustername=Environment.getVar("$HOSTNAME");
		if(subconfig.isEmpty())  //create defaults
		{
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_PM,PROPERTY_KEY_ENABLED),DEFAULT_VALUE_ENABLED);
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_PM,PROPERTY_KEY_CLUSTER),clustername);

			configHandler.save();
		}

		//load
		this.enabled=subconfig.getBoolean(PROPERTY_KEY_ENABLED,DEFAULT_VALUE_ENABLED);
		String c=subconfig.getString(PROPERTY_KEY_CLUSTER,clustername);
		if(c!=null && c.startsWith("$"))
			c=Environment.getVar(c);
		this.cluster=c;
		this.node=String.format("%s%s", this.cluster,"n1");
		this.host="localhost";
    }

	private PmConfig() {
	}

	public static PmConfig getDefaultConfiguration() {
		PmConfig c=new PmConfig();
		c.enabled=DEFAULT_VALUE_ENABLED;
		c.cluster=DEFAULT_VALUE_CLUSTER;
		return c;
	}

	@Override
	public String toString() {
		return "PmConfig [enabled=" + enabled + ", cluster=" + cluster + ", host=" + host + ", node=" + node + "]";
	}
}
