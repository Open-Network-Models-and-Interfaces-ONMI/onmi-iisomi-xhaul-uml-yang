/*
 * Copyright (c) 2017 Frinx s.r.o. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import java.util.ArrayList;
import java.util.List;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwEthernetContainerPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.air._interface.capability.g.SupportedChannelPlanList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.channel.plan.type.g.TransmissionModeList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WirelessPowerCalculator {
    private static Long lastTxEthernetBytesMaxS1 = -1l;
    private static Long lastTxEthernetBytesMaxS2 = -1l;
    private static final Logger LOG = LoggerFactory.getLogger(WirelessPowerCalculator.class);

    public static final double THROUGHPUT_MARGIN_RATE_HIGH = 8/10.0; /* protecting margin level high */
    public static final double THROUGHPUT_MARGIN_RATE_LOW = 5/10.0; /* protecting margin level low */
    public static final int RX_LEVEL_QUARANTEE = 10;

    private final MwAirInterfacePac air;
    private final MwEthernetContainerPac eth;
    private WirelessPowerControlImpl impl;

    public WirelessPowerCalculator(MwAirInterfacePac airInterfacePac, MwEthernetContainerPac ethernetContainerPac, WirelessPowerControlImpl impl) {
        this.air = airInterfacePac;
        this.eth = ethernetContainerPac;
        this.impl = impl;
    }

    public void calc() {
        LOG.info("WirelessPowerCalculator start");
        eth.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList().sort((t1, t2) -> t1.getPeriodEndTime().getValue().compareTo(t2.getPeriodEndTime().getValue()));

        Long histPerfCapacity1 = eth.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList().get(0).getPerformanceData().getTxEthernetBytesSum() * 8;
        Long histPerfCapacity2 = eth.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList().get(1).getPerformanceData().getTxEthernetBytesSum() * 8;

//        if (lastTxEthernetBytesMaxS1.equals(histPerfCapacity1) && lastTxEthernetBytesMaxS2.equals(histPerfCapacity2)) {
//            return;
//        }
        lastTxEthernetBytesMaxS1 = histPerfCapacity1;
        lastTxEthernetBytesMaxS2 = histPerfCapacity2;

        LOG.info("Historical Data has been changed. Algorithm will be applied");

        byte txPower = air.getAirInterfaceConfiguration().getTxPower();

        LOG.info("Current modulation MIN: {} ", air.getAirInterfaceConfiguration().getModulationMin());
        LOG.info("Current txPower: {} ", txPower);

        TransmissionModelContainer transmissionModelContainer = calculateTransmissionModel();
        TransmissionModelItem currentTransmissionMode = transmissionModelContainer.findTransmissionMode(air.getAirInterfaceStatus().getModulationCur(), air.getAirInterfaceStatus().getCodeRateCur());

        LOG.info("Current trans. mode: {} ", currentTransmissionMode.getInnerItem().getTransmissionModeId().getValue());

        Long currentPerfCapacity1 = eth.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList().get(0).getPerformanceData().getTxEthernetBytesSum() * 8;
        Long currentPerfCapacity2 = eth.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList().get(1).getPerformanceData().getTxEthernetBytesSum() * 8;
        Long currentPerfCapacity3 = eth.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList().get(2).getPerformanceData().getTxEthernetBytesSum() * 8;



        long currentCapacity = (int) (currentTransmissionMode.getCapacity() * THROUGHPUT_MARGIN_RATE_LOW);
        if (histPerfCapacity1 < currentCapacity &&
                histPerfCapacity2 < currentCapacity &&
                currentPerfCapacity1 < currentCapacity &&
                currentPerfCapacity2 < currentCapacity &&
                currentPerfCapacity3 < currentCapacity
        ) {
            TransmissionModelItem newTransmissionMode = transmissionModelContainer.findTheLowestTransmissionMode(currentPerfCapacity3);

            LOG.info("New trans. mode: {} ", newTransmissionMode.getInnerItem().getTransmissionModeId().getValue());

            Short modulationMin = newTransmissionMode.getInnerItem().getModulationScheme();
            mergeAirConfiguration(modulationMin, txPower); // store new modulation
            LOG.info("New modulationMin: {} ", modulationMin);

            int expectedRxLevel = newTransmissionMode.getInnerItem().getRxThreshold() + RX_LEVEL_QUARANTEE;
            byte txPowerMin = currentTransmissionMode.getInnerItem().getTxPowerMin();


            Simulator simulator = new Simulator(expectedRxLevel, true);
            while (simulator.getRemoteAirRxLevel() > expectedRxLevel && air.getAirInterfaceStatus().getTxLevelCur()  > txPowerMin) {
                if (txPower > 0) {
                    txPower--;
                }
                mergeAirConfiguration(modulationMin,txPower); //store new power
                LOG.info("New power: {} ", txPower);
            }
        }

        if (currentPerfCapacity3 > currentCapacity) {
            TransmissionModelItem newTransmissionMode = transmissionModelContainer.findTheLowestTransmissionMode(currentPerfCapacity3);
            LOG.info("New trans. mode: {} ", newTransmissionMode.getInnerItem().getTransmissionModeId().getValue());

            Short modulationMin = newTransmissionMode.getInnerItem().getModulationScheme();
            mergeAirConfiguration(modulationMin, txPower);
            LOG.info("New modulationMin: {} ", modulationMin);

            int expectedRxLevel = newTransmissionMode.getInnerItem().getRxThreshold() + RX_LEVEL_QUARANTEE;
            byte txPowerMax = currentTransmissionMode.getInnerItem().getTxPowerMax();

            Simulator simulator = new Simulator(expectedRxLevel, false);
            while (simulator.getRemoteAirRxLevel() < expectedRxLevel && air.getAirInterfaceStatus().getTxLevelCur()  < txPowerMax) {
                if (txPower < 127) {
                    txPower++;
                }
                mergeAirConfiguration(modulationMin, txPower);
                LOG.info("New power: {} ", txPower);
            }
        }


    }

    private TransmissionModelContainer calculateTransmissionModel() {
        TransmissionModelContainer transmissionModelContainer = new TransmissionModelContainer();
        for (SupportedChannelPlanList supportedChannelPlanList :  air.getAirInterfaceCapability().getSupportedChannelPlanList()) {
            if (supportedChannelPlanList.getTransmissionModeList() == null) {
                continue;
            }

            for (TransmissionModeList transmissionModeList : supportedChannelPlanList.getTransmissionModeList()) {
                transmissionModelContainer.add(transmissionModeList);
            }
        }

        transmissionModelContainer.orderItems();
        return transmissionModelContainer;
    }

    public void mergeAirConfiguration(short modulationMin, byte txPower) {
        AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(air.getAirInterfaceConfiguration());
        configurationBuilder.setTxPower(txPower);
        configurationBuilder.setModulationMin(modulationMin);
        impl.merge(configurationBuilder.build());
        wait1seconds();
    }

    private void wait1seconds() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static double log2( double a) {
        return Math.log(a) / Math.log(2);
    }
}

