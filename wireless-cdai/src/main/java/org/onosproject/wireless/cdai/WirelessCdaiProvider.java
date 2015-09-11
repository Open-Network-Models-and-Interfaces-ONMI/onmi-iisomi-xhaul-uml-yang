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
package org.onosproject.wireless.cdai;

import com.google.common.collect.Lists;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.onosproject.net.Device;
import org.onosproject.net.DeviceId;
import org.onosproject.net.MastershipRole;
import org.onosproject.net.Port;
import org.onosproject.net.PortNumber;
import org.onosproject.net.Link;
import org.onosproject.net.device.DefaultDeviceDescription;
import org.onosproject.net.device.DefaultPortDescription;
import org.onosproject.net.device.DeviceDescription;
import org.onosproject.net.device.DeviceEvent;
import org.onosproject.net.device.DeviceListener;
import org.onosproject.net.device.DeviceProvider;
import org.onosproject.net.device.DeviceProviderRegistry;
import org.onosproject.net.device.DeviceProviderService;
import org.onosproject.net.device.DeviceService;
import org.onosproject.net.device.DeviceStore;
import org.onosproject.net.device.PortStatistics;
import org.onosproject.net.device.PortDescription;
//
import static org.onosproject.net.DeviceId.deviceId;
import org.onosproject.net.provider.AbstractProvider;
import org.onosproject.net.provider.ProviderId;
import org.onosproject.net.AnnotationKeys;
import org.onosproject.net.DefaultAnnotations;
import org.onosproject.net.link.LinkService;
import org.onosproject.openflow.controller.Dpid;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowEventListener;
import org.onosproject.openflow.controller.OpenFlowSwitch;
//
import org.onosproject.core.ApplicationId;
import org.onosproject.core.CoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;
//
import java.util.concurrent.atomic.AtomicLong;
//

import static org.onosproject.net.MastershipRole.*;
import static org.onosproject.openflow.controller.Dpid.dpid;
import static org.onosproject.openflow.controller.Dpid.uri;
import org.projectfloodlight.openflow.protocol.OFPortDesc;
import org.projectfloodlight.openflow.protocol.OFExperimenterPortWireless;
import org.projectfloodlight.openflow.protocol.OFPortDescPropWirelessTransport;
import org.projectfloodlight.openflow.protocol.OFPortModPropWirelessTransport;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterface;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportPortFeatureHeader;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterfacePropParamHeader;
import org.projectfloodlight.openflow.protocol.OFWirelessTxCurrentCapacity;
import org.projectfloodlight.openflow.protocol.OFWirelessExperimenterPortMod;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsRequest;
import org.projectfloodlight.openflow.protocol.OFStatsReply;
import org.projectfloodlight.openflow.protocol.OFStatsType;
import org.projectfloodlight.openflow.protocol.OFExperimenterStatsReply;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsReply;

import org.projectfloodlight.openflow.protocol.OFMessage;

import org.projectfloodlight.openflow.types.OFPort;


/**
 * ONOS Wireless use case application for capacity driven air interface.
 */
@Component(immediate = true)
public class WirelessCdaiProvider extends AbstractProvider implements DeviceProvider {
    // Device Annotations
    private static final String WIRELESS_LAG_PORT = "wireless-port-lag";
    private static final String WIRELESS_PORT_PRIM = "wireless-port-prim";
    private static final String WIRELESS_PORT_SEC = "wireless-port-sec";
    private static final String WIRELESS_TX_CURR_CAPACITY = "wireless-tx-curr-capacity";
    private static final String WIRELESS_DEBUG = "wireless-debug";
    private static final String WIRELESS_LOW_UTILIZATION_THRESHOLD = "wireless-low-utilization-th";
    private static final String WIRELESS_HIGH_UTILIZATION_THRESHOLD = "wireless-high-utilization-th";
    // Constants
    private static final long WIRELESS_EXPERIMENTER_TYPE = 0xff000005l;
    private static final long WIRELESS_DEBUG_ALWAYS_SEND_PORT_MOD = 1;
    private static final long WIRELESS_DEBUG_CALCULATE_ONLY = 2;
    private static final long LOW_UTILIZATION_THRESHOLD = 30;
    private static final long HIGH_UTILIZATION_THRESHOLD = 60;
    private static final long TIMER_TASK_DELAY = 60000;

    public WirelessCdaiProvider() {
        super(new ProviderId("wireless-cdai-app", "org.onosproject.wireless.cdai"));
    }

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected CoreService coreService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceStore store;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceService deviceService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected LinkService linkService;

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

