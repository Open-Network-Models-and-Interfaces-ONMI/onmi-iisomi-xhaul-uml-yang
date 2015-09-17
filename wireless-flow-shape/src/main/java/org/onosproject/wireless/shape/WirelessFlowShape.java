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

import com.google.common.collect.Maps;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Modified;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.onosproject.cfg.ComponentConfigService;
import org.onosproject.core.ApplicationId;
import org.onosproject.core.CoreService;
import org.onosproject.net.ConnectPoint;
import org.onosproject.net.Device;
import org.onosproject.net.DeviceId;
import org.onosproject.net.Link;
import org.onosproject.net.PortNumber;
import org.onosproject.net.device.DeviceEvent;
import org.onosproject.net.device.DeviceListener;
import org.onosproject.net.device.DeviceService;
import org.onosproject.net.flow.DefaultFlowRule;
import org.onosproject.net.flow.DefaultTrafficTreatment;
import org.onosproject.net.flow.FlowRule;
import org.onosproject.net.flow.FlowRuleService;
import org.onosproject.net.flow.TrafficTreatment;
import org.onosproject.net.flow.instructions.Instruction;
import org.onosproject.net.flow.instructions.Instructions;
import org.onosproject.net.link.LinkService;
import org.onosproject.net.meter.Band;
import org.onosproject.net.meter.DefaultBand;
import org.onosproject.net.meter.DefaultMeterRequest;
import org.onosproject.net.meter.Meter;
import org.onosproject.net.meter.MeterId;
import org.onosproject.net.meter.MeterRequest;
import org.onosproject.net.meter.MeterService;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowSwitch;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Dictionary;
import java.util.Map;
import java.util.Set;

import static com.google.common.base.Strings.isNullOrEmpty;
import static org.onosproject.net.meter.MeterOperation.Type;

@Component(immediate = true)
public class WirelessFlowShape {
    Logger log = LoggerFactory.getLogger(getClass());
    private static final int DEFAULT_MAX_THRESHOLD = 100;
    private static final int DEFAULT_MIN_THRESHOLD = 10;
    private static final int DEFAULT_NUMBER = 1;
    private static final int DEFAULT_BUFFER = 0;
    static final int POLL_INTERVAL = 10;
    @Property(name = "shapeMaxThreshold", intValue = DEFAULT_MAX_THRESHOLD,
            label = "max threshold capacity in flow based shaping")
    private int shapeMaxThreshold = DEFAULT_MAX_THRESHOLD;

    @Property(name = "shapeMinThreshold", intValue = DEFAULT_MIN_THRESHOLD,
            label = "min threshold capacity in flow based shaping")
    private int shapeMinThreshold = DEFAULT_MIN_THRESHOLD;

    @Property(name = "shakeNumber", intValue = DEFAULT_NUMBER,
            label = "the number to do flow based shaping")
    private int shakeNumber = DEFAULT_NUMBER;

    @Property(name = "bufferValue", intValue = DEFAULT_BUFFER,
            label = "the buffer value to do flow based shaping")
    private int bufferValue = DEFAULT_BUFFER;

    private int curMaxNumber = 0;

    private int curMinNumber = 0;

    private static final String WIRELESS_PORT_LAG = "wireless-port-lag";
    private static final String WIRELESS_PORT_SEC = "wireless-port-sec";
    private static final String WIRELESS_PORT_PRIM = "wireless-port-prim";
    private static final String WIRELESS_TX_CURR_CAPACITY = "wireless-tx-curr-capacity";
    private static final String ETH_PORT = "eth-port";

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceService deviceService;
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected OpenFlowController controller;
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected CoreService coreService;
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected ComponentConfigService cfgService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected FlowRuleService flowService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected MeterService meterService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected LinkService linkService;
//    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    //   protected OpenflowController14 controller14;

    private Map<Long, PortCapacityCollector> collectors = Maps.newHashMap();
    private final DeviceListener listener = new InternalDeviceListener();
    private final Map<DeviceId, FlowRule> flowRuleMap = Maps.newHashMap();
    private ApplicationId appId;


