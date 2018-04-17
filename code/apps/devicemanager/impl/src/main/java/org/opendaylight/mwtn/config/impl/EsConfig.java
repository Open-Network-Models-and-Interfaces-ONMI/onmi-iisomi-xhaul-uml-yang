package org.opendaylight.mwtn.config.impl;

import org.apache.commons.configuration2.INIConfiguration;
import org.apache.commons.configuration2.SubnodeConfiguration;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.opendaylight.mwtn.base.internalTypes.Environment;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;

public class EsConfig {

    private static final String EMPTY = "empty";

	private static final String PROPERTY_KEY_CLUSTER = "cluster";

	private static final String DEFAULT_VALUE_CLUSTER = "";

    private String cluster=EMPTY;
    private String host=EMPTY;
    private String node=EMPTY;

	private EsConfig() {
	}

    public String getCluster() {
        return cluster;
    }

    public String getHost() {
        return host;
    }

    public String getNode() {
        return node;
    }

    public EsConfig(INIConfiguration config,ISubConfigHandler configHandler) throws ConfigurationException {

		SubnodeConfiguration subconfig=config.getSection(HtDevicemanagerConfiguration.SECTION_MARKER_ES);
		String clustername=Environment.getVar("$HOSTNAME");
		if(subconfig.isEmpty())  //create defaults
		{
			config.setProperty(String.format("%s.%s", HtDevicemanagerConfiguration.SECTION_MARKER_ES,PROPERTY_KEY_CLUSTER),clustername);

			configHandler.save();
		}

		//load
		String c=subconfig.getString(PROPERTY_KEY_CLUSTER,clustername);
		if(c!=null && c.startsWith("$"))
			c=Environment.getVar(c);
		this.cluster=c;
		this.node=String.format("%s%s", this.cluster,"n1");
		this.host="localhost";
    }

	public static EsConfig getDefaultConfiguration() {
		EsConfig c=new EsConfig();
		c.cluster=DEFAULT_VALUE_CLUSTER;
		return c;
	}

    @Override
	public String toString() {
		return "EsConfig [cluster=" + cluster + ", host=" + host + ", node=" + node + "]";
	}


}