    private List<InternalData> internalDb = Lists.newArrayList();
    private Map<DeviceId, Boolean> multiPartSendDecisionMap = new HashMap<DeviceId, Boolean>();

    private long prevUtilization = 0;

    private final AtomicLong xidAtomic = new AtomicLong(1);

    private Timer timer;

    @Activate
    protected void activate() {
        appId = coreService.registerApplication("org.onosproject.capacityDrivenAirInterface");
        deviceProviderService = deviceProviderRegistry.register(this);

        deviceService.addListener(deviceListener);
        openFlowController.addEventListener(openFlowlistener);

        timer = new Timer();

        log.info("activate(): Started");
    }

    @Deactivate
    protected void deactivate() {
        openFlowController.removeEventListener(openFlowlistener);
        deviceService.removeListener(deviceListener);
        deviceProviderRegistry.unregister(this);
        deviceProviderService = null;

        if (timer != null) {
            timer.cancel();
        }

        log.info("deactivate(): Stopped");
    }

    /**
     * Listener of device events.
     */
    private class InternalDeviceListener implements DeviceListener {
        @Override
        public void event(DeviceEvent event) {
            final Device device = event.subject();
            final DeviceId deviceId = device.id();
            final DeviceDescription desc = description(device);

            switch (event.type()) {
                case PORT_STATS_UPDATED:
                    log.debug("event(): Recv PORT_STATS_UPDATED");
                    if (isDeviceWireless(device) == false) {
                        break;
                    }
                    if (deviceService.isAvailable(deviceId) == false) {
                        break;
                    }

                    if (multiPartSendDecisionMap.containsKey(deviceId) == true) {
                        Boolean isMultiPartSend = multiPartSendDecisionMap.get(deviceId);
                        if (isMultiPartSend.booleanValue() == false) {
                            break;
                        }
                    }

                    sendExperimenterMultipartPortRequest(device);
                    log.debug("event(): Send ExperimenterMultipartPortRequest");

                    Boolean isSendFlg = Boolean.valueOf(false);
                    multiPartSendDecisionMap.put(deviceId, isSendFlg);

                    TimerTask task = new InternalTimerTask(device);
                    timer.schedule(task, TIMER_TASK_DELAY);

                    boolean result = analyzeDevicePortStats(device);

                    if (result == false) {
                        log.debug("event(): Skip Port Utilization Analyze.");
                        break;
                    }

                    printInternalDb();
                    analyzePortsUtilization(device);

                    break;

                default:
                    break;
            }
        }
    }

    /**
     * Transmission timing control of ExperimenterMultipartPortRequest.
     */
    private class InternalTimerTask extends TimerTask {
        DeviceId deviceId;

        private InternalTimerTask(Device device) {
            deviceId = device.id();
        }

        @Override
        public void run() {
            log.debug("run(): set true to multiPartSend device id {}", deviceId);
            Boolean isSendFlg = Boolean.valueOf(true);
            multiPartSendDecisionMap.put(deviceId, isSendFlg);
        }
    }

    /**
     * Obtains port stats for given device.
     *
     * @param device Statistics acquisition target.
     * @return ports utilization analyze decision result.
     */
    private boolean analyzeDevicePortStats(Device device) {
        DeviceId deviceId = device.id();

        List<Port> ports = store.getPorts(deviceId);
        for (Port port : ports) {
            for (PortStatistics stat : deviceService.getPortStatistics(deviceId)) {
                if (stat.port() != port.number().toLong()) {
                    continue;
                }
                // Stat is the port stats for the lag port.
                InternalData portInternalData = getInternalData(device, port);
                if (portInternalData == null) {
                    continue;
                }

                // Stat is the port stats for the lag MW port.
                calculatePortUtilizedCapacityFromStats(stat, portInternalData);

                InternalData peerPortInternalData = getPeerInternalData(device, port);
                if (peerPortInternalData == null) {
                    return false;
                }

                if (peerPortInternalData.capacityUpdate() == true) {
                    portInternalData.setCapacityUpdate(false);
                    peerPortInternalData.setCapacityUpdate(false);
                    return true;
                }

                log.debug("analyzeDevicePortStats(): set Capacity Updated flag.");
                portInternalData.setCapacityUpdate(true);
                peerPortInternalData.setCapacityUpdate(true);

                return false;
            }
        }
        return false;
    }

