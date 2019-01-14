package com.highstreet.technologies.odlux.bundles;

import com.highstreet.technologies.odlux.api.bundles.OdluxBundle;
import com.highstreet.technologies.odlux.api.bundles.OdluxBundleLoader;

public class MyOdluxBundle extends OdluxBundle{

	@Override
	public void initialize() {
		super.initialize();
	}
	@Override
	public void clean() {
		super.clean();
	}
	@Override
	public String getResourceFileContent(String filename) {
		return super.getResourceFileContent(filename);
	}
	@Override
	public boolean hasResource(String filename) {
		return super.hasResource(filename);
	}
	@Override
	public void setBundleName(String bundleName) {
		super.setBundleName(bundleName);
	}
	@Override
	public void setLoader(OdluxBundleLoader loader) {
		super.setLoader(loader);
	}
	@Override
	public String getBundleName() {
		return super.getBundleName();
	}
	@Override
	public OdluxBundleLoader getLoader() {
		return super.getLoader();
	}
	public MyOdluxBundle() {
		super();
	}
}
