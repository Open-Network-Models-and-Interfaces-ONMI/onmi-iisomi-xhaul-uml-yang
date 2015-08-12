/*
 * Copyright 2014 Open Networking Laboratory
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
package org.onosproject.wireless;

import com.google.common.collect.Lists;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.Service;
import org.onosproject.event.ListenerRegistry;
import org.onosproject.event.EventDeliveryService;
import org.onosproject.net.Device;
import org.onosproject.net.DeviceId;
import org.onosproject.net.MastershipRole;
import org.onosproject.net.Port;
import org.onosproject.net.PortNumber;
import org.onosproject.net.device.DefaultDeviceDescription;
import org.onosproject.net.device.DefaultPortDescription;
import org.onosproject.net.device.DeviceAdminService;
import org.onosproject.net.device.DeviceDescription;
import org.onosproject.net.device.DeviceEvent;
import org.onosproject.net.device.DeviceListener;
import org.onosproject.net.device.DeviceProvider;
import org.onosproject.net.device.DeviceProviderRegistry;
import org.onosproject.net.device.DeviceProviderService;
import org.onosproject.net.device.DeviceService;
import org.onosproject.net.device.DeviceStore;
import org.onosproject.net.device.DeviceStoreDelegate;
import org.onosproject.net.device.PortDescription;
import org.onosproject.net.device.PortStatistics;
import org.onosproject.net.provider.AbstractProviderRegistry;
import org.onosproject.net.provider.AbstractProviderService;
//
import org.onosproject.net.device.DeviceProvider;
import static org.onosproject.net.DeviceId.deviceId;
import org.onosproject.net.provider.AbstractProvider;
import org.onosproject.net.provider.ProviderId;
import org.onosproject.net.PortNumber;
import org.onosproject.net.device.PortStatistics;
import org.onosproject.net.AnnotationKeys;
import org.onosproject.net.DefaultAnnotations;
import org.onosproject.openflow.controller.Dpid;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowEventListener;
import org.onosproject.openflow.controller.OpenFlowSwitch;
import org.onlab.util.HexString;
//
import org.onosproject.net.intent.Intent;
import org.onosproject.net.intent.IntentService;
import org.onosproject.core.ApplicationId;
import org.onosproject.core.CoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
//
import java.util.concurrent.atomic.AtomicLong;
//

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.concurrent.Executors.newSingleThreadScheduledExecutor;
import static org.onlab.util.Tools.groupedThreads;
import static org.onosproject.net.MastershipRole.*;
import static org.slf4j.LoggerFactory.getLogger;
import static org.onosproject.security.AppGuard.checkPermission;
import static org.onosproject.openflow.controller.Dpid.dpid;
import static org.onosproject.openflow.controller.Dpid.uri;
import org.projectfloodlight.openflow.protocol.OFPortMod;
import org.projectfloodlight.openflow.protocol.OFPortDesc;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterface;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterfaceProp;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterfacePropParam;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterfacePropParamTypes;
import org.projectfloodlight.openflow.protocol.OFWirelessTxCurrentCapacity;
import org.projectfloodlight.openflow.protocol.OFWirelessExperimenterPortMod;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsRequest;
import org.projectfloodlight.openflow.protocol.OFStatsReply;
import org.projectfloodlight.openflow.protocol.OFStatsType;
import org.projectfloodlight.openflow.protocol.OFExperimenterStatsReply;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsReply;

import org.projectfloodlight.openflow.protocol.OFMessage;
import org.projectfloodlight.openflow.protocol.OFPortState;
import org.projectfloodlight.openflow.protocol.OFPortStatsEntry;
import org.projectfloodlight.openflow.protocol.OFPortStatsReply;
import org.projectfloodlight.openflow.protocol.OFPortStatus;
import org.projectfloodlight.openflow.protocol.OFVersion;

import org.projectfloodlight.openflow.types.OFPort;
import org.projectfloodlight.openflow.types.U64;


/**
 * ONOS Wireless Use Case Application.
 */

@Component(immediate = true)
public class WirelessDeviceProvider extends AbstractProvider implements DeviceProvider {
    private static final String DEVICE_IS_WIRELESS = "device-is-wireless";
    private static final String WIRELESS_PORT_PRIM = "wireless-port-prim";
    private static final String WIRELESS_PORT_SEC = "wireless-port-sec";
    private static final String WIRELESS_UTILIZED_CAPACITY = "wireless-utilized-tx-capacity";
    private static final String WIRELESS_TX_CURR_CAPACITY = "wireless-tx-curr-capacity";
    private static long portCapacityMbps = 100;
    private static final long wirelessExperimenterType = 0xff000005l;

