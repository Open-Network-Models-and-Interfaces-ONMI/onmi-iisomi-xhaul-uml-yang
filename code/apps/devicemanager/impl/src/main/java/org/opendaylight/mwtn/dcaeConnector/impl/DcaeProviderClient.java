package org.opendaylight.mwtn.dcaeConnector.impl;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

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

    private static final int MIN_HEARTBEAT_TIME_SECONDS = 30;

	private final HtDevicemanagerConfiguration htConfig;
	private final String entityName;
	private final DeviceManagerImpl deviceManager;

	private DcaeProviderWorker worker;

    public DcaeProviderClient(HtDevicemanagerConfiguration cfg, String entityName, DeviceManagerImpl deviceManager) {

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
			synchronized(worker) {
				worker.close();
				worker = new DcaeProviderWorker(DcaeConfig.reload(), entityName, deviceManager);
			}
		}
	};

	private static class DcaeProviderWorker implements AutoCloseable {


	    private final ScheduledExecutorService scheduler;
	    private final DcaeSenderImpl dcaepClient;
	    private final DcaeMessages dcaeMessages;

	    public DcaeProviderWorker(DcaeConfig configuration, String entityName, DeviceManagerImpl deviceManager) {


	        //Start services
	        LOG.info("Configuration: "+configuration);
	        int heartbeatSeconds = configuration.getTimerPeriodSeconds();
	        if ( heartbeatSeconds < MIN_HEARTBEAT_TIME_SECONDS ) {
	        	heartbeatSeconds = MIN_HEARTBEAT_TIME_SECONDS;
	        	LOG.info("Adjust heartbeat intervall to minimum of { } seconds.",heartbeatSeconds);
	        }

	        dcaepClient = new DcaeSenderImpl(configuration.getEventReveicerUrl(), configuration.getUserCredentials());
	        dcaeMessages = new DcaeMessages(dcaepClient, entityName, heartbeatSeconds, deviceManager);

	        //Activate task
	        LOG.info("Create Fault manager client Task");
	        this.scheduler = Executors.newSingleThreadScheduledExecutor();
	        Runnable task = new DcaeProviderTask(dcaeMessages);

	        LOG.info("Fault task created with "+heartbeatSeconds+" Seconds");

	        this.scheduler.scheduleAtFixedRate(task, 0, heartbeatSeconds, TimeUnit.SECONDS);
	        LOG.info("Fault task scheduled");
	    }

	    public void sendProblemNotification(String mountPointName, ProblemNotificationXml notification) {
	        LOG.debug("Notification answer: {}", dcaeMessages.postNotification(mountPointName, notification));
	    }

		@Override
		public void close() {
			try {
				this.scheduler.awaitTermination(5, TimeUnit.SECONDS);
			} catch (InterruptedException e) {
			}
		}


	}

}



