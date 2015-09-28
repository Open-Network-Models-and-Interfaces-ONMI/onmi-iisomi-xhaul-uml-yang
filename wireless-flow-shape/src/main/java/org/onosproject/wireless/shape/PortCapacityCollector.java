/*
 *
 *  * Copyright 2015 Open Networking Laboratory
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package org.onosproject.wireless.shape;

import org.jboss.netty.util.HashedWheelTimer;
import org.jboss.netty.util.Timeout;
import org.jboss.netty.util.TimerTask;
import org.onlab.util.Timer;
import org.onosproject.openflow.controller.OpenFlowSwitch;
import org.projectfloodlight.openflow.protocol.OFVersion;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

public class PortCapacityCollector implements TimerTask {

    Logger log = LoggerFactory.getLogger(PortCapacityCollector.class);

    private final AtomicLong xidAtomic = new AtomicLong(1);
    private final HashedWheelTimer timer = Timer.getTimer();
    private final int refreshInterval;
    private boolean stopTimer;
    private Timeout timeout;
    private final OpenFlowSwitch sw;

    public PortCapacityCollector(OpenFlowSwitch sw, int interval) {
        this.sw = sw;
        this.refreshInterval = interval;
    }

    @Override
    public void run(Timeout timeout) throws Exception {
        sendExperimenterMultiPortRequest();
        if (!this.stopTimer || timeout.isCancelled()) {
            log.trace("Scheduling stats collection in {} seconds for {}",
                      this.refreshInterval, this.sw.getStringId());
            timeout.getTimer().newTimeout(this, refreshInterval,
                                          TimeUnit.SECONDS);
        }
        log.trace("Collecting stats for {}");

    }

    private boolean checkVersion(OFVersion version) {
        if (version == OFVersion.OF_13 || version == OFVersion.OF_14) {
            return true;
        }
        return false;
    }

    private void sendExperimenterMultiPortRequest() {
        if (!checkVersion(sw.factory().getVersion())) {
            return;
        }
        if (sw == null || !sw.isConnected()) {
            log.info("OF Switch not obtained for device {}");
            return;
        }

        // Send OF Port status request messages towards the Network Element
        OFWirelessMultipartPortsRequest portsRequest;
        Long statsXid = xidAtomic.getAndIncrement();
        log.info(String.valueOf(statsXid));
        portsRequest = sw.factory().buildWirelessMultipartPortsRequest()
                .setXid(statsXid)
                .build();
        sw.sendMsg(portsRequest);
        log.info("Multipart Port Request sent to switch {}", sw.getStringId());
    }

    /**
     * Starts the collector.
     */
    public synchronized void start() {
        log.info("Starting Multipart Port Stats collection thread for {}", sw.getStringId());
        timeout = timer.newTimeout(this, 1, TimeUnit.SECONDS);
    }

    /**
     * Stops the collector.
     */
    public synchronized void stop() {
        log.info("Stopping Multipart Port Stats collection thread for {}", sw.getStringId());
        this.stopTimer = true;
        timeout.cancel();
    }
}
