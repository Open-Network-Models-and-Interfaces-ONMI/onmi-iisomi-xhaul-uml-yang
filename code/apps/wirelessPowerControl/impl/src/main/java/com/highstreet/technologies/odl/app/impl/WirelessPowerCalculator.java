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
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.GranularityPeriodType;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwEthernetContainerPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.air._interface.capability.g.SupportedChannelPlanList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.channel.plan.type.g.TransmissionModeList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ethernet.container.current.performance.g.CurrentPerformanceDataList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ethernet.container.historical.performances.g.HistoricalPerformanceDataList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WirelessPowerCalculator {
    private static boolean firstTime = true;
    private static final Logger LOG = LoggerFactory.getLogger(WirelessPowerCalculator.class);

    public static final double THROUGHPUT_MARGIN_RATE_HIGH = 8/10.0; /* protecting margin level high */
    public static final double THROUGHPUT_MARGIN_RATE_LOW = 5/10.0; /* protecting margin level low */

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

//        "period-15-min";

        List<HistoricalPerformanceDataList> historicalPerfomanceList = new ArrayList<>();

        for (HistoricalPerformanceDataList item : eth.getEthernetContainerHistoricalPerformances().getHistoricalPerformanceDataList()) {
            if (GranularityPeriodType.Period15Min.equals(item.getGranularityPeriod())) {
                historicalPerfomanceList.add(item);
            }
        }
        historicalPerfomanceList.sort((t1, t2) -> t2.getPeriodEndTime().getValue().compareTo(t1.getPeriodEndTime().getValue()));

        if (!firstTime && historicalPerfomanceList.size() > 1) {
            Long histPerfCapacity1 = historicalPerfomanceList.get(0).getPerformanceData().getTxEthernetBytesSum();
            Long histPerfCapacity2 = historicalPerfomanceList.get(1).getPerformanceData().getTxEthernetBytesSum();
            if (histPerfCapacity1.equals(histPerfCapacity2)) {
                return;
            }
        }

        LOG.info("Historical Data has been changed. Algorithm will be applied");

        List<CurrentPerformanceDataList> currentPerfomanceList = new ArrayList<>();
        for (CurrentPerformanceDataList item : eth.getEthernetContainerCurrentPerformance().getCurrentPerformanceDataList()) {
            if (GranularityPeriodType.Period15Min.equals(item.getGranularityPeriod())) {
                currentPerfomanceList.add(item);
            }
        }

        if (currentPerfomanceList.isEmpty()) {
            LOG.info("Current perfomance is empty");
            return;
        }


        byte txPower = air.getAirInterfaceConfiguration().getTxPower();
        LOG.info("Current txPower: {} ", txPower);

        Double currentPerfCapacity = currentPerfomanceList.get(0).getPerformanceData().getTxEthernetBytesSum() * 8 / 15 / 60 / 1000000.0;
        Double currentCapacity = air.getAirInterfaceConfiguration().getTxChannelBandwidth() * log2(air.getAirInterfaceStatus().getModulationCur()) * air.getAirInterfaceStatus().getCodeRateCur() / 100  / 1.15 / 1000 ;

        if (currentPerfCapacity < currentCapacity * THROUGHPUT_MARGIN_RATE_HIGH) {
            if (txPower > 0) {
                txPower--;
            }
            mergeAirConfiguration(txPower);
        } else {
            if (txPower < 127) {
                txPower++;
            }
            mergeAirConfiguration(txPower);
        }

        LOG.info("New txPower: {} ", txPower);
        firstTime = false;

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

    public void mergeAirConfiguration(byte txPower) {
        AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(air.getAirInterfaceConfiguration());
        configurationBuilder.setTxPower(txPower);
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
