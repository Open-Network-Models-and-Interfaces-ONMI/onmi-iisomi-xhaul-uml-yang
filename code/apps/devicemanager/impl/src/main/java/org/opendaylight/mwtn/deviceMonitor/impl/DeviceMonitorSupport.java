/**
 *
 */
package org.opendaylight.mwtn.deviceMonitor.impl;

/**
 * @author herbert
 *
 */
public interface DeviceMonitorSupport {

    /**
     * Prepare subsequent check calls
     */
    public void prepareCheck();

    /**
     * Test connection to mediator, by getting data that have to be called from NE
     * @return true if connection working, false if not
     */
    public boolean checkAndConnectionToMediatorIsOk();

    /**
     * Test connection to NE via mediator, by getting data that have to be called from NE
     * @return true if connection working, false if not
     */
    public boolean checkAndConnectionToNeIsOk();


}
