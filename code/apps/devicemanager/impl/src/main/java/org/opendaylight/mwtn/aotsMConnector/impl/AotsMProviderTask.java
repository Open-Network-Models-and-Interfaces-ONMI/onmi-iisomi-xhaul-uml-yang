/**
 * ThreadRunnable for sending aotsMMessages
 *
 * @author herbert, Micha
 *
 */
package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.IOException;
import java.util.concurrent.SynchronousQueue;

import javax.xml.parsers.ParserConfigurationException;

import org.opendaylight.mwtn.aotsMConnector.impl.SendMail.SMTPConfig;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

class AotsMProviderTask implements Runnable {

	private static final Logger LOG = LoggerFactory.getLogger(AotsMProviderTask.class);

	private static final int INQREQ_RETVALUE_NONE = 0;	/* should not happen*/
	private static final int INQREQ_RETVALUE_NOTHING_FOUND = 1;	/*request successful => no tickets found */
	private static final int INQREQ_RETVALUE_ITEM_FOUND = 2;	/*request successful => open ticket(s) found */
	private static final int INQREQ_RETVALUE_ITEM_FOUND_BUTCLOSED = 6;	/*request successful => only closed tickets found */
	private static final int INQREQ_RETVALUE_RESPONSE_ERROR = 3; /*request successful, but response says error(e.g. badrequest) */
	private static final int INQREQ_RETVALUE_PARSERERROR = 4;	/*cannot read response */
	private static final int INQREQ_RETVALUE_REQUEST_ERROR = 5; /*send request failed */

	private static final int ADDREQ_RETVALUE_NONE = 0;	/* should not happen*/
	private static final int ADDREQ_RETVALUE_OK = 1;	/*request successful => ticket inserted */
	private static final int ADDREQ_RETVALUE_RESPONSE_ERROR = 1; /*request successful, but ticket not inserted(response error)*/
	private static final int ADDREQ_RETVALUE_PARSERERROR = 2;	/*cannot read response */
	private static final int ADDREQ_RETVALUE_REQUEST_ERROR = 3; /*send request failed */

	private static final String ADDMOB_EMAIL_HEADER = "AOTSM AddMobility Request";

	private final AotsMSenderImpl clientAdd;
	private final AotsMSenderImpl clientInq;
	private final AddMobilityTemplateFile addmobilityTemplate;
	private final InquireMobilityTemplateFile inqmobilityTemplate;
	private final SynchronousQueue<AotsMMessage> queue;

	private boolean stopped;

	private final SMTPConfig smtpConfig;
	AotsMProviderTask(AotsMSenderImpl clientAdd,AotsMSenderImpl clientInq, AddMobilityTemplateFile addTemplate, InquireMobilityTemplateFile inqTemplate) {
		this(clientAdd,clientInq,addTemplate,inqTemplate,null);
	}
	AotsMProviderTask(AotsMSenderImpl clientAdd,AotsMSenderImpl clientInq, AddMobilityTemplateFile addTemplate, InquireMobilityTemplateFile inqTemplate, SMTPConfig config) {
		LOG.info("Create aotsmprovider task");
		this.queue = new SynchronousQueue<>();
		this.clientAdd = clientAdd;
		this.clientInq = clientInq;
		this.addmobilityTemplate = addTemplate;
		this.inqmobilityTemplate = inqTemplate;
		this.smtpConfig = config;
	}

