package org.opendaylight.mwtn.devicemanager.impl;

import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public interface ResyncNetworkElementsListener
{
    /**
     * Handle API Request and clean up current alarms according to the list of mountpoint id's/devices
     * Implement RPC function "clear-current-fault-by-nodename"
     * @return List with
     * @throws IllegalStateException Illegal state exception
     */
    public @Nonnull List<String> doClearCurrentFaultByNodename(@Nullable List<String> nodeNamesInput) throws IllegalStateException;

}
