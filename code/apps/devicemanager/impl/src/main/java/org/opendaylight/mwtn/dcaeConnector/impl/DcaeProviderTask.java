/**
 * Event provider to ECOMP for heartbeat message
 *
 * @author herbert
 *
 */
package org.opendaylight.mwtn.dcaeConnector.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class DcaeProviderTask  implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(DcaeProviderTask.class);

    private int t = 0;
    private final DcaeMessages dcaeMessages;

    DcaeProviderTask(DcaeMessages dcaeMessages) {
        LOG.info("Create eventprovider task");
        this.dcaeMessages = dcaeMessages;
    }

    private void sendHeartbeat() {
         dcaeMessages.postHeartBeat();
    }

    @Override
    public void run() {
        LOG.debug("DCAE provider heartbeat tick start {}", t++);
        sendHeartbeat();
    }
}
