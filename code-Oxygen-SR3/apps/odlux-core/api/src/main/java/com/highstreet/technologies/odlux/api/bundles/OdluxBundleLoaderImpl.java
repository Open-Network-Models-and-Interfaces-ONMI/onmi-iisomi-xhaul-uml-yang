package com.highstreet.technologies.odlux.api.bundles;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OdluxBundleLoaderImpl implements OdluxBundleLoader {

	final static Logger LOG = LoggerFactory.getLogger(OdluxBundleLoaderImpl.class);
	private static OdluxBundleLoaderImpl mObj;
	public static OdluxBundleLoaderImpl getInstance() {
		if(mObj==null)
			mObj=new OdluxBundleLoaderImpl();
		return mObj;
	}
	private final List<OdluxBundle> bundles;

	public List<OdluxBundle> getBundles(){
		return this.bundles;
	}
	
	public OdluxBundleLoaderImpl()
	{
		this.bundles = new ArrayList<OdluxBundle>();
		mObj=this;
	}
	@Override
	public void addBundle(OdluxBundle bundle) {
		LOG.debug("odlux bundle "+bundle.getBundleName()+" added");
		this.bundles.add(bundle);
		
	}

	@Override
	public void removeBundle(OdluxBundle bundle) {
		this.bundles.remove(bundle);
		LOG.debug("odlux bundle "+bundle.getBundleName()+" removed");
		
	}

}
