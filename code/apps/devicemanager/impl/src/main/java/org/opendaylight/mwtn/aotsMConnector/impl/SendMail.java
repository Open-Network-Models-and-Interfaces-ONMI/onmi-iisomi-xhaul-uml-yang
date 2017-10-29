package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Part;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import javax.mail.internet.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SendMail {

	private static final Logger LOG = LoggerFactory.getLogger(SendMail.class);
	private static final String CHARACTER_ENCODING = "utf-8";

	public static class SMTPConfig {
		public final String Host;
		public final String Username;
		public final String Password;
		public final int Port;
		public final String EmailAddress;
		public final List<String> EmailReceivers;

		public SMTPConfig(String host, int port, String email, String username, String passwd, String receivers) {
			this.Host = host;
			this.Port = port;
			this.EmailAddress = email;
			this.Username = username;
			this.Password = passwd;
			this.EmailReceivers = new ArrayList<String>();
			try {
				String[] hlp = receivers.split(",");
				if (hlp != null && hlp.length > 0) {
					for (String a : hlp) {
						if (a != null && a.length() > 0)
							this.EmailReceivers.add(a);
					}
				}
			} catch (Exception err) {
				LOG.error(err.getMessage());
			}
		}

		@Override
		public String toString() {
			return "SMTPConfig [Host=" + Host + ", Username=" + Username + ", Password=" + Password + ", Port=" + Port
					+ ", EmailAddress=" + EmailAddress + ", EmailReceivers=" + EmailReceivers + "]";
		}
	}

	private final SMTPConfig smtpconfig;
	private final List<FileAppendix> fileAttachements;

	public SendMail(SMTPConfig cfg) {
		this.smtpconfig = cfg;
		this.fileAttachements=new ArrayList<FileAppendix>();

	}

	public boolean Send(String subject, String body) {

		if (this.smtpconfig.EmailReceivers.size() <= 0)
			return false;

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", this.smtpconfig.Host);
		props.put("mail.smtp.port", this.smtpconfig.Port);

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(SendMail.this.smtpconfig.Username, SendMail.this.smtpconfig.Password);
			}
		});
		try {

			// Message
			MimeEmailMessageWrapper messageRoot = new MimeEmailMessageWrapper();
			MimeBodyPart messagePart = new MimeBodyPart();
			messagePart.setContent(body, "text/html; charset=\"" + CHARACTER_ENCODING + "\"");
			messageRoot.multipartAlternativeMessages.addBodyPart(messagePart);

			// append File
			if (this.fileAttachements.size()>0) {
				DataSource filedata;
				for(FileAppendix filecontent:this.fileAttachements)
				{
					try {
						filedata = new ByteArrayDataSource(filecontent.Content.getBytes("UTF-8"),
								"application/octet-stream");
						messageRoot.multipartRoot.addBodyPart(getAttachment(filecontent.Filename, filedata));
					} catch (UnsupportedEncodingException e) {
						LOG.error(e.getMessage());
					}
				}
			}
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(this.smtpconfig.EmailAddress));
			InternetAddress[] tos = new InternetAddress[this.smtpconfig.EmailReceivers.size()];
			int i = 0;
			for (String receiver : this.smtpconfig.EmailReceivers) {
				tos[i++] = InternetAddress.parse(receiver)[0];
				message.setRecipients(Message.RecipientType.TO, tos);
			}
			message.setSubject(subject);
			message.setContent(messageRoot.multipartRoot);

			Transport.send(message);

		} catch (MessagingException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	private static BodyPart getAttachment(String filename, DataSource content) throws MessagingException {
		final BodyPart attachmentPart = new MimeBodyPart();
		final String resourceName = filename.substring(0,filename.indexOf("."));
		final String fileName = filename;
		attachmentPart.setDataHandler(new DataHandler(content));
		final String contentType = content.getContentType();
		attachmentPart.setFileName(fileName);
		attachmentPart.setHeader("Content-Type", contentType + "; filename=" + fileName + "; name=" + resourceName);
		attachmentPart.setHeader("Content-ID", String.format("<%s>", resourceName));
		attachmentPart.setDisposition(Part.ATTACHMENT + "; size=0");
		return attachmentPart;
	}



	public SendMail appendFile(String filename,String content) {
		 this.fileAttachements.add(new FileAppendix(filename, content));
		return this;
	}
	private static class FileAppendix
	{
		public final String Filename;
		public final String Content;
		public FileAppendix(String filename,String content)
		{this.Filename=filename;this.Content=content;}
	}
	private static class MimeEmailMessageWrapper {

		private final MimeMultipart multipartRoot;

		private final MimeMultipart multipartRelated;

		private final MimeMultipart multipartAlternativeMessages;

		/**
		 * @throws MessagingException
		 */
		MimeEmailMessageWrapper() throws MessagingException {
			multipartRoot = new MimeMultipart("mixed");
			final MimeBodyPart contentRelated = new MimeBodyPart();
			multipartRelated = new MimeMultipart("related");
			final MimeBodyPart contentAlternativeMessages = new MimeBodyPart();
			multipartAlternativeMessages = new MimeMultipart("alternative");
			// construct mail structure
			multipartRoot.addBodyPart(contentRelated);
			contentRelated.setContent(multipartRelated);
			multipartRelated.addBodyPart(contentAlternativeMessages);
			contentAlternativeMessages.setContent(multipartAlternativeMessages);
		}
	}

}