	/*
	 *
	 */
	private int sendInquireRequestSync(AotsMMessage msg) {
		int r=INQREQ_RETVALUE_NONE;
		final StringBuffer strRequest=new StringBuffer();
		AotsMResponse response=null;
		try
		{
			if(this.clientInq!=null)
			{
				LOG.debug("try to send inquire request");
				response = msg.postNotificationInquireMobility(this.clientInq,this.inqmobilityTemplate,strRequest);
				if(response.isSuccessful())
				{
					if(!response.hasResultObjects())
					{
						r=INQREQ_RETVALUE_NOTHING_FOUND;
						LOG.debug("inquire response: no items found");
					}
					else
					{
						if(response.hasOpenTicket())
						{
							r=INQREQ_RETVALUE_ITEM_FOUND;
							LOG.debug("inquire response: items found");
						}
						else
						{
							r=INQREQ_RETVALUE_ITEM_FOUND_BUTCLOSED;
							LOG.debug("inquire response: items found but closed");
						}
					}
				}
				else
				{
					r=INQREQ_RETVALUE_RESPONSE_ERROR;
					LOG.debug("inquire response not successful");
				}
			}
			else
			{
				r=INQREQ_RETVALUE_NOTHING_FOUND;
				LOG.debug("inquire is deactivated");
			}
		}
		catch(SAXException | ParserConfigurationException | IOException e)
		{
			LOG.error(e.getMessage());
			r=INQREQ_RETVALUE_PARSERERROR;
		}
		catch (Exception err) {
			LOG.error(err.getMessage());
			r = INQREQ_RETVALUE_REQUEST_ERROR;
		}

		return r;
	}

	private int sendAddMobilityRequest(AotsMMessage msg) {
		int r = ADDREQ_RETVALUE_NONE;
		final StringBuffer strRequest=new StringBuffer();
		LOG.debug("try to send addmobility request");
		AotsMResponse response=null;
		try {
			response=msg.postNotificationAddMobility(this.clientAdd,this.addmobilityTemplate,strRequest);

			if(response.isSuccessful())
			{
				r=ADDREQ_RETVALUE_OK;
				LOG.info("created ticket with ticketno="+response.getTicketNumber());
				LOG.debug("succeeded");
			}
			else
			{
				LOG.debug("response error");
				r=ADDREQ_RETVALUE_RESPONSE_ERROR;
			}
		}
		catch(SAXException | ParserConfigurationException | IOException e)
		{
			LOG.error(e.getMessage());
			r=ADDREQ_RETVALUE_PARSERERROR;
		}
		catch (Exception err) {
			LOG.error(err.getMessage());
			r = ADDREQ_RETVALUE_REQUEST_ERROR;
		}
		finally
		{
			this.sendAddMobilityMail(strRequest,response);
		}
		return r;
	}

	private void sendAddMobilityMail(StringBuffer strRequest, AotsMResponse response) {
		if(this.smtpConfig!=null)
		{
			LOG.debug("try to send mail");
			SendMail mailer=new SendMail(this.smtpConfig);
			mailer.appendFile("request.xml", strRequest.toString());
			if(response!=null)
				mailer.appendFile("response.xml",response.getRaw());
			try
			{
				mailer.Send(ADDMOB_EMAIL_HEADER, "<p>See attached files</p>");
			}
			catch(Exception e2)
			{
				LOG.error(e2.getMessage());
			}
		}
	}
	@Override
	public void run() {
		stopped = false;
		LOG.debug("AotsM provider runnable starts");
		while (!stopped) {
			// try to send one message from queue
			try {
				AotsMMessage msg = queue.poll();
				if (msg != null) {
					int r = this.sendInquireRequestSync(msg);
					if (r != INQREQ_RETVALUE_ITEM_FOUND)
					{
						r = this.sendAddMobilityRequest(msg);
						if(r!=ADDREQ_RETVALUE_OK)
						{
							LOG.warn("add ticket failed");
							//retry???
							//queue.put(msg);
						}
					}
				}
				else
					Thread.sleep(1000);
			} catch (Exception err) {
				LOG.error(err.getMessage());
			}
		}
		LOG.debug("AotsM provider runnable stops");

	}

	public void stop() {
		LOG.debug("try to stop AotsM provider runnable");
		this.stopped = true;
	}

	public void pushNotification(String mountPointName, ProblemNotificationXml notification, int prtOff,int ci, boolean neDeviceAlarm) {
		try {
			LOG.debug(String.format("add notification from %s to queue: %s",mountPointName,notification.toString()));
			this.queue.put(new AotsMMessage(mountPointName, notification, prtOff, ci, neDeviceAlarm));
		} catch (InterruptedException e) {
			LOG.error("Error appending message to queue(" + e.getMessage() + ")");
		}
	}
}
