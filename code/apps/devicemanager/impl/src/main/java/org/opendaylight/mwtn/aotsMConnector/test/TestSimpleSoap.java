package org.opendaylight.mwtn.aotsMConnector.test;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Priority;
import org.opendaylight.mwtn.aotsMConnector.impl.AddMobilityTemplateFile;
import org.opendaylight.mwtn.aotsMConnector.impl.AotsMMessage;
import org.opendaylight.mwtn.aotsMConnector.impl.AotsMResponse;
import org.opendaylight.mwtn.aotsMConnector.impl.AotsTemplateFile;
import org.opendaylight.mwtn.aotsMConnector.impl.InquireMobilityTemplateFile;
import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.config.impl.HtLogger;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.xml.sax.SAXException;

public class TestSimpleSoap {


	public static String getRequestAddMobility()
	{
		String problemName="only a test problem";
		String problemDetails="only a test app";
		String nodeName="soapTestNodeName";
		String hash="hashmeifyoucan";
		String timeStamp="2017-09-06T01:00:00.000Z";
		String REQ_USERNAME = "sdnr";
		String REQ_USERPASSWORD="sdnr04";
		String ADDINQ_ENTRYTYPE_NETREPORT="2";
		String ADDINQ_TICKETSEVERITY_CRITICAL="5";
		String ADD_ASSIGNEDTO="gl4709";
		String REQ_SYSTEMUSER="sdnr";
String s="<soapenv:Envelope\n" +
		"xmlns:q1=\"http://csi.att.com/CSI/Namespaces/ATTOneTicketingSystem/Types/Public/CommonDataModel.xsd\"\n" +
		"xmlns:q0=\"http://csi.cingular.com/CSI/Namespaces/Container/Public/AddMobilityTicketRequest.xsd\"\n" +
		"xmlns:mh=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\"\n" +
		"xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"\n" +
		"xmlns:cdm=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\"\n" +
		"xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">\n" +
		"\n" +
		"<soapenv:Header>\n" +
		"  <mh:MessageHeader>\n" +
		"    <mh:TrackingMessageHeader>\n" +
		"      <cdm:version>209</cdm:version>\n" +
		"      <cdm:messageId>sdnr:67-1504108901169</cdm:messageId>\n" +
		"      <cdm:timeToLive>30000</cdm:timeToLive>\n" +
		"      <cdm:dateTimeStamp>"+timeStamp+"</cdm:dateTimeStamp>\n" +
		"    </mh:TrackingMessageHeader>\n" +
		"    <mh:SecurityMessageHeader>\n" +
		"      <cdm:userName>"+REQ_USERNAME+"</cdm:userName>\n" +
		"      <cdm:userPassword>"+REQ_USERPASSWORD+"</cdm:userPassword>\n" +
		"    </mh:SecurityMessageHeader>\n" +
		"    <mh:SequenceMessageHeader>\n" +
		"      <cdm:sequenceNumber>1</cdm:sequenceNumber>\n" +
		"      <cdm:totalInSequence>1</cdm:totalInSequence>\n" +
		"    </mh:SequenceMessageHeader>\n" +
		"  </mh:MessageHeader>\n" +
		"</soapenv:Header>\n" +
		"<soapenv:Body>\n" +
		"    <q0:AddMobilityTicketRequest>\n" +
		"        <q0:TicketCoreDetails>\n" +
		"            <q1:entryType>"+ADDINQ_ENTRYTYPE_NETREPORT+"</q1:entryType>\n" +
		"            <q1:ticketSeverity>"+ADDINQ_TICKETSEVERITY_CRITICAL+"</q1:ticketSeverity>\n" +
		"            <q1:shortDescription>"+problemName+"</q1:shortDescription>\n" +
		"            <q1:customerImpact>0</q1:customerImpact>\n" +
		"        </q0:TicketCoreDetails>\n" +
		"        <q0:ProblemDetails>\n" +
		"            <q1:problemCategory>Fault Management</q1:problemCategory>\n" +
		"            <q1:problemSubCategory>SDN-R</q1:problemSubCategory>\n" +
		"            <q1:problemDetail>"+problemDetails+"</q1:problemDetail>\n" +
		"        </q0:ProblemDetails>\n" +
		"        <q0:EquipmentDetails>\n" +
		"            <q1:equipmentId>"+nodeName+"</q1:equipmentId>\n" +
		"        </q0:EquipmentDetails>\n" +
		"        <q0:assignedTo>"+ADD_ASSIGNEDTO+"</q0:assignedTo>\n" +
		"        <q0:systemUser>"+REQ_SYSTEMUSER+"</q0:systemUser>\n" +
		"        <q0:workDone>done</q0:workDone>\n" +
		"        <q0:callOrigin>TECH OPS</q0:callOrigin>\n" +
		"        <q0:externalTicketNumber>"+hash+"</q0:externalTicketNumber>\n" +
		"        <q0:serviceImpactLevel>5</q0:serviceImpactLevel>\n" +
		"    </q0:AddMobilityTicketRequest>\n" +
		"</soapenv:Body>\n" +
		"</soapenv:Envelope>";
return s;
	}
	private static String getSuccessResponseAddMob()
	{
		String s="<SOAPENV:Envelope xmlns:SOAPENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:mes=\"http://csi.cingular.com/CSI/Namespaces/ATTOneTicketingSystem/InfrastructureCommon/Types/Public/MessageHeader.xsd\" xmlns:add=\"http://csi.cingular.com/CSI/Namespaces/Container/Public/AddMobilityTicketResponse.xsd\" xmlns:com=\"http://csi.att.com/CSI/Namespaces/ATTOneTicketingSystem/Types/Public/CommonDataModel.xsd\">\n" +
				"   <SOAPENV:Header>\n" +
				"      <mes:MessageHeader>\n" +
				"         <mes:TrackingMessageHeader>\n" +
				"            <mes:infrastructureVersion>86</mes:infrastructureVersion>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:originalInfrastructureVersion>?</mes:originalInfrastructureVersion>\n" +
				"            <mes:applicationName>ATTOneTicketingSystem</mes:applicationName>\n" +
				"            <mes:version>209</mes:version>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:originalVersion>?</mes:originalVersion>\n" +
				"            <mes:messageId>?</mes:messageId>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:originatorId>?</mes:originatorId>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:responseTo>?</mes:responseTo>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:returnURL>?</mes:returnURL>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:timeToLive>?</mes:timeToLive>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:conversationId>?</mes:conversationId>\n" +
				"            <!--Zero or more repetitions:-->\n" +
				"            <mes:routingRegionOverride>?</mes:routingRegionOverride>\n" +
				"            <mes:dateTimeStamp>?</mes:dateTimeStamp>\n" +
				"            <!--Optional:-->\n" +
				"            <mes:uniqueTransactionId>?</mes:uniqueTransactionId>\n" +
				"         </mes:TrackingMessageHeader>\n" +
				"         <mes:SecurityMessageHeader>\n" +
				"            <mes:userName>?</mes:userName>\n" +
				"            <mes:userPassword>?</mes:userPassword>\n" +
				"         </mes:SecurityMessageHeader>\n" +
				"         <mes:SequenceMessageHeader>\n" +
				"            <mes:sequenceNumber>?</mes:sequenceNumber>\n" +
				"            <mes:totalInSequence>?</mes:totalInSequence>\n" +
				"         </mes:SequenceMessageHeader>\n" +
				"      </mes:MessageHeader>\n" +
				"   </SOAPENV:Header>\n" +
				"   <SOAPENV:Body>\n" +
				"      <add:AddMobilityTicketResponse>\n" +
				"         <add:mobilityTicketNumber>T1234312312</add:mobilityTicketNumber>\n" +
				"         <add:Response>\n" +
				"            <com:code>0</com:code>\n" +
				"            <com:description>Success</com:description>\n" +
				"         </add:Response>\n" +
				"      </add:AddMobilityTicketResponse>\n" +
				"   </SOAPENV:Body>\n" +
				"</SOAPENV:Envelope>";
		return s;
	}
	private static String getErrorResponseAddMob()
	{
		String s="<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">\n" +
				"    <SOAP-ENV:Header>\n" +
				"        <MessageHeader xmlns=\"http://csi.cingular.com/CSI/Namespaces/ATTOneTicketingSystem/InfrastructureCommon/Types/Public/MessageHeader.xsd\">\n" +
				"            <TrackingMessageHeader>\n" +
				"                <infrastructureVersion>86</infrastructureVersion>\n" +
				"                <applicationName>ATTOneTicketingSystem</applicationName>\n" +
				"                <version>209</version>\n" +
				"                <messageId>1</messageId>\n" +
				"                <timeToLive>300000</timeToLive>\n" +
				"                <conversationId>sdnr~CNG-CSI~f9d3f6c2-da56-41e1-927b-463651520af0</conversationId>\n" +
				"                <dateTimeStamp>2017-08-15T07:19:25.676Z</dateTimeStamp>\n" +
				"                <uniqueTransactionId>ServiceGateway724413@q100csg106c3_004b0ae2-8e4e-4ceb-b4d9-f0f31a014432</uniqueTransactionId>\n" +
				"            </TrackingMessageHeader>\n" +
				"            <SecurityMessageHeader>\n" +
				"                <userName>username</userName>\n" +
				"                <userPassword>password</userPassword>\n" +
				"            </SecurityMessageHeader>\n" +
				"            <SequenceMessageHeader>\n" +
				"                <sequenceNumber>1</sequenceNumber>\n" +
				"                <totalInSequence>1</totalInSequence>\n" +
				"            </SequenceMessageHeader>\n" +
				"        </MessageHeader>\n" +
				"    </SOAP-ENV:Header>\n" +
				"    <SOAP-ENV:Body>\n" +
				"        <SOAP-ENV:Fault xmlns:cer=\"http://csi.cingular.com/CSI/Namespaces/ATTOneTicketingSystem/InfrastructureCommon/Types/Public/ErrorResponse.xsd\" xmlns:std=\"http://csi.cingular.com/CSI/Namespaces/ATTOneTicketingSystem/InfrastructureCommon/Types/Public/SoapFaultDetails.xsd\">\n" +
				"            <faultcode xmlns:ns1=\"http://schemas.xmlsoap.org/soap/envelope/\">ns1:Client</faultcode>\n" +
				"            <faultstring>input data Is Invalid</faultstring>\n" +
				"            <faultactor>soap-env:Client</faultactor>\n" +
				"            <detail>\n" +
				"                <std:CSIApplicationException>\n" +
				"                    <cer:Response>\n" +
				"                        <cer:code>300</cer:code>\n" +
				"                        <cer:description>Data Error</cer:description>\n" +
				"                    </cer:Response>\n" +
				"                    <cer:ServiceProviderEntity>\n" +
				"                        <cer:reportingServiceEntity>AOTSREMEDY</cer:reportingServiceEntity>\n" +
				"                        <cer:faultDate>2017-08-18Z</cer:faultDate>\n" +
				"                        <cer:faultSequenceNumber>1</cer:faultSequenceNumber>\n" +
				"                        <cer:faultLevel>ERROR</cer:faultLevel>\n" +
				"                        <cer:faultCode>3002702098002</cer:faultCode>\n" +
				"                        <cer:faultDescription>input data Is Invalid</cer:faultDescription>\n" +
				"                        <cer:ServiceProviderRawError>\n" +
				"                            <cer:code>1003</cer:code>\n" +
				"                            <cer:description>Not a Valid System User</cer:description>\n" +
				"                        </cer:ServiceProviderRawError>\n" +
				"                    </cer:ServiceProviderEntity>\n" +
				"                </std:CSIApplicationException>\n" +
				"            </detail>\n" +
				"        </SOAP-ENV:Fault>\n" +
				"    </SOAP-ENV:Body>\n" +
				"</SOAP-ENV:Envelope>\n" +
				"";
		return s;
	}
	private static String getErrorResponseInqMob() {
		String s="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
				"<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:cer=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd\" encodingStyle=\"\">\n" +
				"    <SOAP-ENV:Header>\n" +
				"        <ns2:MessageHeader xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns:ns2=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\">\n" +
				"            <ns2:TrackingMessageHeader>\n" +
				"                <version>209</version>\n" +
				"                <messageId>sdnr:36-1504101836417</messageId>\n" +
				"                <timeToLive>30000</timeToLive>\n" +
				"                <conversationId>sdnr~CNG-CSI~cbb97d3e-160c-44f6-a9d7-4a8acaf7f1d5</conversationId>\n" +
				"                <dateTimeStamp>2017-08-30T14:03:56Z</dateTimeStamp>\n" +
				"                <uniqueTransactionId>ServiceGateway112722@q100csg66c1_ce155589-b98d-4323-8f6d-058055fb3e36</uniqueTransactionId>\n" +
				"            </ns2:TrackingMessageHeader>\n" +
				"            <ns2:SecurityMessageHeader>\n" +
				"                <userName>sdnr</userName>\n" +
				"                <userPassword>sdnr04</userPassword>\n" +
				"            </ns2:SecurityMessageHeader>\n" +
				"            <ns2:SequenceMessageHeader>\n" +
				"                <sequenceNumber>1</sequenceNumber>\n" +
				"                <totalInSequence>1</totalInSequence>\n" +
				"            </ns2:SequenceMessageHeader>\n" +
				"        </ns2:MessageHeader>\n" +
				"    </SOAP-ENV:Header>\n" +
				"    <SOAP-ENV:Body>\n" +
				"        <SOAP-ENV:Fault>\n" +
				"            <faultcode>SOAP-ENV:Server</faultcode>\n" +
				"            <faultstring>Unknown Error</faultstring>\n" +
				"            <detail>\n" +
				"                <soap1:CSIApplicationException xmlns:soap1=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFaultDetails.xsd\" xmlns:cng=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFault.xsd\">\n" +
				"                    <cer:Response>\n" +
				"                        <cng:code>900</cng:code>\n" +
				"                        <cng:description>java.lang.ClassNotFoundException: com.cingular.csi.transforms.Transform_MessageHeader_v124_to_209_Response</cng:description>\n" +
				"                    </cer:Response>\n" +
				"                    <cer:ServiceProviderEntity>\n" +
				"                        <cer:reportingServiceEntity>CSI</cer:reportingServiceEntity>\n" +
				"                        <cer:faultDate>2017-08-31Z</cer:faultDate>\n" +
				"                        <cer:faultSequenceNumber>1</cer:faultSequenceNumber>\n" +
				"                        <cer:faultLevel>ERROR</cer:faultLevel>\n" +
				"                        <cer:faultCode>90000000001</cer:faultCode>\n" +
				"                        <cer:faultDescription>java.lang.ClassNotFoundException: com.cingular.csi.transforms.Transform_MessageHeader_v124_to_209_Response</cer:faultDescription>\n" +
				"                        <cer:ServiceProviderRawError>\n" +
				"                            <cer:code>900</cer:code>\n" +
				"                            <cer:description>java.lang.ClassNotFoundException: com.cingular.csi.transforms.Transform_MessageHeader_v124_to_209_Response</cer:description>\n" +
				"                        </cer:ServiceProviderRawError>\n" +
				"                    </cer:ServiceProviderEntity>\n" +
				"                </soap1:CSIApplicationException>\n" +
				"            </detail>\n" +
				"        </SOAP-ENV:Fault>\n" +
				"    </SOAP-ENV:Body>\n" +
				"</SOAP-ENV:Envelope>\n" +
				"";
		return s;
	}
	private static String getSuccessResponseInqMob() {
		String s="<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">\n" +
				"   <SOAP-ENV:Header>\n" +
				"      <ns2:MessageHeader xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns:ns2=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\">\n" +
				"         <ns2:TrackingMessageHeader>\n" +
				"            <version>209</version>\n" +
				"            <messageId>sdnr:36-1504100680647</messageId>\n" +
				"            <timeToLive>30000</timeToLive>\n" +
				"            <conversationId>sdnr~CNG-CSI~eddb76bf-6fb8-4e1d-90e0-581befa6a3b1</conversationId>\n" +
				"            <dateTimeStamp>2017-08-30T13:44:40Z</dateTimeStamp>\n" +
				"            <uniqueTransactionId>ServiceGateway161350@q100csg66c1_a695349a-2327-4519-8cf8-64a436d4e57f</uniqueTransactionId>\n" +
				"         </ns2:TrackingMessageHeader>\n" +
				"         <ns2:SecurityMessageHeader>\n" +
				"            <userName>sdnr</userName>\n" +
				"            <userPassword>sdnr04</userPassword>\n" +
				"         </ns2:SecurityMessageHeader>\n" +
				"         <ns2:SequenceMessageHeader>\n" +
				"            <sequenceNumber>1</sequenceNumber>\n" +
				"            <totalInSequence>1</totalInSequence>\n" +
				"         </ns2:SequenceMessageHeader>\n" +
				"      </ns2:MessageHeader>\n" +
				"   </SOAP-ENV:Header>\n" +
				"   <SOAP-ENV:Body>\n" +
				"      <InquireMobilityTicketListResponse xmlns=\"http://csi.cingular.com/CSI/Namespaces/Container/Public/InquireMobilityTicketListResponse.xsd\" xmlns:ns2=\"http://csi.att.com/CSI/Namespaces/ATTOneTicketingSystem/Types/Public/CommonDataModel.xsd\">\n" +
				"         <MobilityTicketDetails>\n" +
				"            <MobilityTicket>\n" +
				"               <mobilityTicketNumber>TT200030213428</mobilityTicketNumber>\n" +
				"               <entryType>0</entryType>\n" +
				"               <parentName>8890 EMS-01  SERVER</parentName>\n" +
				"               <equipmentName>8890 EMS-01  SERVER</equipmentName>\n" +
				"               <MobilityCoreTicketDetails>\n" +
				"                  <ns2:ticketStatus>Assigned</ns2:ticketStatus>\n" +
				"                  <ns2:ticketSeverity>5</ns2:ticketSeverity>\n" +
				"                  <ns2:CLLI>AVONMA05MONU0003</ns2:CLLI>\n" +
				"                  <ns2:shortDescription>Yogesh Testing interface</ns2:shortDescription>\n" +
				"                  <ns2:customerAffecting>0</ns2:customerAffecting>\n" +
				"                  <ns2:submittedBy>zz3155a</ns2:submittedBy>\n" +
				"                  <ns2:opsDistrict>NIS</ns2:opsDistrict>\n" +
				"                  <ns2:opsZone>NIS</ns2:opsZone>\n" +
				"               </MobilityCoreTicketDetails>\n" +
				"               <AlarmDetails>\n" +
				"                  <ns2:alarmTime>2017-08-22T07:53:56Z</ns2:alarmTime>\n" +
				"               </AlarmDetails>\n" +
				"               <AssigneeDetails>\n" +
				"                  <ns2:assignedTo>WFA NONE</ns2:assignedTo>\n" +
				"                  <ns2:assignedMarket>ALL</ns2:assignedMarket>\n" +
				"                  <ns2:assignedRegion>HQ</ns2:assignedRegion>\n" +
				"                  <ns2:assignedZone>ALL</ns2:assignedZone>\n" +
				"                  <ns2:assignedDepartment>MNRC</ns2:assignedDepartment>\n" +
				"                  <ns2:assiginedDistrictSubDepartment>ALL</ns2:assiginedDistrictSubDepartment>\n" +
				"               </AssigneeDetails>\n" +
				"               <EquipmentDetails>\n" +
				"                  <ns2:commonId>8890 EMS-01  SERVER</ns2:commonId>\n" +
				"                  <ns2:equipmentId>8890 EMS-01  SERVER</ns2:equipmentId>\n" +
				"                  <ns2:equipmentRegion>HQ</ns2:equipmentRegion>\n" +
				"                  <ns2:equipmentMarket>HQ</ns2:equipmentMarket>\n" +
				"                  <ns2:equipmentMarketCluster>HQ</ns2:equipmentMarketCluster>\n" +
				"                  <ns2:parentId>8890 EMS-01  SERVER</ns2:parentId>\n" +
				"               </EquipmentDetails>\n" +
				"               <LocationDetails>\n" +
				"                  <clli>AVONMA05MON</clli>\n" +
				"                  <name>MABSXX-AVON LSC</name>\n" +
				"                  <locationType>MTSO</locationType>\n" +
				"                  <city>AVON</city>\n" +
				"                  <addressLine1>185 BODWELL STREET</addressLine1>\n" +
				"                  <state>MA</state>\n" +
				"                  <zip>02322</zip>\n" +
				"                  <locationId>LO00000216</locationId>\n" +
				"                  <latitude>42.1337</latitude>\n" +
				"                  <longitude>-71.0585</longitude>\n" +
				"                  <locationRanking>68045</locationRanking>\n" +
				"                  <usid>87415</usid>\n" +
				"               </LocationDetails>\n" +
				"               <ProblemDetails>\n" +
				"                  <problemCategory>Fault Management</problemCategory>\n" +
				"                  <problemSubCategory>AOTS-TM</problemSubCategory>\n" +
				"                  <problemDetail>Unknown</problemDetail>\n" +
				"               </ProblemDetails>\n" +
				"               <TrackingDetails>\n" +
				"                  <plannedRestoralTime>2017-08-31T07:28:20Z</plannedRestoralTime>\n" +
				"                  <ticketCreatedTime>2017-08-30T13:28:21Z</ticketCreatedTime>\n" +
				"               </TrackingDetails>\n" +
				"               <serviceImpactLevel>999</serviceImpactLevel>\n" +
				"               <lastEntryOfWorkDone>AOTS Managing Org: ENOC \n" +
				"AOTS Active Org: ENOC-IPAG \n" +
				"AOTS User ID: OPC \n" +
				"AOTS User Name: \n" +
				"AOTS User Phone:\n" +
				"\n" +
				"Created From RUBY-MOBILITY\n" +
				"URL:</lastEntryOfWorkDone>\n" +
				"               <callOrigin>AOTS-TM</callOrigin>\n" +
				"               <lastModifiedDate>2017-08-30T13:28:21Z</lastModifiedDate>\n" +
				"               <lastModifiedByUserId>RubyMobUser1</lastModifiedByUserId>\n" +
				"               <ticketType>0</ticketType>\n" +
				"            </MobilityTicket>\n" +
				"            <MobilityTicket>\n" +
				"               <mobilityTicketNumber>TT200030213427</mobilityTicketNumber>\n" +
				"               <entryType>0</entryType>\n" +
				"               <parentName>8890 EMS-01  SERVER</parentName>\n" +
				"               <equipmentName>8890 EMS-01  SERVER</equipmentName>\n" +
				"               <MobilityCoreTicketDetails>\n" +
				"                  <ns2:ticketStatus>Assigned</ns2:ticketStatus>\n" +
				"                  <ns2:ticketSeverity>5</ns2:ticketSeverity>\n" +
				"                  <ns2:CLLI>AVONMA05MONU0003</ns2:CLLI>\n" +
				"                  <ns2:shortDescription>Yogesh Testing interface</ns2:shortDescription>\n" +
				"                  <ns2:customerAffecting>0</ns2:customerAffecting>\n" +
				"                  <ns2:submittedBy>zz3155a</ns2:submittedBy>\n" +
				"                  <ns2:opsDistrict>NIS</ns2:opsDistrict>\n" +
				"                  <ns2:opsZone>NIS</ns2:opsZone>\n" +
				"               </MobilityCoreTicketDetails>\n" +
				"               <AlarmDetails>\n" +
				"                  <ns2:alarmTime>2017-08-22T07:53:56Z</ns2:alarmTime>\n" +
				"               </AlarmDetails>\n" +
				"               <AssigneeDetails>\n" +
				"                  <ns2:assignedTo>WFA NONE</ns2:assignedTo>\n" +
				"                  <ns2:assignedMarket>ALL</ns2:assignedMarket>\n" +
				"                  <ns2:assignedRegion>HQ</ns2:assignedRegion>\n" +
				"                  <ns2:assignedZone>ALL</ns2:assignedZone>\n" +
				"                  <ns2:assignedDepartment>MNRC</ns2:assignedDepartment>\n" +
				"                  <ns2:assiginedDistrictSubDepartment>ALL</ns2:assiginedDistrictSubDepartment>\n" +
				"               </AssigneeDetails>\n" +
				"               <EquipmentDetails>\n" +
				"                  <ns2:commonId>8890 EMS-01  SERVER</ns2:commonId>\n" +
				"                  <ns2:equipmentId>8890 EMS-01  SERVER</ns2:equipmentId>\n" +
				"                  <ns2:equipmentRegion>HQ</ns2:equipmentRegion>\n" +
				"                  <ns2:equipmentMarket>HQ</ns2:equipmentMarket>\n" +
				"                  <ns2:equipmentMarketCluster>HQ</ns2:equipmentMarketCluster>\n" +
				"                  <ns2:parentId>8890 EMS-01  SERVER</ns2:parentId>\n" +
				"               </EquipmentDetails>\n" +
				"               <LocationDetails>\n" +
				"                  <clli>AVONMA05MON</clli>\n" +
				"                  <name>MABSXX-AVON LSC</name>\n" +
				"                  <locationType>MTSO</locationType>\n" +
				"                  <city>AVON</city>\n" +
				"                  <addressLine1>185 BODWELL STREET</addressLine1>\n" +
				"                  <state>MA</state>\n" +
				"                  <zip>02322</zip>\n" +
				"                  <locationId>LO00000216</locationId>\n" +
				"                  <latitude>42.1337</latitude>\n" +
				"                  <longitude>-71.0585</longitude>\n" +
				"                  <locationRanking>68045</locationRanking>\n" +
				"                  <usid>87415</usid>\n" +
				"               </LocationDetails>\n" +
				"               <ProblemDetails>\n" +
				"                  <problemCategory>Fault Management</problemCategory>\n" +
				"                  <problemSubCategory>AOTS-TM</problemSubCategory>\n" +
				"                  <problemDetail>Unknown</problemDetail>\n" +
				"               </ProblemDetails>\n" +
				"               <TrackingDetails>\n" +
				"                  <plannedRestoralTime>2017-08-31T07:24:59Z</plannedRestoralTime>\n" +
				"                  <ticketCreatedTime>2017-08-30T13:25:00Z</ticketCreatedTime>\n" +
				"               </TrackingDetails>\n" +
				"               <serviceImpactLevel>999</serviceImpactLevel>\n" +
				"               <lastEntryOfWorkDone>AOTS Managing Org: ENOC \n" +
				"AOTS Active Org: ENOC-IPAG \n" +
				"AOTS User ID: OPC \n" +
				"AOTS User Name: \n" +
				"AOTS User Phone:\n" +
				"\n" +
				"Created From RUBY-MOBILITY\n" +
				"URL:</lastEntryOfWorkDone>\n" +
				"               <callOrigin>AOTS-TM</callOrigin>\n" +
				"               <lastModifiedDate>2017-08-30T13:25:00Z</lastModifiedDate>\n" +
				"               <lastModifiedByUserId>RubyMobUser1</lastModifiedByUserId>\n" +
				"               <ticketType>0</ticketType>\n" +
				"            </MobilityTicket>\n" +
				"            <MobilityTicket>\n" +
				"               <mobilityTicketNumber>TT200030213423</mobilityTicketNumber>\n" +
				"               <entryType>2</entryType>\n" +
				"               <alternateSiteId>Unknown</alternateSiteId>\n" +
				"               <logicId>NDC2BSVC2SDG01:ifEntry.7352:Generic Link Status:1:Generic:MTTRAPD:2</logicId>\n" +
				"               <MobilityCoreTicketDetails>\n" +
				"                  <ns2:ticketStatus>Assigned</ns2:ticketStatus>\n" +
				"                  <ns2:ticketSeverity>5</ns2:ticketSeverity>\n" +
				"                  <ns2:shortDescription>NDC2BSVC2SDG01 5 Link Down  ( irb.2626 ) AdminStatus=Up ( 1 )  OperStatus=Down ( 2 )</ns2:shortDescription>\n" +
				"                  <ns2:customerAffecting>0</ns2:customerAffecting>\n" +
				"                  <ns2:submittedBy>RubyMobUser1</ns2:submittedBy>\n" +
				"                  <ns2:opsDistrict>NA</ns2:opsDistrict>\n" +
				"                  <ns2:opsZone>NA</ns2:opsZone>\n" +
				"               </MobilityCoreTicketDetails>\n" +
				"               <AlarmDetails>\n" +
				"                  <ns2:alarmGroupId>7005</ns2:alarmGroupId>\n" +
				"                  <ns2:alarmText>EXP_290943-E2E-Testing</ns2:alarmText>\n" +
				"                  <ns2:alarmSeverity>5</ns2:alarmSeverity>\n" +
				"                  <ns2:alarmTime>2017-08-30T08:18:37Z</ns2:alarmTime>\n" +
				"                  <ns2:serialNumber>77011719</ns2:serialNumber>\n" +
				"                  <ns2:serverName>LT_STG_PRX2</ns2:serverName>\n" +
				"                  <ns2:serverSerial>551684120</ns2:serverSerial>\n" +
				"               </AlarmDetails>\n" +
				"               <AssigneeDetails>\n" +
				"                  <ns2:assignedTo>RubyMobUser1</ns2:assignedTo>\n" +
				"                  <ns2:assignedMarket>ALL</ns2:assignedMarket>\n" +
				"                  <ns2:assignedRegion>ALL</ns2:assignedRegion>\n" +
				"                  <ns2:assignedZone>ALL</ns2:assignedZone>\n" +
				"                  <ns2:assignedDepartment>MNRC</ns2:assignedDepartment>\n" +
				"                  <ns2:assiginedDistrictSubDepartment>ALL</ns2:assiginedDistrictSubDepartment>\n" +
				"               </AssigneeDetails>\n" +
				"               <EquipmentDetails>\n" +
				"                  <ns2:commonId>NDC2BSVC2SDG01</ns2:commonId>\n" +
				"                  <ns2:parentId>NDC2BSVC2SDG01</ns2:parentId>\n" +
				"               </EquipmentDetails>\n" +
				"               <LocationDetails>\n" +
				"                  <usid>0</usid>\n" +
				"               </LocationDetails>\n" +
				"               <ProblemDetails>\n" +
				"                  <problemCategory>Fault Management</problemCategory>\n" +
				"                  <problemSubCategory>RUBY-Mobility</problemSubCategory>\n" +
				"                  <problemDetail>linkDown 1200</problemDetail>\n" +
				"               </ProblemDetails>\n" +
				"               <TrackingDetails>\n" +
				"                  <plannedRestoralTime>2017-08-31T03:49:03Z</plannedRestoralTime>\n" +
				"                  <ticketCreatedTime>2017-08-30T09:49:04Z</ticketCreatedTime>\n" +
				"               </TrackingDetails>\n" +
				"               <serviceImpactLevel>999</serviceImpactLevel>\n" +
				"               <lastEntryOfWorkDone>Ticket created for alarm with Identifier: NDC2BSVC2SDG01:ifEntry.7352:Generic Link Status:1:Generic:MTTRAPD:2\n" +
				"\n" +
				"Please use the following URL to perform an active alarm lookup for this location:\n" +
				"http://fmsreports.web.att.com/netcoolalarmviewer/index.php?alarmloadertable[Location]=,+,+:\n" +
				"\n" +
				"Created From RUBY-MOBILITY\n" +
				"URL:</lastEntryOfWorkDone>\n" +
				"               <callOrigin>FMS MANUAL</callOrigin>\n" +
				"               <lastModifiedDate>2017-08-30T09:49:04Z</lastModifiedDate>\n" +
				"               <lastModifiedByUserId>RubyMobUser1</lastModifiedByUserId>\n" +
				"               <ticketType>0</ticketType>\n" +
				"            </MobilityTicket>\n" +
				"            <MobilityTicket>\n" +
				"               <mobilityTicketNumber>TT200030213402</mobilityTicketNumber>\n" +
				"               <entryType>0</entryType>\n" +
				"               <alternateSiteId>WAL91101</alternateSiteId>\n" +
				"               <logicId>MTTRAPD:WAL91101:NetActEMS:nbiNetAct_communicationsAlarm:133340_PLMN-PLMN/MRBTS-2501</logicId>\n" +
				"               <equipmentName>WTC1 REDMOND FACILITY</equipmentName>\n" +
				"               <MobilityCoreTicketDetails>\n" +
				"                  <ns2:ticketStatus>Assigned</ns2:ticketStatus>\n" +
				"                  <ns2:ticketSeverity>5</ns2:ticketSeverity>\n" +
				"                  <ns2:shortDescription>WAL91101 5 0_71058|NE O&amp;M CONNECTION FAILURE_133340 ||Connection lost for IP=2606:ae00:ffe0:6150::2||||_NEName=WAL91101</ns2:shortDescription>\n" +
				"                  <ns2:customerAffecting>0</ns2:customerAffecting>\n" +
				"                  <ns2:submittedBy>RubyMobUser1</ns2:submittedBy>\n" +
				"                  <ns2:opsDistrict>RF TCH WA SEA S</ns2:opsDistrict>\n" +
				"                  <ns2:opsZone>WE_WA_CRYSTAL_MTN_CS</ns2:opsZone>\n" +
				"               </MobilityCoreTicketDetails>\n" +
				"               <AlarmDetails>\n" +
				"                  <ns2:alarmGroupId>33644</ns2:alarmGroupId>\n" +
				"                  <ns2:alarmText>STG-ONLY_PROJECT296022-E2E</ns2:alarmText>\n" +
				"                  <ns2:alarmSeverity>5</ns2:alarmSeverity>\n" +
				"                  <ns2:alarmTime>2017-08-30T01:16:52Z</ns2:alarmTime>\n" +
				"                  <ns2:serialNumber>18987932</ns2:serialNumber>\n" +
				"                  <ns2:serverName>LT_STG_PRX2</ns2:serverName>\n" +
				"                  <ns2:serverSerial>551593509</ns2:serverSerial>\n" +
				"               </AlarmDetails>\n" +
				"               <AssigneeDetails>\n" +
				"                  <ns2:assignedTo>MNRC Netcool Default</ns2:assignedTo>\n" +
				"                  <ns2:assignedMarket>WASHINGTON</ns2:assignedMarket>\n" +
				"                  <ns2:assignedRegion>WEST</ns2:assignedRegion>\n" +
				"                  <ns2:assignedZone>WE_WA_CRYSTAL_MTN_CS</ns2:assignedZone>\n" +
				"                  <ns2:assignedDepartment>MNRC</ns2:assignedDepartment>\n" +
				"                  <ns2:assiginedDistrictSubDepartment>RF TCH WA SEA S</ns2:assiginedDistrictSubDepartment>\n" +
				"               </AssigneeDetails>\n" +
				"               <EquipmentDetails>\n" +
				"                  <ns2:commonId>WAL91101</ns2:commonId>\n" +
				"                  <ns2:equipmentId>413L20170227</ns2:equipmentId>\n" +
				"                  <ns2:equipmentRegion>WEST</ns2:equipmentRegion>\n" +
				"                  <ns2:equipmentMarket>WASHINGTON</ns2:equipmentMarket>\n" +
				"                  <ns2:equipmentMarketCluster>SEATTLE/OREGON/NO. ID</ns2:equipmentMarketCluster>\n" +
				"                  <ns2:parentId>WAL91101</ns2:parentId>\n" +
				"               </EquipmentDetails>\n" +
				"               <LocationDetails>\n" +
				"                  <name>WTC1 REDMOND FACILITY</name>\n" +
				"                  <city>REDMOND</city>\n" +
				"                  <state>WA</state>\n" +
				"                  <locationId>LCMW00000083232</locationId>\n" +
				"                  <locationRanking>0</locationRanking>\n" +
				"                  <usid>92243</usid>\n" +
				"               </LocationDetails>\n" +
				"               <ProblemDetails>\n" +
				"                  <problemCategory>Fault Management</problemCategory>\n" +
				"                  <problemSubCategory>RUBY-Mobility</problemSubCategory>\n" +
				"                  <problemDetail>71058</problemDetail>\n" +
				"               </ProblemDetails>\n" +
				"               <TrackingDetails>\n" +
				"                  <plannedRestoralTime>2017-08-30T20:52:03Z</plannedRestoralTime>\n" +
				"                  <ticketCreatedTime>2017-08-30T02:52:05Z</ticketCreatedTime>\n" +
				"               </TrackingDetails>\n" +
				"               <serviceImpactLevel>999</serviceImpactLevel>\n" +
				"               <lastEntryOfWorkDone>Ticket created for alarm with Identifier: MTTRAPD:WAL91101:NetActEMS:nbiNetAct_communicationsAlarm:133340_PLMN-PLMN/MRBTS-2501\n" +
				"\n" +
				"Please use the following URL to perform an active alarm lookup for this location:\n" +
				"http://fmsreports.web.att.com/netcoolalarmviewer/index.php?alarmloadertable[Location]=WA,+REDMOND,+MTSO:WTC1+REDMOND+FACILITY\n" +
				"\n" +
				"Created From RUBY-MOBILITY\n" +
				"URL:</lastEntryOfWorkDone>\n" +
				"               <callOrigin>FMS MANUAL</callOrigin>\n" +
				"               <lastModifiedDate>2017-08-30T02:52:05Z</lastModifiedDate>\n" +
				"               <lastModifiedByUserId>RubyMobUser1</lastModifiedByUserId>\n" +
				"               <ticketType>0</ticketType>\n" +
				"            </MobilityTicket>\n" +
				"            <MobilityTicket>\n" +
				"               <mobilityTicketNumber>TT200030213398</mobilityTicketNumber>\n" +
				"               <entryType>0</entryType>\n" +
				"               <alternateSiteId>WAL91101</alternateSiteId>\n" +
				"               <logicId>MTTRAPD:WAL91101:NetActEMS:nbiNetAct_qualityOfServiceAlarm:133268_PLMN-PLMN/MRBTS-2501/LNBTS-2501/LNCEL-25017_2A_1</logicId>\n" +
				"               <equipmentName>WTC1 REDMOND FACILITY</equipmentName>\n" +
				"               <MobilityCoreTicketDetails>\n" +
				"                  <ns2:ticketStatus>Assigned</ns2:ticketStatus>\n" +
				"                  <ns2:ticketSeverity>5</ns2:ticketSeverity>\n" +
				"                  <ns2:shortDescription>WAL91101 5 0_7653|CELL FAULTY_133268 shared:N;Unit blocked||100 100 100 0048UHIE 1 0 path=/SMOD-1(Left)/BBMOD-2(Left_Middle)/rf1/RMOD-1 additionalFaultId:48;||||_NEName=WAL91101_2A_1</ns2:shortDescription>\n" +
				"                  <ns2:customerAffecting>0</ns2:customerAffecting>\n" +
				"                  <ns2:submittedBy>RubyMobUser1</ns2:submittedBy>\n" +
				"                  <ns2:opsDistrict>RF TCH WA SEA S</ns2:opsDistrict>\n" +
				"                  <ns2:opsZone>WE_WA_CRYSTAL_MTN_CS</ns2:opsZone>\n" +
				"               </MobilityCoreTicketDetails>\n" +
				"               <AlarmDetails>\n" +
				"                  <ns2:alarmGroupId>8000</ns2:alarmGroupId>\n" +
				"                  <ns2:alarmText>STG-ONLY_PROJECT296022-E2E</ns2:alarmText>\n" +
				"                  <ns2:alarmSeverity>5</ns2:alarmSeverity>\n" +
				"                  <ns2:alarmTime>2017-08-30T00:10:57Z</ns2:alarmTime>\n" +
				"                  <ns2:serialNumber>18987736</ns2:serialNumber>\n" +
				"                  <ns2:serverName>LT_STG_PRX2</ns2:serverName>\n" +
				"                  <ns2:serverSerial>551580031</ns2:serverSerial>\n" +
				"               </AlarmDetails>\n" +
				"               <AssigneeDetails>\n" +
				"                  <ns2:assignedTo>MNRC Netcool Default</ns2:assignedTo>\n" +
				"                  <ns2:assignedMarket>WASHINGTON</ns2:assignedMarket>\n" +
				"                  <ns2:assignedRegion>WEST</ns2:assignedRegion>\n" +
				"                  <ns2:assignedZone>WE_WA_CRYSTAL_MTN_CS</ns2:assignedZone>\n" +
				"                  <ns2:assignedDepartment>MNRC</ns2:assignedDepartment>\n" +
				"                  <ns2:assiginedDistrictSubDepartment>RF TCH WA SEA S</ns2:assiginedDistrictSubDepartment>\n" +
				"               </AssigneeDetails>\n" +
				"               <EquipmentDetails>\n" +
				"                  <ns2:commonId>WAL91101</ns2:commonId>\n" +
				"                  <ns2:equipmentId>413L20170227</ns2:equipmentId>\n" +
				"                  <ns2:equipmentRegion>WEST</ns2:equipmentRegion>\n" +
				"                  <ns2:equipmentMarket>WASHINGTON</ns2:equipmentMarket>\n" +
				"                  <ns2:equipmentMarketCluster>SEATTLE/OREGON/NO. ID</ns2:equipmentMarketCluster>\n" +
				"                  <ns2:parentId>WAL91101</ns2:parentId>\n" +
				"               </EquipmentDetails>\n" +
				"               <LocationDetails>\n" +
				"                  <name>WTC1 REDMOND FACILITY</name>\n" +
				"                  <city>REDMOND</city>\n" +
				"                  <state>WA</state>\n" +
				"                  <locationId>LCMW00000083232</locationId>\n" +
				"                  <locationRanking>0</locationRanking>\n" +
				"                  <usid>92243</usid>\n" +
				"               </LocationDetails>\n" +
				"               <ProblemDetails>\n" +
				"                  <problemCategory>Fault Management</problemCategory>\n" +
				"                  <problemSubCategory>RUBY-Mobility</problemSubCategory>\n" +
				"                  <problemDetail>7653:48</problemDetail>\n" +
				"               </ProblemDetails>\n" +
				"               <TrackingDetails>\n" +
				"                  <plannedRestoralTime>2017-08-30T19:45:05Z</plannedRestoralTime>\n" +
				"                  <ticketCreatedTime>2017-08-30T01:45:07Z</ticketCreatedTime>\n" +
				"               </TrackingDetails>\n" +
				"               <serviceImpactLevel>999</serviceImpactLevel>\n" +
				"               <lastEntryOfWorkDone>Ticket created for alarm with Identifier: MTTRAPD:WAL91101:NetActEMS:nbiNetAct_qualityOfServiceAlarm:133268_PLMN-PLMN/MRBTS-2501/LNBTS-2501/LNCEL-25017_2A_1\n" +
				"\n" +
				"Please use the following URL to perform an active alarm lookup for this location:\n" +
				"http://fmsreports.web.att.com/netcoolalarmviewer/index.php?alarmloadertable[Location]=WA,+REDMOND,+MTSO:WTC1+REDMOND+FACILITY\n" +
				"\n" +
				"Created From RUBY-MOBILITY\n" +
				"URL:</lastEntryOfWorkDone>\n" +
				"               <callOrigin>FMS MANUAL</callOrigin>\n" +
				"               <lastModifiedDate>2017-08-30T01:45:07Z</lastModifiedDate>\n" +
				"               <lastModifiedByUserId>RubyMobUser1</lastModifiedByUserId>\n" +
				"               <ticketType>0</ticketType>\n" +
				"            </MobilityTicket>\n" +
				"         </MobilityTicketDetails>\n" +
				"         <Response>\n" +
				"            <ns2:code>0</ns2:code>\n" +
				"            <ns2:description>Query Results exceeded more than 3000 rows. Only 3000 records are returned based on recent Create Date</ns2:description>\n" +
				"         </Response>\n" +
				"      </InquireMobilityTicketListResponse>\n" +
				"   </SOAP-ENV:Body>\n" +
				"</SOAP-ENV:Envelope>";
		return s;
	}
	private static String getErrorResponse2AddMob()
	{
		return "<soap-env:Envelope xmlns:soap-env=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:m=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" xmlns:cer=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd\">\n" +
				"	<soap-env:Header>\n" +
				"		<m:MessageHeader>\n" +
				"			<ns2:TrackingMessageHeader xmlns:ns2=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns:ns5=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd\" xmlns:ns4=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFault.xsd\" xmlns:ns3=\"http://csi.cingular.com/CSI/Namespaces/JMS/Public/SoapFaultResponse.xsd\">\n" +
				"				<version>209</version>\n" +
				"				<messageId>sdnr:67-1504108901169</messageId>\n" +
				"				<timeToLive>30000</timeToLive>\n" +
				"				<conversationId>sdnr~CNG-CSI~5b73b21c-6f93-460a-9df6-157e14da7031</conversationId>\n" +
				"				<dateTimeStamp>2017-01-01T00:00:00.0Z</dateTimeStamp>\n" +
				"				<uniqueTransactionId>ServiceGateway304971@p102csg2c4_c64cd014-f0b1-4bb0-8147-e25ae05f320b</uniqueTransactionId>\n" +
				"			</ns2:TrackingMessageHeader>\n" +
				"			<ns2:SecurityMessageHeader xmlns:ns2=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns:ns5=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd\" xmlns:ns4=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFault.xsd\" xmlns:ns3=\"http://csi.cingular.com/CSI/Namespaces/JMS/Public/SoapFaultResponse.xsd\">\n" +
				"				<userName>sdnr</userName>\n" +
				"				<userPassword>meTCjgW5XnxNj</userPassword>\n" +
				"			</ns2:SecurityMessageHeader>\n" +
				"			<ns2:SequenceMessageHeader xmlns:ns2=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns:ns5=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd\" xmlns:ns4=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFault.xsd\" xmlns:ns3=\"http://csi.cingular.com/CSI/Namespaces/JMS/Public/SoapFaultResponse.xsd\">\n" +
				"				<sequenceNumber>1</sequenceNumber>\n" +
				"				<totalInSequence>1</totalInSequence>\n" +
				"			</ns2:SequenceMessageHeader>\n" +
				"		</m:MessageHeader>\n" +
				"	</soap-env:Header>\n" +
				"	<soap-env:Body>\n" +
				"		<soap-env:Fault xmlns:soap1=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFaultDetails.xsd\">\n" +
				"			<faultcode>soap-env:Client</faultcode>\n" +
				"			<faultstring>input data Is Invalid</faultstring>\n" +
				"			<faultactor>soap-env:Client</faultactor>\n" +
				"			<detail>\n" +
				"				<soap1:CSIApplicationException>\n" +
				"					<ns5:Response xmlns:ns5=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd\" xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns:ns2=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" xmlns:ns4=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFault.xsd\" xmlns:ns3=\"http://csi.cingular.com/CSI/Namespaces/JMS/Public/SoapFaultResponse.xsd\">\n" +
				"						<code>300</code>\n" +
				"						<description>Data Error</description>\n" +
				"					</ns5:Response>\n" +
				"					<ns5:ServiceProviderEntity xmlns:ns5=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd\" xmlns=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/CingularDataModel.xsd\" xmlns:ns2=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/MessageHeader.xsd\" xmlns:ns4=\"http://csi.cingular.com/CSI/Namespaces/Types/Public/SoapFault.xsd\" xmlns:ns3=\"http://csi.cingular.com/CSI/Namespaces/JMS/Public/SoapFaultResponse.xsd\">\n" +
				"						<ns5:reportingServiceEntity>AOTSREMEDY</ns5:reportingServiceEntity>\n" +
				"						<ns5:faultDate>2017-10-13Z</ns5:faultDate>\n" +
				"						<ns5:faultSequenceNumber>1</ns5:faultSequenceNumber>\n" +
				"						<ns5:faultLevel>ERROR</ns5:faultLevel>\n" +
				"						<ns5:faultCode>3002702098002</ns5:faultCode>\n" +
				"						<ns5:faultDescription>input data Is Invalid</ns5:faultDescription>\n" +
				"						<ns5:ServiceProviderRawError>\n" +
				"							<ns5:code>1003</ns5:code>\n" +
				"							<ns5:description>PRT is required for Trouble Reports</ns5:description>\n" +
				"						</ns5:ServiceProviderRawError>\n" +
				"					</ns5:ServiceProviderEntity>\n" +
				"				</soap1:CSIApplicationException>\n" +
				"			</detail>\n" +
				"		</soap-env:Fault>\n" +
				"	</soap-env:Body>\n" +
				"</soap-env:Envelope>";
	}

