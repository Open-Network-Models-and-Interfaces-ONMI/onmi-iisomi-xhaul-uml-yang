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

    private final List<MwAirInterfacePac> airList;
    private final MwEthernetContainerPac eth;
    private WirelessPowerControlImpl impl;

    public WirelessPowerCalculator(List<MwAirInterfacePac> mwAirInterfacePacList, MwEthernetContainerPac ethernetContainerPac, WirelessPowerControlImpl impl) {
        this.airList = mwAirInterfacePacList;
        this.eth = ethernetContainerPac;
        this.impl = impl;
    }

    public void calc() {
        LOG.info("WirelessPowerCalculator start");

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
            LOG.info("Historical capacity 1: {} bytes",histPerfCapacity1);
            LOG.info("Historical capacity 2: {} bytes",histPerfCapacity1);
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

        Double currentPerfCapacity = currentPerfomanceList.get(0).getPerformanceData().getTxEthernetBytesSum() * 8 / 15 / 60 / 1000000.0;
        LOG.debug("Current performance capacity of ETC: {} bytes per 15 min",currentPerfomanceList.get(0).getPerformanceData().getTxEthernetBytesSum());
        LOG.debug("Current performance capacity of ETC: {} Mbs",currentPerfCapacity);


        double mwCapacityTotal = 0.0d;
        for (MwAirInterfacePac air : airList) {
            Double mwCapacity = air.getAirInterfaceConfiguration().getTxChannelBandwidth() * log2(air.getAirInterfaceStatus().getModulationCur()) * air.getAirInterfaceStatus().getCodeRateCur() / 100  / 1.15 / 1000 ;
            mwCapacityTotal = mwCapacityTotal + mwCapacity;
            LOG.debug("Air Interface capacity {} is: {} Mbs",air.getAirInterfaceConfiguration().getAirInterfaceName(), mwCapacity);
        }

        LOG.debug("Total MWCapacity: {} Mbs",mwCapacityTotal);
        LOG.debug("Factor: {}",THROUGHPUT_MARGIN_RATE_HIGH);


        if (currentPerfCapacity < mwCapacityTotal * THROUGHPUT_MARGIN_RATE_HIGH) {
            int i = 0;
            for (MwAirInterfacePac air : airList) {
                byte txPower = air.getAirInterfaceConfiguration().getTxPower();
                LOG.info("Current txPower {} is : {} ",air.getAirInterfaceConfiguration().getAirInterfaceName(),txPower);
                if (txPower > 0) {
                    txPower--;
                }
                LOG.info("New txPower {} is : {} ",air.getAirInterfaceConfiguration().getAirInterfaceName(),txPower);
                mergeAirConfiguration(txPower, air, i);
                i++;
            }
        } else {
            int i = 0;
            for (MwAirInterfacePac air : airList) {
                byte txPower = air.getAirInterfaceConfiguration().getTxPower();
                LOG.info("Current txPower {} is : {} ",air.getAirInterfaceConfiguration().getAirInterfaceName(),txPower);
                if (txPower < 127) {
                    txPower++;
                }
                LOG.info("New txPower {} is : {} ",air.getAirInterfaceConfiguration().getAirInterfaceName(),txPower);
                mergeAirConfiguration(txPower, air, i);
                i++;
            }
        }


        firstTime = false;

    }

    public void mergeAirConfiguration(byte txPower, MwAirInterfacePac air, int index) {
        AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(air.getAirInterfaceConfiguration());
        configurationBuilder.setTxPower(txPower);
        impl.merge(configurationBuilder.build(), index);
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
