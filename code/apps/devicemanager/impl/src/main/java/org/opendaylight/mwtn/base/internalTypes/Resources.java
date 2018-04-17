package org.opendaylight.mwtn.base.internalTypes;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.framework.Bundle;
import org.osgi.framework.FrameworkUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Resources {

	private static final Logger LOG = LoggerFactory.getLogger(Resources.class);


	private static URL getFileURL(String resFile)
	{
		Bundle b = FrameworkUtil.getBundle(Resources.class);
		URL u=null;
		if(b==null)
		{
			LOG.warn("cannot load bundle resources");
			try {
				u=new File("src/main/resources"+resFile).toURI().toURL();
			} catch (MalformedURLException e) {
				LOG.warn(e.getMessage());
			}
		}
		else
			u= b.getEntry(resFile);
		return u;
	}

	private static File getFile(String resFile)
	{
		Bundle b = FrameworkUtil.getBundle(Resources.class);
		File f=null;
		if(b==null)
		{
			LOG.warn("cannot load bundle resources");
			f=new File("src/main/resources"+resFile);
		} else
			try {
				f=new File(b.getEntry(resFile).toURI());
			} catch (URISyntaxException e) {

			}
		return f;
	}

	private static String readFile(final URL u) throws IOException
	{
		return readFile(u.openStream());
	}
	private static String readFile(final File f) throws IOException
	{
		return readFile(new FileInputStream(f));
	}
	private static String readFile(final InputStream s) throws IOException
	{
		//read file
		BufferedReader in = new BufferedReader(new InputStreamReader(s));
        StringBuilder sb=new StringBuilder();
		String inputLine;
        while ((inputLine = in.readLine()) != null)
        {
        	sb.append(inputLine);
        }
	    in.close();
	    s.close();
	    return sb.toString();
	}

	public static String getFileContent(String resFile) throws IOException
	{
		return readFile(getFileURL(resFile));
	}
	public static List<File> getFiles(String folder,final String filter,final boolean recursive)
	{
		List<File> list=new ArrayList<File>();
		FileFilter ff=new FileFilter() {

			@Override
			public boolean accept(File pathname) {
				if(pathname.isFile())
					return pathname.getName().contains(filter);
				else
					return true;
			}
		};
		File ffolder=getFile(folder);
		if(ffolder!=null && ffolder.isDirectory())
		{
			File[] files=ffolder.listFiles(ff);
			if(files!=null && files.length>0)
			{
				for(File f:files)
				{
					if(f.isFile())
						list.add(f);
					else if(f.isDirectory() && recursive)
					{
						getFilesRecursive(f,ff,list);
					}
				}
			}
		}
		return list;
	}
	public static List<URL> getFileURLs(String folder,final String filter,final boolean recursive) throws IOException
	{
		Bundle b = FrameworkUtil.getBundle(Resources.class);
		List<URL> list=new ArrayList<URL>();
		if(b==null)
		{
			FileFilter ff=new FileFilter() {

				@Override
				public boolean accept(File pathname) {
					if(pathname.isFile())
						return pathname.getName().contains(filter);
					else
						return true;
				}
			};
			File ffolder=getFile(folder);
			if(ffolder!=null && ffolder.isDirectory())
			{
				File[] files=ffolder.listFiles(ff);
				if(files!=null && files.length>0)
				{
					for(File f:files)
					{
						if(f.isFile())
							list.add(f.toURI().toURL());
						else if(f.isDirectory() && recursive)
						{
							getFileURLsRecursive(f,ff,list);
						}
					}
				}
			}
		}
		else
		{
			getResourceURLsTreeRecurse(b,filter,b.getEntryPaths(folder),recursive,list);
		}
		return list;
	}
	private static void getFilesRecursive(File root, FileFilter ff, List<File> list) {
		if(root!=null && root.isDirectory())
		{
			File[] files=root.listFiles(ff);
			if(files!=null && files.length>0)
			{
				for(File f:files)
				{
					if(f.isFile())
						list.add(f);
					else if(f.isDirectory())
					{
						getFilesRecursive(f,ff,list);
					}
				}
			}
		}

	}
	private static void getFileURLsRecursive(File root, FileFilter ff, List<URL> list) throws MalformedURLException {
		if(root!=null && root.isDirectory())
		{
			File[] files=root.listFiles(ff);
			if(files!=null && files.length>0)
			{
				for(File f:files)
				{
					if(f.isFile())
						list.add(f.toURI().toURL());
					else if(f.isDirectory())
					{
						getFileURLsRecursive(f,ff,list);
					}
				}
			}
		}

	}
	private static void getResourceURLsTreeRecurse(Bundle b, String filter, Enumeration<String> resource,boolean recursive,List<URL> outp) throws IOException {
		while (resource.hasMoreElements()) {
			String name = resource.nextElement();
			Enumeration<String> list = b.getEntryPaths(name);
			if (list != null) {
				if(recursive)
					getResourceURLsTreeRecurse(b, filter, list,recursive,outp);
			} else {
				//Read
				if(name.contains(filter))
				{
					LOG.debug("add "+name+ " to list");
					outp.add(b.getEntry(name));
				}
				else
					LOG.debug("filtered out "+name);
			}
		}
	}
	public static List<JSONObject> getJSONFiles(String folder,boolean recursive)
	{
		List<URL> urls=null;
		try {
			urls = getFileURLs(folder,".json",recursive);
		} catch (IOException e1) {
			LOG.warn("failed to get urls from resfolder "+folder+" : "+e1.getMessage());
		}
		LOG.debug("found "+urls==null?"no":urls.size()+" files");
		List<JSONObject> list=new ArrayList<JSONObject>();
		if(urls!=null)
		{
			for (URL u: urls)
			{
				LOG.debug("try to parse "+u.toString());
				try {
					JSONObject o=new JSONObject(readFile(u));
					list.add(o);
				} catch (JSONException | IOException e) {
					LOG.warn("problem reading/parsing file "+u+" :"+e.getMessage());
				}
			}
		}
		return list;
	}
	public static JSONObject getJSONFile(String resFile) {
		LOG.debug("loading json file "+resFile+" from res");
		URL u=getFileURL(resFile);
		if (u == null)
		{
			LOG.warn("cannot find resfile: "+resFile);
			return null;
		}
		JSONObject o=null;
		try
		{
			//parse to jsonobject
		    o=new JSONObject(readFile(u));
		}
		catch(Exception e)
		{
			LOG.warn("problem reading/parsing file: "+e.getMessage());
		}
		return o;
	}

	public static boolean extractFileTo(String resFile, File oFile) {
    	if(oFile==null)
    		return false;
    	LOG.debug("try to copy "+resFile+" from res to "+oFile.getAbsolutePath());
    	URL u=getFileURL(resFile);
		if (u == null)
		{
			LOG.warn("cannot find resfile:"+resFile);
			return false;
		}
		try {
			InputStream in = u.openStream();
			oFile.getParentFile().mkdirs();
			OutputStream outStream;
			outStream = new FileOutputStream(oFile);
			int theInt;
			while ((theInt = in.read()) >= 0) {
				outStream.write(theInt);
			}
			in.close();
			outStream.flush();
			outStream.close();
			LOG.debug("file written successfully");
		}
		catch (IOException e) {
			LOG.error("problem writing file:"+e.getMessage());
			return false;
		}
		return true;
	}

}
