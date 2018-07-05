package org.opendaylight.mwtn.config.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.opendaylight.mwtn.config.impl.AkkaConfig.ClusterRoleInfo;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

public class GeoConfig {


	public static class RolesTableEntry
	{
		@Override
		public String toString() {
			return "RolesTableEntry [role=" + role + ", ip=" + ip + "]";
		}
		private final AkkaConfig.ClusterRoleInfo role;
		private final String ip;
		public RolesTableEntry(Config c) throws Exception {
			this.role = new ClusterRoleInfo(c.getString("role"));
			this.ip=c.getString("ip");
		}
	}
	public static class RolesTable extends ArrayList<RolesTableEntry>
	{
		/**
		 *
		 */
		private static final long serialVersionUID = -9146218864237487506L;

		public RolesTable(List<? extends Config> configList) throws Exception {
			for(Config c : configList)
			{
				this.add(new RolesTableEntry(c));
			}
		}

	}

	private static final String DEFAULT_FILENAME = "configuration/initial/geo.conf";
	private static final String LUMINA_ROOTNODENAME = "lumina-geo-cluster";
	private final String filename;
	private final String rootNodename;
	private AkkaConfig.ClusterRoleInfoCollection primaryRoles;
	private AkkaConfig.ClusterRoleInfoCollection secondayRoles;
	private RolesTable rolesTable;
	private GeoConfig()
	{
		this(null);
	}
	@Override
	public String toString() {
		return "GeoConfig [filename=" + filename + ", rootNodename=" + rootNodename + ", primaryRoles=" + primaryRoles
				+ ", secondayRoles=" + secondayRoles + ", rolesTable=" + rolesTable + "]";
	}
	private GeoConfig(String filename)
	{
		this(filename,LUMINA_ROOTNODENAME);
	}
	private GeoConfig(String filename,String rootNodeName)
	{
		this.filename=filename;
		this.rootNodename=rootNodeName;
	}
	public static boolean fileExists()
	{
		File f=new File(DEFAULT_FILENAME);
		return f.exists();
	}
	public static GeoConfig load() throws Exception
	{
		return load(DEFAULT_FILENAME);
	}
	public static GeoConfig load(String filename) throws Exception
	{
		GeoConfig cfg=new GeoConfig(filename);
		cfg._load();
		return cfg;
	}
	private void _load() throws Exception
	{
		this._load(ConfigFactory.parseFile(new File(this.filename)));
	}
	private void _load(Config cfg) throws Exception {
		 this.primaryRoles=new AkkaConfig.ClusterRoleInfoCollection();
		List<String> a=cfg.getConfig(this.rootNodename).getStringList("primary_roles");

		for (int i = 0; i < a.size(); i++) {
			ClusterRoleInfo s = new ClusterRoleInfo(a.get(i));
			this.primaryRoles.add(s);
		}
		this.secondayRoles=new AkkaConfig.ClusterRoleInfoCollection();
		a=cfg.getConfig(this.rootNodename).getStringList("secondary_roles");
		for (int i = 0; i < a.size(); i++) {
			ClusterRoleInfo s = new ClusterRoleInfo(a.get(i));
			this.secondayRoles.add(s);
		}
		this.checkDuplicateRoleEntries();
		this.rolesTable = new RolesTable(cfg.getConfig(this.rootNodename).getConfigList("ip_roles_table"));
	}
	private void checkDuplicateRoleEntries() throws Exception {
		AkkaConfig.ClusterRoleInfoCollection duplicateEntries=new AkkaConfig.ClusterRoleInfoCollection();
		for(ClusterRoleInfo primaryRole: this.primaryRoles)
		{
			if(this.secondayRoles.contains(primaryRole))
				duplicateEntries.add(primaryRole);
		}
		if(duplicateEntries.size()>0)
			throw new Exception("duplicate entries found: "+duplicateEntries.toString());

	}
	public static GeoConfig parse(String content) throws Exception {
		GeoConfig cfg=new GeoConfig();
		cfg._load(ConfigFactory.parseString(content));
		return cfg;
	}
	public AkkaConfig.ClusterRoleInfoCollection getPrimaryRoles() {
		return this.primaryRoles;
	}
	public AkkaConfig.ClusterRoleInfoCollection getSecondaryRoles() {
		return this.secondayRoles;
	}
	public boolean isPrimary(ClusterRoleInfo roleMember) {
		return !this.isSecondary(roleMember);
	}
	private boolean isSecondary(ClusterRoleInfo roleMember) {
		if(roleMember==null)
			return false;
		for(ClusterRoleInfo info:this.secondayRoles)
		{
			if(info.equals(roleMember))
				return true;
		}
		return false;
	}

}
