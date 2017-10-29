package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InquireMobilityTemplateFile extends AotsTemplateFile{

	private static final Logger LOG = LoggerFactory.getLogger(InquireMobilityTemplateFile.class);

	public InquireMobilityTemplateFile(File f) throws IOException {
		super(f);

	}
	private InquireMobilityTemplateFile(String content)
	{
		super(content);
	}
	public String set(AotsMMessage m) throws NoSuchAlgorithmException
	{
		return this.set(m,null);
	}
	public String set(AotsMMessage m,StringBuffer sb) throws NoSuchAlgorithmException
	{
		ProblemNotificationXml notification = m.getNotification();
		String nodeName = m.getEndpointName();
		InternalSeverity severity = notification.getSeverity();
		String hash = createHash(notification,m.isNeDeviceAlarm());
		this.addValue(KEY_AOTS_EXTTICKETNUMBER, hash);
		this.addValue(KEY_AOTS_SEVERITY, this.convert(severity));
		this.addValue(KEY_SYSTEM_TIMESTAMP, Instant.now().toString());
		LOG.info("request-inq hash="+hash+" ("+nodeName+","+severity.toNetconfString()+")");
		String s=this.toString();
		if(sb!=null)
			sb.append(s);
		return s;
	}
	public static InquireMobilityTemplateFile LoadDefault() {
		String s="<soapenv:Envelope " +
				"xmlns:q1=\"http://csi.att.com/CSI/Namespaces/ATTOneTicketingSystem/Types/Public/CommonDataModel.xsd\" " +
				"xmlns:q0=\"http://csi.cingular.com/CSI/Namespaces/Container/Public/InquireMobilityTicketListRequest.xsd\" " +
				"xmlns:mh=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" " +
				"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
				"xmlns:cdm=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" " +
				"xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"> " +
				"<soapenv:Header> " +
				"  <mh:MessageHeader>" +
				"    <mh:TrackingMessageHeader>" +
				"      <cdm:version>209</cdm:version>" +
				"      <cdm:messageId>"+"sdnr:36-1504101836417"+"</cdm:messageId>" +
				"      <cdm:timeToLive>30000</cdm:timeToLive>" +
				"      <cdm:dateTimeStamp>"+KEY_SYSTEM_TIMESTAMP+"</cdm:dateTimeStamp>" +
				"    </mh:TrackingMessageHeader>" +
				"    <mh:SecurityMessageHeader>" +
				"      <cdm:userName>"+KEY_AOTS_USERNAME+"</cdm:userName>" +
				"      <cdm:userPassword>"+KEY_AOTS_USERPASSWORD+"</cdm:userPassword>" +
				"    </mh:SecurityMessageHeader>" +
				"    <mh:SequenceMessageHeader>" +
				"      <cdm:sequenceNumber>1</cdm:sequenceNumber>" +
				"      <cdm:totalInSequence>1</cdm:totalInSequence>" +
				"    </mh:SequenceMessageHeader>" +
				"  </mh:MessageHeader>" +
				"</soapenv:Header>" +
				"<soapenv:Body>" +
				"    <q0:InquireMobilityTicketListRequest>" +
				"        <q0:MobilityCoreTicketDetails>" +
				"            <q1:ticketSeverity>"+KEY_AOTS_SEVERITY+"</q1:ticketSeverity>" +
				"			<q1:submittedBy>"+KEY_AOTS_SYSTEMUSER+"</q1:submittedBy>"+
				"        </q0:MobilityCoreTicketDetails>" +
				"        <q0:externalTicketNumber>"+KEY_AOTS_EXTTICKETNUMBER+"</q0:externalTicketNumber>" +
				"    </q0:InquireMobilityTicketListRequest>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>";
		return new InquireMobilityTemplateFile(s);
	}
}
