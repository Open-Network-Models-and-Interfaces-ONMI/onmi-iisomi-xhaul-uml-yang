package org.opendaylight.mwtn.dcaeConnector.impl;

import org.opendaylight.mwtn.config.impl.DcaeConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration.IConfigChangedListener;
import org.opendaylight.mwtn.devicemanager.impl.DeviceManagerImpl;
import org.opendaylight.mwtn.devicemanager.impl.ProviderClient;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DcaeProviderClient implements AutoCloseable, ProviderClient {

    private static final Logger LOG = LoggerFactory.getLogger(DcaeProviderClient.class);

	private final HtDevicemanagerConfiguration htConfig;
	private final String entityName;
	private final DeviceManagerImpl deviceManager;

	private DcaeProviderWorker worker;

    public DcaeProviderClient(HtDevicemanagerConfiguration cfg, String entityName, DeviceManagerImpl deviceManager) {
    	LOG.info("Create");
    	this.entityName = entityName;
    	this.deviceManager = deviceManager;
    	this.htConfig=cfg;
		this.htConfig.registerConfigChangedListener(configChangedListener );

		worker = new DcaeProviderWorker(this.htConfig.getDcae(), entityName, deviceManager);
    }

	@Override
    public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification) {
    	synchronized(worker) {
    		worker.sendProblemNotification(mountPointName, notification);
    	}
    }

	@Override
	public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification, boolean neDeviceAlarm) {
		sendProblemNotification(mountPointName, notification);
	}

	@Override
	public void close() {
		this.htConfig.unregisterConfigChangedListener(configChangedListener);
    	synchronized(worker) {
    		worker.close();
    	}
	}

    /* ---------------------------------------------------------
     * Private
     */

	private IConfigChangedListener configChangedListener = new IConfigChangedListener() {

		@Override
		public void onConfigChanged() {
			LOG.info("Configuration change. Worker exchanged");
			synchronized(worker) {
				worker.close();
				worker = new DcaeProviderWorker(DcaeConfig.reload(), entityName, deviceManager);
			}
		}
	};

}