    public WirelessDeviceProvider() {
        super(new ProviderId("wireless-app", "org.onosproject.wireless"));
    }

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected CoreService coreService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceStore store;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceService deviceService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected OpenFlowController openFlowController;

    private ApplicationId appId;
    private final DeviceListener deviceListener = new InternalDeviceListener();
    private final OpenFlowEventListener openFlowlistener = new InternalOpenFlowListener();


    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceProviderRegistry deviceProviderRegistry;

    private DeviceProviderService deviceProviderService;
    private enum PortPropertyBitMap {
        TX_MAX_CAPACITY, TX_CURRENT_CAPACITY, RX_CURRENT_CAPACITY, TX_POWER, TX_MAX_POWER,
        TX_MUTE, RSL, SNR,
    }
    private long statsReportCounter = 0;
    private long prevRxBytes = 0;
    private long prevTxBytes = 0;
    private long prevDuration = 0;
    private long prevUtilization = 0;
    private boolean portAlreadyMute = false;

    private final AtomicLong xidAtomic = new AtomicLong(1);

    @Activate
    protected void activate() {
        appId = coreService.registerApplication("org.onosproject.wireless");
        deviceProviderService = deviceProviderRegistry.register(this);

        deviceService.addListener(deviceListener);
        openFlowController.addEventListener(openFlowlistener);
        log.info(" xxxxxxxxxxxxx Started");
    }

    @Deactivate
    protected void deactivate() {
        openFlowController.removeEventListener(openFlowlistener);
        deviceService.removeListener(deviceListener);
        deviceProviderRegistry.unregister(this);
        deviceProviderService = null;

        log.info(" xxxxxxxxxxxx Stopped");
    }

