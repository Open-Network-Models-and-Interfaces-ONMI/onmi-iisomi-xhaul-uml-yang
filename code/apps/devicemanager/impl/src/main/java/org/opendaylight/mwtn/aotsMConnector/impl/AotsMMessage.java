/**
        aotsmProvider.postNotificationAddMobility(ownKeyName, notificationXml);
 * AOTSM Messages are generated an send to destination
 *
 * @author herbert, Micha
 */
package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import javax.xml.parsers.ParserConfigurationException;

import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

public class AotsMMessage {

	private static final Logger LOG = LoggerFactory.getLogger(AotsMMessage.class);


	private final String endPointName;
	private final ProblemNotificationXml notification;
	private final boolean isNeDeviceAlarm;

	private final int prtOffset;//[in minutes]


	private final int customerImpact;

	public ProblemNotificationXml getNotification() {
		return this.notification;
	}
	public boolean isNeDeviceAlarm()
	{return this.isNeDeviceAlarm;}

	public int getPrtOffset()
	{return this.prtOffset;}
	public String getEndpointName()
	{return this.endPointName;}



	public AotsMMessage(String endpointName,ProblemNotificationXml xml ,int prtOff,int ci,boolean neDeviceAlarm) {
		this.prtOffset=prtOff;
		this.customerImpact=ci;
		this.endPointName=endpointName;
		this.notification=xml;
		this.isNeDeviceAlarm=neDeviceAlarm;
	}



	public AotsMResponse postNotificationAddMobility(AotsMSender aotsMSender,AddMobilityTemplateFile template) throws NoSuchAlgorithmException, SAXException, ParserConfigurationException, IOException {
		return this.postNotificationAddMobility(aotsMSender,template,null);
	}
	public AotsMResponse postNotificationAddMobility(AotsMSender aotsMSender,AddMobilityTemplateFile template,StringBuffer sb) throws NoSuchAlgorithmException, SAXException, ParserConfigurationException, IOException {

		String body = template.set(this,sb);
		LOG.debug(body);
		return AotsMResponse.ParseAddMobility(aotsMSender.sendAotsMPost(body));
	}

	public AotsMResponse postNotificationInquireMobility(AotsMSender aotsMSender,InquireMobilityTemplateFile template, StringBuffer sb) throws NoSuchAlgorithmException, SAXException, ParserConfigurationException, IOException {

		String body = template.set(this,sb);
		LOG.debug(body);
		return AotsMResponse.ParseInquireMobility(aotsMSender.sendAotsMPost(body));
	}
	public int getCustomerImpact() {
		return this.customerImpact;
	}



	/*
	 * ----------------- Private function for message creation and with templates
	 */




