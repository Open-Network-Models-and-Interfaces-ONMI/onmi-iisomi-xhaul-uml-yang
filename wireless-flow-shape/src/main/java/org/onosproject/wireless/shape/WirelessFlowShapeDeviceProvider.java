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
package org.onosproject.wireless.shape;

import com.google.common.collect.Lists;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.onosproject.event.EventDeliveryService;
import org.onosproject.net.AnnotationKeys;
import org.onosproject.net.DefaultAnnotations;
import org.onosproject.net.Device;
import org.onosproject.net.DeviceId;
import org.onosproject.net.Port;
import org.onosproject.net.PortNumber;
import org.onosproject.net.device.DefaultPortDescription;
import org.onosproject.net.device.DeviceEvent;
import org.onosproject.net.device.DeviceService;
import org.onosproject.net.device.DeviceStore;
import org.onosproject.net.device.PortDescription;
import org.onosproject.openflow.controller.Dpid;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowEventListener;
import org.projectfloodlight.openflow.protocol.OFExperimenterPortWireless;
import org.projectfloodlight.openflow.protocol.OFExperimenterStatsReply;
import org.projectfloodlight.openflow.protocol.OFMessage;
import org.projectfloodlight.openflow.protocol.OFPortDescPropWirelessTransport;
import org.projectfloodlight.openflow.protocol.OFStatsReply;
import org.projectfloodlight.openflow.protocol.OFStatsType;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsReply;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterface;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterfacePropParamHeader;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportPortFeatureHeader;
import org.projectfloodlight.openflow.protocol.OFWirelessTxCurrentCapacity;
import org.projectfloodlight.openflow.protocol.OFWirelessTxMaxCapacity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static com.google.common.base.Strings.isNullOrEmpty;
import static org.onosproject.net.DeviceId.deviceId;
import static org.onosproject.openflow.controller.Dpid.uri;

@Component(immediate = true)
public class WirelessFlowShapeDeviceProvider {

    private static final String WIRELESS_PORT_LAG = "wireless-port-lag";
    private static final String WIRELESS_TX_CURR_CAPACITY = "wireless-tx-curr-capacity";
    private static final long WIRELESS_EXPERIMENTER_TYPE = 0xff000005L;
    Logger log = LoggerFactory.getLogger(WirelessFlowShapeDeviceProvider.class);
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceService deviceService;


    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected OpenFlowController controller;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceStore deviceStore;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    EventDeliveryService eventDispatcher;

    private final OpenFlowEventListener listener = new InternalOpenFlowListener();


    @Activate
    public void activate() {
        controller.addEventListener(listener);
        log.info("started");
    }

    @Deactivate
    public void deactivate() {
        log.info("stopped");
    }

    private class InternalOpenFlowListener implements OpenFlowEventListener {

        @Override
        public void handleMessage(Dpid dpid, OFMessage msg) {
            switch (msg.getType()) {
                case STATS_REPLY:
                    if (((OFStatsReply) msg).getStatsType() == OFStatsType.EXPERIMENTER
                            && ((OFExperimenterStatsReply) msg).getExperimenter() == WIRELESS_EXPERIMENTER_TYPE) {
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
            List<Port> ports = deviceService.getPorts(deviceId);


            if (isNullOrEmpty(device.annotations().value(WIRELESS_PORT_LAG))) {
                log.info("the device {} is not MW device.", device.id());
                return;
            }

            // The experimenter stats message contains MW ports only
            // Updating the port descriptions of the device requires running over all the device's ports
            List<OFExperimenterPortWireless> ifcs = msg.getPorts();
            for (Port port : ports) {
                DefaultAnnotations annotations = null;
                // Search if the current port is presented in the received multipart reply
                for (OFExperimenterPortWireless ifc : ifcs) {
                    PortNumber portNo = PortNumber.portNumber(ifc.getPortNo().getPortNumber());
                    if (port.number().equals(portNo)) {
                        long txCurrCapacity = getTxCurrCapacityFromReplyIfc(ifc);
                        log.debug("annotatePortByMwParams(): port {}, TX_CURR_CAPACITY {}",
                                  portNo, txCurrCapacity);
                        if (txCurrCapacity == 0) {
                            break;
                        }
                        annotations = DefaultAnnotations.builder()
                                .set(AnnotationKeys.PORT_NAME, ifc.getName())
                                .set(WIRELESS_TX_CURR_CAPACITY, String.valueOf(txCurrCapacity))
                                .build();
                        break;
                    }
                }
                descs.add(new DefaultPortDescription(port.number(),
                                                     port.isEnabled(), port.type(), port.portSpeed(), annotations));
            }
            List<DeviceEvent> deviceEvents = deviceStore.updatePorts(device.providerId(), deviceId, descs);
            deviceEvents.forEach(this::post);
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
                    if (param.getType() == 1) { // (OFWirelessTransportInterfacePropParamTypes.TX_CURRENT_CAPACITY)
                        List<OFWirelessTransportInterfacePropParamHeader> ifcs =
                                ((OFWirelessTransportInterface) param).getParams();
                        for (OFWirelessTransportInterfacePropParamHeader ifp : ifcs) {
                            if (ifp.getType() == 2) {
                                long txCurrentCapacity = ((OFWirelessTxCurrentCapacity) ifp).getTxCurrentCapacity();

                                log.info(" Get TxCurrentCapacity value {}", txCurrentCapacity);
                                return txCurrentCapacity;
                            } else if (ifp.getType() == 1) {
                                long txMaxCapacity = ((OFWirelessTxMaxCapacity) ifp).getTxMaxCapacity();
                                log.info(" Get txMaxCapacity value {}", txMaxCapacity);
                            }

                        }

                    }
                }
                break;
            }
            log.info("TxCurrentCapacity not found");
            return 0;
        }

        protected void post(DeviceEvent event) {
            if (event != null && eventDispatcher != null) {
                eventDispatcher.post(event);
            }
        }
    }
}
