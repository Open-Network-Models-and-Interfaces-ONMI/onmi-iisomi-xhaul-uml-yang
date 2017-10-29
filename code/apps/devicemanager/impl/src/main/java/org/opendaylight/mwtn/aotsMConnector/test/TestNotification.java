package org.opendaylight.mwtn.aotsMConnector.test;

import org.joda.time.DateTime;
import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.typedefinitions.rev160701.DateAndTime;

public class TestNotification {

	private static ProblemNotificationXml createNotification(String nodeName,String uuid,String problemName,InternalSeverity sev,String counter, InternalDateAndTime timestamp)
	{
		return new ProblemNotificationXml(nodeName,uuid,problemName,sev,counter,timestamp);
	}
	public static void main(String[] args)
	{
		String sNotificationTime="2017-10-17T03:04:05.5Z";
		int prtOff=20*60;
		//DateTime notificationTime= DateTime.parse(sNotificationTime);
		DateAndTime time = DateAndTime.getDefaultInstance(sNotificationTime);
		ProblemNotificationXml notification1=createNotification("testnode", "", "myproblem", InternalSeverity.Critical, "444",InternalDateAndTime.valueOf(time ) );
		System.out.println(sNotificationTime);
		System.out.println(String.format("+ %d Minutes",prtOff));
		System.out.println("="+notification1.getTimeStampOffset(prtOff));


	}
}
