package org.onosproject.openflow.api;

import org.onosproject.openflow.controller.OpenFlowSwitch;

public interface OpenflowController14 {

    /**
     * Returns all switches known to this OF controller.
     *
     * @return Iterable of dpid elements
     */
    Iterable<OpenFlowSwitch> getSwitches();

    /**
     * Returns the actual switch for the given Dpid.
     *
     * @param dpid the switch to fetch
     * @return the interface to this switch
     */
    OpenFlowSwitch getSwitch(Dpid14 dpid);


}
