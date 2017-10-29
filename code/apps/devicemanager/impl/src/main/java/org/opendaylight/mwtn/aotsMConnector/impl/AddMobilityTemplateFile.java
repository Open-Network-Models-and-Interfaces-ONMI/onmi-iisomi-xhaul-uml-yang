package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;

import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AddMobilityTemplateFile extends AotsTemplateFile{


	private static final Logger LOG = LoggerFactory.getLogger(AddMobilityTemplateFile.class);

	public AddMobilityTemplateFile(File f) throws IOException
	{
		super(f);
	}
	private AddMobilityTemplateFile(String content)
	{
		super(content);
	}
	public String set(AotsMMessage m) throws NoSuchAlgorithmException
	{
		return set(m,null);
	}
	public String set(AotsMMessage m, StringBuffer sb) throws NoSuchAlgorithmException {

		ProblemNotificationXml notification = m.getNotification();
		String hash = createHash(notification,m.isNeDeviceAlarm());
		String nodeName = m.getEndpointName();
		InternalSeverity severity = notification.getSeverity();
		//String body = assembleAddMobilityTicket(sb,timeStamp, sequence, nodeName, objId, problemName, severity,hash,plannedRestoreTime).toString();

		this.addValue(KEY_NOTIFICATION_EQUIPMENTID, m.isNeDeviceAlarm()?nodeName:notification.getObjectId());
		this.addValue(KEY_NOTIFICATION_TIMESTAMP, notification.getTimeStamp());
		this.addValue(KEY_NOTIFICATION_ALARMSTRING,notification.getProblem());
		this.addValue(KEY_NOTIFICATION_COMPONENT,notification.getObjectId());
		this.addValue(KEY_NOTIFICATION_NODENAME, notification.getNodeName());
		this.addValue(KEY_AOTS_PLANNEDRESTORALTIME, notification.getTimeStampOffset(m.getPrtOffset()));
		this.addValue(KEY_AOTS_EXTTICKETNUMBER, hash);
		this.addValue(KEY_AOTS_SEVERITY, this.convert(severity));
		this.addValue(KEY_AOTS_CUSTOMERIMPACT, m.getCustomerImpact() );

		LOG.info("request-add hash="+hash+" ("+nodeName+","+severity.toNetconfString()+")");
		String s=this.toString();
		if(sb!=null)
			sb.append(s);
		return s;
	}
	public static AddMobilityTemplateFile LoadDefault() {
		String s="<soapenv:Envelope\n" +
				"xmlns:q1=\"http://csi.att.com/CSI/Namespaces/ATTOneTicketingSystem/Types/Public/CommonDataModel.xsd\" " +
				"xmlns:q0=\"http://csi.cingular.com/CSI/Namespaces/Container/Public/AddMobilityTicketRequest.xsd\" " +
				"xmlns:mh=\"http://csi.cingular.com/CSI/Namespaces/sdnr/InfrastructureCommon/Types/Public/MessageHeader.xsd\" " +
				"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
				"xmlns:cdm=\"http://csi.att.com/CSI/Namespaces/sdnr/Types/Public/CommonDataModel.xsd\" " +
				"xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
				"<soapenv:Header>" +
				"  <mh:MessageHeader>" +
				"    <mh:TrackingMessageHeader>" +
				"      <mh:infrastructureVersion>86</mh:infrastructureVersion>" +
				"      <mh:applicationName>sdnr</mh:applicationName>" +
				"      <mh:version>209</mh:version>" +
				"      <mh:messageId>sdnr:37-1508173894848</mh:messageId>" +
				"      <mh:timeToLive>30000</mh:timeToLive>" +
				"      <mh:dateTimeStamp>"+KEY_NOTIFICATION_TIMESTAMP+"</mh:dateTimeStamp>" +
				"    </mh:TrackingMessageHeader>" +
				"    <mh:SecurityMessageHeader>" +
				"      <mh:userName>"+KEY_AOTS_USERNAME+"</mh:userName>" +
				"      <mh:userPassword>"+KEY_AOTS_USERPASSWORD+"</mh:userPassword>" +
				"    </mh:SecurityMessageHeader>" +
				"    <mh:SequenceMessageHeader>" +
				"      <mh:sequenceNumber>1</mh:sequenceNumber>" +
				"      <mh:totalInSequence>1</mh:totalInSequence>" +
				"    </mh:SequenceMessageHeader>" +
				"  </mh:MessageHeader>" +
				"</soapenv:Header>" +
				"<soapenv:Body>" +
				"    <q0:AddMobilityTicketRequest>" +
				"        <q0:TicketCoreDetails>" +
				"            <q1:entryType>2</q1:entryType>" +
				"            <q1:ticketSeverity>"+KEY_AOTS_SEVERITY+"</q1:ticketSeverity>" +
				"            <q1:shortDescription>"+KEY_NOTIFICATION_ALARMSTRING+"</q1:shortDescription>" +
				"            <q1:customerImpact>0</q1:customerImpact>" +
				"        </q0:TicketCoreDetails>" +
				"        <q0:ProblemDetails>" +
				"            <q1:problemCategory>Fault Management</q1:problemCategory>" +
				"            <q1:problemSubCategory>SDN-R</q1:problemSubCategory>" +
				"            <q1:problemDetail>"+KEY_NOTIFICATION_ALARMSTRING+"("+KEY_NOTIFICATION_COMPONENT+")@"+KEY_NOTIFICATION_NODENAME+"</q1:problemDetail>" +
				"        </q0:ProblemDetails>" +
				"        <q0:EquipmentDetails>" +
				"            <q1:equipmentId>"+KEY_NOTIFICATION_EQUIPMENTID+"</q1:equipmentId>" +
				"        </q0:EquipmentDetails>" +
				"        <q0:assignedTo>"+KEY_AOTS_ASSIGNEDTO+"</q0:assignedTo>" +
				"        <q0:systemUser>"+KEY_AOTS_SYSTEMUSER+"</q0:systemUser>" +
				"        <q0:workDone>done</q0:workDone>" +
				"        <q0:callOrigin>TECH OPS</q0:callOrigin>" +
				"        <q0:externalTicketNumber>"+KEY_AOTS_EXTTICKETNUMBER+"</q0:externalTicketNumber>" +
				"        <q0:plannedRestoralTime>"+KEY_AOTS_PLANNEDRESTORALTIME+"</q0:plannedRestoralTime>" +
				"        <q0:serviceImpactLevel>5</q0:serviceImpactLevel>" +
				"    </q0:AddMobilityTicketRequest>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>";
		return new AddMobilityTemplateFile(s);
	}

}