	private static void testAddmobResponseParser()
	{
		System.out.println("  tryin parsing success response...");
		AotsMResponse r1;
		try {
			r1 = AotsMResponse.ParseAddMobility(getSuccessResponseAddMob());
			if(r1.isAddMobilityTicketResponse())
				System.out.println("    parsing succeeded");
			if(!r1.isSuccessful())
				System.err.println("    interpretation failed");
			else
				System.out.println("    interpretation succeeded");
		} catch (Exception e) {
			System.err.println("  failed: "+e.getMessage());
		}
		System.out.println("  tryin error response...");
		AotsMResponse r2;
		try {
			r2 = AotsMResponse.ParseAddMobility(getErrorResponseAddMob());
			if(r2.isAddMobilityTicketResponse())
				System.out.println("    parsing succeeded");
			if(r2.isSuccessful())
				System.err.println("    interpretation failed");
			else
				System.out.println("    interpretation succeeded");
		} catch (SAXException | ParserConfigurationException | IOException e) {
			System.err.println("  failed: "+e.getMessage());
		}
		System.out.println("  tryin error response2...");
		AotsMResponse r3;
		try {
			r3 = AotsMResponse.ParseAddMobility(getErrorResponse2AddMob());
			if(r3.isAddMobilityTicketResponse())
				System.out.println("    parsing succeeded");
			if(r3.isSuccessful())
				System.err.println("    interpretation failed");
			else
				System.out.println("    interpretation succeeded");
		} catch (SAXException | ParserConfigurationException | IOException e) {
			System.err.println("  failed: "+e.getMessage());
		}


	}
	private static void testInquiremobResponseParser()
	{
		System.out.println("  tryin parsing success response...");
		AotsMResponse r1;
		try {
			r1 = AotsMResponse.ParseInquireMobility(getSuccessResponseInqMob());
			if(r1.isInquireMobilityTicketResponse())
				System.out.println("    parsing succeeded");
			if(!r1.isSuccessful())
				System.err.println("    interpretation failed");
			else
				System.out.println("    interpretation succeeded. found "+r1.getNumResults()+" items");
		} catch (Exception e) {
			System.err.println("failed: "+e.getMessage());
		}
		System.out.println("  tryin error response...");
		AotsMResponse r2;
		try {
			r2 = AotsMResponse.ParseInquireMobility(getErrorResponseInqMob());
			if(r2.isInquireMobilityTicketResponse())
				System.out.println("    parsing succeeded");
			if(r2.isSuccessful())
				System.err.println("    interpretation failed");
			else
				System.out.println("    interpretation succeeded");
		} catch (SAXException | ParserConfigurationException | IOException e) {
			System.err.println("  failed: "+e.getMessage());
		}
	}

