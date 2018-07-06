package com.highstreet.technologies.helpserver.data;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import org.json.JSONObject;
import org.osgi.framework.Bundle;
import org.osgi.framework.FrameworkUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelpInfrastructureObject extends JSONObject {

	private static final Logger LOG = LoggerFactory.getLogger(HelpInfrastructureObject.class);
	private static String HELPBASE = "help";
	private static String KARAFBUNDLERESOURCEHELPROOT = "/"+HELPBASE;
	private static String KARAFHELPDIRPREFIX = "data/cache/com.highstreet.technologies.";
	public static File KARAFHELPDIRECTORY = new File(KARAFHELPDIRPREFIX+HELPBASE);

	public static class VersionObject extends JSONObject
	{
		private static Comparator<VersionObject> comp;
		private final String mVersion;
		public String getVersion() {return this.mVersion;}
		public VersionObject(String path,String date,String label,String version)
		{
			this.mVersion=version;
			this.put("path", path);
			this.put("date",date);
			this.put("label", label);
		}
		public static Comparator<VersionObject> getComparer() {
			if(comp==null)
				comp=new Comparator<HelpInfrastructureObject.VersionObject>() {

					@Override
					public int compare(VersionObject o1, VersionObject o2) {
						return o1.getVersion().compareTo(o2.getVersion());
					}
				};
				return comp;
		}
		public VersionObject cloneAsLatest() {
			return new VersionObject(this.getString("path"), this.getString("date"), this.getString("label"), "latest");
		}
		public VersionObject cloneAsCurrent() {
			return new VersionObject(this.getString("path"), this.getString("date"), this.getString("label"), "current");
		}
	}
	public static class NodeObject extends JSONObject
	{
		public NodeObject(Path base,File dir,String label,ArrayList<VersionObject> versions)
		{
			this.put("label", label);
			if(versions!=null && versions.size()>0)
			{
				JSONObject o=new JSONObject();
				this.put("versions", o);
				for(VersionObject version : versions)
					o.put(version.getVersion(), version);

			}
			File[] list = dir.listFiles();
		     if (list == null) return;
		     for(File f: list)
		     {
		    	 if(f.isDirectory())
		    	 {
		    		 ArrayList<VersionObject> versions2=findReadmeVersionFolders(base, f.toPath(),true);
		    		 if(versions2!=null && versions2.size()>0)
		    		 {
		    			 JSONObject nodes;
		    			 if(!this.has("nodes"))
		    				 this.put("nodes",new JSONObject());
		    			 nodes=this.getJSONObject("nodes");

		    			 NodeObject o=new NodeObject(base,f,f.getName(),versions2);
		    			 nodes.put(o.getString("label").toLowerCase(),o);
		    		 }
		    	 }
		     }
		}

	}
	public HelpInfrastructureObject(Path proot) throws URISyntaxException
	{
		 File root = proot.toFile();
	     File[] list = root.listFiles();
	     if (list == null) return;
	     for(File f: list)
	     {
	    	 if(f.isDirectory())
	    	 {
	    		 ArrayList<VersionObject> versions=findReadmeVersionFolders(root.toPath(), f.toPath(),true);
	    		 if(versions!=null && versions.size()>0)
	    		 {
	    			 NodeObject o=new NodeObject(proot,f,f.getName(),versions);
	    			 this.put(o.getString("label").toLowerCase(), o);
	    		 }
	    	 }
	     }


	}
	 public static void walk(ArrayList<File> results, String path ) {

	        File root = new File( path );
	        File[] list = root.listFiles();

	        if (list == null) return;

	        for ( File f : list ) {
	            if ( f.isDirectory() ) {
	                walk(results, f.getAbsolutePath() );
	                //System.out.println( "Dir:" + f.getAbsoluteFile() );
	            }
	            else {
	                //System.out.println( "File:" + f.getAbsoluteFile() );
	                if(f.isFile() && f.getName().endsWith(".md") )
	                	results.add(f);
	            }
	        }
	    }
	 private static ArrayList<VersionObject> findReadmeVersionFolders(Path base,Path root,boolean appendCurrent)
	 {
		 ArrayList<VersionObject> list=new ArrayList<>();
		 File[] files=root.toFile().listFiles();
		 int baselen=base.toFile().getAbsolutePath().length();
		 if(files!=null)
		 {
			 for(File f : files)
			 {
				if(f.isDirectory() && new File(f.getAbsolutePath()+"/README.md").exists())
					list.add(new VersionObject(f.getAbsolutePath().substring(baselen+1)+"/README.md","","",f.getName()));
			 }
		 }
		 Collections.sort(list, VersionObject.getComparer());
		 Collections.reverse(list);
		 if(list.size()>0 && appendCurrent)
		 {
			 list.add(list.get(0).cloneAsCurrent());
		 }
		 return list;
	 }


	 public static void createFilesFromResources()
	 {

		 if (KARAFHELPDIRECTORY.exists()) {
			 LOG.info("Delete existing directory");
			 try {
				 ExtactBundleResource.deleteRecursively(KARAFHELPDIRECTORY);
			 } catch (IOException e1) {
				 LOG.warn(e1.toString());
			 }
		 }

		 LOG.info("Extract");
		 try {
			 Bundle b=FrameworkUtil.getBundle(HelpInfrastructureObject.class);
			 if (b == null) {
				 LOG.info("No bundlereference: Use target in filesystem.");
				 //URL helpRessource = JarFileUtils.stringToJarURL("target/helpserver-impl-0.4.0-SNAPSHOT.jar",KARAFBUNDLERESOURCEHELPROOT);

			 } else {
				 LOG.info("Bundle location:{} State:{}",b.getLocation(), b.getState());
				 LOG.info("Write files from Resource");
				 ExtactBundleResource.copyBundleResoucesRecursively(b,"data/cache/com.highstreet.technologies." ,KARAFBUNDLERESOURCEHELPROOT);
			 }
		 } catch (IOException e) {
			 LOG.warn("No help files available. Exception: "+e.toString());
		 }
	 }

	 public static Path getHelpDirectoryBase() {
		 return(KARAFHELPDIRECTORY.toPath());
	 }
}
