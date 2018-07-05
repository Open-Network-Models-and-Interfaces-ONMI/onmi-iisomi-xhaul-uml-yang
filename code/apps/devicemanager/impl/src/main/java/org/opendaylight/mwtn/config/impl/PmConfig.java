package org.opendaylight.mwtn.config.impl;

import org.opendaylight.mwtn.base.internalTypes.Environment;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile.ConfigurationException;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;

public class PmConfig extends BaseSubConfig {

	private static final String SECTION_MARKER_PM = "pm";
	private static final String PROPERTY_KEY_ENABLED = "pmEnabled";
	private static final String PROPERTY_KEY_CLUSTER = "pmCluster";

	private static final boolean DEFAULT_VALUE_ENABLED = true;
	private static final String DEFAULT_VALUE_CLUSTER = "";
	private static PmConfig pmConfig;

	private boolean enabled;

	public static final String ESDATATYPENAME = "database";

	private static final String EMPTY = "empty";

	private String cluster;
	private String host;
	private String node;

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

	public boolean isPerformanceManagerEnabled() {
		return this.enabled;
	}

	public PmConfig(IniConfigurationFile config, ISubConfigHandler configHandler) throws ConfigurationException {
		this(config, configHandler, true);
	}

	public PmConfig(IniConfigurationFile config, ISubConfigHandler configHandler, boolean save)
			throws ConfigurationException {

		super(config, configHandler, SECTION_MARKER_PM);
		String clustername = Environment.getVar("$HOSTNAME");

		this.enabled = this.getBoolean(PROPERTY_KEY_ENABLED, DEFAULT_VALUE_ENABLED);
		String c = this.getString(PROPERTY_KEY_CLUSTER, clustername);
		if (c != null && c.startsWith("$"))
			c = Environment.getVar(c);
		this.cluster = c;
		this.node = String.format("%s%s", this.cluster, "n1");
		this.host = "localhost";

		if (save) {
			config.setProperty(SECTION_MARKER_PM + "." + PROPERTY_KEY_ENABLED, this.enabled);
			config.setProperty(SECTION_MARKER_PM + "." + PROPERTY_KEY_CLUSTER, this.cluster);

			this.save();
		}
	}

	private PmConfig() {
		super();
		this.cluster = EMPTY;
		this.host = EMPTY;
		this.node = EMPTY;
		this.enabled = DEFAULT_VALUE_ENABLED;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof PmConfig) {
			PmConfig cobj = (PmConfig) obj;
			if (!((cobj.cluster == null && this.cluster == null) || cobj.cluster.equals(this.cluster)))
				return false;
			if (!((cobj.host == null && this.host == null) || cobj.host.equals(this.host)))
				return false;
			if (!((cobj.node == null && this.node == null) || cobj.node.equals(this.node)))
				return false;
			return true;
		}
		return super.equals(obj);
	}

	public static PmConfig getDefaultConfiguration() {
		PmConfig c = new PmConfig();
		c.enabled = DEFAULT_VALUE_ENABLED;
		c.cluster = DEFAULT_VALUE_CLUSTER;
		return c;
	}

	@Override
	public String toString() {
		return "PmConfig [enabled=" + enabled + ", cluster=" + cluster + ", host=" + host + ", node=" + node + "]";
	}

	public static boolean isInstantiated() {
		return pmConfig != null;
	}

	public static PmConfig getPm(IniConfigurationFile config, ISubConfigHandler configHandler) {
		if (pmConfig == null)
			try {
				pmConfig = new PmConfig(config, configHandler);
			} catch (ConfigurationException e) {
				pmConfig = PmConfig.getDefaultConfiguration();
			}
		return pmConfig;
	}

	public static PmConfig reload() {
		if (pmConfig == null)
			return null;
		PmConfig tmpConfig;
		try {
			tmpConfig = new PmConfig(pmConfig.getConfig(), pmConfig.getConfigHandler(), false);
		} catch (ConfigurationException e) {
			tmpConfig = PmConfig.getDefaultConfiguration();
		}
		pmConfig = tmpConfig;
		return pmConfig;
	}
}
