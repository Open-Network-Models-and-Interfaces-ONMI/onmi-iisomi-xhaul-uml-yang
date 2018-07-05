/**
 * (c) 2017 highstreet technologies GmbH
 */

package org.opendaylight.mwtn.deviceMonitor.impl;

import java.util.Enumeration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.devicemanager.impl.listener.ODLEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *  Implementation of concept "Active monitoring" of a device.<br>
 *    <br>
 *  For each existing mountpoint a task runs with 120s cycle time. Every 120 seconds the check actions are performed.
 *  The request is handled by the NETCONF layer with a (default)configured time-out of 60 seconds.<br>
 *  Generated alarms, by the object/node "SDN-Controller" are (enum DeviceMonitorProblems):<br>
 *      - notConnected(InternalSeverity.Warning)<br>
 *      - noConnectionMediator(InternalSeverity.Minor)<br>
 *      - noConnectionNe(InternalSeverity.Critical)<br>
 *    <br>
 *  1. Mountpoint does not exist<br>
 *  If the mountpoint does not exists there are no related current alarms in the database.<br>
 *    <br>
 *  2. Created mountpoint with state "Connecting" or "UnableToConnect"<br>
 *  If the Mountpoint is created and connection status is "Connecting" or "UnableToConnect".<br>
 *  - After about 2..4 Minutes ... raise alarm "notConnected" with severity warning<br>
 *    <br>
 *  3. Created mountpoint with state "Connection"<br>
 *  There are two monitor activities.<br>
 *      3a. Check of Mediator connection by requesting (typical) cached data.<br>
 *          - After about 60 seconds raise alarm: connection-loss-mediator with severity minor<br>
 *          - Request from Mediator: network-element<br>
 *    <br>
 *      3b. Check connection to NEby requesting (typical) non-cached data.<br>
 *          - Only if AirInterface available. The first one is used.<br>
 *          - Requested are the currentAlarms<br>
 *          - After about 60 seconds raise alarm: connection-loss-network-element with severity critical<br>
 *    <br>
 * @author herbert
 */

public class DeviceMonitorImpl implements DeviceMonitor, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(DeviceMonitorImpl.class);

    private final ConcurrentHashMap<String, DeviceMonitorTask> queue;
    private final ScheduledExecutorService scheduler;
    private final ODLEventListener odlEventListener;

    /*-------------------------------------------------------------
     * Construction/ destruction of service
     */

    /**
     * Basic implementation of devicemonitoring
     * @param odlEventListener as destination for problems
     */
    public DeviceMonitorImpl(ODLEventListener odlEventListener) {
        LOG.info("Construct {}", this.getClass().getSimpleName());

        this.odlEventListener = odlEventListener;
        this.queue = new ConcurrentHashMap<>();
        this.scheduler = Executors.newScheduledThreadPool(1);
    }

    /**
     * Stop the service. Stop all running monitoring tasks.
     */
    @Override
    synchronized public void close() {
        LOG.info("Close {}", this.getClass().getSimpleName());

        Enumeration<String> e = queue.keys();
        while (e.hasMoreElements()) {
            deviceDisconnectIndication(e.nextElement());
        }

        scheduler.shutdown();
    }

    /*-------------------------------------------------------------
     * Register/ Deregister Mountpoint
     */

    @Override
    synchronized public void createMountpointIndication(String mountPointNodeName) {

        LOG.debug("Register for monitoring {} {}",mountPointNodeName, mountPointNodeName.hashCode());

        LOG.info("Do start of DeviceMonitor task");
        //Runnable task = new PerformanceManagerTask(queue, databaseService);
        DeviceMonitorTask task = new DeviceMonitorTask(mountPointNodeName, this.odlEventListener);
        queue.put(mountPointNodeName, task);
        task.start(scheduler);
    }

    @Override
    synchronized public void removeMountpointIndication(String mountPointNodeName) {

        if (queue.containsKey(mountPointNodeName)) {
            DeviceMonitorTask task = queue.get(mountPointNodeName);
            //Remove from here
            queue.remove(mountPointNodeName);

            //Clear all problems
            task.removeMountpointIndication();
            LOG.debug("Task stopped: {}", mountPointNodeName);
        } else {
            LOG.warn("Task not in queue anymore: {}", mountPointNodeName);
        }
    }

    /*-------------------------------------------------------------
     * Register/ Deregister device
     */

    @Override
    synchronized public void deviceConnectIndication(String mountPointNodeName, ONFCoreNetworkElementRepresentation ne) {

        LOG.debug("ne changes to connected state {}",mountPointNodeName);
        if (queue.containsKey(mountPointNodeName)) {
            DeviceMonitorTask task = queue.get(mountPointNodeName);
            task.deviceConnectIndication(ne);
        } else {
            LOG.warn("Monitoring task not in queue anymore: {} {} {}", mountPointNodeName, mountPointNodeName.hashCode(), queue.size());
        }
    }

    @Override
    synchronized public void deviceDisconnectIndication(String mountPointNodeName) {

        LOG.debug("ne changes to disconnected state {}",mountPointNodeName);
        if (queue.containsKey(mountPointNodeName)) {
            DeviceMonitorTask task = queue.get(mountPointNodeName);
            task.deviceDisconnectIndication();
        } else {
            LOG.warn("Monitoring task not in queue anymore: {} {} {}", mountPointNodeName, mountPointNodeName.hashCode(), queue.size());
        }
    }

    /*-------------------------------------------------------------
     * Private functions
     */

}