    // Auxiliary listener to device events.
    private class InternalDeviceListener implements DeviceListener {
        @Override
        public void event(DeviceEvent event) {
            final Device device = event.subject();
            final DeviceId deviceId = device.id();
            final DeviceDescription desc = description(device);

            switch (event.type()) {
                case PORT_STATS_UPDATED:
                    if (device.annotations().value(DEVICE_IS_WIRELESS) != null) {
                        ++statsReportCounter;
                        if (statsReportCounter %5 == 0) {
                            annotatePortByTxUtilizedCapacity(device);
                        }
                        else if (statsReportCounter %5 == 2) {
                                sendExperimenterMultipartPortRequest(device);
                        }
                        else {
                            analyzePortsUtilization(device);
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    } // class InternalDeviceListener

    // Checks device's annotations and updates the utilized capacity annotation of the relevant ports
    private void annotatePortByTxUtilizedCapacity(Device device) {
        ProviderId devProviderId = device.providerId();
        DeviceId deviceId = device.id();
        List<PortDescription> descs = Lists.newArrayList();

        List<Port> ports = store.getPorts(deviceId);
        for (Port port : ports) {
            if (device.annotations().value(DEVICE_IS_WIRELESS) != null) {
                DefaultAnnotations annotations = null;
                long portNum = port.number().toLong();
                if (   (   (device.annotations().value(WIRELESS_PORT_PRIM) != null)
                        && (HexString.toLong(device.annotations().value(WIRELESS_PORT_PRIM)) == portNum))
                    || (   (device.annotations().value(WIRELESS_PORT_SEC) != null)
                            && (HexString.toLong(device.annotations().value(WIRELESS_PORT_SEC)) == portNum))) {
                    if (port.isEnabled() == true) {
                        long capacity = calculatePortUtilizedCapacity(deviceId, portNum);
                        annotations = DefaultAnnotations.builder()
                                .set(AnnotationKeys.PORT_NAME, port.annotations().value(AnnotationKeys.PORT_NAME))
                                .set(WIRELESS_UTILIZED_CAPACITY, Long.toString(capacity))
                                .build();
                    }
                    else {
                        annotations = DefaultAnnotations.builder()
                                .set(AnnotationKeys.PORT_NAME, port.annotations().value(AnnotationKeys.PORT_NAME))
                                .build();
                    }
                }
                descs.add(new DefaultPortDescription(port.number(),
                    port.isEnabled(), port.type(), port.portSpeed(), annotations));
            }
        }

        store.updatePorts(devProviderId, deviceId, descs);
    }

    // Checks the utilization annotation and disables/enables the relevant ports
    private void analyzePortsUtilization(Device device) {
        ProviderId devProviderId = device.providerId();
        DeviceId deviceId = device.id();
        long utilization = 0;
        int portNum = 0;

        List<Port> ports = store.getPorts(deviceId);
        for (Port port : ports) {
            if (port.annotations().value(WIRELESS_UTILIZED_CAPACITY) != null) {
                utilization = Long.parseLong(port.annotations().value(WIRELESS_UTILIZED_CAPACITY));
                portNum = (int)port.number().toLong();
                if (utilization > 20) {
                    sendWirelessPortMod(deviceId, portNum, true);
                }
                if (utilization < 10) {
                    sendWirelessPortMod(deviceId, portNum, false);
                }
            }
        }
    }

    // Checks the port stats for the specified device
    private long calculatePortUtilizedCapacity (DeviceId deviceId, long wirelessPort) {
        long capacity = 0;
        for (PortStatistics stat : deviceService.getPortStatistics(deviceId)) {
            if (stat.port() == wirelessPort) {
                capacity = calculatePortUtilizedCapacityFromStats(stat);
                break;
            }
        }
/*
        if (utilization > 100 || utilization < 0) {
            utilization = prevUtilization;
        }
        else {
            prevUtilization = utilization;
        }
*/
        return capacity;
    }


    private long calculatePortUtilizedCapacityFromStats(PortStatistics stat) {
        long rxBytes, txBytes, rxDelta, txDelta, maxDelta, duration, timeMs;
        long capacity = 0;

        duration = stat.durationNano()/1000000;
        timeMs = (duration <= prevDuration) ? (duration + 1000 - prevDuration) : (duration - prevDuration);

        // looks like there is a bug in duration provisioning: each 5 seconds it increments by ~10,000ms
        timeMs *= 50;

        rxBytes = stat.bytesReceived();
        txBytes = stat.bytesSent();

        rxDelta = (rxBytes > prevRxBytes) ? (rxBytes - prevRxBytes) : (0xffffffff - prevRxBytes + rxBytes);
        txDelta = (txBytes > prevTxBytes) ? (txBytes - prevTxBytes) : (0xffffffff - prevTxBytes + txBytes);

        capacity = txDelta / timeMs / 10;

//        maxDelta =  (rxDelta > txDelta) ? rxDelta : txDelta;
//        utilization = maxDelta / timeMs  / 10; // :timeSec: 1000ms*100%
        log.info(" xxxxxxxxxxxx Calc for port {}: rx={}, rxDelta={}, tx={}, txDelta={}, timeMs={}, stat.durationNano()={}, duration={} prevDuration={}, capacity={}",
                    stat.port(), rxBytes, rxDelta, txBytes, txDelta, timeMs, stat.durationNano(), duration, prevDuration, capacity);
        prevRxBytes = rxBytes;
        prevTxBytes = txBytes;
        prevDuration = duration;

        return capacity;
    }

/*
    private long calculatePortUtilization(PortStatistics stat) {
        long rxBytes, txBytes, rxDelta, txDelta, maxDelta, duration, timeMs;
        long utilization = 0;

        duration = stat.durationNano()/1000000;
        timeMs = (duration <= prevDuration) ? (duration + 1000 - prevDuration) : (duration - prevDuration);

        // looks like there is a bug in duration provisioning: each 5 seconds it increments by ~10,000ms
        timeMs *= 50;

        rxBytes = stat.bytesReceived();
        txBytes = stat.bytesSent();

        rxDelta = (rxBytes > prevRxBytes) ? (rxBytes - prevRxBytes) : (0xffffffff - prevRxBytes + rxBytes);
        txDelta = (txBytes > prevTxBytes) ? (txBytes - prevTxBytes) : (0xffffffff - prevTxBytes + txBytes);
        maxDelta =  (rxDelta > txDelta) ? rxDelta : txDelta;
        utilization = maxDelta*8 / timeMs / portCapacityMbps / 10; // :timeSec:100Mbps: 1000ms*100%
        log.info(" xxxxxxxxxxxx Calc for port {}: rx={}, rxDelta={}, tx={}, txDelta={}, timeMs={}, stat.durationNano()={}, duration={} prevDuration={}, utilization={}",
                    stat.port(), rxBytes, rxDelta, txBytes, txDelta, timeMs, stat.durationNano(), duration, prevDuration, utilization);
        prevRxBytes = rxBytes;
        prevTxBytes = txBytes;
        prevDuration = duration;

        return utilization;
    }
*/
    private long getTxCurrCapacityFromPortAnnotation(DeviceId deviceId, int portNum) {
        long capacity = 0;

        List<Port> ports = store.getPorts(deviceId);
        for (Port port : ports) {
            if (port.annotations().value(WIRELESS_TX_CURR_CAPACITY) != null) {
//                txMaxCapacity = U64.of(Long.parseLong(port.annotations().value(WIRELESS_TX_CURR_CAPACITY)));
                capacity = Long.parseLong(port.annotations().value(WIRELESS_TX_CURR_CAPACITY));
                break;
            }
        }
        return capacity;
    }

    private void sendWirelessPortMod(DeviceId deviceId, int port, boolean mute) {
/*
        // Check if the  action is needed
        if (portAlreadyMute == mute) {
            log.info(" xxxxxxxxxxxx Port {}/{} already {}",
                deviceId, port, (mute==true) ? "Mute" : "Unmute");
            return;
        }
*/
        log.info(" ------------ Sending Experimenter Port Modify for {}/{}", deviceId, port);

        final Dpid dpid = dpid(deviceId.uri());
        OpenFlowSwitch sw = openFlowController.getSwitch(dpid(deviceId.uri()));
        if (sw == null || !sw.isConnected()) {
            log.info("OF Switch not obtained for device {}", deviceId);
            return;
        }

        // Send OF Port Modify message towards the Network Element
        OFWirelessExperimenterPortMod portMod;
        List<OFWirelessTransportInterfaceProp> properties = new ArrayList<OFWirelessTransportInterfaceProp>();
        List<OFWirelessTransportInterfacePropParam> paramList = new ArrayList<OFWirelessTransportInterfacePropParam>();

        final List<OFPortDesc> portDescs = sw.getPorts();
        for (OFPortDesc portDesc : portDescs) {

            if (portDesc.getPortNo().getPortNumber() == (long)port) {
                Long statsXid = xidAtomic.getAndIncrement();
                // Temporary values. To be obtained from the port's annotations */
                U64 txMaxCapacity = U64.of(0x123456);
                int txPower = 0x123;
                // TX_MAX_CAPACITY
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessTxMaxCapacity()
                        .setTxMaxCapacity(txMaxCapacity)
                        .build());
                // TX_CURRENT_CAPACITY
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessTxCurrentCapacity()
                        .setTxCurrentCapacity(U64.of(0))
                        .build());
                // RX_CURRENT_CAPACITY
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessRxCurrentCapacity()
                        .setRxCurrentCapacity(U64.of(0))
                        .build());
                // TX_POWER
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessTxPower()
                        .setTxPower(txPower)
                        .build());
                // TX_MAX_POWER
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessTxMaxPower()
                        .setTxMaxPower(2*txPower)
                        .build());
                // TX_MUTE
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessTxMute()
                        .setTxMute(mute == true ? (short)0x1 : (short)0x0)
                        .build());
                // RSL
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessRsl()
                        .setRsl(0)
                        .build());
                // SINR
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessSinr()
                        .setSinr(0)
                        .build());
                // OPERATION_MODE
                paramList.add((OFWirelessTransportInterfacePropParam)sw.factory().buildWirelessOperationMode()
                        .setOperationMode((short)0)
                        .build());
                // Build the message
                properties.add(sw.factory().buildWirelessTransportInterfaceProp()
                        .setParamList(paramList)
                        .build());

                portMod = sw.factory().buildWirelessExperimenterPortMod()
                        .setXid(statsXid)
                        .setPortNo(portDesc.getPortNo())
                        .setLengths(96)
                        .setHwAddr(portDesc.getHwAddr())
                        .setConfig(0)
                        .setState(0)
                        .setProperties(properties)
                        .build();

                sw.sendMsg(portMod);

                log.info(" xxxxxxxxxxxx Port {} is {}",
                        portDesc.getPortNo(), (mute==true) ? "Mute" : "Unmute");
                portAlreadyMute = mute;
            }
        }
    }

    private void sendExperimenterMultipartPortRequest(Device device) {
        DeviceId deviceId = device.id();
        final Dpid dpid = dpid(deviceId.uri());
        OpenFlowSwitch sw = openFlowController.getSwitch(dpid);
        if (sw == null || !sw.isConnected()) {
            log.info("OF Switch not obtained for device {}", deviceId);
            return;
        }

        // Send OF Port Modify message towards the Network Element
        OFWirelessMultipartPortsRequest portsRequest;
        Long statsXid = xidAtomic.getAndIncrement();
        portsRequest = sw.factory().buildWirelessMultipartPortsRequest()
                .setXid(statsXid)
                .build();

        sw.sendMsg(portsRequest);

        log.info(" xxxxxxxxxxxx Multipart Port Request sent for device {}", deviceId);
    }


    @Override
    public void triggerProbe(DeviceId deviceId) {
        // TODO Auto-generated method stub
    }

    @Override
    public void roleChanged(DeviceId deviceId, MastershipRole newRole) {
    }

    @Override
    public boolean isReachable(DeviceId deviceId) {
        // TODO Auto-generated method stub
        return true;
    }

    static DeviceDescription description(Device device) {
        return new DefaultDeviceDescription(device.id().uri(), device.type(),
                                            device.manufacturer(),
                                            device.hwVersion(), device.swVersion(),
                                            device.serialNumber(), device.chassisId());
    }

    private class InternalOpenFlowListener implements OpenFlowEventListener {

        @Override
        public void handleMessage(Dpid dpid, OFMessage msg) {
            switch (msg.getType()) {
                case STATS_REPLY:
                    if (   ((OFStatsReply) msg).getStatsType() == OFStatsType.EXPERIMENTER
                        && ((OFExperimenterStatsReply) msg).getExperimenter() == wirelessExperimenterType ) {
                        annotatePortByTxCurrCapacity(dpid, (OFWirelessMultipartPortsReply) msg);
                    }
                    break;
            }
        }

        private void annotatePortByTxCurrCapacity(Dpid dpid, OFWirelessMultipartPortsReply msg) {
            DeviceId deviceId = deviceId(uri(dpid));
            OpenFlowSwitch sw = openFlowController.getSwitch(dpid);
            List<PortDescription> descs = Lists.newArrayList();

            // Obtain the Device pertinent to the received message
            for (Device device : store.getDevices()) {
                if (deviceId.equals(device.id())) {
                    ProviderId devProviderId = device.providerId();
                    List<Port> ports = store.getPorts(deviceId);

                    if (device.annotations().value(DEVICE_IS_WIRELESS).isEmpty()) {
                        log.error(" #####  ###### annotatePortByTxCurrCapacity: Wireless Experimeter stats received on non annotated device {}",
                            device.id());
                        continue;
                    }

                    // The experimenter stats message contains MW ports only
                    // Updating the port descriptions of the device requires running over all the device's ports
                    List<OFWirelessTransportInterface> ifcs = msg.getInterfaces();
                    for (Port port : ports) {
                        DefaultAnnotations annotations = null;
                        log.info(" ##### 2 ###### annotatePortByTxCurrCapacity: device port {}/{}", deviceId, port.number());
                        // Search if the current port is presented in the received multipart reply
                        for (OFWirelessTransportInterface ifc : ifcs) {
                            PortNumber portNo = PortNumber.portNumber(ifc.getPortNo().getPortNumber());
                            log.info(" ##### 3 ###### annotatePortByTxCurrCapacity: check port {}", portNo);
                            if (port.number().equals(portNo)) {
                                long txCurrCapacity = getTxCurrCapacityFromReplyIfc(ifc);
                                annotations = DefaultAnnotations.builder()
                                    .set(AnnotationKeys.PORT_NAME, ifc.getName())
                                    .set(WIRELESS_TX_CURR_CAPACITY, Long.toString(txCurrCapacity))
                                    .build();
                            }
                            descs.add(new DefaultPortDescription(port.number(),
                                port.isEnabled(), port.type(), port.portSpeed(), annotations));
                            break;
                        }
                        store.updatePorts(devProviderId, deviceId, descs);
                    }
                    break;
                }
            }

            log.info(" xxxxxxxxxxxx OF Message {}, type {}, experimenter {}, subtype {}, received from {} - proceeded",
                msg.getType(), ((OFStatsReply) msg).getStatsType(),
                ((OFExperimenterStatsReply) msg).getExperimenter(),
                ((OFWirelessMultipartPortsReply) msg).getSubtype(),
                dpid);
        } // annotatePortByTxCurrCapacity

        private long getTxCurrCapacityFromReplyIfc(OFWirelessTransportInterface ifc) {
            List<OFWirelessTransportInterfaceProp> props = ifc.getProperties();
            for (OFWirelessTransportInterfaceProp prop : props) {
                log.info(" ##### 4 ###### Mw Metrics: check property {}", prop.getType());
                List<OFWirelessTransportInterfacePropParam> params = prop.getParamList();
                for (OFWirelessTransportInterfacePropParam param : params) {
                    log.info(" ##### 5 ###### Mw Metrics: check param {}", param.getType());
                    if (param.getType() == 2) { // (OFWirelessTransportInterfacePropParamTypes.TX_CURRENT_CAPACITY)
                        long value = ((OFWirelessTxCurrentCapacity)param).getTxCurrentCapacity().getValue();
                        log.info(" ##### 6 ###### Mw Metrics: TxMaxCapacity {}", value);
                        return value;
                    }
                }
                break;
            }
            log.info(" ##### 7 ###### Mw Metrics: TxMaxCapacity not found");
            return 0;
        }

    } // class InternalOpenFlowListener

} // class WirelessDeviceProvider
