package org.opendaylight.mwtn.config.impl;

import org.opendaylight.mwtn.base.internalTypes.Environment;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile.ConfigurationException;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;

public class EsConfig extends BaseSubConfig {

	public static final String SECTION_MARKER_ES = "es";

	public static final String ESDATATYPENAME = "database";

	private static final String EMPTY = "empty";

	private static final String PROPERTY_KEY_CLUSTER = "esCluster";

	private static final String DEFAULT_VALUE_CLUSTER = "";

	private static EsConfig esConfig;

	private String cluster;
	private String host;
	private String node;
	private String index;

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

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	@Override
	public String toString() {
		return "EsConfig [cluster=" + cluster + ", host=" + host + ", node=" + node + ", index=" + index + "]";
	}

	public EsConfig(IniConfigurationFile config, ISubConfigHandler configHandler) throws ConfigurationException {
		this(config, configHandler, true);
	}

	public EsConfig(IniConfigurationFile config, ISubConfigHandler configHandler, boolean save)
			throws ConfigurationException {

		super(config, configHandler, SECTION_MARKER_ES);
		String clustername = Environment.getVar("$HOSTNAME");

		String c = this.getString(PROPERTY_KEY_CLUSTER, clustername);
		if (c != null && c.startsWith("$"))
			c = Environment.getVar(c);
		this.cluster = c;
		this.node = String.format("%s%s", this.cluster, "n1");
		this.host = "localhost";

		if (save) {
			config.setProperty(SECTION_MARKER_ES + "." + PROPERTY_KEY_CLUSTER, this.cluster);
			this.save();
		}
	}

	private EsConfig() {
		super();
		this.host = EMPTY;
		this.node = EMPTY;
		this.index = EMPTY;
		this.cluster = DEFAULT_VALUE_CLUSTER;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof EsConfig) {
			EsConfig cobj = (EsConfig) obj;
			if (!((cobj.cluster == null && this.cluster == null) || cobj.cluster.equals(this.cluster)))
				return false;
			if (!((cobj.host == null && this.host == null) || cobj.host.equals(this.host)))
				return false;
			if (!((cobj.node == null && this.node == null) || cobj.node.equals(this.node)))
				return false;
			if (!((cobj.index == null && this.index == null) || cobj.index.equals(this.index)))
				return false;
			return true;
		}
		return super.equals(obj);
	}

	public EsConfig cloneWithIndex(String index) {
		EsConfig c = new EsConfig();
		c.index = index;
		c.host = this.host;
		c.node = this.node;
		c.cluster = this.cluster;
		return c;
	}

	public static boolean isInstantiated() {
		return esConfig != null;
	}

	public static EsConfig getDefaultConfiguration() {
		return new EsConfig();
	}

	public static EsConfig getEs(IniConfigurationFile config, ISubConfigHandler configHandler) {
		if (esConfig == null)
			try {
				esConfig = new EsConfig(config, configHandler);
			} catch (ConfigurationException e) {
				esConfig = EsConfig.getDefaultConfiguration();
			}
		return esConfig;
	}

	public static EsConfig reload() {
		if (esConfig == null)
			return null;
		EsConfig tmpConfig;
		try {
			tmpConfig = new EsConfig(esConfig.getConfig(), esConfig.getConfigHandler(), false);
		} catch (ConfigurationException e) {
			tmpConfig = EsConfig.getDefaultConfiguration();
		}
		esConfig = tmpConfig;
		return esConfig;
	}

}
