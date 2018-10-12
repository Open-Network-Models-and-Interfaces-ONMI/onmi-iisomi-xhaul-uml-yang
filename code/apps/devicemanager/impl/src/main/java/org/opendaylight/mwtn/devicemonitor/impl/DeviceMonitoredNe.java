/**
 *
 */
package org.opendaylight.mwtn.devicemonitor.impl;

/**
 * @author herbert
 *
 */
public interface DeviceMonitoredNe {

    /**
     * Prepare subsequent check calls
     */
    public void prepareCheck();

    /**
     * Test connection to mediator, by getting data that have to be called from NE
     * @return true if connection working, false if not
     */
    public boolean checkIfConnectionToMediatorIsOk();

    /**
     * Test connection to NE via mediator, by getting data that have to be called from NE
     * @return true if connection working, false if not
     */
    public boolean checkIfConnectionToNeIsOk();


}
