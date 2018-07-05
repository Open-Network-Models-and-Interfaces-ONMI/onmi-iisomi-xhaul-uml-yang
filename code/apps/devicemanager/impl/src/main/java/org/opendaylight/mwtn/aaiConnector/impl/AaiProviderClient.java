package org.opendaylight.mwtn.aaiConnector.impl;

import java.util.List;

import org.opendaylight.mwtn.base.http.BaseHTTPResponse;
import org.opendaylight.mwtn.base.internalTypes.InventoryInformation;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.config.impl.AaiConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.IConfigChangedListener;
import org.opendaylight.mwtn.devicemanager.impl.DeviceManagerImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AaiProviderClient implements AutoCloseable {

	private static Logger LOG = LoggerFactory.getLogger(AaiProviderClient.class);
	private static boolean reloadConfigFlag;
	private AaiConfig config;
	private DeviceManagerImpl deviceManager;
	private HtDevicemanagerConfiguration htconfig;
	private final IConfigChangedListener configChangedListener = new IConfigChangedListener() {

		@Override
		public void onConfigChanged() {
			reloadConfigFlag=true;
		}
	};


	public AaiConfig getConfig() {return this.config;}

	private class AaiCreateRequestRunnable implements Runnable {

		private static final int RESPCODE_NOTFOUND = BaseHTTPResponse.CODE404;
		private static final int RESPCODE_FOUND = BaseHTTPResponse.CODE200;
		private final AaiWebApiClient mClient;
		private final String pnfId;
		private final String type;
		private final String model;
		private final String vendor;
		private final String oamIp;
		private final List<String> ifaces;
		private int timeout;
		public AaiCreateRequestRunnable(String pnfId, String type, String model, String vendor, String oamIp,
				List<String> ifaces) {
			this.pnfId = pnfId;
			this.type = type;
			this.model = model;
			this.vendor = vendor;
			this.oamIp = oamIp;
			this.ifaces = ifaces;
			this.timeout=AaiProviderClient.this.config.getConnectionTimeout();
			this.mClient = new AaiWebApiClient(
					AaiProviderClient.this.config.getBaseUrl(),
					AaiProviderClient.this.config.getHeaders(),
					AaiProviderClient.this.config.getTrustAll(),
					AaiProviderClient.this.config.getPcks12CertificateFilename(),
					AaiProviderClient.this.config.getPcks12CertificatePassphrase()
					);
		}

		@Override
		public void run() {
			LOG.debug("check if pnfid "+pnfId+" exists");
			this.mClient.setTimeout(timeout);
			BaseHTTPResponse response=this.mClient.pnfCheckIfExists(pnfId);
			if(response.code==RESPCODE_NOTFOUND)
			{
				LOG.debug("do pnfCreate for "+pnfId);
				this.mClient.pnfCreate(pnfId, type, model, vendor, oamIp, ifaces);
			}
			else if(response.code==RESPCODE_FOUND)
			{
				LOG.debug("pnfid "+pnfId+" found, nothing to do");
			}
			else
			{
				LOG.warn("unhandled response code: "+response.toString());
			}
		}
	};

	private class AaiDeleteRequestRunnable implements Runnable {

		private final AaiWebApiClient mClient;
		private final String pnfId;
		private int timeout;


		public AaiDeleteRequestRunnable(String pnfId) {
			this.pnfId = pnfId;
			this.timeout=AaiProviderClient.this.config.getConnectionTimeout();
			this.mClient = new AaiWebApiClient(
					AaiProviderClient.this.config.getBaseUrl(),
					AaiProviderClient.this.config.getHeaders(),
					AaiProviderClient.this.config.getTrustAll(),
					AaiProviderClient.this.config.getPcks12CertificateFilename(),
					AaiProviderClient.this.config.getPcks12CertificatePassphrase()
					);
		}

		@Override
		public void run() {
			this.mClient.setTimeout(this.timeout);
			this.mClient.pnfDelete(pnfId);
		}
	};

	public AaiProviderClient(HtDevicemanagerConfiguration cfg,DeviceManagerImpl devMgr) {
		this.config = cfg.getAai();
		this.htconfig=cfg;
		this.htconfig.registerConfigChangedListener(configChangedListener);
		this.deviceManager = devMgr;

	}

	private void _reload()
	{
		if(reloadConfigFlag)
		{
			this.config=AaiConfig.reload();
			LOG.info("config reloaded:"+config==null?"null":config.toString());
		}
		reloadConfigFlag=false;
	}
	public void onDeviceRegistered(String mountPointName) {
		this._reload();
		if(this.config.isOff())
			return;
		ONFCoreNetworkElementRepresentation ne =this.deviceManager!=null?this.deviceManager.getNeByMountpoint(mountPointName):null;
		this.onDeviceRegistered(mountPointName,ne!=null?ne.getInventoryInformation("MWPS"):InventoryInformation.DEFAULT);

	}
	public void onDeviceRegistered(String mountPointName,InventoryInformation i) {
		this._reload();
		if(this.config.isOff())
			return;
		new Thread(new AaiCreateRequestRunnable(mountPointName, i.getType(), i.getModel(), i.getVendor(), i.getDeviceIpv4(), i.getInterfaceUuidList())).start();
	}
	public void onDeviceUnregistered(String mountPointName) {
		this._reload();
		if(this.config.isOff())
			return;
		if(this.config.doDeleteOnMountPointRemoved())
			new Thread(new AaiDeleteRequestRunnable(mountPointName)).start();
		else
			LOG.debug("prevent deleting device "+mountPointName+" by config");
	}

	@Override
	public void close() throws Exception {
		this.htconfig.unregisterConfigChangedListener(configChangedListener);
	}
}
