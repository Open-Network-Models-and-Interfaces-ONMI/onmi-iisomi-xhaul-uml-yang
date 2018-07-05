package org.opendaylight.mwtn.config.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

public class AkkaConfig {

	private static final Logger LOG = LoggerFactory.getLogger(AkkaConfig.class);

	public static class ClusterNodeInfo {
		@Override
		public String toString() {
			return "ClusterNodeInfo [protocol=" + protocol + ", clusterName=" + clusterName + ", remoteAdr=" + remoteAdr
					+ ", port=" + port + "]";
		}

		private final String protocol;
		private final String clusterName;
		private final String remoteAdr;
		private final int port;

		public String getRemoteAddress() {
			return this.remoteAdr;
		}

		public ClusterNodeInfo(String s) throws Exception {
			final String regex = "([a-z.]*):\\/\\/([a-zA-Z0-9-]*)@([a-zA-Z0-9.-]*):([0-9]*)";
			final Pattern pattern = Pattern.compile(regex);
			final Matcher matcher = pattern.matcher(s);
			if (!matcher.find())
				throw new Exception("invalid seedNode format");
			this.protocol = matcher.group(1);
			this.clusterName = matcher.group(2);
			this.remoteAdr = matcher.group(3);
			this.port = Integer.parseInt(matcher.group(4));
		}

		public ClusterNodeInfo(String protocol, String clustername, String remoteadr, int port) {
			this.protocol=protocol;
			this.clusterName=clustername;
			this.remoteAdr=remoteadr;
			this.port=port;
		}

		public static ClusterNodeInfo defaultSingleNodeInfo() {
			return new ClusterNodeInfo("akka.tcp","opendaylight-cluster-data","127.0.0.1",2550);
		}
	}

	public static class ClusterRoleInfo {
		private final String Role;
		private final int Index;

		public ClusterRoleInfo(String s) throws Exception {
			final String regex = "([a-zA-Z]*)-([0-9]*)";
			final Pattern pattern = Pattern.compile(regex);
			final Matcher matcher = pattern.matcher(s);
			if (!matcher.find())
				throw new Exception("unexpected role format:"+s);
			this.Role = matcher.group(1);
			this.Index = Integer.parseInt(matcher.group(2));
		}

		private ClusterRoleInfo(String role, int idx) {
			this.Role=role;
			this.Index=idx;
		}

		@Override
		public boolean equals(Object obj) {
			if(obj instanceof ClusterRoleInfo)
				return ((ClusterRoleInfo)obj).Index== this.Index && ((ClusterRoleInfo)obj).Role.equals(this.Role);
			return super.equals(obj);
		}
		public static ClusterRoleInfo defaultSingleNodeRole() {
			return new ClusterRoleInfo("member",1);
		}
		@Override
		public String toString() {
			return "ClusterRoleInfo [Role=" + Role + ", Index=" + Index + "]";
		}
	}
	public static class ClusterRoleInfoCollection extends ArrayList<ClusterRoleInfo>
	{
		private static final long serialVersionUID = 1L;
		public ClusterRoleInfo get(String role)
		{
			for(ClusterRoleInfo info:this)
			{
				if(info.Role.equals(role))
					return info;
			}
			return null;
		}
		public boolean contains(ClusterRoleInfo info)
		{
			if(info==null)
				return false;
			for(ClusterRoleInfo i:this)
			{
				if(i.equals(info))
					return true;
			}
			return false;
		}
	}
	public static class ClusterConfig {
		@Override
		public String toString() {
			return "ClusterConfig [seedNodes=" + seedNodes + ", roles=" + roles + "]";
		}

		private final List<ClusterNodeInfo> seedNodes;
		private final ClusterRoleInfoCollection roles;
		private ClusterNodeInfo ismeInfo;

