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

package onosproject.wireless.shape;

import com.google.common.collect.Collections2;
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
import org.onosproject.net.Device;
import org.onosproject.net.DeviceId;
import org.onosproject.net.device.DeviceEvent;
import org.onosproject.net.device.DeviceListener;
import org.onosproject.net.device.DeviceService;
import org.onosproject.net.meter.Band;
import org.onosproject.net.meter.DefaultBand;
import org.onosproject.net.meter.DefaultMeterRequest;
import org.onosproject.net.meter.Meter;
import org.onosproject.net.meter.MeterId;
import org.onosproject.net.meter.MeterOperation;
import org.onosproject.net.meter.MeterRequest;
import org.onosproject.net.meter.MeterService;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowSwitch;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.Collections;
import java.util.Dictionary;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import static com.google.common.base.Strings.isNullOrEmpty;

@Component(immediate = true)
public class WirelessFlowShape {
    Logger log = LoggerFactory.getLogger(getClass());
    private static final int DEFAULT_MAX_THRESHOLD = 100;
    private static final int DEFAULT_MIN_THRESHOLD = 10;
    private static final int DEFAULT_NUMBER = 1;
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

    private int curMaxNumber = 0;

    private int curMinNumber = 0;

    private static final String DEVICE_IS_WIRELESS = "device-is-wireless";

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected DeviceService deviceService;
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected OpenFlowController controller;
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected CoreService coreService;
    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected ComponentConfigService cfgService;

    @Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY)
    protected MeterService meterService;

    private final AtomicInteger meterIdAtomic = new AtomicInteger(1);
    private Map<Long, PortCapacityCollector> collectors = Maps.newHashMap();
    private final DeviceListener listener = new InternalDeviceListener();
    private ApplicationId appId;

    @Activate
    public void activate(ComponentContext context) {
        modified(context);
        cfgService.registerProperties(getClass());
        appId = coreService.registerApplication("org.onosproject.wireless.shape");
        deviceService.addListener(listener);
        log.info(String.valueOf(controller.getSwitches()));
        controller.getSwitches().forEach((sw -> createPortStatsCollection(sw)));
        log.info(String.valueOf(controller.getSwitches()));
        log.info("Started" + appId.id());
    }

    @Deactivate
    public void deactivate(ComponentContext context) {
        deviceService.removeListener(listener);
        collectors.values().forEach(PortCapacityCollector::stop);
        log.info("Stopped");
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

    private void anaysisCapacity(long txCurrCapacity) {
        if (txCurrCapacity > (shapeMaxThreshold)) {
            curMaxNumber++;
            if (curMaxNumber < shakeNumber) {
                return;
            }
            applyPolicyToRouters(shapeMaxThreshold, MeterOperation.Type.REMOVE);
            curMaxNumber = 0;
        } else if (txCurrCapacity < (shapeMinThreshold)) {
            curMinNumber++;
            if (curMinNumber < shakeNumber) {
                return;
            }
            applyPolicyToRouters(shapeMinThreshold, MeterOperation.Type.ADD);
            curMinNumber = 0;
        }
    }

    private void applyPolicyToRouters(long capacity, MeterOperation.Type opType) {

        deviceService.getAvailableDevices().forEach(device -> {
            if (device.type() == Device.Type.ROUTER) {
                applePolicy(device.id(), capacity, opType);
            }
        });
    }


    private void applePolicy(DeviceId deviceId, long capacity, MeterOperation.Type opType) {
        Band band = DefaultBand.builder()
                .ofType(Band.Type.DROP)
                .withRate(capacity)
                .build();
        MeterRequest.Builder request = DefaultMeterRequest.builder()
                .forDevice(deviceId)
                .fromApp(coreService.registerApplication(appId.name()))
                .withUnit(Meter.Unit.KB_PER_SEC)
                .withBands(Collections.singleton(band));

        switch (opType) {
            case ADD:
                meterService.submit(request.add());
                break;
            case REMOVE:
                Collection<Meter> meters = meterService.getAllMeters();
                Collection<Meter> devMeters = Collections2.filter(meters,
                                                                  m -> m.deviceId().equals(deviceId));
                devMeters.forEach(meter -> meterService.withdraw(request.remove(), meter.id()));
                break;
            case MODIFY:
                break;
            default:
                log.warn("Unknown Meter command {}; not sending anything", opType);
        }
    }

    private class InternalDeviceListener implements DeviceListener {

        @Override
        public void event(DeviceEvent event) {
            log.info("Device Event");
            final Device device = event.subject();
            if (event.type() == DeviceEvent.Type.PORT_UPDATED) {
                if (isNullOrEmpty(device.annotations().value(DEVICE_IS_WIRELESS))) {
                    return;
                }
                deviceService.getPorts(device.id()).forEach(port -> {
                    String txCurrCapacity = port.annotations().value("WIRELESS_TX_CURR_CAPACITY");
                    log.info("txCurrCapacity----->" + txCurrCapacity);
                    if (!isNullOrEmpty(txCurrCapacity)) {
                        anaysisCapacity(Long.parseLong(txCurrCapacity));
                    }

                });
            }
        }
    }

}
