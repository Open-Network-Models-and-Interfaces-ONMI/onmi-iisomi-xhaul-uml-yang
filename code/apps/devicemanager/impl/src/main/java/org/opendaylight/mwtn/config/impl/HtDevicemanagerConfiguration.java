package org.opendaylight.mwtn.config.impl;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.opendaylight.mwtn.base.internalTypes.FileWatchdog;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile.ConfigurationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HtDevicemanagerConfiguration {

	private static final long FILE_POLL_INTERVAL_MS = 1000;

	public interface IConfigChangedListener {
		void onConfigChanged();
	}
	public static class ConfigFileObserver extends FileWatchdog
	{
		private final List<IConfigChangedListener> mConfigChangedHandlers = new ArrayList<IConfigChangedListener>();
		protected ConfigFileObserver(String filename) {
			super(filename);
			this.setDelay(FILE_POLL_INTERVAL_MS);
		}

		@Override
		protected void doOnChange() {

			boolean succeeded=true;
			LOG.debug("property file has changed");
			try {
				mConfig.reLoad();

			} catch (ConfigurationException e) {
				LOG.warn("error reloading config: "+e.getMessage());
				succeeded = false;

			}
			if(!succeeded)
				return;
			if(this.mConfigChangedHandlers==null)
			{
				LOG.debug("handler list is null");//should never happen
				return;
			}
			//push event to all listeners
			for (IConfigChangedListener listener : this.mConfigChangedHandlers) {
				if (listener != null)
					listener.onConfigChanged();
			}
		}

		public void registerConfigChangedListener(IConfigChangedListener l) {
			if (!this.mConfigChangedHandlers.contains(l))
				this.mConfigChangedHandlers.add(l);
		}

		public void unregisterConfigChangedListener(IConfigChangedListener l) {
			this.mConfigChangedHandlers.remove(l);
		}


	}
	public interface ISubConfigHandler {
		void save();
	}

	private static final Logger LOG = LoggerFactory.getLogger(HtDevicemanagerConfiguration.class);

	private static final String CONFIGURATIONFILE = "etc/devicemanager.properties";
	private static final String CONFIGURATIONTESTFILE = "test.properties"; // for
	// testing

	private static HtDevicemanagerConfiguration mObj;
	private static HtDevicemanagerConfiguration mObjTest;

	public static HtDevicemanagerConfiguration getConfiguration() {
		if (mObj == null)
			mObj = new HtDevicemanagerConfiguration(CONFIGURATIONFILE);
		return mObj;
	}
	public static HtDevicemanagerConfiguration getTestConfiguration() {
		if (mObjTest == null)
			mObjTest = new HtDevicemanagerConfiguration(CONFIGURATIONTESTFILE);
		return mObjTest;
	}
	private static IniConfigurationFile mConfig;
	private File mFile;

	public IniConfigurationFile getMConfig() {
		return mConfig;
	}

	private final ConfigFileObserver fileObserver;
	public void registerConfigChangedListener(IConfigChangedListener l) {
		this.fileObserver.registerConfigChangedListener(l);
	}

	public void unregisterConfigChangedListener(IConfigChangedListener l) {
		this.fileObserver.unregisterConfigChangedListener(l);
	}

	private HtDevicemanagerConfiguration(String filename) {

		try {
			this.mFile = new File(filename);
			if (!this.mFile.exists())
				this.mFile.createNewFile();
			if(mConfig==null)
				mConfig = new IniConfigurationFile(this.mFile);
			mConfig.load();

		} catch (ConfigurationException e) {
			LOG.error("error loading config values:" + e.getMessage());

		} catch (IOException e) {
			LOG.error("error loading config file " + filename + ": " + e.getMessage());
		}

		this.fileObserver=new ConfigFileObserver(filename);
		this.fileObserver.start();
	}

	@Override
	protected void finalize() throws Throwable {
		if(this.fileObserver!=null)
			this.fileObserver.interrupt();
		super.finalize();
	}
	public DcaeConfig getDcae() {
		return DcaeConfig.getDcae(mConfig, this.subconfigHandler);
	}

	public AaiConfig getAai() {
		return AaiConfig.getAai(mConfig, this.subconfigHandler);
	}

	public EsConfig getEs() {
		return EsConfig.getEs(mConfig, this.subconfigHandler);
	}

	public PmConfig getPm() {
		return PmConfig.getPm(mConfig, this.subconfigHandler);
	}

	private final ISubConfigHandler subconfigHandler = new ISubConfigHandler() {

		@Override
		public void save() {
			mConfig.save();
		}
	};

	public ISubConfigHandler getSubconfigHandler() {
		return subconfigHandler;
	}



}
