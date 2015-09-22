package org.onosproject.openflow.ctl;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Service;
import org.onosproject.openflow.api.Dpid14;
import org.onosproject.openflow.api.OpenflowController14;
import org.onosproject.openflow.controller.OpenFlowSwitch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ConcurrentHashMap;

@Component(immediate = true)
@Service
public class OpenflowControllerImpl14 implements OpenflowController14 {

    Logger log = LoggerFactory.getLogger(getClass());
    protected ConcurrentHashMap<Dpid14, OpenFlowSwitch> connectedSwitches =
            new ConcurrentHashMap<>();
    @Activate
    public void activate() {
        log.info("started");
    }

    @Deactivate
    public void deactivate() {
        log.info("stopped");
    }

    @Override
    public Iterable<OpenFlowSwitch> getSwitches() {
        return connectedSwitches.values();
    }


    @Override
    public OpenFlowSwitch getSwitch(Dpid14 dpid) {
        return connectedSwitches.get(dpid);
    }
}
