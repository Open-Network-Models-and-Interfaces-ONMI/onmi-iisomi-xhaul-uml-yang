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
     * Procedure to check the connection of one mountpoint
     * @return true if reachable, false if not
     */
    boolean isConnected() {
        return isReachableOnce();
    }
}

