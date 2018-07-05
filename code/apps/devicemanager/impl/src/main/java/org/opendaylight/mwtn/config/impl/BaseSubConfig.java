package org.opendaylight.mwtn.config.impl;

import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile.ConversionException;
import org.opendaylight.mwtn.base.internalTypes.IniConfigurationFile.Section;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.ISubConfigHandler;

public class BaseSubConfig {


	private final Section subconfig;
	private final ISubConfigHandler configHandler;
	private final IniConfigurationFile config;
	protected Section getSubConfig() {
		return this.subconfig;
	}
	protected ISubConfigHandler getConfigHandler() {
		return this.configHandler;
	}
	protected IniConfigurationFile getConfig() {
		return this.config;
	}
	public BaseSubConfig()
	{
		this.config=null;
		this.subconfig=null;
		this.configHandler=null;
	}
	public BaseSubConfig(IniConfigurationFile config, ISubConfigHandler configHandler,String section) {
		this.config = config;
		this.subconfig = config.subset(section);
		this.configHandler = configHandler;
	}
	protected boolean hasKey(String key)
	{
		if(this.subconfig==null)
			return false;
		return this.subconfig.hasKey(key);
	}
	protected String getString(String key,String def)
	{
		if(this.subconfig==null)
			return def;
		String s;
		//try
		{
			s=this.subconfig.getString(key, def);
			if(s.isEmpty())
				s=def;
		}
		/*catch(ConversionException e)
		{
			s=def;
		}
		*/
		return s;
	}
	protected boolean getBoolean(String key, boolean def) {
		if(this.subconfig==null)
			return def;
		boolean s;
		try {
			s=this.subconfig.getBoolean(key, def);
		}
		catch(ConversionException e)
		{
			s=def;
		}
		return s;
	}
	protected int getInt(String key, int def) {
		if(this.subconfig==null)
			return def;
		int s;
		try {
			s=this.subconfig.getInt(key, def);
		}
		catch(ConversionException e)
		{
			s=def;
		}
		return s;
	}
	protected void save()
	{
		if(this.configHandler!=null)
			this.configHandler.save();
	}


}
