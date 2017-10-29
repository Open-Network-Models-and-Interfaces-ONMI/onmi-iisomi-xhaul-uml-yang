package org.opendaylight.mwtn.aotsMConnector.test;

import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;
import org.opendaylight.mwtn.aotsMConnector.impl.HtConfigurationAotsConnector;
import org.opendaylight.mwtn.aotsMConnector.impl.SendMail;
import org.opendaylight.mwtn.aotsMConnector.impl.SendMail.SMTPConfig;
import org.opendaylight.mwtn.config.impl.HtDatabaseConfigService;

public class EmailTest {

	private static void startLog() {
		ConsoleAppender console = new ConsoleAppender(); // create appender
		// configure the appender
		// String PATTERN = "%d [%p|%c|%C{1}] %m%n";
		String PATTERN = "%d [%p|%C{1}] %m%n";
		console.setLayout(new PatternLayout(PATTERN));
		console.setThreshold(Level.DEBUG);
		console.activateOptions();
		// add appender to any Logger (here is root)
		Logger.getRootLogger().addAppender(console);
	}

	public static void main(String[] args) {

		startLog();
		HtDatabaseConfigService configurationService = new HtDatabaseConfigService();
		HtConfigurationAotsConnector config = HtConfigurationAotsConnector.getConfiguration(configurationService);

		SMTPConfig cfg = config.getSmtpConfig();
		if (cfg != null) {

			System.out.println("try to send mail to:");
			SendMail mailer = new SendMail(cfg);
			System.out.println(cfg.EmailReceivers.toString());
			System.out.println("...");
			String subject = "test program";
			String body = "<p>Here you can find your ad</p>";
			String xml = "<testxml><soapblablabla><content>1</content></soapblablabla></testxml>";
			String xml2 = "<testxml><soapblablabla><content>3</content></soapblablabla></testxml>";
			mailer.appendFile("file1.xml",xml).appendFile("file2.xml",xml2).Send(subject, body);
			System.out.println("completed");
		} else
			System.out.println("config is not valid");
		System.exit(0);
	}
}
