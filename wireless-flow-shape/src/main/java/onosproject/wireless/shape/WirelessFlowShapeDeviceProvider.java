/*
 * Copyright 2015 Open Networking Laboratory
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package onosproject.wireless.shape;

import com.google.common.collect.Lists;
import org.apache.felix.scr.annotations.*;
import org.onosproject.net.*;
import org.onosproject.net.device.*;
import org.onosproject.net.provider.AbstractProvider;
import org.onosproject.net.provider.ProviderId;
import org.onosproject.openflow.controller.Dpid;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowEventListener;
import org.projectfloodlight.openflow.protocol.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static com.google.common.base.Strings.isNullOrEmpty;
import static org.onosproject.net.DeviceId.deviceId;
import static org.onosproject.openflow.controller.Dpid.uri;

@Component(immediate = true)
@Service
public class WirelessFlowShapeDeviceProvider extends AbstractProvider implements DeviceProvider {
    private static final int DEFAULT_MAX_THRESHOLD = 100;
    private static final int DEFAULT_MIN_THRESHOLD = 10;
    static final int POLL_INTERVAL = 10;
    private static final String DEVICE_IS_WIRELESS = "device-is-wireless";
    private static final String WIRELESS_TX_CURR_CAPACITY = "wireless-tx-curr-capacity";
    private static final long WIRELESS_EXPERIMENTER_TYPE = 0xff000005L;
    Logger log = LoggerFactory.getLogger(WirelessFlowShapeDeviceProvider.class);
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceService deviceService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceProviderRegistry deviceProviderRegistry;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected OpenFlowController controller;


    private DeviceProviderService deviceProviderService;

    private final OpenFlowEventListener listener = new InternalOpenFlowListener();

    /**
     * Creates a provider with the supplier identifier.
     */
    public WirelessFlowShapeDeviceProvider() {
        super(new ProviderId("wireless-shape-app", "org.onosproject.wireless.shape"));
    }

    @Activate
    public void activate() {
        deviceProviderService = deviceProviderRegistry.register(this);
        controller.addEventListener(listener);
    }

    @Deactivate
    public void deactivate() {
        deviceProviderRegistry.unregister(this);
        deviceProviderService = null;
    }

    @Override
    public void triggerProbe(DeviceId deviceId) {

    }

    @Override
    public void roleChanged(DeviceId deviceId, MastershipRole newRole) {

    }

    @Override
    public boolean isReachable(DeviceId deviceId) {
        return false;
    }


    private class InternalOpenFlowListener implements OpenFlowEventListener {

        @Override
        public void handleMessage(Dpid dpid, OFMessage msg) {
            log.info("handle message");
            switch (msg.getType()) {
                case STATS_REPLY:
                    log.info("STATS_REPLY");
                    if (((OFStatsReply) msg).getStatsType() == OFStatsType.EXPERIMENTER
                            && ((OFExperimenterStatsReply) msg).getExperimenter() == WIRELESS_EXPERIMENTER_TYPE) {
                        log.info("annotate");
                        annotatePortByTxCurrCapacity(dpid, (OFWirelessMultipartPortsReply) msg);
                    }
                    break;
                default:
            }
        }

        private void annotatePortByTxCurrCapacity(Dpid dpid, OFWirelessMultipartPortsReply msg) {
            DeviceId deviceId = deviceId(uri(dpid));
            List<PortDescription> descs = Lists.newArrayList();
            Device device = deviceService.getDevice(deviceId);
            log.info(String.valueOf(device));

            List<Port> ports = deviceService.getPorts(deviceId);
            log.info(String.valueOf(ports));

            if (isNullOrEmpty(device.annotations().value(DEVICE_IS_WIRELESS))) {
                return;
            }

            // The experimenter stats message contains MW ports only
            // Updating the port descriptions of the device requires running over all the device's ports
            List<OFExperimenterPortWireless> ifcs = msg.getPorts();
            log.info(String.valueOf(ifcs));
            for (Port port : ports) {
                DefaultAnnotations annotations = null;
                // Search if the current port is presented in the received multipart reply
                for (OFExperimenterPortWireless ifc : ifcs) {
                    PortNumber portNo = PortNumber.portNumber(ifc.getPortNo().getPortNumber());
                    log.info(String.valueOf(portNo));
                    log.info(String.valueOf(port.number()));

                    if (port.number().equals(portNo)) {
                        long txCurrCapacity = getTxCurrCapacityFromReplyIfc(ifc);
                        log.info("txCurrCapacity -----" + txCurrCapacity);
                        if (txCurrCapacity == 0) {
                            break;
                        }
                        annotations = DefaultAnnotations.builder()
                                .set(AnnotationKeys.PORT_NAME, ifc.getName())
                                .set(WIRELESS_TX_CURR_CAPACITY, Long.toString(txCurrCapacity))
                                .build();
                    }
                    descs.add(new DefaultPortDescription(port.number(),
                            port.isEnabled(), port.type(), port.portSpeed(), annotations));
                    log.info("Annotate Port By TxCurrCapacity: port {}", portNo);
                    break;
                }
                deviceProviderService.updatePorts(deviceId, descs);

            }

            log.info(" xxxxxxxxxxxx OF Message {}, type {}, experimenter {}, subtype {}, received from {} - proceeded",
                    msg.getType(), ((OFStatsReply) msg).getStatsType(),
                    ((OFExperimenterStatsReply) msg).getExperimenter(),
                    ((OFWirelessMultipartPortsReply) msg).getSubtype(),
                    dpid);
        }

        private long getTxCurrCapacityFromReplyIfc(OFExperimenterPortWireless ifc) {
            List<OFPortDescPropWirelessTransport> props = ifc.getProperties();
            for (OFPortDescPropWirelessTransport prop : props) {
                List<OFWirelessTransportPortFeatureHeader> params = prop.getFeatures();
                for (OFWirelessTransportPortFeatureHeader param : params) {
                    if (param.getType() == 2) { // (OFWirelessTransportInterfacePropParamTypes.TX_CURRENT_CAPACITY)
                        long value = ((OFWirelessTxCurrentCapacity) param).getTxCurrentCapacity().getValue();
                        log.info(" Get TxCurrentCapacity value {}", value);
                        return value;
                    }
                }
                break;
            }
            log.info("TxCurrentCapacity not found");
            return 0;
        }

    }
}