    /**
     * Checks the utilization annotation and disables/enables the relevant ports.
     *
     * @param device Check target.
     */
    private void analyzePortsUtilization(Device device) {
        ProviderId devProviderId = device.providerId();
        DeviceId deviceId = device.id();
        long wirelessDebug = (device.annotations().value(WIRELESS_DEBUG) == null) ?
            0 : Integer.valueOf(device.annotations().value(WIRELESS_DEBUG)).longValue();

        List<Port> ports = store.getPorts(deviceId);
        for (Port port : ports) {
            InternalData portInternalData = getInternalData(device, port);
            if (portInternalData == null) {
                continue;
            }

            InternalData peerPortInternalData = getPeerInternalData(device, port);
            if (peerPortInternalData == null) {
                return;
            }
            Device peerDevice = peerPortInternalData.device();
            Port peerPort = peerPortInternalData.port();

            // Calculate utilization: current lag port.
            long utilizedCapacity = portInternalData.txUtilizedCapacity();
            long currCapacity =  portInternalData.txCurrentCapacity();
            log.info("analyzePortsUtilization(): ----- {}/{}: Capacity {}",
                deviceId, port.number(), currCapacity);

            long peerUtilizedCapacity = peerPortInternalData.txUtilizedCapacity();
            long peerCurrCapacity =  peerPortInternalData.txCurrentCapacity();
            log.info("analyzePortsUtilization(): ----- {}/{}: peerCapacity {}",
                peerDevice.id(), peerPort.number(), peerCurrCapacity);

            if (currCapacity > 0) {
                long utilization = utilizedCapacity * 100 / currCapacity;
                log.info("analyzePortsUtilization(): ----- {}/{}: utilization {}",
                    deviceId, port.number(), utilization);

                long peerUtilization = peerUtilizedCapacity * 100 / peerCurrCapacity;
                log.info("analyzePortsUtilization(): ----- {}/{}: peerUtilization {}",
                    peerDevice.id(), peerPort.number(), peerUtilization);

                long lowThreshold = getUtilizationThresholdLow(device);
                long highThreshold = getUtilizationThresholdHigh(device);
                log.info("analyzePortsUtilization(): ----- {}/{}: High th {} Low th {}",
                    deviceId, port.number(), highThreshold, lowThreshold);

                long peerLowThreshold = getUtilizationThresholdLow(peerDevice);
                long peerHighThreshold = getUtilizationThresholdHigh(peerDevice);
                log.info("analyzePortsUtilization(): ----- {}/{}: peerHigh th {} peerLow th {}",
                    peerDevice.id(), peerPort.number(), peerHighThreshold, peerLowThreshold);

                // Debug: always send ExperimanterPortMod if a flag is set on.
                if (utilization == 0
                 && peerUtilization == 0
                 && wirelessDebug == WIRELESS_DEBUG_ALWAYS_SEND_PORT_MOD) {
                    sendWirelessPortMod(device.id(), port, false); // Always unmute.
                }
                else if (utilization >= 0
                      && utilization < lowThreshold
                      && portInternalData.portMute() == false
                      && portInternalData.prevUtilization() >= 0
                      && peerUtilization >= 0
                      && peerUtilization < peerLowThreshold
                      && peerPortInternalData.portMute() == false
                      && peerPortInternalData.prevUtilization() >= 0
                      && wirelessDebug != WIRELESS_DEBUG_CALCULATE_ONLY) {
                    muteMwPort(portInternalData);
                }
                else if (utilization > highThreshold
                      && portInternalData.portMute() == true
                      && wirelessDebug != WIRELESS_DEBUG_CALCULATE_ONLY
                      || peerUtilization > peerHighThreshold
                      && peerPortInternalData.portMute() == true
                      && wirelessDebug != WIRELESS_DEBUG_CALCULATE_ONLY) {
                   unmuteMwPort(portInternalData);
                }
                portInternalData.setPrevUtilization(utilization);
            }
        }
    }

    /**
     * Sends port mute msg.
     *
     * @param portInternalData Mute port data.
     */
    private void muteMwPort(InternalData portInternalData) {
        Device device = portInternalData.device();
        Port port = portInternalData.port();
        Port muteP = portInternalData.mutePort();
        log.debug("muteMwPort(): start for port {}/{}", device.id(), port.number());

        // Get peer data here. If it does not exist, escape with error.
        InternalData peerPortInternalData = getPeerInternalData(device, port);
        Device peerDevice = peerPortInternalData.device();
        Port peerMuteP = peerPortInternalData.mutePort();

        printInternalDb();

        // Mute the ports on both sides.
        sendWirelessPortMod(device.id(), muteP, true);
        portInternalData.setPortMute(true);
        sendWirelessPortMod(peerDevice.id(), peerMuteP, true);
        peerPortInternalData.setPortMute(true);

        printInternalDb();
    }