    @Activate
    public void activate(ComponentContext context) {
        cfgService.registerProperties(getClass());
        appId = coreService.registerApplication("org.onosproject.wireless.shape");
        deviceService.addListener(listener);
        controller.getSwitches().forEach((this::createPortStatsCollection));
        log.info("Started");
    }

    @Deactivate
    public void deactivate(ComponentContext context) {
        deviceService.removeListener(listener);
        collectors.values().forEach(PortCapacityCollector::stop);
        log.info("Stopped");
    }

    private int switchNum(Iterable<OpenFlowSwitch> it) {
        int i = 0;
        for (OpenFlowSwitch o : it) {
            i++;
        }
        return i;
    }

    @Modified
    public void modified(ComponentContext context) {
        readComponentConfiguration(context);
    }

    /**
     * Extracts properties from the component configuration context.
     *
     * @param context the component context
     */
    private void readComponentConfiguration(ComponentContext context) {
        Dictionary<?, ?> properties = context.getProperties();
        Integer shapeMaxThresholdConfig = getIntegerProperty(properties, "shapeMaxThreshold");
        Integer shapeMinThresholdConfig = getIntegerProperty(properties, "shapeMinThreshold");
        Integer shakeNumberConfig = getIntegerProperty(properties, "shakeNumber");
        Integer bufferValueConfig = getIntegerProperty(properties, "bufferNumber");


        if (shapeMaxThresholdConfig == null) {
            log.info("Max shape threshold is not configured, default value is {}",
                     shapeMaxThreshold);
        } else {
            shapeMaxThreshold = shapeMaxThresholdConfig;
            log.info("Configured. Max shape threshold is configured to {}",
                     shapeMaxThreshold, " M");
        }

        if (shapeMinThresholdConfig == null) {
            log.info("Max shape threshold is not configured, default value is {}",
                     shapeMinThreshold);
        } else {
            shapeMinThreshold = shapeMinThresholdConfig;
            log.info("Configured. Max shape threshold is configured to {}",
                     shapeMinThreshold, " M");
        }
        if (shakeNumberConfig == null) {
            log.info("shakeNumber is not configured, default value is {}",
                     shakeNumber);
        } else {
            shakeNumber = shakeNumberConfig;
            log.info("shakeNumber is configured to {}",
                     shakeNumber);
        }
        if (bufferValueConfig == null) {
            log.info("bufferNumber is not configured, default value is {}",
                     bufferValue);
        } else {
            bufferValue = bufferValueConfig;
            log.info("bufferNumber is configured to {}",
                     bufferValue);
        }
    }

    /**
     * Get Integer property from the propertyName
     * Return null if propertyName is not found.
     *
     * @param properties   properties to be looked up
     * @param propertyName the name of the property to look up
     * @return value when the propertyName is defined or return null
     */
    private static Integer getIntegerProperty(Dictionary<?, ?> properties,
                                              String propertyName) {
        Integer value = null;
        try {
            String s = (String) properties.get(propertyName);
            value = isNullOrEmpty(s) ? value : Integer.parseInt(s.trim());
        } catch (NumberFormatException | ClassCastException e) {
            value = null;
        }
        return value;
    }

    private void createPortStatsCollection(OpenFlowSwitch sw) {
        PortCapacityCollector collector = new PortCapacityCollector(sw, POLL_INTERVAL);
        log.info("create collection");
        collector.start();
        collectors.put(sw.getId(), collector);
    }

