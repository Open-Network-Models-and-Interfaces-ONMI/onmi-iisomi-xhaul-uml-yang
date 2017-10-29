package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.File;

import org.opendaylight.mwtn.config.impl.HtDatabaseConfigService;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AotsMProviderClient {

	private static final Logger LOG = LoggerFactory.getLogger(AotsMProviderClient.class);

	private final HtConfigurationAotsConnector configuration;
	private final HtDatabaseConfigService configurationService;
	private final AotsMSenderImpl aotsMClientAdd;
	private final AotsMSenderImpl aotsMClientInquire;
	private AddMobilityTemplateFile addMobilityTemplate;
	private InquireMobilityTemplateFile inqMobilityTemplate;

	private AotsMProviderTask task;

	public AotsMProviderClient(HtDatabaseConfigService configurationService) {

		this.configurationService = configurationService;
		// Get configuration
		this.configuration = HtConfigurationAotsConnector.getConfiguration(this.configurationService);

		// Start services
		LOG.info("Configuration: " + configuration);
		// set system credentials
		AotsTemplateFile.setCredentials(configuration.getUsername(), configuration.getPassword(),
				configuration.getSystemUser(), configuration.getAssignedTo());

		if (!this.configuration.isOff()) {
			this.aotsMClientAdd = new AotsMSenderImpl(configuration.getSoapUrlAdd(),
					configuration.getHttpUserCredentials(), configuration.getTimeoutAdd());
			try
			{
				LOG.debug("loading addreq template from file "+this.configuration.getAddMobilityTemplateFilename());
				this.addMobilityTemplate = new AddMobilityTemplateFile(new File(this.configuration.getAddMobilityTemplateFilename()));
				LOG.debug("loading addreq template succeeded");
			}
			catch(Exception e)
			{
				LOG.error("error loading add template: "+e.getMessage());
				this.addMobilityTemplate = AddMobilityTemplateFile.LoadDefault();
			}

			if (!this.configuration.isInquireOff())
			{
				this.aotsMClientInquire = new AotsMSenderImpl(configuration.getSoapUrlInq(),
						configuration.getHttpUserCredentials(), configuration.getTimeoutInq());
				try
				{
					LOG.debug("loading inqreq template from file "+this.configuration.getInqMobilityTemplateFilename());
					this.inqMobilityTemplate = new InquireMobilityTemplateFile(new File(this.configuration.getInqMobilityTemplateFilename()));
					LOG.debug("loading inqreq template succeeded");
				}
				catch(Exception e)
				{
					LOG.error("error loading inq template: "+e.getMessage());
					this.inqMobilityTemplate = InquireMobilityTemplateFile.LoadDefault();
				}
			}
			else
				this.aotsMClientInquire = null;
		} else {
			this.aotsMClientAdd = null;
			this.aotsMClientInquire = null;
		}
		if (this.aotsMClientAdd != null || this.aotsMClientInquire != null
				|| this.configuration.getSmtpConfig() != null) {
			LOG.info(String.format("starting Aots thread (add=%s;inq=%s,email=%s)",
					this.aotsMClientAdd == null ? "off" : "on", this.aotsMClientInquire == null ? "off" : "on",
					this.configuration.getSmtpConfig() == null ? "off" : "on"));
			this.task = new AotsMProviderTask(this.aotsMClientAdd, this.aotsMClientInquire,
					this.addMobilityTemplate,this.inqMobilityTemplate,this.configuration.getSmtpConfig());
			new Thread(this.task).start();
		} else
			LOG.info("Aots is completely off");

	}
	public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification) {
		this.sendProblemNotification(mountPointName, notification,true);
	}

	public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification, boolean neDeviceAlarm) {
		if (notification != null) {
			if (this.configuration.severityCanPass(notification.getSeverity())) {
				LOG.debug(String.format("push notification (%s) to aotsm queue",notification.toString()));
				if (task != null)
				{
					int ci=this.configuration.getCustomerImpact(notification.getSeverity(), notification.getProblem());
					this.task.pushNotification(mountPointName,
							notification,
							this.configuration.getPrtOffset(ci,notification.getSeverity()),
							ci,
							neDeviceAlarm);
				}
			} else
				LOG.debug(String.format("notification (%s) not pushed by config filter",notification.toString()));
		} else
			LOG.debug("notification is null");
	}

	public void close() {
		if (this.task != null)
			this.task.stop();

	}

	/*
	 * --------------------------------------------------------- Private
	 */

}
