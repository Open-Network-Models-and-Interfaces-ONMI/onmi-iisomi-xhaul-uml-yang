package org.opendaylight.mwtn.aotsMConnector.test;

import org.opendaylight.mwtn.aotsMConnector.impl.AotsMMessage;
import org.opendaylight.mwtn.aotsMConnector.impl.AotsTemplateFile;
import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;

public class TestHash {


	private static void test1()
	{
		try {
			String nodeName="testnode";
			String uuid = "";
			String problemNameString = "myproblem";
			InternalSeverity problemSeverity = InternalSeverity.Critical;
			String counterString="444";
			InternalDateAndTime timestamp = InternalDateAndTime.TESTPATTERN;
			ProblemNotificationXml notification=new ProblemNotificationXml(
					nodeName,uuid,problemNameString,problemSeverity,counterString,
					timestamp);
			String hash = AotsTemplateFile.createHash(notification,true);

			if (hash.length() > AotsTemplateFile.HASH_MAXLEN)
				throw new Exception("hash is too long: "+hash);

			System.out.println("notification:"+notification.toString());
			System.out.println("hash: \""+hash+"\"");

		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	private static ProblemNotificationXml createNotification(String nodeName,String uuid,String problemName,InternalSeverity sev,String counter, InternalDateAndTime timestamp)
	{
		return new ProblemNotificationXml(nodeName,uuid,problemName,sev,counter,timestamp);
	}

	/*
	 * test if hash of equal severities for the same node + different problem is equal
	 */
	private static void test2()
	{
		try {
			ProblemNotificationXml notification1=createNotification("testnode", "", "myproblem", InternalSeverity.Critical, "444", InternalDateAndTime.TESTPATTERN);
			String hash1 = AotsTemplateFile.createHash(notification1);
			ProblemNotificationXml notification2=createNotification("testnode", "", "myproblem2", InternalSeverity.Critical, "445", InternalDateAndTime.TESTPATTERN);
			String hash2 = AotsTemplateFile.createHash(notification2);
			ProblemNotificationXml notification3=createNotification("testnode", "", "myproblem3", InternalSeverity.Critical, "464", InternalDateAndTime.TESTPATTERN);
			String hash3 = AotsTemplateFile.createHash(notification3);

			if (hash1.length() > AotsTemplateFile.HASH_MAXLEN)
				throw new Exception("hash1 is too long: "+hash1);
			if (hash2.length() > AotsTemplateFile.HASH_MAXLEN)
				throw new Exception("hash2 is too long: "+hash2);
			if (hash3.length() > AotsTemplateFile.HASH_MAXLEN)
				throw new Exception("hash3 is too long: "+hash3);


			System.out.println("notification:"+notification1.toString());
			System.out.println("hash1: \""+hash1+"\"");
			System.out.println("notification:"+notification2.toString());
			System.out.println("hash2: \""+hash2+"\"");
			System.out.println("notification:"+notification3.toString());
			System.out.println("hash3: \""+hash3+"\"");

			if(!(hash1.equals(hash2) && hash1.equals(hash3)))
				throw new Exception("hashes are not the same value");
			else
				System.out.println("test succeeded");

		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	public static void main(String args[]) {

		test2();

	}
}
