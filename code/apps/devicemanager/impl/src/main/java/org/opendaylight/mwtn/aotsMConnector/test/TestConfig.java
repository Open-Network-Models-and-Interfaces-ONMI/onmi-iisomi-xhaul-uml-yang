package org.opendaylight.mwtn.aotsMConnector.test;

import org.apache.log4j.Priority;
import org.opendaylight.mwtn.aotsMConnector.impl.AotsTemplateFile;
import org.opendaylight.mwtn.aotsMConnector.impl.HtConfigurationAotsConnector;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.config.impl.HtLogger;

public class TestConfig {


	public static void main(String[] args)
	{
		HtLogger.initConsole(Priority.DEBUG);
		System.out.println("starting config test:");
		HtConfigurationAotsConnector.setTestMode();
		//HtConfigurationAotsConnector config = HtConfigurationAotsConnector.readConfigurationFromFile("/home/herbert/odl/distribution-karaf-0.5.3-Boron-SR3/etc/aotsmconnector.properties");
		HtConfigurationAotsConnector config = HtConfigurationAotsConnector.getConfiguration(null);

		System.out.println(HtConfigurationAotsConnector.getTemplate());
		//test severity passthrough
		//testSeverityPass(config);
		//testPrtOff(config);


		System.out.println("tests finished");
	}

	private static void testSeverityPass(HtConfigurationAotsConnector config) {
		System.out.println("testing severity-passthrough");
		config.setSeverityPassthrough("critical,major,minor,warning");
		if(!config.severityCanPass(InternalSeverity.Critical))
			System.err.println("  critical not in sevpass");
		else
			System.out.println("  critical passed");
		if(!config.severityCanPass(InternalSeverity.Major))
			System.err.println("  major not in sevpass");
		else
			System.out.println("  major passed");
		if(!config.severityCanPass(InternalSeverity.Minor))
			System.err.println("  minor not in sevpass");
		else
			System.out.println("  minor passed");
		if(!config.severityCanPass(InternalSeverity.Warning))
			System.err.println("  warning not in sevpass");
		else
			System.out.println("  warning passed");

	}

	private static void testPrtOff(HtConfigurationAotsConnector config) {
		System.out.println("testing prt-offset case 2");
		config.setPrtOffset("360,600,1200,1440");
		if(config.getPrtOffset(InternalSeverity.Critical)!=360)
			System.err.println("  critical not correct");
		else
			System.out.println("  critical passed");
		if(config.getPrtOffset(InternalSeverity.Major)!=600)
			System.err.println("  major not correct");
		else
			System.out.println("  major passed");
		if(config.getPrtOffset(InternalSeverity.Minor)!=1200)
			System.err.println("  minor not correct");
		else
			System.out.println("  minor passed");
		if(config.getPrtOffset(InternalSeverity.Warning)!=1440)
			System.err.println("  warning not correct");
		else
			System.out.println("  warning passed");

		System.out.println("testing prt-offset case 3");
		int ci=AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE;
		config.setPrtOffset("[300 400 500 600],[600 700 800 900],[1200 1300 1400 1500],[1440 1540 1640 1740]");
		if((config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Critical)!=300) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Critical)!=400) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Critical)!=500) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Critical)!=600))
			System.err.println("  critical not correct");
		else
			System.out.println("  critical passed");
		if((config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Major)!=600) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Major)!=700) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Major)!=800) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Major)!=900))
			System.err.println("  major not correct");
		else
			System.out.println("  major passed");
		if((config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Minor)!=1200) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Minor)!=1300) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Minor)!=1400) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Minor)!=1500))
			System.err.println("  minor not correct");
		else
			System.out.println("  minor passed");
		if((config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE,InternalSeverity.Warning)!=1440) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_FULLOUTAGE,InternalSeverity.Warning)!=1540) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT,InternalSeverity.Warning)!=1640) &&
				(config.getPrtOffset(AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT,InternalSeverity.Warning)!=1740))
			System.err.println("  warning not correct");
		else
			System.out.println("  warning passed");

	}
}