	/**
	 * Assemble soap message for addmobility
	 *
	 * @param sb
	 *            StringBuffer to be used or null to allocate
	 * @param epochTimeMicrosecondsString
	 *            Text with time stamp
	 * @param sequence
	 *            integer sequence number
	 * @param nodeName
	 * @param objId
	 * @param problemName
	 * @param severity
	 * @return StringBuffer with result
	 */
	/*
	private StringBuffer assembleAddMobilityTicket(StringBuffer sb,String timeStamp,
			String sequence, String nodeName, String objId, String problemName, InternalSeverity severity,String hash,String prtTime) {
		if(sb==null)
			sb = new StringBuffer();
		String problemDetails=String.format("%s(%s)@%s",problemName,objId,nodeName);
		String eqId=this.isNeDeviceAlarm?nodeName:objId;

		sb.append("<soapenv:Envelope " +
				"xmlns:q1=\"http://csi.att.com/CSI/Namespaces/ATTOneTicketingSystem/Types/Public/CommonDataModel.xsd\" " +
				"xmlns:q0=\"http://csi.cingular.com/CSI/Namespaces/Container/Public/AddMobilityTicketRequest.xsd\" " +
				"xmlns:mh=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" " +
				"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
				"xmlns:cdm=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" " +
				"xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"> " +
				" " +
				"<soapenv:Header>" +
				"  <mh:MessageHeader>" +
				"    <mh:TrackingMessageHeader>" +
			    "      <mh:infrastructureVersion>86</mh:infrastructureVersion>"+
			    "      <mh:applicationName>sdnr</mh:applicationName>"+
			    "      <cdm:version>209</cdm:version>" +
				"      <cdm:messageId>sdnr:67-1504108901169</cdm:messageId>" +
				"      <cdm:timeToLive>30000</cdm:timeToLive>" +
				"      <cdm:dateTimeStamp>"+timeStamp+"</cdm:dateTimeStamp>" +
				"    </mh:TrackingMessageHeader>" +
				"    <mh:SecurityMessageHeader>" +
				"      <cdm:userName>"+REQ_USERNAME+"</cdm:userName>" +
				"      <cdm:userPassword>"+REQ_USERPASSWORD+"</cdm:userPassword>" +
				"    </mh:SecurityMessageHeader>" +
				"    <mh:SequenceMessageHeader>" +
				"      <cdm:sequenceNumber>1</cdm:sequenceNumber>" +
				"      <cdm:totalInSequence>1</cdm:totalInSequence>" +
				"    </mh:SequenceMessageHeader>" +
				"  </mh:MessageHeader>" +
				"</soapenv:Header>" +
				"<soapenv:Body>" +
				"    <q0:AddMobilityTicketRequest>" +
				"        <q0:TicketCoreDetails>" +
				"            <q1:entryType>"+ADDINQ_ENTRYTYPE_NETREPORT+"</q1:entryType>" +
				"            <q1:ticketSeverity>"+this.convert2(severity)+"</q1:ticketSeverity>" +
				"            <q1:shortDescription>"+problemName+"</q1:shortDescription>" +
				"            <q1:customerImpact>0</q1:customerImpact>" +
				"        </q0:TicketCoreDetails>" +
				"        <q0:ProblemDetails>" +
				"            <q1:problemCategory>Fault Management</q1:problemCategory>" +
				"            <q1:problemSubCategory>SDN-R</q1:problemSubCategory>" +
				"            <q1:problemDetail>"+problemDetails+"</q1:problemDetail>" +
				"        </q0:ProblemDetails>" +
				"        <q0:EquipmentDetails>" +
				"            <q1:equipmentId>"+eqId+"</q1:equipmentId>" +
				"        </q0:EquipmentDetails>" +
				"        <q0:assignedTo>"+ADD_ASSIGNEDTO+"</q0:assignedTo>" +
				"        <q0:systemUser>"+REQ_SYSTEMUSER+"</q0:systemUser>" +
				"        <q0:workDone>done</q0:workDone>" +
				"        <q0:callOrigin>TECH OPS</q0:callOrigin>" +
				"        <q0:externalTicketNumber>"+hash+"</q0:externalTicketNumber>" +
				"        <q0:serviceImpactLevel>5</q0:serviceImpactLevel>" +
		        "		 <q0:plannedRestoralTime>"+prtTime+"</q0:plannedRestoralTime>"+
				"    </q0:AddMobilityTicketRequest>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>");
		return sb;
	}
	*/
	/**
	 * Assemble soap message for inquire
	 *
	 * @param sb
	 *            StringBuffer to be used or null to allocate
	 * @param epochTimeMicrosecondsString
	 *            Text with time stamp
	 * @param sequence
	 *            integer sequence number
	 * @param nodeName
	 * @param objId
	 * @param problemName
	 * @param severity
	 * @return StringBuffer with result
	 */
	/*
	private StringBuffer assembleInquireMobilityTicket(StringBuffer sb,String epochTimeMicrosecondsString,
			String sequence, String nodeName, String objId, String problemName, InternalSeverity severity,String hash) {

		if(sb==null)
			sb = new StringBuffer();
		String messageId="sdnr:36-1504101836417";
		String timestamp=Instant.now().toString();//"2017-08-30T14:03:56Z";
		sb.append("<soapenv:Envelope " +
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
				"      <cdm:messageId>"+messageId+"</cdm:messageId>" +
				"      <cdm:timeToLive>30000</cdm:timeToLive>" +
				"      <cdm:dateTimeStamp>"+timestamp+"</cdm:dateTimeStamp>" +
				"    </mh:TrackingMessageHeader>" +
				"    <mh:SecurityMessageHeader>" +
				"      <cdm:userName>"+REQ_USERNAME+"</cdm:userName>" +
				"      <cdm:userPassword>"+REQ_USERPASSWORD+"</cdm:userPassword>" +
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
				"            <q1:ticketSeverity>"+this.convert2(severity)+"</q1:ticketSeverity>" +
				"			<q1:submittedBy>"+REQ_SYSTEMUSER+"</q1:submittedBy>"+
				"        </q0:MobilityCoreTicketDetails>" +
				"        <q0:externalTicketNumber>"+hash+"</q0:externalTicketNumber>" +
//				"        <q0:vendorSystemName></q0:vendorSystemName>" +
				"    </q0:InquireMobilityTicketListRequest>" +
				"</soapenv:Body>" +
				"</soapenv:Envelope>");
		return sb;
	}
	*/







}
