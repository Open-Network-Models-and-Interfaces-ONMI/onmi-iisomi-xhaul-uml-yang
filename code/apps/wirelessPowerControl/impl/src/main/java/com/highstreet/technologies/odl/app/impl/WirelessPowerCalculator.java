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
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePacBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwEthernetContainerPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.air._interface.capability.g.SupportedChannelPlanList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.channel.plan.type.g.TransmissionModeList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WirelessPowerCalculator {
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
        LOG.info("Current modulation MIN: {} ", air.getAirInterfaceConfiguration().getModulationMin());
        LOG.info("Current txPower: {} ", air.getAirInterfaceConfiguration().getTxPower());

        TransmissionModelContainer transmissionModelContainer = calculateTransmissionModel();
        TransmissionModelItem currentTransmissionMode = transmissionModelContainer.findTransmissionMode(air.getAirInterfaceStatus().getModulationCur(), air.getAirInterfaceStatus().getCodeRateCur());

        LOG.info("Current trans. mode: {} ", currentTransmissionMode.getInnerItem().getTransmissionModeId().getValue());

        Integer currentPerfCapacity1 = eth.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList().get(0).getPerformanceData().getTxEthernetBytesMaxS() * 8;
        Integer currentPerfCapacity2 = eth.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList().get(1).getPerformanceData().getTxEthernetBytesMaxS() * 8;
        Integer currentPerfCapacity3 = eth.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList().get(2).getPerformanceData().getTxEthernetBytesMaxS() * 8;

        Integer histPerfCapacity1 = eth.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList().get(0).getPerformanceData().getTxEthernetBytesMaxS() * 8;
        Integer histPerfCapacity2 = eth.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList().get(1).getPerformanceData().getTxEthernetBytesMaxS() * 8;

        int currentCapacity = (int) (currentTransmissionMode.getCapacity() * THROUGHPUT_MARGIN_RATE_LOW / 1000);
        if (histPerfCapacity1 < currentCapacity &&
                histPerfCapacity2 < currentCapacity &&
                currentPerfCapacity1 < currentCapacity &&
                currentPerfCapacity2 < currentCapacity &&
                currentPerfCapacity3 < currentCapacity
        ) {
            TransmissionModelItem newTransmissionMode = transmissionModelContainer.findTheLowestTransmissionMode(currentPerfCapacity3);

            LOG.info("New trans. mode: {} ", newTransmissionMode.getInnerItem().getTransmissionModeId().getValue());

            Short modulationMin = newTransmissionMode.getInnerItem().getModulationScheme();
            mergeModulationMin(modulationMin); // store new modulation

            int expectedRxLevel = newTransmissionMode.getInnerItem().getRxThreshold() + RX_LEVEL_QUARANTEE;
            byte txPowerMin = currentTransmissionMode.getInnerItem().getTxPowerMin();
            byte txPower = air.getAirInterfaceConfiguration().getTxPower();

            Simulator simulator = new Simulator(expectedRxLevel, true);
            while (simulator.getRemoteAirRxLevel() > expectedRxLevel && air.getAirInterfaceStatus().getTxLevelCur()  > txPowerMin) {
                txPower--;
                mergeTxPower(txPower); //store new power
            }
        }

        if (currentPerfCapacity3 > currentCapacity) {
            TransmissionModelItem newTransmissionMode = transmissionModelContainer.findTheLowestTransmissionMode(currentPerfCapacity3);
            LOG.info("New trans. mode: {} ", newTransmissionMode.getInnerItem().getTransmissionModeId().getValue());

            Short modulationMin = newTransmissionMode.getInnerItem().getModulationScheme();
            mergeModulationMin(modulationMin);

            int expectedRxLevel = newTransmissionMode.getInnerItem().getRxThreshold() + RX_LEVEL_QUARANTEE;
            byte txPowerMax = currentTransmissionMode.getInnerItem().getTxPowerMax();
            byte txPower = air.getAirInterfaceConfiguration().getTxPower();

            Simulator simulator = new Simulator(expectedRxLevel, false);
            while (simulator.getRemoteAirRxLevel() < expectedRxLevel && air.getAirInterfaceStatus().getTxLevelCur()  < txPowerMax) {
                txPower++;
                mergeTxPower(txPower);
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


    public void mergeModulationMin(short modulationMin) {
        LOG.info("New modulation MIN: {} ", modulationMin);
        AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(air.getAirInterfaceConfiguration());
        configurationBuilder.setModulationMin(modulationMin);
        impl.merge(configurationBuilder.build());
        wait3seconds();
    }

    public void mergeTxPower(byte txPower) {
        LOG.info("New power: {} ", txPower);
        AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(air.getAirInterfaceConfiguration());
        configurationBuilder.setTxPower(txPower);
        impl.merge(configurationBuilder.build());
        wait3seconds();
    }

    private void wait3seconds() {
        try {
            Thread.sleep(3000);
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
        return null;
    }

    public TransmissionModelItem findTheLowestTransmissionMode(Integer currentCapacity) {
        for (TransmissionModelItem item : itemList) {
            if (currentCapacity < item.getCapacity() * WirelessPowerCalculator.THROUGHPUT_MARGIN_RATE_HIGH) {
                return item;
            }
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
