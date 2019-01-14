package com.highstreet.technologies.odlux.api.bundles;

import java.io.IOException;
import java.net.URL;
import java.util.Iterator;

import org.osgi.framework.Bundle;
import org.osgi.framework.FrameworkUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.opensymphony.xwork2.util.ClassLoaderUtil;

public class ClassLoaderUtilExt {

	final static Logger LOG = LoggerFactory.getLogger(ClassLoaderUtilExt.class);
	public static URL getResource(String resourceName, Class callingClass) {

		Iterator<URL> urls = null;
		URL url=null;
			try {
				urls=getResources(resourceName, callingClass,true);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		if(urls!=null)
		{
			while(urls.hasNext())
			{
				URL u=urls.next();
				LOG.debug("found "+u.toString());
				url=u;
				break;
			}
		}
		if (url == null) {
			LOG.debug("res currently not found. try to find with bundle");
			Bundle b = FrameworkUtil.getBundle(callingClass);
			url = b.getEntry(resourceName);
		}
		return url;
	}
	public static Iterator<URL> getResources(String resourceName, Class callingClass, boolean aggregate) throws IOException{
		return ClassLoaderUtil.getResources(resourceName, callingClass, aggregate);
	}

}