    /**
     * Sends port unmute msg.
     *
     * @param portInternalData Unmute port data.
     */
    private void unmuteMwPort(InternalData portInternalData) {
        Device device = portInternalData.device();
        Port port = portInternalData.port();
        Port muteP = portInternalData.mutePort();
        log.debug("unmuteMwPort(): start for port {}/{}", device.id(), port.number());

        // Get peer data here. If it does not exist, escape with error.
        InternalData peerPortInternalData = getPeerInternalData(device, port);
        if (peerPortInternalData == null) {
            log.error("unmuteMwPort(): No internal data record for port of {}/{}",
                device.id(), port.number());
            return;
        }
        Device peerDevice = peerPortInternalData.device();
        Port peerMuteP = peerPortInternalData.mutePort();

        printInternalDb();

        // Unmute the ports on both sides.
        sendWirelessPortMod(device.id(), muteP, false);
        portInternalData.setPortMute(false);
        sendWirelessPortMod(peerDevice.id(), peerMuteP, false);
        peerPortInternalData.setPortMute(false);
        printInternalDb();
    }


    /**
     * Port utilized capacity Statistics calculation.
     *
     * @param stat Stats data.
     * @param portInternalData Prev stats data.
     * @return Calculated capacity data.
     */
    private long calculatePortUtilizedCapacityFromStats(PortStatistics stat, InternalData portInternalData) {
        long rxBytes, txBytes, rxDelta, txDelta, maxDelta, duration, timeMs;
        long capacity = 0;
        long prevTimeMs = portInternalData.prevTimeMs();
        long prevTxBytes = portInternalData.prevTxBytes();
        long prevRxBytes = portInternalData.prevRxBytes();
        long prevTxUtilizedCapacity = portInternalData.txUtilizedCapacity();

        timeMs = stat.durationSec() * 1000 + stat.durationNano() / 1000000;
        duration = (timeMs > prevTimeMs) ? (timeMs - prevTimeMs) : (Integer.MAX_VALUE - prevTimeMs + timeMs);

        rxBytes = stat.bytesReceived();
        txBytes = stat.bytesSent();

        txDelta = (txBytes >= prevTxBytes) ? (txBytes - prevTxBytes) : (Integer.MAX_VALUE - prevTxBytes + txBytes);
        rxDelta = (rxBytes >= prevRxBytes) ? (rxBytes - prevRxBytes) : (Integer.MAX_VALUE - prevRxBytes + rxBytes);

        capacity = txDelta * 8 / duration;  // Kbps = Bytes*8/ms

        log.info("calculatePortUtilizedCapacityFromStats(): Calc for port {}/{}: port={}, rx={}, rxDelta={}, tx={}, txDelta={}, duration={}, timeMs={}, prevTimeMs={}, stat.durationSec()={}, stat.durationNano()={}, capacity={}",
            portInternalData.device().id(), portInternalData.port().number(), stat.port(), rxBytes, rxDelta, txBytes, txDelta, duration, timeMs, prevTimeMs, stat.durationSec(), stat.durationNano(), capacity);

        portInternalData.setPrevRxBytes(rxBytes);
        portInternalData.setPrevTxBytes(txBytes);
        portInternalData.setPrevTimeMs(timeMs);
        portInternalData.setTxUtilizedCapacity(capacity);

        return capacity;
    }