		public static ClusterConfig defaultSingleNodeConfig()
		{
			ClusterConfig cfg=new ClusterConfig();
			cfg.ismeInfo=ClusterNodeInfo.defaultSingleNodeInfo();
			cfg.seedNodes.add(cfg.ismeInfo);
			cfg.roles.add(ClusterRoleInfo.defaultSingleNodeRole());
			return cfg;
		}
		private ClusterConfig()
		{
			this.seedNodes = new ArrayList<ClusterNodeInfo>();
			this.roles = new ClusterRoleInfoCollection();

		}
		public ClusterConfig(Config o) throws Exception {
			{
				this.seedNodes = new ArrayList<ClusterNodeInfo>();
				this.roles = new ClusterRoleInfoCollection();
				List<String> a = o.getStringList("seed-nodes");
				for (int i = 0; i < a.size(); i++) {
					ClusterNodeInfo info = new ClusterNodeInfo(a.get(i));
					this.seedNodes.add(info);
				}
				a = o.getStringList("roles");
				for (int i = 0; i < a.size(); i++) {
					ClusterRoleInfo s = new ClusterRoleInfo(a.get(i));
					this.roles.add(s);
				}
				int idx = this.roles.get(0).Index - 1;
				if (idx >= 0 && idx < this.seedNodes.size())
					this.ismeInfo = this.seedNodes.get(idx);
				else
					this.ismeInfo = null;
			}

		}

		public boolean isCluster() {
			return this.seedNodes != null ? this.seedNodes.size() > 1 : false;
		}

		public boolean isMe(ClusterNodeInfo i) {
			return this.ismeInfo != null ? this.ismeInfo.equals(i) : false;
		}

		public List<ClusterNodeInfo> getSeedNodes() {
			return this.seedNodes;
		}

		public String getHostName(String defaultValue) {
			if (getRoleMemberIndex() > 0 && getRoleMemberIndex() <= seedNodes.size())
				return this.seedNodes.get(getRoleMemberIndex()-1).remoteAdr;
			else {
				LOG.warn("Seednode not available for roleMemberIndex {}. Using default {}",getRoleMember(), defaultValue);
				return defaultValue;
			}
		}

		public String getDBClusterName(String defaultValue) {
			String r = null;
			if (this.seedNodes != null && this.seedNodes.size() > 0) {
				r = String.format("cluster-%s.%d", this.seedNodes.get(0).remoteAdr, this.seedNodes.get(0).port);
			}
			if (r == null || r.isEmpty())
				r = defaultValue;
			return r;
		}

		public int getRoleMemberIndex() {

			ClusterRoleInfo role=this.roles.get("member");
			return role!=null?role.Index:0;
		}
		public ClusterRoleInfo getRoleMember() {
			return this.roles.get("member");
		}
	}

	private static final String DEFAULT_FILENAME = "configuration/initial/akka.conf";
	private final String filename;
	private ClusterConfig cluserConfig;

	public ClusterConfig getClusterConfig() {
		return this.cluserConfig;
	}

	private AkkaConfig(String filename) {
		this.filename = filename;
	}

	public AkkaConfig() {
		this(null);
	}

	@Override
	public String toString() {
		return "AkkaConfig [filename=" + filename + ", cluserConfig=" + cluserConfig + "]";
	}

	private void loadFromFile() throws Exception {
		Config cfg = ConfigFactory.parseFile(new File(this.filename));
		this.cluserConfig = new ClusterConfig(cfg.getConfig("odl-cluster-data").getConfig("akka").getConfig("cluster"));
	}

	public boolean isCluster() {
		return this.cluserConfig != null ? this.cluserConfig.isCluster() : false;
	}

	public static AkkaConfig load() throws Exception {
		return load(DEFAULT_FILENAME);
	}

	public static AkkaConfig load(String filename) throws Exception {
		AkkaConfig cfg = new AkkaConfig(filename);
		cfg.loadFromFile();
		return cfg;
	}

	public boolean isSingleNode() {
		return !this.isCluster();
	}
	public static AkkaConfig defaultSingleNodeConfig()
	{
		AkkaConfig cfg=new AkkaConfig();
		cfg.cluserConfig=new ClusterConfig();
		return cfg;
	}

	public static AkkaConfig parse(String content) throws Exception {
		Config cfg = ConfigFactory.parseString(content);
		AkkaConfig c=new AkkaConfig();
		c.cluserConfig=new ClusterConfig(cfg.getConfig("odl-cluster-data").getConfig("akka").getConfig("cluster"));
		return c;
	}
}
