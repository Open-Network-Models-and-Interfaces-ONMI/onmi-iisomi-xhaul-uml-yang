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
import org.onosproject.net.flow.DefaultFlowRule;
import org.onosproject.net.flow.DefaultTrafficSelector;
import org.onosproject.net.flow.DefaultTrafficTreatment;
import org.onosproject.net.flow.FlowRule;
import org.onosproject.net.flow.FlowRuleService;
import org.onosproject.net.flow.TrafficSelector;
import org.onosproject.net.flow.TrafficTreatment;
import org.onosproject.openflow.controller.Dpid;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowEventListener;
import org.onosproject.openflow.controller.OpenFlowSwitch;
import org.onlab.util.HexString;
import org.onlab.packet.VlanId;
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
import org.projectfloodlight.openflow.protocol.OFPortDesc;
import org.projectfloodlight.openflow.protocol.OFExperimenterPortWireless;
import org.projectfloodlight.openflow.protocol.OFPortDescPropWirelessTransport;
import org.projectfloodlight.openflow.protocol.OFPortModPropWirelessTransport;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportPortFeatureHeader;
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
    private static final String ETH_PORT = "eth-port";
    private static final String WIRELESS_UTILIZED_CAPACITY = "wireless-utilized-tx-capacity";
    private static final String WIRELESS_TX_CURR_CAPACITY = "wireless-tx-curr-capacity";
    private static final String FLOW_OPERATION = "flow-op";
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
    protected FlowRuleService flowRuleService;

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

    private long statsReportCounter = 0;
    private long prevUtilization = 0;
    private boolean portMute = false;

    private boolean flowsInstalled = false;
    private final AtomicLong xidAtomic = new AtomicLong(1);

    @Activate
    protected void activate() {
        appId = coreService.registerApplication("org.onosproject.wireless");
        deviceProviderService = deviceProviderRegistry.register(this);

        deviceService.addListener(deviceListener);
        openFlowController.addEventListener(openFlowlistener);

        log.info("activate(): Started");
    }

    @Deactivate
    protected void deactivate() {
        removeCreatedFlows();
        openFlowController.removeEventListener(openFlowlistener);
        deviceService.removeListener(deviceListener);
        deviceProviderRegistry.unregister(this);
        deviceProviderService = null;

        log.info("deactivate(): Stopped");
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
                    if (isDeviceWireless(device) == false) {
                        break;
                    }
                    if (deviceService.isAvailable(deviceId) == false) {
                        break;
                    }

                    ++statsReportCounter;

                    analyzeDevicePortStats(device);
                    if (statsReportCounter % 5 == 2) {
                        sendExperimenterMultipartPortRequest(device);
                    }
                    if (statsReportCounter % 5 == 4) {
                        printInternalDb();
                        analyzePortsUtilization(device);
                    }

                    break;

                default:
                    break;
            }
        }
    } // class InternalDeviceListener

    // Obtains port stats for given device
    private void analyzeDevicePortStats(Device device) {
        DeviceId deviceId = device.id();

        List<Port> ports = store.getPorts(deviceId);
        for (Port port : ports) {
            for (PortStatistics stat : deviceService.getPortStatistics(deviceId)) {
                if (stat.port() != port.number().toLong()) {
                    continue;
                }
                // stat is the port stats for the current port
                InternalData portInternalData = getInternalData(device, port);
                if (portInternalData == null) {
                    continue;
                }
                // The flow init is done for each device once:
                // flow 1 is set on the primary port, flow 2 - on the secondary
                if (portInternalData.flowsFirstCreated() == false) {
                    if (portInternalData.port().number().toLong() != getMwPortPrim(device)) {
                        continue;
                    }
                    initFlows(portInternalData);
                }
                else {
                    // stat is the port stats for the current MW port
                    calculatePortUtilizedCapacityFromStats(stat, portInternalData);
                break;
                }
            }
        }
    }

    // Checks the utilization annotation and disables/enables the relevant ports
    private void analyzePortsUtilization(Device device) {
        ProviderId devProviderId = device.providerId();
        DeviceId deviceId = device.id();

        List<Port> ports = store.getPorts(deviceId);
        for (Port port : ports) {
            InternalData portInternalData = getInternalData(device, port);
            if (portInternalData == null) {
                continue;
            }

            long utilized_capacity = portInternalData.txUtilizedCapacity();
            long curr_capacity = getTxCurrCapacityFromPortAnnotation(port);
            if (curr_capacity > 0) {
                long utilization = utilized_capacity * 100 / curr_capacity;
                log.info("analyzePortsUtilization(): ----- {}/{}: utilized_capacity {}, curr_capacity {} utilization {}",
                    deviceId, port.number(), utilized_capacity, curr_capacity, utilization);
                // wait until the calculations become steady
                    if (   utilization > 0
                        && utilization < 20
                        && portInternalData.prevUtilization() > 0) {
//                        if (device.annotations().value("mw-start") != null)
                            muteMwPort(portInternalData);
                    }
                    if (utilization > 80) {
//                        if (device.annotations().value("mw-start") != null)
                            unmuteMwPort(portInternalData);
                    }
                portInternalData.setPrevUtilization(utilization);
            }
        }
    }

    // Moves all created flows from the given MW port to its mate; sends ExperimenterPortMod msg
    private void muteMwPort(InternalData portInternalData) {
        Device device = portInternalData.device();
        Port port = portInternalData.port();
        Port mateMwPort = portInternalData.mateMwPort();
        InternalData matePortInternalData = getInternalData(device, mateMwPort);
        if (matePortInternalData == null) {
            log.error("muteMwPort(): No internal data record for port {}/{}",
                device.id(), mateMwPort.number());
            return;
        }

        // Escape if either the given or mate port is already muted.
        if (matePortInternalData.portMute()) {
            log.info("muteMwPort(): port {}/{} is not muted because the mate port is already mute",
                device.id(), port.number());
            return;
        }
        if (portInternalData.portMute()) {
            log.debug("muteMwPort(): port {}/{} is already mute",
                device.id(), port.number());
            return;
        }
        // move _all_ flows from the given port to mate
        if (portInternalData.flow1Created()) {
            operateFlow(device, port.number().toLong(), false, true); // remove, flow1
            portInternalData.setFlow1Created(false);

            operateFlow(device, mateMwPort.number().toLong(), true, true); // add, flow1
            matePortInternalData.setFlow2Created(true);
        }
        if (portInternalData.flow2Created()) {
            operateFlow(device, port.number().toLong(), false, false); // remove, flow2
            portInternalData.setFlow2Created(false);

            operateFlow(device, mateMwPort.number().toLong(), true, false); // add, flow2
            matePortInternalData.setFlow2Created(true);
        }

        // Mute the port
        sendWirelessPortMod(device.id(), port, true);
        portInternalData.setPortMute(true);
    }

    // sends ExperimenterPortMod msg;
    // Moves either flow1 or flow2 (depending on whether the given port is Prim or Sec) from the mate MW port to the given one
    private void unmuteMwPort(InternalData portInternalData) {
        Device device = portInternalData.device();
        Port port = portInternalData.port();
        Port mateMwPort = portInternalData.mateMwPort();
        InternalData matePortInternalData = getInternalData(device, mateMwPort);
        if (matePortInternalData == null) {
            log.error("muteMwPort(): No internal data record for port {}/{}",
                device.id(), mateMwPort.number());
            return;
        }

        if (getMwPortPrim(device) == port.number().toLong()) {
            // move flow1 from the mate
            if (matePortInternalData.flow1Created()) {
                operateFlow(device, mateMwPort.number().toLong(), false, true); // remove, flow1
                matePortInternalData.setFlow1Created(false);

                operateFlow(device, port.number().toLong(), true, true); // add, flow1
                portInternalData.setFlow1Created(true);
            }
        }
        else {
            // move flow2 from the mate
            if (matePortInternalData.flow2Created()) {
                operateFlow(device, mateMwPort.number().toLong(), false, false); // remove, flow2
                matePortInternalData.setFlow2Created(false);

                operateFlow(device, port.number().toLong(), true, false); // add, flow2
                portInternalData.setFlow2Created(true);
            }
        }

        // Unmute the port
        sendWirelessPortMod(device.id(), port, false);
        portInternalData.setPortMute(false);
    }

    private long calculatePortUtilizedCapacityFromStats(PortStatistics stat, InternalData portInternalData) {
        long rxBytes, txBytes, rxDelta, txDelta, maxDelta, duration, timeMs;
        long capacity = 0;
        long prevTimeMs = portInternalData.prevTimeMs();
        long prevTxBytes = portInternalData.prevTxBytes();
        long prevRxBytes = portInternalData.prevRxBytes();
        long prevTxUtilizedCapacity = portInternalData.txUtilizedCapacity();

        timeMs = stat.durationSec()*1000 + stat.durationNano()/1000;
        duration = (timeMs > prevTimeMs) ? (timeMs - prevTimeMs) : (Integer.MAX_VALUE - prevTimeMs + timeMs);

        rxBytes = stat.bytesReceived();
        txBytes = stat.bytesSent();

        txDelta = (txBytes >= prevTxBytes) ? (txBytes - prevTxBytes) : (Integer.MAX_VALUE - prevTxBytes + txBytes);
        rxDelta = (rxBytes >= prevRxBytes) ? (rxBytes - prevRxBytes) : (Integer.MAX_VALUE - prevRxBytes + rxBytes);

        capacity = txDelta * 8 / duration;  // Kbps = Bytes*8/ms

        log.debug("calculatePortUtilizedCapacityFromStats(): Calc for port {}/{}: port={}, rx={}, rxDelta={}, tx={}, txDelta={}, duration={}, timeMs={}, prevTimeMs={}, stat.durationSec()={}, stat.durationNano()={}, capacity={}",
            portInternalData.device().id(), portInternalData.port().number(), stat.port(), rxBytes, rxDelta, txBytes, txDelta, duration, timeMs, prevTimeMs, stat.durationSec(), stat.durationNano(), capacity);

        portInternalData.setPrevRxBytes(rxBytes);
        portInternalData.setPrevTxBytes(txBytes);
        portInternalData.setPrevTimeMs(timeMs);
        portInternalData.setTxUtilizedCapacity(capacity);


        return capacity;
    }

    private long getTxCurrCapacityFromPortAnnotation(Port port) {
        long capacity = 0;
        if (port.annotations().value(WIRELESS_TX_CURR_CAPACITY) != null) {
            capacity = Long.parseLong(port.annotations().value(WIRELESS_TX_CURR_CAPACITY));
        }
        return capacity;
    }

    private void sendWirelessPortMod(DeviceId deviceId, Port port, boolean mute) {
/*
        // Check if the  action is needed
        if (portMute == mute) {
            log.info(" xxxxxxxxxxxx Port {}/{} already {}",
                deviceId, port, (mute==true) ? "Mute" : "Unmute");
            return;
        }
*/
        log.debug("sendWirelessPortMod(): Sending Experimenter Port Modify for {}/{}", deviceId, port.number());

        final Dpid dpid = dpid(deviceId.uri());
        OpenFlowSwitch sw = openFlowController.getSwitch(dpid(deviceId.uri()));
        if (sw == null || !sw.isConnected()) {
            log.error("sendWirelessPortMod(): OF Switch not obtained for device {}", deviceId);
            return;
        }

        // Send OF Port Modify message towards the Network Element
        OFWirelessExperimenterPortMod portMod;
        List<OFPortModPropWirelessTransport> properties = new ArrayList<OFPortModPropWirelessTransport>();
//        List<OFPortDescPropWirelessTransport> properties = new ArrayList<OFPortDescPropWirelessTransport>();
        List<OFWirelessTransportPortFeatureHeader> featureList = new ArrayList<OFWirelessTransportPortFeatureHeader>();

        final List<OFPortDesc> portDescs = sw.getPorts();
        for (OFPortDesc portDesc : portDescs) {

            if (portDesc.getPortNo().equals(OFPort.of((int)port.number().toLong()))) { // == portNum.toLong()) {
                Long statsXid = xidAtomic.getAndIncrement();
                // Temporary values. To be obtained from the port's annotations */
                U64 txMaxCapacity = U64.of(0x123456);
                int txPower = 0x123;
                // TX_MAX_CAPACITY
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessTxMaxCapacity()
                        .setTxMaxCapacity(txMaxCapacity)
                        .build());
                // TX_CURRENT_CAPACITY
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessTxCurrentCapacity()
                        .setTxCurrentCapacity(U64.of(0))
                        .build());
                // RX_CURRENT_CAPACITY
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessRxCurrentCapacity()
                        .setRxCurrentCapacity(U64.of(0))
                        .build());
                // TX_POWER
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessTxPower()
                        .setTxPower(txPower)
                        .build());
                // TX_MAX_POWER
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessTxMaxPower()
                        .setTxMaxPower(2*txPower)
                        .build());
                // TX_MUTE
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessTxMute()
                        .setTxMute(mute == true ? (short)0x1 : (short)0x0)
                        .build());
                // RSL
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessRsl()
                        .setRsl(0)
                        .build());
                // SINR
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessSinr()
                        .setSinr(0)
                        .build());
                // OPERATION_MODE
                featureList.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessOperationMode()
                        .setOperationMode((short)0)
                        .build());
                // Build the message
                properties.add(sw.factory().buildPortModPropWirelessTransport()
                        .setFeatures(featureList)
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
                        portDesc.getPortNo(), (mute==true) ? "Mute" : "Unmute");
                portMute = mute;
            }
        }
    }

    private void sendExperimenterMultipartPortRequest(Device device) {
        DeviceId deviceId = device.id();
        final Dpid dpid = dpid(deviceId.uri());
        OpenFlowSwitch sw = openFlowController.getSwitch(dpid);
        if (sw == null || !sw.isConnected()) {
            log.error("sendExperimenterMultipartPortRequest(): OF Switch not obtained for device {}", deviceId);
            return;
        }

        // Send OF Port Modify message towards the Network Element
        OFWirelessMultipartPortsRequest portsRequest;
        Long statsXid = xidAtomic.getAndIncrement();
        portsRequest = sw.factory().buildWirelessMultipartPortsRequest()
                .setXid(statsXid)
                .build();

        sw.sendMsg(portsRequest);

        log.debug("sendExperimenterMultipartPortRequest(): Multipart Port Request sent for device {}", deviceId);
    }

    private FlowRule buildFlowRule(Device device, long cookie,
                         long inPort, short inputVid, byte inputPcp,
                         long outPort, short outputVid, byte outputPcp) {
        TrafficSelector.Builder sbuilder = DefaultTrafficSelector.builder();
        TrafficTreatment.Builder tbuilder = DefaultTrafficTreatment.builder();

        VlanId outVid = VlanId.vlanId(outputVid);
        VlanId inVid = VlanId.vlanId(inputVid);

        sbuilder.matchInPort(PortNumber.portNumber(inPort))
                .matchVlanId(inVid)
                .matchVlanPcp(inputPcp);

        tbuilder.setOutput(PortNumber.portNumber(outPort))
                .setVlanId(outVid)
                .setVlanPcp(outputPcp);

        TrafficSelector selector = sbuilder.build();
        TrafficTreatment treatement = tbuilder.build();

        log.debug("buildFlowRule(): Build flow rule for device {}", device.id());
        FlowRule flowRule = DefaultFlowRule.builder()
                .forDevice(device.id())
                .withSelector(selector)
                .withTreatment(treatement)
                .withPriority(100)
                .fromApp(appId)
                .makePermanent()
                .withCookie(cookie)
                .build();
        log.debug("buildFlowRule(): Flow rule was built for device {}", device.id());

        return flowRule;
    }

    private void addFlow(Device device, long cookie,
                         long inPort, short inputVid, byte inputPcp,
                         long outPort, short outputVid, byte outputPcp) {

        FlowRule flowRule = buildFlowRule(device, cookie,
                             inPort, inputVid, inputPcp,
                             outPort, outputVid, outputPcp);
        flowRuleService.applyFlowRules(flowRule);
        log.info("addFlow(): Flow vid {} was added to device port {}/{}-{}",
            inputVid, device.id(), inPort, outPort);
    }

    private void removeFlow(Device device, long cookie,
                         long inPort, short inputVid, byte inputPcp,
                         long outPort, short outputVid, byte outputPcp) {

        log.debug("removeFlow(): Remove flow vid {} from device port {}/{}-{}",
            inputVid, device.id(), inPort, outPort);
        FlowRule flowRule = buildFlowRule(device, cookie,
                             inPort, inputVid, inputPcp,
                             outPort, outputVid, outputPcp);
        flowRuleService.removeFlowRules(flowRule);
        log.info("removeFlow(): Flow vid {} was removed from device port {}/{}-{}",
            inputVid, device.id(), inPort, outPort);
    }

    private void operateFlow(Device device, long mwPortNum, boolean add, boolean flow1) {
        long ethPortNum = getEthPort(device);

        if (mwPortNum == 0 || ethPortNum == 0)
        {
            log.error("operateFlow(): Flow Ports are not found for device {}", device.id());
            return;
        }

        long cookie = (flow1) ? 11 : 12;
        short vid = (short)(cookie + 200);
        byte pcp = 0;
        if (add){
            addFlow(device, cookie, mwPortNum, vid, pcp, ethPortNum, vid, pcp);
//            addFlow(device, cookie, ethPortNum, vid, pcp, mwPortNum, vid, pcp);
        }
        else {
            removeFlow(device, cookie, mwPortNum, vid, pcp, ethPortNum, vid, pcp);
//            removeFlow(device, cookie, ethPortNum, vid, pcp, mwPortNum, vid, pcp);
        }

    }

    // Checks the utilization annotation and disables/enables the relevant ports
    private void initFlows(InternalData portInternalData) {
        Device device = portInternalData.device();
        InternalData matePortInternalData = getInternalData(device, portInternalData.mateMwPort());
        if (matePortInternalData == null) {
            return;
        }
        // create flow1 on the given MW port
        operateFlow(device, portInternalData.port().number().toLong(), true, true); // add, flow1
        portInternalData.setFlow1Created(true);
        // create flow2 on the mate MW port
        operateFlow(device, matePortInternalData.port().number().toLong(), true, false); // add, flow2
        matePortInternalData.setFlow2Created(true);

        portInternalData.setFlowsFirstCreated(true);
        matePortInternalData.setFlowsFirstCreated(true);
    }

    private void removeCreatedFlows() {
        if (internalDb.size() != 0) {
            for (InternalData portInternalData : internalDb) {
                if (portInternalData.flow1Created()) {
                    operateFlow(portInternalData.device(), portInternalData.port().number().toLong(), false, true); // remove, flow1
                    portInternalData.setFlow1Created(false);
                }
                if (portInternalData.flow2Created()) {
                    operateFlow(portInternalData.device(), portInternalData.port().number().toLong(), false, false); // remove, flow2
                    portInternalData.setFlow1Created(false);
                }
                // Unmute the port
                sendWirelessPortMod(portInternalData.device.id(), portInternalData.port(), false);
                portInternalData.setPortMute(false);
            }
        }
    }

    public long getMwPortPrim(Device device) {
        long port = 0;
        if (device.annotations().value(WIRELESS_PORT_PRIM) != null) {
            port = Integer.valueOf(device.annotations().value(WIRELESS_PORT_PRIM)).longValue();
        }
        return port;
    }
    public long getMwPortSec(Device device) {
        long port = 0;
        if (device.annotations().value(WIRELESS_PORT_SEC) != null) {
            port = Integer.valueOf(device.annotations().value(WIRELESS_PORT_SEC)).longValue();
        }
        return port;
    }
    public long getEthPort(Device device) {
        long port = 0;
        if (device.annotations().value(ETH_PORT) != null) {
            port = Integer.valueOf(device.annotations().value(ETH_PORT)).longValue();
        }
        return port;
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
                        annotatePortByMwParams(dpid, (OFWirelessMultipartPortsReply) msg);
                    }
                    break;
            }
        }

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
        } // annotatePortByMwParams

        private long getTxCurrCapacityFromReplyPort(OFExperimenterPortWireless msgPort) {
            long value = 0;
            List<OFPortDescPropWirelessTransport> props = msgPort.getProperties();
            for (OFPortDescPropWirelessTransport prop : props) {
                List<OFWirelessTransportPortFeatureHeader> features = prop.getFeatures();
                for (OFWirelessTransportPortFeatureHeader feature : features) {
                    if (feature.getType() == 2) { // (OFWirelessTransportInterfacePropParamTypes.TX_CURRENT_CAPACITY)
                        value = ((OFWirelessTxCurrentCapacity)feature).getTxCurrentCapacity().getValue();
                        log.debug("getTxCurrCapacityFromReplyIfc(): TxCurrCapacity {}", value);
                        return value;
                    }
                }
            }
            log.info("getTxCurrCapacityFromReplyIfc(): TxMaxCapacity not found");
            return value;
        }

    } // class InternalOpenFlowListener

    private class InternalData {
        private Device device;
        private Port port;
        private Port mateMwPort;
        private Port ethPort;
        private long txUtilizedCapacity;
        private long prevRxBytes;
        private long prevTxBytes;
        private long prevTimeMs;
        private long prevUtilization;
        private boolean portMute;
        private boolean flowsFirstCreated;
        private boolean flow1Created;
        private boolean flow2Created;

        public InternalData(Device device, Port port, Port mateMwPort, Port ethPort ) {
            this.device = device;
            this.port = port;
            this.mateMwPort = mateMwPort;
            this.ethPort = ethPort;
            this.txUtilizedCapacity = 0;
            this.prevRxBytes = 0;
            this.prevTxBytes = 0;
            this.prevTimeMs = 0;
            this.prevUtilization = 0;
            this.portMute = false;
            this.flowsFirstCreated = false;
            this.flow1Created = false;
            this.flow2Created = false;
        }

        public InternalData(InternalData data) {
            device = data.device;
            port = data.port;
            mateMwPort = data.mateMwPort;
            ethPort = data.ethPort;
            txUtilizedCapacity = data.txUtilizedCapacity;
            prevRxBytes = data.prevRxBytes;
            prevTxBytes = data.prevTxBytes;
            prevTimeMs = data.prevTimeMs;
            prevUtilization = data.prevUtilization;
            portMute = data.portMute;
            flowsFirstCreated = data.flowsFirstCreated;
            flow1Created = data.flow1Created;
            flow2Created = data.flow2Created;
        }

        public Device device() {
            return device;
        }
        public Port port() {
            return port;
        }
        public Port mateMwPort() {
            return mateMwPort;
        }
        public Port ethPort() {
            return ethPort;
        }
        public long txUtilizedCapacity() {
            return txUtilizedCapacity;
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
        public boolean flowsFirstCreated() {
            return flowsFirstCreated;
        }
        public boolean flow1Created() {
            return flow1Created;
        }
        public boolean flow2Created() {
            return flow2Created;
        }

        // Set functions
        public void setTxUtilizedCapacity(long txUtilizedCapacity) {
            this.txUtilizedCapacity = txUtilizedCapacity;
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
        public void setFlowsFirstCreated(boolean flowsFirstCreated) {
            this.flowsFirstCreated = flowsFirstCreated;
        }
        public void setFlow1Created(boolean flow1Created) {
            this.flow1Created = flow1Created;
        }
        public void setFlow2Created(boolean flow2Created) {
            this.flow2Created = flow2Created;
        }
    }

    private InternalData getInternalData(Device device, Port port) {
        long mwPrim = getMwPortPrim(device);
        long mwSec = getMwPortSec(device);
        if (mwPrim == 0 && mwSec == 0) {
            return null; // This device is not wireless
        }
        long eth = getEthPort(device);
        if (eth == 0) {
            log.error("getInternalData(): No eth port annotation for device {}", device.id());
            return null;
        }
        if (mwPrim != port.number().toLong() && mwSec != port.number().toLong()) {
            // Not wireless port
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
        PortNumber matePNum = (port.number().toLong() == mwPrim) ?
                        PortNumber.portNumber(mwSec) : PortNumber.portNumber(mwPrim);
        Port mateP = store.getPort(device.id(), matePNum);
        Port ethP = store.getPort(device.id(), PortNumber.portNumber(eth));
        if (mateP == null || ethP == null) {
            log.error("getInternalData(): Either mate-mw or eth port not found for device {}", device.id());
            return null;
        }

        InternalData newData = new InternalData(device, port, mateP, ethP);
        // Save the new data element in the internal DB
        internalDb.add(newData);
        log.info("getInternalData(): New data element added for device {}, port {}, mateP {}, ethP {}",
            device.id(), port.number(), mateP.number(), ethP.number());

        return newData;
    }

    private boolean isDeviceWireless(Device device) {
        boolean isWireless = true;
        long mwPrim = getMwPortPrim(device);
        long mwSec = getMwPortSec(device);
        long ethPort = getEthPort(device);
        if (mwPrim == 0 || mwSec == 0 || ethPort == 0) {
            isWireless = false;
        }
        return isWireless;
    }

    private void printInternalDb() {
        if (internalDb.size() != 0) {
            for (InternalData data : internalDb) {
                log.debug("printInternalDb(): ----- Internal data: device={}, port={}, mateMwPort={}, ethPort={}, txUtilizedCapacity={}, prevUtilization={}, portMute={}, flowsFirstCreated={}, flow1Created={}, flow2Created={} ",                    data.device().id(),
                    data.port().number(),
                    data.mateMwPort().number(),
                    data.ethPort().number(),
                    data.txUtilizedCapacity(),
                    data.prevUtilization(),
                    data.portMute() ? "true" : "false",
                    data.flowsFirstCreated() ? "true" : "false",
                    data.flow1Created() ? "true" : "false",
                    data.flow2Created() ? "true" : "false");
            }
        }
    }

} // class WirelessDeviceProvider
