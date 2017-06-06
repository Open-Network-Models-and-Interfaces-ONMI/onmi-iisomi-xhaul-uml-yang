/**
 *
 */
package org.opendaylight.mwtn.deviceMonitor.impl;

import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;

/**
 * @author herbert
 *
 */
public interface DeviceMonitor {


    /**
     * Stop the complete service and terminates all actions
     */
    public void close();

    /**
     * createMountpoint registers a new mountpoint monitoring service
     * @param mountPointNodeName name of mountpoint
     */
    public void createMountpointIndication(String mountPointNodeName);

    /**
     * removeMountpoint deregisters a mountpoint for registration services
     * @param mountPointNodeName to deregister
     */
    public void removeMountpointIndication(String mountPointNodeName);

    /**
     * Notify of device state changes to "connected"
     * @param mountPointNodeName name of mountpoint
     * @param ne to monitor
     */
    public void deviceConnectIndication(String mountPointNodeName, ONFCoreNetworkElementRepresentation ne);

    /**
     * Notify of device state change to "disconnected"
     * @param mountPointNodeName to deregister
     */
    public void deviceDisconnectIndication(String mountPointNodeName);


}
