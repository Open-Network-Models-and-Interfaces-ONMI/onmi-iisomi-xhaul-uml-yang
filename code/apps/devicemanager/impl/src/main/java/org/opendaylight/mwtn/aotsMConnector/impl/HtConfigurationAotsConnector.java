package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Properties;
import javax.annotation.Nullable;

import org.opendaylight.mwtn.aotsMConnector.impl.SendMail.SMTPConfig;
import org.opendaylight.mwtn.base.database.EsObject;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.config.impl.HtDatabaseConfigService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HtConfigurationAotsConnector extends EsObject {

    private static final Logger LOG = LoggerFactory.getLogger(HtConfigurationAotsConnector.class);

    private static final String CONFIGURATIONID = "org.opendaylight.mwtn.aotsmconnector";
    private static final String CONFIGURATIONFILE = "etc/aotsmconnector.properties";
    private static final String CONFIGURATIONFILE_LOCAL = "aotsmconnector.properties";  // for testing
    private static boolean CONFIGLOCAL=false;
    public static void setTestMode() {CONFIGLOCAL=true;}
    private static String getConfigFile()
    {return CONFIGLOCAL?CONFIGURATIONFILE_LOCAL:CONFIGURATIONFILE;}

    public static final String ESDATATYPENAME = "database";
    private static final String EMPTY = "empty";
    public static final int PRTOFF_DEFAULT = 20*60;//20h
    public static String getTemplate()
    {return FILECONTENTTEMPLATE;}
    private static final String FILECONTENTTEMPLATE =
            "#Properties for aotsmConnector of devicemanager\n" +
            "#Add parameters without additional spaces after equal sign.\n" +
            "\n" +
            "#Full URL of the receiver for add requests\n" +
            "#soapurladd=\n" +
            "#If there is no receiver available switched of with the off configuration\n" +
            "soapurladd=off\n" +
            "#xml template file\n"+
            "addtemplate=addreq.tmpl.xml\n"+
            "#http request timeout in seconds\n"+
             "soapaddtimeout=10\n"+
            "\n" +
            "#Full URL of the receiver for inquire requests\n" +
            "#soapurlinq=\n" +
            "#If there is no receiver available switched of with the off configuration\n" +
            "soapurlinq=off\n" +
            "#xml template file\n"+
            "inqtemplate=inqreq.tmpl.xml\n"+
            "#http request timeout in seconds\n"+
            "soapinqtimeout=20\n"+
            "#ticket severities that will pass to aots(comma separated)\n"+
            "severitypassthrough=critical,major,minor,warning\n"+
            "#plannedRestorTime Offset after notification Timestamp in minutes\n"+
            "#var 1:(one default value)\n"+
            "#prt-offset=1200\n"+
            "#var 2:(comma seperated values for each severity\n"+
            "#prt-offset=360,600,1200,1440\n"+
            "#var 3:(comma seperated array for each severity, array[NOOUTAGE FULLOUTAGE GT50PCT LT50PCT])\n"+
            "prt-offset=[1080 360 360 360],[1800 1080 1080 1800],[2880 2880 2880 2880],[2880 2880 2880 2880]\n"+
            "\n" +
            "#credentials\n"+
            "userName=user\n"+
            "userPassword=passwd\n"+
            "systemuser=user\n"+
            "assignedto=userid\n"+
            "\n"+
            "#optional smtp fallback for sending reports\n"+
            "#If no email report wanted just comment out all smtp Options\n"+
            "#HostName or HostIp of the smtp server\n"+
            "#smtpHost=smtp.example.com\n"+
            "#smtp port (default: 587 for smtp with TLS)\n"+
            "#smtpPort=587\n"+
            "#smtpUsername=john.doe\n"+
            "#smtpPassword=password\n"+
            "#email address sender\n"+
            "#smtpSender=john.doe@example.com\n"+
            "#comma seperated email addresses\n"+
            "#smtpReceivers=jane.smith@example.com\n"+
            "\n";

    private String soapUrlAdd=EMPTY;
    private String soapUrlInq=EMPTY;
    private String httpUserCredentials=EMPTY;
    private String userName = EMPTY;
    private String userPassword = EMPTY;
    private String systemUser = EMPTY;
    private String assignedTo = EMPTY;
    private int soapAddTimeout = 10;
    private int soapInqTimeout = 20;
    private String[] severityPassthrough=null;
    private int prtOffDefault = 20*60;
    private PrtOffsetMap prtOffsets;
    private String addMobilityTemplateFilename;
    private String inqMobilityTemplateFilename;

    private SMTPConfig smtpConfig = null;

	/*
     * Constructor
     */


    public HtConfigurationAotsConnector() {
    }

    /*
     * Setter
     */

    public void setSoapUrlAdd(String url) {
        this.soapUrlAdd = url;
    }
    public void setSoapUrlInq(String url) {
        this.soapUrlInq = url;
    }

    public void setUserCredentials(String username,String password) {
        this.userName=username;
        this.userPassword=password;
        this.httpUserCredentials=String.format("%s:%s",username,password);
    }

    public void setSystemUser(String user) {
        this.systemUser = user;
    }
    public void setAssignedTo(String id)
    {this.assignedTo=id;}

    public void setTimeoutAdd(int timeout)
    {this.soapAddTimeout=timeout;}
    public void setTimeoutInq(int timeout)
    {this.soapInqTimeout=timeout;}
    public void setSeverityPassthrough(String s)
    {
    	if(s!=null)
    		this.severityPassthrough=s.split(",");
    	else
    		this.severityPassthrough=null;
    }
    public void setPrtOffset(int off)
    {this.setPrtOffset(new int[] {off});}

    public void setAddMobilityTemplateFilename(String s)
    {
    	if(s!=null && !s.contains("/"))
    		s="etc/"+s;
    	this.addMobilityTemplateFilename=s;
    }
    public void setInqMobilityTemplateFilename(String s)
    {
    	if(s!=null && !s.contains("/"))
    		s="etc/"+s;
    	this.inqMobilityTemplateFilename=s;
    }

    /*
     * Getter
     */

    public String getSoapUrlAdd() {
        return this.soapUrlAdd;
    }
    public String getSoapUrlInq() {
        return this.soapUrlInq;
    }

    public String getHttpUserCredentials() {
        return this.httpUserCredentials;
    }

    public String getUsername() {
        return this.userName;
    }

    public String getPassword() {
        return this.userPassword;
    }

    public String getSystemUser() {
        return this.systemUser;
    }
    public String[] getSeverityPassthrough()
    {return this.severityPassthrough;}

    public boolean isOff()
    {
    	return this.soapUrlAdd==null || this.soapUrlAdd.equals("off") || this.soapUrlAdd.length()<=0;
    }
    public boolean isInquireOff() {
    	return this.soapUrlInq==null || this.soapUrlInq.equals("off") || this.soapUrlInq.length()<=0;
	}
    private void setSmtpConfig(SMTPConfig config) {
    	this.smtpConfig=config;
	}
    public SMTPConfig getSmtpConfig()
    {
    	return this.smtpConfig;
    }
    public String getAssignedTo()
    {	return this.assignedTo;}

    public int getTimeoutAdd()
    {return this.soapAddTimeout;}
    public int getTimeoutInq()
    {return this.soapInqTimeout;}

    public boolean severityCanPass(String sev)
    {
    	if(this.severityPassthrough==null)
    		return false;
    	if(sev==null)
    		return false;

    	for(String s:this.severityPassthrough)
    	{
    		if(s!=null && s.length()>0 && s.equals(sev))
    			return true;
    	}
    	return false;

    }
    public String getAddMobilityTemplateFilename()
    {	return this.addMobilityTemplateFilename; }
    public String getInqMobilityTemplateFilename()
    {	return this.inqMobilityTemplateFilename; }


    /*
     * Print and read
     */

    @Override
	public String toString() {
		return "HtConfigurationAotsConnector [soapUrlAdd=" + soapUrlAdd + ", soapUrlInq=" + soapUrlInq
				+ ", httpUserCredentials=" + httpUserCredentials + ", userName=" + userName + ", userPassword="
				+ userPassword + ", systemUser=" + systemUser + ", assignedTo=" + assignedTo + ", soapAddTimeout="
				+ soapAddTimeout + ", soapInqTimeout=" + soapInqTimeout + ", severityPassthrough="
				+ Arrays.toString(severityPassthrough) + ", prtOffDefault=" + prtOffDefault + ", prtOffsets="
				+ prtOffsets + ", addMobilityTemplateFilename=" + addMobilityTemplateFilename
				+ ", inqMobilityTemplateFilename=" + inqMobilityTemplateFilename + ", smtpConfig=" + smtpConfig + "]";
	}

    /**
     * Get configuration for the service
     * @param configurationService Access to DB configuration section
     * @return HtConfigurationEcompConnector with configuration information
     */
    public static HtConfigurationAotsConnector getConfiguration(HtDatabaseConfigService configurationService) {

        HtConfigurationAotsConnector configuration;

        configuration = HtConfigurationAotsConnector.readConfigurationFromFile(getConfigFile());
        if (configuration != null) {
            LOG.info("Got configuration from File");

        } else if (configurationService != null) {
            configuration = readConfigurationFromDB(configurationService);
        }

        if (configuration == null) {
            LOG.info("Use defaultconfigurtion and create default configuration file"+getConfigFile());
            createDefaultConfigurationFromFile(getConfigFile());
            configuration = HtConfigurationAotsConnector.readConfigurationFromFile(getConfigFile());
        }

        if (configuration == null) {
            throw new IllegalArgumentException("No configuration available.");
        }
        return configuration;
    }



	/**
     * Read configuration from FILE
     * @param fileName of configuration file
     * @return HtConfigurationEcompConnector
     */
    public static @Nullable HtConfigurationAotsConnector readConfigurationFromFile(String fileName) {

        HtConfigurationAotsConnector fileConfiguration = null;

        try {
            Properties properties = new Properties();
            File file = new File(fileName);

            if (file.exists()) {
                FileInputStream fileInput;

                fileInput = new FileInputStream(file);
                properties.load(fileInput);
                fileInput.close();

                fileConfiguration = new HtConfigurationAotsConnector();
                fileConfiguration.setSoapUrlAdd(properties.getProperty("soapurladd"));
                fileConfiguration.setSoapUrlInq(properties.getProperty("soapurlinq"));
                fileConfiguration.setUserCredentials(properties.getProperty("userName"),properties.getProperty("userPassword"));
                fileConfiguration.setSystemUser(properties.getProperty("systemuser"));
                fileConfiguration.setAssignedTo(properties.getProperty("assignedto"));
                fileConfiguration.setSeverityPassthrough(properties.getProperty("severitypassthrough",""));
                fileConfiguration.setAddMobilityTemplateFilename(properties.getProperty("addtemplate","addreq.tmpl.xml"));
                fileConfiguration.setInqMobilityTemplateFilename(properties.getProperty("inqtemplate","inqreq.tmpl.xml"));

                try
                {
                	fileConfiguration.setPrtOffset(properties.getProperty("prt-offset",String.format("%d", PRTOFF_DEFAULT)));
                }
                catch(Exception e)
                {
                	LOG.warn("malformed config value prt-off. has to be integer.");
                	fileConfiguration.setPrtOffset(PRTOFF_DEFAULT);
                }
                try
                {
                	fileConfiguration.setTimeoutAdd(Integer.parseInt(properties.getProperty("soapaddtimeout","10")));
                	fileConfiguration.setTimeoutInq(Integer.parseInt(properties.getProperty("soapinqtimeout","20")));
                }
                catch(Exception e)
                {
                	LOG.warn("Error in properties with timeout values:"+e.getMessage());
                }
                String host=properties.getProperty("smtpHost");
                if(host!=null && host.length()>0)
                {
                	int port = Integer.parseInt(properties.getProperty("smtpPort"));
                	String email = properties.getProperty("smtpSender");
                	String receivers = properties.getProperty("smtpReceivers");
                	String username=properties.getProperty("smtpUsername");
                	String passwd = properties.getProperty("smtpPassword");
                	fileConfiguration.setSmtpConfig(new SMTPConfig(host,port,email,username,passwd,receivers));
                }
                else
                	fileConfiguration.setSmtpConfig(null);

            }
        } catch (Exception e) {
            LOG.warn("something in config failed: "+e.getMessage());
        }

        return fileConfiguration;
    }


    /*
     * comma seperated values :
     * 	[1] for critical,major,minor, warning
     *  [2] one for all
     *  [3] like [1] but within an array for customerImpact [NOOUTAGE FULLOUTAGE >50pct <50pct]
     */
	public void setPrtOffset(String propertyString) {
		if(prtOffsets==null)
			prtOffsets=new PrtOffsetMap();
		this.prtOffsets.clear();
		if(!propertyString.contains(","))
			this.setPrtOffset(Integer.parseInt(propertyString));
		String[] hlp=propertyString.split(",");
		int[] intvalues=new int[hlp.length];
		InternalSeverity[] sevMap= {InternalSeverity.Critical,InternalSeverity.Major,InternalSeverity.Minor,InternalSeverity.Warning};
		int[] ciMap= {AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,
				AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,
				AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,
				AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT};
		boolean extMode=propertyString.contains("[") && propertyString.contains("]");
		if(hlp.length>0)
		{
			for(int i=0;i<hlp.length;i++)
			{
				if(extMode)
				{
					//parse Array
					String[] hlp2=hlp[i].substring(1,hlp[i].length()-1).split(" ");
					for(int j=0;j<hlp2.length && j<sevMap.length;j++)
					{
						if(i==0 && j==0)
							this.prtOffDefault=Integer.parseInt(hlp2[j]);
						this.setPrtOffset(ciMap[j],sevMap[i],Integer.parseInt(hlp2[j]));
					}
				}
				else
					intvalues[i]=Integer.parseInt(hlp[i]);
			}
		}
		if(!extMode)
			this.setPrtOffset(intvalues);
	}

	private void setPrtOffset(int customerImpact,InternalSeverity sev, int value) {
		if(prtOffsets==null)
			prtOffsets=new PrtOffsetMap();
		this.prtOffsets.put(customerImpact, sev, value);
	}

	private void setPrtOffset(int[] values) {
		if(prtOffsets==null)
			prtOffsets=new PrtOffsetMap();
		this.prtOffsets.clear();
		if(values!=null)
		{
			if(values.length>0)
			{
				this.prtOffDefault=values[0];
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Critical, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Critical, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Critical, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Critical, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Major, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Major, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Major, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Major, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Minor, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Minor, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Minor, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Minor, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Warning, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Warning, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Warning, this.prtOffDefault);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Warning, this.prtOffDefault);
			}
			if(values.length>1)
			{
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Major, values[1]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Major, values[1]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Major, values[1]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Major, values[1]);
			}
			if(values.length>2)
			{
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Minor, values[2]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Minor, values[2]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Minor, values[2]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Minor, values[2]);
			}
			if(values.length>3)
			{
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Warning, values[3]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Warning, values[3]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Warning, values[3]);
				this.prtOffsets.put(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Warning, values[3]);
				}
		}
	}
	public int getPrtOffset() {
		return this.prtOffDefault;
	}

	public int getPrtOffset(InternalSeverity s)
	{
		return this.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,s);
	}
	public int getPrtOffset(int customerImpact,InternalSeverity s)
	{
		if(this.prtOffsets!=null && this.prtOffsets.containsKey(customerImpact,s))
			return this.prtOffsets.get(customerImpact,s);
		return this.prtOffDefault;
	}

	/**
     * Create a file with configuration information
     * @param filename of config file
     */
    private static void createDefaultConfigurationFromFile( String filename ) {
        try{
            PrintWriter writer = new PrintWriter(filename, "UTF-8");
            writer.print(FILECONTENTTEMPLATE);
            writer.close();
            LOG.info("Created: "+filename);
        } catch (IOException e) {
            LOG.warn("Couldn't write configuration file "+filename+" with reason: "+e.getMessage());
        }
    }

    /**
     * Read configuration from database
     * @param configurationService to access the config part of the database
     * @return HtConfigurationEcompConnector
     */
    public static @Nullable HtConfigurationAotsConnector readConfigurationFromDB(HtDatabaseConfigService configurationService) {

        if (configurationService == null) {
            LOG.info("No configuration database Service available");
        } else {
            HtConfigurationAotsConnector newConfiguration = configurationService.getHtConfigurationAotsConnector(CONFIGURATIONID);
            if (newConfiguration != null) {
                return newConfiguration;
            }
        }
        return null;
    }

	public boolean severityCanPass(InternalSeverity severity) {
		return this.severityCanPass(severity.toNetconfString());
	}

	/*
	 * Map severity and problemName to a customer impact
	 */
	public int getCustomerImpact(InternalSeverity severity,String problemName)
	{
		return AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE;
	}



}
