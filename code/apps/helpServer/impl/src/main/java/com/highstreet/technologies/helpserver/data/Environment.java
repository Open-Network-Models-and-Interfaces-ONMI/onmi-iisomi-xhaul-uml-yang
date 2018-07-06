package com.highstreet.technologies.helpserver.data;

import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.util.Map;

public class Environment {

	public static String getVar(String v)
	{
		if(v.equals("$HOSTNAME"))
			try {
				return Inet4Address.getLocalHost().getHostName();
			} catch (UnknownHostException e) {

			}
		Map<String, String> env = System.getenv();
        for (String envName : env.keySet()) {
           if(envName!=null && envName.equals(v))
              return env.get(envName);
        }
        return null;
	}
}