    /**
     * analysis the capacity of the device,
     * if the txCurrCapacity is less than shapeMinThreshold after shakeNumber times, than apply meter add policy?
     * if the txCurrCapacity is larger than shapeMaxThreshold after shakeNumber times apply meter delete policy.
     *
     * @param id             device id of a MW device
     * @param txCurrCapacity tx current capacity of a MW device port
     */
    private void analysisCapacity(DeviceId id, long txCurrCapacity) {
        if (txCurrCapacity > (shapeMaxThreshold)) {
            curMaxNumber++;
            if (curMaxNumber < shakeNumber) {
                return;
            }
            applyPolicyToRouters(id, shapeMaxThreshold, Type.REMOVE);
            curMaxNumber = 0;
        } else if (txCurrCapacity < (shapeMinThreshold)) {
            curMinNumber++;
            if (curMinNumber < shakeNumber) {
                return;
            }
            applyPolicyToRouters(id, (shapeMinThreshold - bufferValue), Type.ADD);
            curMinNumber = 0;
        }
    }


    private void applyPolicyToRouters(DeviceId deviceId, long capacity, Type opType) {
        FlowRule routerFlowRule = flowRuleMap.get(deviceId);
        switch (opType) {
            case ADD:
                MeterRequest request = buildMeter(routerFlowRule.deviceId(), capacity);
                Meter meterAdd = meterService.submit(request);
                if (meterAdd == null) {
                    log.info("Add meter {} for device {} failed", meterAdd.id(), meterAdd.deviceId());
                }
                log.info("add meter successfully, modify router flow started.");
                modifyRouterFlow(routerFlowRule, meterAdd.id(), opType);
                break;

            case REMOVE:
                modifyRouterFlow(routerFlowRule, null, opType);
                break;

            case MODIFY:
                break;

            default:
                log.warn("Unknown Meter command {}; not sending anything", opType);
        }
    }

    private MeterRequest buildMeter(DeviceId deviceId, long capacity) {
        Band band = DefaultBand.builder()
                .ofType(Band.Type.DROP)
                .withRate(capacity)
                .build();
        MeterRequest request = DefaultMeterRequest.builder()
                .forDevice(deviceId)
                .fromApp(coreService.registerApplication(appId.name()))
                .withUnit(Meter.Unit.KB_PER_SEC)
                .withBands(Collections.singleton(band)).add();
        return request;
    }

    private void modifyRouterFlow(FlowRule routerFlowRule, MeterId meterId, Type operation) {

        FlowRule.Builder ruleBuilder = buildFlowRule(routerFlowRule, meterId, operation);
        if (ruleBuilder == null) {
            log.info("Build flow failed.");
            return;
        }
        FlowRule newRule = ruleBuilder.build();
        flowService.applyFlowRules(newRule);
        log.info("Apply flow successfully, flow id is {}.", Long.toHexString(newRule.id().value()));
        //update the flow rule map
        flowRuleMap.put(routerFlowRule.deviceId(), routerFlowRule);
    }

    private FlowRule.Builder buildFlowRule(FlowRule routerFlowRule, MeterId meterId, Type operation) {
        FlowRule.Builder ruleBuilder;
        TrafficTreatment.Builder treatmentBuilder = DefaultTrafficTreatment
                .builder();
        if (routerFlowRule.treatment() != null) {
            for (Instruction i : routerFlowRule.treatment().allInstructions()) {
                if ((i.type() == Instruction.Type.METER) && (operation == Type.ADD)) {
                    log.info("Policy has already be set to the router {}, and meter id is {}",
                             routerFlowRule.deviceId(), meterId);
                    return null;
                } else if ((i.type() == Instruction.Type.METER) && (operation == Type.REMOVE)) {
                    continue;
                }
                treatmentBuilder.add(i);
            }
        }
        if (operation == Type.ADD) {
            treatmentBuilder.add(Instructions.meterTraffic(meterId));
        }

        ruleBuilder = DefaultFlowRule.builder()
                .fromApp(appId).withPriority(routerFlowRule.priority())
                .forDevice(routerFlowRule.deviceId())
                .forTable(routerFlowRule.tableId())
                .withSelector(routerFlowRule.selector())
                .makePermanent()
                .withTreatment(treatmentBuilder.build());
        return ruleBuilder;
    }

