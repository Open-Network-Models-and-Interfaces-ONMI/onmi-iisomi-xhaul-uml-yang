package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.File;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.base.internalTypes.TemplateFile;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;

public class AotsTemplateFile extends TemplateFile{

	public static final String AOTSM_NORMAL = "NORMAL";
	public static final String AOTSM_MINOR = "MINOR";
	public static final String AOTSM_WARNING = "WARNING";
	public static final String AOTSM_CRITICAL = "CRITICAL";
	public static final String AOTSM_MAJOR = "MAJOR";

	public static final int HASH_MAXLEN = 25; /* restriction for field 'external ticket number' */

	public static final int ADDINQ_ENTRYTYPE_TROUBLEREPORT = 0;
	public static final int ADDINQ_ENTRYTYPE_ACTIONREPORT = 1;
	public static final int ADDINQ_ENTRYTYPE_NETREPORT = 2;
	public static final int ADDINQ_ENTRYTYPE_NISHELPDESKREPORT = 3;

	public static final int ADDINQ_TICKETSEVERITY_UNKNOWN = 1;
	public static final int ADDINQ_TICKETSEVERITY_WARNING = 2;
	public static final int ADDINQ_TICKETSEVERITY_MINOR = 3;
	public static final int ADDINQ_TICKETSEVERITY_MAJOR = 4;
	public static final int ADDINQ_TICKETSEVERITY_CRITICAL = 5;
	public static final int ADDINQ_TICKETSEVERITY_SIR2 = 6;
	public static final int ADDINQ_TICKETSEVERITY_SIR1 = 7;
	public static final int ADDINQ_TICKETSEVERITY_SIR1E = 8;
	public static final int ADDINQ_TICKETSEVERITY_SIR3 = 9;
	public static final int ADDINQ_TICKETSEVERITY_SIR4 = 10;

	public static final int ADDINQ_CUSTOMERIMPACT_NOOUTAGE = 0;
	public static final int ADDINQ_CUSTOMERIMPACT_FULLOUTAGE = 1;
	public static final int ADDINQ_CUSTOMERIMPACT_GREATERTHAN50PERCENT = 2;
	public static final int ADDINQ_CUSTOMERIMPACT_LESSTHAN50PERCENT = 3;

	/* Template Keys */
	public static final String KEY_AOTS_USERNAME = "{aotsUsername}";
	public static final String KEY_AOTS_USERPASSWORD = "{aotsUserpassword}";
	public static final String KEY_AOTS_SYSTEMUSER = "{aotsSystemUser}";
	public static final String KEY_AOTS_ASSIGNEDTO = "{aotsAssignedTo}";
	public static final String KEY_AOTS_SEVERITY = "{aotsSeverity}";
	public static final String KEY_AOTS_PLANNEDRESTORALTIME = "{aotsPRT}";
	public static final String KEY_AOTS_EXTTICKETNUMBER = "{aotsExternalTicketNumber}";
	public static final String KEY_AOTS_CUSTOMERIMPACT = "{aotsCustomerImpact}";

	public static final String KEY_SYSTEM_TIMESTAMP = "{systemTimestamp}";

	public static final String KEY_NOTIFICATION_EQUIPMENTID = "{notificationEqId}";
	public static final String KEY_NOTIFICATION_TIMESTAMP = "{notificationTimestamp}";
	public static final String KEY_NOTIFICATION_COMPONENT = "{notificationComponent}";
	public static final String KEY_NOTIFICATION_NODENAME = "{notificationNodename}";
	public static final String KEY_NOTIFICATION_ALARMSTRING = "{notficationAlarm}";
	public static final String KEY_NOTIFICATION_SEVERITY = "{notificationSeverity}";

	/* System Credentials */
	private static String REQ_USERNAME="sdnr";
	private static String REQ_USERPASSWORD = "sdnr04";
	private static String REQ_SYSTEMUSER="sdnr";
	private static String ADD_ASSIGNEDTO = "ATTUID";


	public AotsTemplateFile(File f) throws IOException {
		super(f);

	}
	public AotsTemplateFile(String content)
	{
		super(content);
	}

	public static void setCredentials(String username,String userPassword,String systemUser,String assignedTo)
	{
		REQ_USERNAME = username;
		REQ_USERPASSWORD = userPassword;
		REQ_SYSTEMUSER = systemUser;
		ADD_ASSIGNEDTO = assignedTo;
	}
	public static String createHash(ProblemNotificationXml n) throws NoSuchAlgorithmException {
		return createHash(n,true);
	}
	public static String createHash(ProblemNotificationXml n,boolean isNeDeviceAlarm) throws NoSuchAlgorithmException {

		/*
		 * Encoding Method? LIMIT: String length<=25
		 * https://en.wikipedia.org/wiki/List_of_hash_functions
		 * MD5 = 128bit => 16byte =>base64(6bit to 8bit AsciiChar) => less than 25 chars
		 */
		//String unique_str=n.genSpecificEsId();
		String unique_str=String.format("%s%s", isNeDeviceAlarm?n.getNodeName():n.getObjectId(),n.getSeverity().toNetconfString());
		MessageDigest m= MessageDigest.getInstance("MD5");
		m.update(unique_str.getBytes());
		return Base64.getEncoder().encodeToString(m.digest());

	}


	public int convert(InternalSeverity severity) {
		switch (severity) {
		case NonAlarmed:
			break;
		case Warning:
			return ADDINQ_TICKETSEVERITY_WARNING;
		case Minor:
			return ADDINQ_TICKETSEVERITY_MINOR;
		case Major:
			return ADDINQ_TICKETSEVERITY_MAJOR;
		case Critical:
			return ADDINQ_TICKETSEVERITY_CRITICAL;
		}
		return ADDINQ_TICKETSEVERITY_UNKNOWN;
	}
	@Override
	public String toString()
	{
		this.addValue(KEY_AOTS_USERNAME, REQ_USERNAME);
		this.addValue(KEY_AOTS_USERPASSWORD, REQ_USERPASSWORD);
		this.addValue(KEY_AOTS_SYSTEMUSER, REQ_SYSTEMUSER);
		this.addValue(KEY_AOTS_ASSIGNEDTO, ADD_ASSIGNEDTO);
		return super.toString();
	}
}
