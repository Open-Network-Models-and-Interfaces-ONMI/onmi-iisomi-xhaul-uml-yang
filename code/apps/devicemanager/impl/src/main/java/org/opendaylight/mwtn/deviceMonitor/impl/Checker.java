/**
 * (c) highstreet technologies GmbH
 */
package org.opendaylight.mwtn.deviceMonitor.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Steps to Monitor the connection to a network element during state connected
 */
abstract class Checker {

    @SuppressWarnings("unused")
    private static final Logger LOG = LoggerFactory.getLogger(Checker.class);

    /**
     * Check action.
     * @return true if reachable, false if not
     */
    abstract boolean isReachableOnce();

    /**
     * State machine to check the connection of one mountpoint
     * @return true if reachable, false if not
     */
    boolean checkIfReachableStates() {
        // Mediator check
        if (! isReachableOnce()) { //First check
            // If not successful give it a next try
            return false;
            /*
            try {
                Thread.sleep(10);
                if (! isReachableOnce()) {  //Second check
                    // If again not successful give it a next try
                    Thread.sleep(10);
                    if (! isReachableOnce()) {  //third check
                        // If again not successful give it a next try
                         //Raise Alarm condition
                        //--> Notificator
                        return false;
                    }
                }
            } catch (InterruptedException e) {
                //Do nothing, but stop task
                LOG.info("Cancel Monitoring");
            }*/
        }
        return true;
    }
}

