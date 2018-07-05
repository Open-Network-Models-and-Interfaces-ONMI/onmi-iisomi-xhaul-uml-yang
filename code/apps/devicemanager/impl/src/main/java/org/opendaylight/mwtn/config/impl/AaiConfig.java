package org.opendaylight.mwtn.config.impl;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONArray;
import org.json.JSONException;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile.ConfigurationException;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AaiConfig extends BaseSubConfig {

	private static final Logger LOG = LoggerFactory.getLogger(AaiConfig.class);

	private static final String SECTION_MARKER_AAI = "aai";

	private static final String PROPERTY_KEY_AAIPROP_FILE ="aaiPropertiesFile";
	private static final String PROPERTY_KEY_BASEURL = "aaiUrl";
	private static final String PROPERTY_KEY_USERCREDENTIALS = "aaiUserCredentials";
	private static final String PROPERTY_KEY_HEADERS = "aaiHeaders";
	private static final String PROPERTY_KEY_DELETEONMOUNTPOINTREMOVED = "aaiDeleteOnMountpointRemove";
	private static final String PROPERTY_KEY_TRUSTALLCERTS = "aaiTrustAllCerts";
	private static final String PROPERTY_KEY_APIVERSION = "aaiApiVersion";
	private static final String PROPERTY_KEY_PCKS12CERTFILENAME = "aaiPcks12ClientCertFile";
	private static final String PROPERTY_KEY_PCKS12PASSPHRASE = "aaiPcks12ClientCertPassphrase";
	private static final String PROPERTY_KEY_CONNECTIONTIMEOUT = "aaiClientConnectionTimeout";
	private static final String PROPERTY_KEY_APPLICATIONID = "aaiApplicationId";

	private static final String DEFAULT_VALUE_AAIPROP_FILE ="null";
	private static final String DEFAULT_VALUE_BASEURL = "off";
	private static final String DEFAULT_VALUE_APPLICATION = "SDNR";
	private static final String DEFAULT_VALUE_USERNAME = "";
	private static final String DEFAULT_VALUE_USERPASSWORD = "";
	private static final String DEFAULT_VALUE_USERCREDENTIALS = "";
	private static final String DEFAULT_VALUE_HEADERS = "[\"X-TransactionId: 9999\"]";
	private static final boolean DEFAULT_VALUE_DELETEONMOUNTPOINTREMOVED = false;
	private static final boolean DEFAULT_VALUE_TRUSTALLCERTS = false;
	private static final int DEFAULT_VALUE_CONNECTION_TIMEOUT = 30000;	//in ms
	private static final String DEFAULT_VALUE_APIVERSION = "aai/v13";
	private static final String DEFAULT_VALUE_PCKS12CERTFILENAME ="";
	private static final String DEFAULT_VALUE_PCKS12PASSPHRASE = "";
	private static final String DEFAULT_VALUE_APPLICATIONID = "SDNR";

	private static final String HEADER_KEY_APPLICATION = "X-FromAppId";


	private static AaiConfig aaiConfig;

	private String aaiPropFile;
	private String baseUrl;
	private String apiVersion;
	private String applicationIdentifier;
	private String username;
	private String password;
	private String pcks12CertificateFilename;
	private String pcks12CertificatePassphrase;
	private int connectionTimeout;
	private boolean deleteOnMountPointRemoved;
	private boolean trustAllCerts;

	public boolean doDeleteOnMountPointRemoved() {
		return this.deleteOnMountPointRemoved;
	}

	private Map<String, String> headers;


	private AaiConfig() {
		super();
		this.aaiPropFile = DEFAULT_VALUE_AAIPROP_FILE;
		this.apiVersion=DEFAULT_VALUE_APIVERSION;
		this.applicationIdentifier = DEFAULT_VALUE_APPLICATION;
		this.baseUrl = DEFAULT_VALUE_BASEURL;
		this.username = DEFAULT_VALUE_USERNAME;
		this.password = DEFAULT_VALUE_USERPASSWORD;
		this.deleteOnMountPointRemoved = DEFAULT_VALUE_DELETEONMOUNTPOINTREMOVED;
		this.trustAllCerts=DEFAULT_VALUE_TRUSTALLCERTS;
		this.applicationIdentifier=DEFAULT_VALUE_APPLICATIONID;
	}

	/*
	 * private void change(AaiConfig cfg) { this.baseUrl=cfg.baseUrl;
	 * this.username=cfg.username; this.password=cfg.password;
	 * this.deleteOnMountPointRemoved=cfg.deleteOnMountPointRemoved; }
	 */
	public AaiConfig(IniConfigurationFile config, ISubConfigHandler configHandler) throws ConfigurationException {
		this(config, configHandler, true);
	}

	public AaiConfig(IniConfigurationFile config, ISubConfigHandler configHandler, boolean save)
			throws ConfigurationException {
		super(config, configHandler, SECTION_MARKER_AAI);
		// load
		this.aaiPropFile=this.getString(PROPERTY_KEY_AAIPROP_FILE, "");
		AaiClientPropertiesFile aaiProperties = new AaiClientPropertiesFile(this.aaiPropFile);
		String defBaseUrl=DEFAULT_VALUE_BASEURL;
		String defPCKSCertFilename=DEFAULT_VALUE_PCKS12CERTFILENAME;
		String defPCKSPassphrase=DEFAULT_VALUE_PCKS12PASSPHRASE;
		String defApplicationId=DEFAULT_VALUE_APPLICATION;
		int defconnectionTimeout=DEFAULT_VALUE_CONNECTION_TIMEOUT;
		boolean loaded=false;
		if(aaiProperties.exists())
		{
			LOG.debug("found another aaiclient.properties file");
			try
			{
				aaiProperties.load();
				loaded=true;
				LOG.debug("loaded successfully");
			}
			catch(IOException|NumberFormatException e)
			{
				LOG.warn("problem loading external properties file "+aaiProperties.getFilename()+": "+e.getMessage());
			}
			if(loaded)	//preload new default values
			{
				String value;
				value = aaiProperties.getRemoteUrl();
				if (value != null)
					defBaseUrl = value;
				value = aaiProperties.getPCKS12CertFilename();
				if (value != null)
					defPCKSCertFilename = value;
				value = aaiProperties.getPCKS12Passphrase();
				if (value != null)
					defPCKSPassphrase = value;
				value = aaiProperties.getApplicationIdentifier();
				if (value != null)
					defApplicationId = value;
			}
		}
		else
			LOG.debug("no aaiclient.properties file found");


		this.baseUrl = this.getString(PROPERTY_KEY_BASEURL, defBaseUrl);
		this.apiVersion=this.getString(PROPERTY_KEY_APIVERSION,DEFAULT_VALUE_APIVERSION);
		String credentials = this.getString(PROPERTY_KEY_USERCREDENTIALS, DEFAULT_VALUE_USERCREDENTIALS);
		if (credentials.contains(":")) {
			try {
				this.username = credentials.split(":")[0];
				this.password = credentials.split(":")[1];
			} catch (Exception e) {
				this.username = DEFAULT_VALUE_USERNAME;
				this.password = DEFAULT_VALUE_USERPASSWORD;
			}
		} else {
			this.username = DEFAULT_VALUE_USERNAME;
			this.password = DEFAULT_VALUE_USERPASSWORD;
		}
		this.headers = _parseHeadersMap(this.getString(PROPERTY_KEY_HEADERS, DEFAULT_VALUE_HEADERS));
		this.applicationIdentifier = this.getString(PROPERTY_KEY_APPLICATIONID, defApplicationId);
		this.pcks12CertificateFilename=this.getString(PROPERTY_KEY_PCKS12CERTFILENAME, defPCKSCertFilename);
		this.pcks12CertificatePassphrase=this.getString(PROPERTY_KEY_PCKS12PASSPHRASE, defPCKSPassphrase);
		this.connectionTimeout = this.getInt(PROPERTY_KEY_CONNECTIONTIMEOUT, defconnectionTimeout);
		this.deleteOnMountPointRemoved = this.getBoolean(PROPERTY_KEY_DELETEONMOUNTPOINTREMOVED,
				DEFAULT_VALUE_DELETEONMOUNTPOINTREMOVED);
		this.trustAllCerts = this.getBoolean(PROPERTY_KEY_TRUSTALLCERTS, DEFAULT_VALUE_TRUSTALLCERTS);

		boolean missing=(!this.hasKey(PROPERTY_KEY_APPLICATIONID))|| (!this.hasKey(PROPERTY_KEY_CONNECTIONTIMEOUT))||
				(!this.hasKey(PROPERTY_KEY_TRUSTALLCERTS)) || (!this.hasKey(PROPERTY_KEY_PCKS12CERTFILENAME)) ||
				(!this.hasKey(PROPERTY_KEY_PCKS12PASSPHRASE));
		if(missing)
			LOG.debug("some params missing in config file");
		//re-save if external aaiproperties file changed to show that params are submitted internally
		if(missing || (aaiConfig!=null && aaiConfig!=this && (
				!propertyEquals(aaiConfig.aaiPropFile, this.aaiPropFile) ||
				!propertyEquals(aaiConfig.pcks12CertificateFilename, this.pcks12CertificateFilename) ||
				!propertyEquals(aaiConfig.pcks12CertificatePassphrase, this.pcks12CertificatePassphrase) ||
				!propertyEquals(aaiConfig.connectionTimeout, this.connectionTimeout)

				)))
		{
			LOG.debug("force saving because of reload changes from remote file");
			save=true;
		}
		if (save) {
			config.setProperty(SECTION_MARKER_AAI + "." + PROPERTY_KEY_BASEURL, this.baseUrl);
			config.setProperty(SECTION_MARKER_AAI + "." + PROPERTY_KEY_USERCREDENTIALS,
					(nullorempty(this.username) && nullorempty(this.password))?"":(this.username + ":" + this.password));
			config.setProperty(SECTION_MARKER_AAI + "." + PROPERTY_KEY_HEADERS, _printHeadersMap(this.headers));
			config.setProperty(SECTION_MARKER_AAI + "." + PROPERTY_KEY_DELETEONMOUNTPOINTREMOVED,
					this.deleteOnMountPointRemoved);
			config.setProperty(SECTION_MARKER_AAI + "." + PROPERTY_KEY_TRUSTALLCERTS, this.trustAllCerts);
			config.setProperty(SECTION_MARKER_AAI+"."+PROPERTY_KEY_AAIPROP_FILE, this.aaiPropFile);
			config.setProperty(SECTION_MARKER_AAI+"."+PROPERTY_KEY_APIVERSION,this.apiVersion);
			config.setProperty(SECTION_MARKER_AAI+"."+PROPERTY_KEY_APPLICATIONID, this.applicationIdentifier);
			config.setProperty(SECTION_MARKER_AAI+"."+PROPERTY_KEY_CONNECTIONTIMEOUT, this.connectionTimeout);
			/*if(this.pcks12CertificateFilename !=null && !this.pcks12CertificateFilename.isEmpty() &&
					this.pcks12CertificatePassphrase!=null && !this.pcks12CertificatePassphrase.isEmpty())*/
			{
				LOG.debug("no client credentials to save");
				config.setProperty(SECTION_MARKER_AAI+"."+PROPERTY_KEY_PCKS12CERTFILENAME, this.pcks12CertificateFilename);
				config.setProperty(SECTION_MARKER_AAI+"."+PROPERTY_KEY_PCKS12PASSPHRASE, this.pcks12CertificatePassphrase);
			}
			LOG.debug("save");
			this.save();
		}
	}

	private boolean nullorempty(String s) {
		return s==null || s.isEmpty();
	}

	public boolean isOff() {
		return this.baseUrl == null || this.baseUrl.toLowerCase().equals("off");
	}

	private static boolean propertyEquals(final Object p1,final Object p2)
	{
		return (p1==null && (p2==null) || p1.equals(p2));
	}
	private static boolean propertyEquals(final boolean p1,final boolean p2)
	{
		return p1==p2;
	}
	private static boolean propertyEquals(final int p1,final int p2)
	{
		return p1==p2;
	}
	@Override
	public boolean equals(Object obj) {
		if (obj instanceof AaiConfig) {
			AaiConfig cobj = (AaiConfig) obj;
			if(!AaiConfig.propertyEquals(cobj.baseUrl, this.baseUrl))
				return false;
			if(!AaiConfig.propertyEquals(cobj.apiVersion, this.apiVersion))
				return false;
			if(!AaiConfig.propertyEquals(cobj.username, this.username))
				return false;
			if(!AaiConfig.propertyEquals(cobj.password, this.password))
				return false;
			if(!AaiConfig.propertyEquals(cobj.deleteOnMountPointRemoved, this.deleteOnMountPointRemoved))
				return false;
			if(!AaiConfig.propertyEquals(cobj.headers, this.headers))
				return false;
			if(!AaiConfig.propertyEquals(cobj.trustAllCerts, this.trustAllCerts))
				return false;
			if(!AaiConfig.propertyEquals(cobj.aaiPropFile, this.aaiPropFile))
				return false;
			if(!AaiConfig.propertyEquals(cobj.connectionTimeout, this.connectionTimeout))
				return false;
			if(!AaiConfig.propertyEquals(cobj.pcks12CertificateFilename, this.pcks12CertificateFilename))
				return false;
			if(!AaiConfig.propertyEquals(cobj.pcks12CertificatePassphrase, this.pcks12CertificatePassphrase))
				return false;
			if(!AaiConfig.propertyEquals(cobj.applicationIdentifier, this.applicationIdentifier))
				return false;

			/*
			if (!((cobj.baseUrl == null && this.baseUrl == null) || cobj.baseUrl.equals(this.baseUrl)))
				return false;
			if (!((cobj.apiVersion == null && this.apiVersion == null) || cobj.apiVersion.equals(this.apiVersion)))
				return false;
			if (!((cobj.username == null && this.username == null) || cobj.username.equals(this.username)))
				return false;
			if (!((cobj.password == null && this.password == null) || cobj.password.equals(this.password)))
				return false;
			if (!(cobj.deleteOnMountPointRemoved != this.deleteOnMountPointRemoved))
				return false;
			if (!((cobj.headers == null && this.headers == null) || cobj.headers.equals(this.headers)))
				return false;
			if (!(cobj.trustAllCerts != this.trustAllCerts))
				return false;
*/
			return true;
		}
		return super.equals(obj);
	}

	public String getBaseUrl() {
		String url=this.baseUrl;
		if(!url.endsWith("/"))
			url+="/";
		if(this.apiVersion.startsWith("/"))
			this.apiVersion=this.apiVersion.substring(1);
		return url+this.apiVersion;
	}

	public Map<String, String> getHeaders() {
		if (this.headers == null)
			this.headers = new HashMap<String, String>();
		this.headers.put(HEADER_KEY_APPLICATION, this.applicationIdentifier);
		String s = this.headers.getOrDefault("Authorization", null);
		if (nullorempty(s) && !nullorempty(this.username) && !nullorempty(this.password)) {
			this.headers.put("Authorization", "Basic "
					+ new String(Base64.getEncoder().encode((this.username + ":" + this.password).getBytes())));
		}
		return this.headers;
	}

	@Override
	public String toString() {
		return "AaiConfig [aaiPropFile=" + aaiPropFile + ", baseUrl=" + baseUrl + ", apiVersion=" + apiVersion
				+ ", applicationIdentifier=" + applicationIdentifier + ", username=" + username + ", password="
				+ password + ", pcks12CertificateFilename=" + pcks12CertificateFilename
				+ ", pcks12CertificatePassphrase=" + pcks12CertificatePassphrase + ", connectionTimeout="
				+ connectionTimeout + ", deleteOnMountPointRemoved=" + deleteOnMountPointRemoved + ", trustAllCerts="
				+ trustAllCerts + ", headers=" + this.getHeaders() + "]";
	}

	private static String _printHeadersMap(Map<String, String> headers) {
		String r = "[";
		if (headers != null) {
			int i = 0;
			for (Entry<String, String> entry : headers.entrySet()) {
				if (i > 0)
					r += ",";
				r += "\"" + entry.getKey() + ":" + entry.getValue() + "\"";
				i++;
			}
		}
		r += "]";
		return r;
	}

	private static Map<String, String> _parseHeadersMap(String s) throws JSONException {
		Map<String, String> r = new HashMap<String, String>();
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
		return r;
	}

	public static boolean isInstantiated() {
		return aaiConfig != null;
	}

	public static AaiConfig getDefaultConfiguration() {
		return new AaiConfig();
	}

	public static AaiConfig getAai(IniConfigurationFile config, ISubConfigHandler configHandler) {
		if (aaiConfig == null)
			try {
				aaiConfig = new AaiConfig(config, configHandler);
			} catch (ConfigurationException e) {
				aaiConfig = AaiConfig.getDefaultConfiguration();
			}
		return aaiConfig;
	}

	public static AaiConfig reload() {
		if (aaiConfig == null)
			return null;
		AaiConfig tmpConfig;
		try {
			tmpConfig = new AaiConfig(aaiConfig.getConfig(), aaiConfig.getConfigHandler(), false);
		} catch (ConfigurationException e) {
			tmpConfig = AaiConfig.getDefaultConfiguration();
			LOG.warn("problem loading config: "+e.getMessage());
		}
		aaiConfig = tmpConfig;
		return aaiConfig;
	}

	public boolean getTrustAll() {
		return this.trustAllCerts;
	}

	public String getPcks12CertificateFilename() {
		return this.pcks12CertificateFilename;
	}

	public String getPcks12CertificatePassphrase() {
		return this.pcks12CertificatePassphrase;
	}

	public int getConnectionTimeout() {
		return this.connectionTimeout;
	}

}