    /**
     * Sends ExperimenterPortMod msg.
     *
     * @param deviceId Mute/Unmute target device id.
     * @param port Mute/Unmute target port.
     * @param mute Mute/Unmute flag.
     */
    private void sendWirelessPortMod(DeviceId deviceId, Port port, boolean mute) {
        final Dpid dpid = dpid(deviceId.uri());
        OpenFlowSwitch sw = openFlowController.getSwitch(dpid(deviceId.uri()));
        if (sw == null || !sw.isConnected()) {
            log.error("sendWirelessPortMod(): OF Switch not obtained for device {}", deviceId);
            return;
        }

        log.debug("sendWirelessPortMod(): Sending Experimenter Port Modify for {}/{}", deviceId, port.number());
        // Send OF Port Modify message towards the Network Element.
        OFWirelessExperimenterPortMod portMod;
        List<OFPortModPropWirelessTransport> properties = new ArrayList<OFPortModPropWirelessTransport>();
        List<OFWirelessTransportPortFeatureHeader> features = new ArrayList<OFWirelessTransportPortFeatureHeader>();
        List<OFWirelessTransportInterfacePropParamHeader> paramList = new ArrayList<OFWirelessTransportInterfacePropParamHeader>();

        final List<OFPortDesc> portDescs = sw.getPorts();
        for (OFPortDesc portDesc : portDescs) {

            if (portDesc.getPortNo().equals(OFPort.of((int)port.number().toLong()))) {
                Long statsXid = xidAtomic.getAndIncrement();
                // TX_MUTE
                paramList.add((OFWirelessTransportInterfacePropParamHeader)sw.factory().buildWirelessTxMute()
                        .setTxMute(mute == true ? (short)0x1 : (short)0x0)
                        .setFlags((short)0x1)
                        .build());
                // Build the message
                features.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessTransportInterface()
                        .setParams(paramList)
                        .build());
                properties.add(sw.factory().buildPortModPropWirelessTransport()
                        .setFeatures(features)
                        .build());

                portMod = sw.factory().buildWirelessExperimenterPortMod()
                        .setXid(statsXid)
                        .setPortNo(portDesc.getPortNo())
                        .setHwAddr(portDesc.getHwAddr())
                        .setConfig(0)
                        .setMask(0)
                        .setProperties(properties)
                        .build();

                sw.sendMsg(portMod);

                log.info("sendWirelessPortMod(): Port {} is {}",
                        portDesc.getPortNo(), (mute == true) ? "Mute" : "Unmute");
            }
        }
    }

    /**
     * Sends ExperimenterMultipartPortRequest msg.
     *
     * @param device Sends target device.
     */
    private void sendExperimenterMultipartPortRequest(Device device) {
        DeviceId deviceId = device.id();
        final Dpid dpid = dpid(deviceId.uri());
        OpenFlowSwitch sw = openFlowController.getSwitch(dpid);
        if (sw == null || !sw.isConnected()) {
            log.error("sendExperimenterMultipartPortRequest(): OF Switch not obtained for device {}", deviceId);
            return;
        }

        OFWirelessMultipartPortsRequest portsRequest;
        Long statsXid = xidAtomic.getAndIncrement();
        portsRequest = sw.factory().buildWirelessMultipartPortsRequest()
                .setXid(statsXid)
                .build();

        sw.sendMsg(portsRequest);

        log.debug("sendExperimenterMultipartPortRequest(): Multipart Port Request sent for device {}", deviceId);
    }

    /**
     * Get annotation of wireless prim port.
     *
     * @param device Get target device.
     * @return Port number.
     */
    public long getMwPortPrim(Device device) {
        long port = 0;
        if (device.annotations().value(WIRELESS_PORT_PRIM) != null) {
            port = Integer.valueOf(device.annotations().value(WIRELESS_PORT_PRIM)).longValue();
        }
        return port;
    }

    /**
     * Get annotation of wireless sec port.
     *
     * @param device Get target device.
     * @return Port number.
     */
    public long getMwPortSec(Device device) {
        long port = 0;
        if (device.annotations().value(WIRELESS_PORT_SEC) != null) {
            port = Integer.valueOf(device.annotations().value(WIRELESS_PORT_SEC)).longValue();
        }
        return port;
    }

    /**
     * Get annotation of wireless lag port.
     *
     * @param device Get target device.
     * @return Port number.
     */
    public long getMwPortLag(Device device) {
        long port = 0;
        if (device.annotations().value(WIRELESS_LAG_PORT) != null) {
            port = Integer.valueOf(device.annotations().value(WIRELESS_LAG_PORT)).longValue();
        }
        return port;
    }

    /**
     * Get annotation of low utilization threshold.
     *
     * @param device Get target device.
     * @return low utilization threshold.
     */
    public long getUtilizationThresholdLow(Device device) {
        long low_threshold = LOW_UTILIZATION_THRESHOLD;
        if (device.annotations().value(WIRELESS_LOW_UTILIZATION_THRESHOLD) != null) {
            long threshold = Integer.valueOf(device.annotations().value(WIRELESS_LOW_UTILIZATION_THRESHOLD)).longValue();
            if (threshold >= 0L && threshold <= 100L) {
                low_threshold = threshold;
            }
        }
        return low_threshold;
    }

    /**
     * Get annotation of high utilization threshold.
     *
     * @param device Get target device.
     * @return high utilization threshold.
     */
    public long getUtilizationThresholdHigh(Device device) {
        long high_threshold = HIGH_UTILIZATION_THRESHOLD;
        if (device.annotations().value(WIRELESS_HIGH_UTILIZATION_THRESHOLD) != null) {
            long threshold = Integer.valueOf(device.annotations().value(WIRELESS_HIGH_UTILIZATION_THRESHOLD)).longValue();
            if (threshold >= 0L && threshold <= 100L) {
                high_threshold = threshold;
            }
        }
        return high_threshold;
    }

    @Override
    public void triggerProbe(DeviceId deviceId) {
        // TODO Auto-generated method stub
    }

    @Override
    public void roleChanged(DeviceId deviceId, MastershipRole newRole) {
        // TODO Auto-generated method stub
    }

    @Override
    public boolean isReachable(DeviceId deviceId) {
        // TODO Auto-generated method stub
        return true;
    }

    /**
     * Default Device Description Create.
     *
     * @param device Device information used for the create.
     */
    static DeviceDescription description(Device device) {
        return new DefaultDeviceDescription(device.id().uri(), device.type(),
                                            device.manufacturer(),
                                            device.hwVersion(), device.swVersion(),
                                            device.serialNumber(), device.chassisId());
    }

    /**
     * Listener of OpenFlow msg recv.
     */
    private class InternalOpenFlowListener implements OpenFlowEventListener {

        @Override
        public void handleMessage(Dpid dpid, OFMessage msg) {
            switch (msg.getType()) {
                case STATS_REPLY:
                    log.debug("handleMessage() : Recv OpenFlow Msg StatsType {}", ((OFStatsReply) msg).getStatsType());
                    if (   ((OFStatsReply) msg).getStatsType() == OFStatsType.EXPERIMENTER
                        && ((OFExperimenterStatsReply) msg).getExperimenter() == WIRELESS_EXPERIMENTER_TYPE ) {
                        annotatePortByMwParams(dpid, (OFWirelessMultipartPortsReply) msg);
                    }
                    break;
            }
        }

        /**
         * Update port annotation.
         *
         * @param dpid Data Path ID.
         * @param msg Recv OpenFlow Wireless Multipart Port Reply Msg.
         */
        private void annotatePortByMwParams(Dpid dpid, OFWirelessMultipartPortsReply msg) {
            OpenFlowSwitch sw = openFlowController.getSwitch(dpid);
            List<PortDescription> descs = Lists.newArrayList();

            // Obtain the Device related to the received message
            DeviceId deviceId = deviceId(uri(dpid));
            Device device = store.getDevice(deviceId);
            if (isDeviceWireless(device) == false) {
                log.error("annotatePortByMwParams(): Wireless Experimeter stats received on non annotated device {}",
                    device.id());
                return;
            }

            // The experimenter stats message contains MW ports only
            // Updating the port descriptions of the device requires running over all the device's ports
            List<Port> ports = store.getPorts(deviceId);
            List<OFExperimenterPortWireless> msgPorts = msg.getPorts();
            for (Port port : ports) {
                DefaultAnnotations annotations = DefaultAnnotations.builder()
                    .set(AnnotationKeys.PORT_NAME, port.annotations().value(AnnotationKeys.PORT_NAME))
                    .build();
                // Search if the current port is presented in the received multipart reply
                for (OFExperimenterPortWireless msgPort : msgPorts) {
                    PortNumber portNo = PortNumber.portNumber(msgPort.getPortNo().getPortNumber());
                    if (port.number().equals(portNo)) {
                        long txCurrCapacity = getTxCurrCapacityFromReplyPort(msgPort);
                        annotations = DefaultAnnotations.builder()
                            .set(AnnotationKeys.PORT_NAME, msgPort.getName())
                            .set(WIRELESS_TX_CURR_CAPACITY, Long.toString(txCurrCapacity))
                            .build();
                        log.debug("annotatePortByMwParams(): port {}, TX_CURR_CAPACITY {}",
                            portNo, txCurrCapacity);
                        InternalData portInternalData = getInternalData(device, port);
                        if (portInternalData == null) {
                            break;
                        }
                        portInternalData.setTxCurrentCapacity(txCurrCapacity);
                        break;
                    }
                }
                descs.add(new DefaultPortDescription(port.number(),
                    port.isEnabled(), port.type(), port.portSpeed(), annotations));
            }
            store.updatePorts(device.providerId(), deviceId, descs);

            log.debug("annotatePortByMwParams(): OF Message {}, type {}, experimenter {}, subtype {}, received from {} - proceeded",
                msg.getType(), ((OFStatsReply) msg).getStatsType(),
                ((OFExperimenterStatsReply) msg).getExperimenter(),
                ((OFWirelessMultipartPortsReply) msg).getSubtype(),
                dpid);
        }

        /**
         * Extraction of Tx capacity.
         *
         * @param msgPort Extraction source the msg.
         * @retrun Extraction data.
         */
        private long getTxCurrCapacityFromReplyPort(OFExperimenterPortWireless msgPort) {
            long value = 0;
            List<OFPortDescPropWirelessTransport> props = msgPort.getProperties();
            for (OFPortDescPropWirelessTransport prop : props) {
                List<OFWirelessTransportPortFeatureHeader> features = prop.getFeatures();
                for (OFWirelessTransportPortFeatureHeader feature : features) {
                    OFWirelessTransportInterface tranceportInterface  = (OFWirelessTransportInterface)feature;
                    List<OFWirelessTransportInterfacePropParamHeader> params = tranceportInterface.getParams();
                    for (OFWirelessTransportInterfacePropParamHeader param : params) {
                        if (param.getType() == 2) { // (OFWirelessTransportInterfacePropParamTypes.TX_CURRENT_CAPACITY)
                            value = ((OFWirelessTxCurrentCapacity)param).getTxCurrentCapacity();
                            log.debug("getTxCurrCapacityFromReplyIfc(): TxCurrCapacity {}", value);
                            return value;
                        }
                    }
                }
            }
            log.info("getTxCurrCapacityFromReplyIfc(): TxMaxCapacity not found. port {}", msgPort.getPortNo().getPortNumber());
            return value;
        }

    }

    /**
     * Internal data for managing the control information.
     */
    private class InternalData {
        private Device device;
        private Port port;
        private Port mutePort;
        private long txUtilizedCapacity;
        private long txCurrentCapacity;
        private long prevRxBytes;
        private long prevTxBytes;
        private long prevTimeMs;
        private long prevUtilization;
        private boolean portMute;
        private boolean capacityUpdate;

        public InternalData(Device device, Port port, Port mutePort) {
            this.device = device;
            this.port = port;
            this.mutePort = mutePort;
            this.txUtilizedCapacity = 0;
            this.txCurrentCapacity = 0;
            this.prevRxBytes = 0;
            this.prevTxBytes = 0;
            this.prevTimeMs = 0;
            this.prevUtilization = 0;
            this.portMute = false;
            this.capacityUpdate = false;
        }

        public InternalData(InternalData data) {
            device = data.device;
            port = data.port;
            mutePort = data.mutePort;
            txUtilizedCapacity = data.txUtilizedCapacity;
            txCurrentCapacity = data.txCurrentCapacity;
            prevRxBytes = data.prevRxBytes;
            prevTxBytes = data.prevTxBytes;
            prevTimeMs = data.prevTimeMs;
            prevUtilization = data.prevUtilization;
            portMute = data.portMute;
            capacityUpdate = data.capacityUpdate;
        }

        public Device device() {
            return device;
        }
        public Port port() {
            return port;
        }
        public Port mutePort() {
            return mutePort;
        }
        public long txUtilizedCapacity() {
            return txUtilizedCapacity;
        }
        public long txCurrentCapacity() {
            return txCurrentCapacity;
        }
        public long prevRxBytes() {
            return prevRxBytes;
        }
        public long prevTxBytes() {
            return prevTxBytes;
        }
        public long prevTimeMs() {
            return prevTimeMs;
        }
        public long prevUtilization() {
            return prevUtilization;
        }
        public boolean portMute() {
            return portMute;
        }
        public boolean capacityUpdate() {
            return capacityUpdate;
        }

        // Set functions
        public void setTxUtilizedCapacity(long txUtilizedCapacity) {
            this.txUtilizedCapacity = txUtilizedCapacity;
        }
        public void setTxCurrentCapacity(long txCurrentCapacity) {
            this.txCurrentCapacity = txCurrentCapacity;
        }
        public void setPrevRxBytes(long prevRxBytes) {
            this.prevRxBytes = prevRxBytes;
        }
        public void setPrevTxBytes(long prevTxBytes) {
            this.prevTxBytes = prevTxBytes;
        }
        public void setPrevTimeMs(long prevTimeMs) {
            this.prevTimeMs = prevTimeMs;
        }
        public void setPrevUtilization(long prevUtilization) {
            this.prevUtilization = prevUtilization;
        }
        public void setPortMute(boolean portMute) {
            this.portMute = portMute;
        }
        public void setCapacityUpdate(boolean capacityUpdate) {
            this.capacityUpdate = capacityUpdate;
        }
    }

    /**
     * Search for match the deviceid and the port number.
     * Create if there is no data that matches.
     *
     * @param device Device including search target deviceid.
     * @param port Search target port.
     * @return Search or created Internal data.
     */
    private InternalData getInternalData(Device device, Port port) {
        long mwPrim = getMwPortPrim(device);
        long mwSec = getMwPortSec(device);
        long mwLag = getMwPortLag(device);
        if (mwPrim == 0 || mwSec == 0 || mwLag == 0) {
            return null; // This device is not wireless
        }
        if (mwLag != port.number().toLong()) {
            // Not wireless lag port
            return null;
        }

        if (port.isEnabled() == false) {
            log.error("getInternalData(): MW Lag port {}/{} is disabled", device.id(), port.number());
            return null;
        }

        Port muteP = store.getPort(device.id(), PortNumber.portNumber(mwSec));
        if (muteP == null) {
            log.error("getInternalData(): : MW mute port {}/{} is not found.",
                device.id(), mwSec);
            return null;
        }

        // Search the list for the given device/port
        if (internalDb.size() != 0) {
            for (InternalData data : internalDb) {
                if (   data.device().id().equals(device.id())
                    && data.port().number().equals(port.number())) {
                    return data;
                }
            }
        }

        // data element was not found, but the device is annotated as having two wireless ports
        // create a new data element
        log.debug("getInternalData(): Number of devices in the DB is {}", internalDb.size());

        InternalData newData = new InternalData(device, port, muteP);
        // Save the new data element in the internal DB
        internalDb.add(newData);
        log.info("getInternalData(): New data element added for device {}, port {} ",
            device.id(), port.number());

        return newData;
    }

    /**
     * Check if the given port belongs to any link and if yes get the peer port's Internal data.
     *
     * @param device Device including search target deviceid.
     * @param port Search target port.
     * @return Search peer InternalData.
     */
    private InternalData getPeerInternalData(Device device, Port port) {
        for (Link link : linkService.getDeviceEgressLinks(device.id())) {
            DeviceId peerDeviceId = link.dst().deviceId();
            Device peerDevice = deviceService.getDevice(peerDeviceId);
            Port peerPort = deviceService.getPort(peerDeviceId, link.dst().port());
            log.debug("getPeerInternalData(): Port for {}/{}: check link {}/{} -> {}/{}",
                device.id(), port.number(), link.src().deviceId(), link.src().port(),
                peerDeviceId, peerPort.number());
            if (   device.id().equals(link.src().deviceId())
                && port.number().equals(peerPort.number())) {
                log.info("getPeerInternalData(): get InternalData for {}/{}: link {}/{} -> {}/{}",
                    device.id(), port.number(), link.src().deviceId(), link.src().port(),
                    peerDeviceId, peerPort.number());
                return getInternalData(peerDevice, peerPort);
            }
        }
        return null;
    }

    /**
     * Checks the device annotation for the wireless decision.
     *
     * @param device Target device.
     * @return Decision result.
     */
    private boolean isDeviceWireless(Device device) {
        boolean isWireless = true;
        long mwPrim = getMwPortPrim(device);
        long mwSec = getMwPortSec(device);
        long lagPort = getMwPortLag(device);
        if (mwPrim == 0 || mwSec == 0 || lagPort == 0) {
            isWireless = false;
        }
        return isWireless;
    }

    /**
     * Port's Internal data output to the log.
     */
    private void printInternalDb() {
        if (internalDb.size() != 0) {
            for (InternalData data : internalDb) {
                log.debug("printInternalDb(): ----- Internal data: device={}, port={}, lagPort={}, txUtilizedCapacity={}, prevUtilization={}, portMute={} ",    data.device().id(),
                    data.port().number(),
                    data.mutePort().number(),
                    data.txUtilizedCapacity(),
                    data.prevUtilization(),
                    data.portMute() ? "true" : "false");
            }
        }
    }
}
