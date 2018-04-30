package org.opendaylight.mwtn.base.internalTypes;

import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.util.Map;

public class Environment {

	public static String getVar(String v)
	{
		if(v.equals("$HOSTNAME"))
		{
			String s=null;
			try {
				s = Inet4Address.getLocalHost().getHostName();
			} catch (UnknownHostException e) {

			}
			if(s!=null && s.length()>0)
				return s;
		}
		Map<String, String> env = System.getenv();
        for (String envName : env.keySet()) {
           if(envName!=null && envName.equals(v))
              return env.get(envName);
        }
        return null;
	}
}
