package org.opendaylight.mwtn.config.impl;

import java.util.HashMap;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.Level;
import org.apache.log4j.PatternLayout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class HtLogger {

	private static final HashMap<String, Logger> mLogs=new HashMap<>();

	public static void initConsole(Level lvl)
	{
		BasicConfigurator.configure();
		org.apache.log4j.Logger.getRootLogger().getLoggerRepository().resetConfiguration();
		ConsoleAppender console = new ConsoleAppender(); // create appender
		// configure the appender
		// String PATTERN = "%d [%p|%c|%C{1}] %m%n";
		String PATTERN = "%d [%p|%C{1}] %m%n";
		console.setLayout(new PatternLayout(PATTERN));
		console.setThreshold(lvl);
		console.activateOptions();
		// add appender to any Logger (here is root)
		org.apache.log4j.Logger.getRootLogger().addAppender(console);
	}
	public static Logger GetInstance(Object cls)
	{
		String key=cls.getClass().getName();
		if(mLogs.containsKey(key))
			return mLogs.get(key);
		Logger l=LoggerFactory.getLogger(cls.getClass());
		mLogs.put(key, l);
		return l;
	}



}
