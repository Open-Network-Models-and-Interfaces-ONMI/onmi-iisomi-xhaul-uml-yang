package org.opendaylight.mwtn.base.database;

import org.apache.log4j.Priority;
import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.config.impl.HtLogger;

public class DBPluginExtractTest {

	public static void main(String[] args)
	{
		HtLogger.initConsole(Priority.DEBUG);
		HtDatabaseNode.checkorcreateplugins("/home/herbert/test");
	}
}