class TransmissionModelContainer {
    private List<TransmissionModelItem> itemList;

    public TransmissionModelItem findTransmissionMode(Short modulationCur, Byte codeRateCur) {
        for (TransmissionModelItem item : itemList) {
            if (item.getInnerItem().getModulationScheme().equals(modulationCur) && item.getInnerItem().getCodeRate().equals(codeRateCur)) {
                return item;
            }
        }
        if (itemList.size() > 0) { // if we don't find, we select the first one
            return itemList.get(0);
        }
        return null;
    }

    public TransmissionModelItem findTheLowestTransmissionMode(long currentCapacity) {
        for (TransmissionModelItem item : itemList) {
            if (currentCapacity < item.getCapacity() * WirelessPowerCalculator.THROUGHPUT_MARGIN_RATE_HIGH) {
                return item;
            }
        }
        if (itemList.size() > 0) { // if we don't find, we select the first one
            return itemList.get(0);
        }
        return null;
    }

    public TransmissionModelContainer() {
        itemList = new ArrayList<>();
    }

    public void add(TransmissionModeList item) {
        itemList.add(new TransmissionModelItem(item,calculateCapacity(item)));
    }



    private Integer calculateCapacity(TransmissionModeList item) {
        return (int)(item.getChannelBandwidth()*WirelessPowerCalculator.log2(item.getModulationScheme()) * item.getCodeRate());
    }

    public void orderItems() {
        itemList.sort((transmissionModelItem, t1) -> transmissionModelItem.getCapacity().compareTo(t1.getCapacity()));
    }
}

class TransmissionModelItem   {

    public TransmissionModelItem(TransmissionModeList innerItem, Integer capacity) {
        this.innerItem = innerItem;
        this.capacity = capacity;
    }

    private TransmissionModeList innerItem;
    private Integer capacity;

    public TransmissionModeList getInnerItem() {
        return innerItem;
    }

    public Integer getCapacity() {
        return capacity;
    }
}

class Simulator {
    private static final int COUNT_STEP = 3;
    int currentStep;
    int expectedRxLevel;
    boolean isSimulateGreaterValue;

    public Simulator(int expectedRxLevel, boolean isSimulateGreaterValue) {
        this.expectedRxLevel = expectedRxLevel;
        this.isSimulateGreaterValue = isSimulateGreaterValue;
        this.currentStep = 0;
    }

    public int getRemoteAirRxLevel() {
        currentStep++;
        if (COUNT_STEP == currentStep) {
            return isSimulateGreaterValue ? expectedRxLevel -1 :  expectedRxLevel + 1;
        }
        return isSimulateGreaterValue ? expectedRxLevel + 1 :  expectedRxLevel - 1;
    }



}