    public long getPortFromAnnotation(Device device, String key) {
        long port = 0;
        String value = device.annotations().value(key);
        if (!isNullOrEmpty(value)) {
            port = Integer.valueOf(value).longValue();
        }
        return port;
    }

    private boolean isDeviceWireless(Device device) {
        boolean isWireless = true;
        long mwPrim = getPortFromAnnotation(device, WIRELESS_PORT_PRIM);
        long lagPort = getPortFromAnnotation(device, WIRELESS_PORT_LAG);
        if (mwPrim == 0 || lagPort == 0) {
            isWireless = false;
        }
        return isWireless;
    }


    private FlowRule findPeerRouterRule(DeviceId deviceId, long port) {
        ConnectPoint routerPoint = null;
        ConnectPoint peerPoint = null;
        FlowRule routerFlowRule;
        ConnectPoint connectPoint = new ConnectPoint(deviceId, PortNumber.portNumber(port));
        Set<Link> links = linkService.getDeviceLinks(deviceId);
        for (Link link : links) {
            peerPoint = link.src().deviceId().equals(deviceId) ? link.dst() : link.src();
            //search for the flow in router
            if (!isDeviceWireless(deviceService.getDevice(peerPoint.deviceId()))) {
                routerFlowRule = findRuleByOutPort(peerPoint.deviceId(), peerPoint.port().toLong());
                if (routerFlowRule != null) {
                    return routerFlowRule;
                }
            } else {
//                return findPeerConnectPoint(peerPoint.deviceId(),peerPoint.port().toLong());
                for (Link anotherLinks : linkService.getDeviceLinks(peerPoint.deviceId())) {
                    peerPoint = anotherLinks.src().equals(connectPoint) ? anotherLinks.dst() : anotherLinks.src();
                    if (!isDeviceWireless(deviceService.getDevice(peerPoint.deviceId()))) {
//                        return peerPoint;
                        routerFlowRule = findRuleByOutPort(peerPoint.deviceId(), peerPoint.port().toLong());
                        if (routerFlowRule != null) {
                            return routerFlowRule;
                        }
                    }
                }
            }
        }
        return null;
    }

    private FlowRule findRuleByOutPort(DeviceId deviceId, long port) {
        for (FlowRule flow : flowService.getFlowEntries(deviceId)) {
            for (Instruction i : flow.treatment().allInstructions()) {
                //get the direction through the flow rule
                if (i.type() == Instruction.Type.OUTPUT) {
                    long outPort = ((Instructions.OutputInstruction) i).port().toLong();
                    if (port == outPort) {
                        return flow;
                    }
                }
            }
        }
        return null;
    }

    private class InternalDeviceListener implements DeviceListener {

        @Override
        public void event(DeviceEvent event) {
            log.info("Device Event");
            final Device device = event.subject();
            if (event.type() == DeviceEvent.Type.PORT_UPDATED) {
                if (!isDeviceWireless(device)) {
                    log.info("device {} is not wireless device.", device.id());
                    return;
                }
                deviceService.getPorts(device.id()).forEach(port -> {

                    if (getPortFromAnnotation(device, WIRELESS_PORT_LAG) != port.number().toLong()) {
                        return;
                    }
                    String txCurrCapacity = port.annotations().value(WIRELESS_TX_CURR_CAPACITY);
                    log.info("txCurrCapacity-----> {}, and port number is {}", txCurrCapacity, port.number().toLong());
                    if (isNullOrEmpty(txCurrCapacity)) {
                        log.info("port {} has no annotation of WIRELESS_TX_CURR_CAPACITY", port.number().toLong());
                        return;
                    }
                    if (!flowRuleMap.keySet().contains(device.id())) {
                        FlowRule inRouterRule = findPeerRouterRule(device.id(), port.number().toLong());
                        if (inRouterRule == null) {
                            log.info("Can not find router flow for device {}", device.id());
                            return;
                        }
                        flowRuleMap.put(device.id(), inRouterRule);
                    }
                    analysisCapacity(device.id(), Long.parseLong(txCurrCapacity));

                });
            }
        }
    }
}
