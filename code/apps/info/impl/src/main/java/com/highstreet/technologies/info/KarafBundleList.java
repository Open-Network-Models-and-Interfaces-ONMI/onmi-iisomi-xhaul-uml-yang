package com.highstreet.technologies.info;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.jar.Attributes;
import java.util.jar.JarInputStream;
import java.util.jar.Manifest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class KarafBundleList extends ArrayList<KarafBundle>{


	private static Logger LOG = LoggerFactory.getLogger(KarafBundleList.class);
	/**
	 *
	 */
	private static final long serialVersionUID = 2856302408338858883L;
	private final Path _root;
	public KarafBundleList(String root)
	{
		this._root=new File(root).toPath();
	}
	public void scan()
	{
		LOG.debug("start scanning "+this._root.toString()+" for bundles");
		for(File f : this._root.toFile().listFiles())
		{
			if(!f.isDirectory())
				continue;
			int id=Integer.parseInt(f.getName());
			File bundleFile=new File(f,"1/bundlefile");
			if(bundleFile.exists() && bundleFile.isFile())
			{
				LOG.trace("try to load bundleinfos for "+bundleFile.getName()+"("+id+")");
				try {
					KarafBundle infos=this._readManifestFromZip(id,bundleFile);
					this.add(infos);
				} catch (IOException e) {
					LOG.warn("problem reading bundle with id="+id+": "+e.getMessage());
				}
			}
		}
	}
	private KarafBundle _readManifestFromZip(int id,File bundleFile) throws FileNotFoundException, IOException  {

		JarInputStream jarStream = new JarInputStream(new FileInputStream(bundleFile));
		Manifest mf = jarStream.getManifest();
		Attributes a=mf.getMainAttributes();
		jarStream.close();
		return new KarafBundle(id, a.getValue("Bundle-Name"), a.getValue("Bundle-SymbolicName"), a.getValue("Bundle-Vendor"), a.getValue("Bundle-Version"));
	}

	public String toJSON()
	{
		return "["+String.join(",", this)+"]";
	}
}