	private static void testAddMobilityTemplate() throws NoSuchAlgorithmException
	{
		AddMobilityTemplateFile template=AddMobilityTemplateFile.LoadDefault();
		AotsTemplateFile.setCredentials("abcUsername", "defPassword", "gihSystemUser", "jkiAssignedTo");

		String nodeName = "DragonWave1";
		ProblemNotificationXml notification = new ProblemNotificationXml(nodeName, "MWPS-RADIO", "modemRxConnectionLoss", InternalSeverity.Warning,"5",InternalDateAndTime.TESTPATTERN);
		int prtOff =60*20;
		boolean neDeviceAlarm=true;
		int customerImpact = AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE;
		AotsMMessage message = new AotsMMessage(nodeName, notification, prtOff, customerImpact, neDeviceAlarm);
		System.out.println(template.set(message ));
	}
	private static void testInqMobilityTemplate() throws NoSuchAlgorithmException
	{
		InquireMobilityTemplateFile template=InquireMobilityTemplateFile.LoadDefault();
		AotsTemplateFile.setCredentials("abcUsername", "defPassword", "gihSystemUser", "jkiAssignedTo");

		String nodeName = "DragonWave1";
		ProblemNotificationXml notification = new ProblemNotificationXml(nodeName, "MWPS-RADIO", "modemRxConnectionLoss", InternalSeverity.Warning,"5",InternalDateAndTime.TESTPATTERN);
		int prtOff =60*20;
		boolean neDeviceAlarm=true;
		int customerImpact = AotsTemplateFile.ADDINQ_CUSTOMERIMPACT_NOOUTAGE;
		AotsMMessage message = new AotsMMessage(nodeName, notification, prtOff, customerImpact, neDeviceAlarm);
		System.out.println(template.set(message ));
	}

	public static void main(String[] args)
	{
		HtLogger.initConsole(Priority.DEBUG);
		System.out.println("testing addmobility ticket parser");
		testAddmobResponseParser();
		System.out.println("testing inquiremobility ticket parser");
		testInquiremobResponseParser();
		System.out.println("testing addmobility template:");
		try {
			testAddMobilityTemplate();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		System.out.println("testing inquiremobility template:");
		try {
			testInqMobilityTemplate();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

	}
}
