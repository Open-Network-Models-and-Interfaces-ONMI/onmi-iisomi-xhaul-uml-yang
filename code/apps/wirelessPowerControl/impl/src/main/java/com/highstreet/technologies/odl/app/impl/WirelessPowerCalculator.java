/*
 * Copyright (c) 2017 Frinx s.r.o. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePacBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfigurationBuilder;

public class WirelessPowerCalculator {
    private final WirelessPowerControlInputData input;
    private MwAirInterfacePac airInterfacePac;
    private boolean onlyChangeModulation;

    // these two field are still changing
    private short modulationMin;
    private byte txPower;

    public WirelessPowerCalculator(WirelessPowerControlInputData input, MwAirInterfacePac airInterfacePac) {
        this.input = input;
        this.airInterfacePac = airInterfacePac;

        this.onlyChangeModulation = true;
        this.modulationMin = input.getModulationMin();
        this.txPower = input.getTxPower();
    }

    /**
     * Return true, if is needed change the modulation or the power
     * @return
     */
    public boolean isNeededChangeModulationAndPower() {
        Double txCapacity = input.getTxChannelBandwidth() * log2(input.getModulationCur()) * input.getCodeRateCur()/ 1.15;

        if (input.getCurrentThroughput() < txCapacity && input.getHistoricalThroughput() < txCapacity) {
            // 1. firstly change the modulation. I don't know how much I can decrease
            if (onlyChangeModulation) {
                modulationMin = (short) (modulationMin - 100) ;
                onlyChangeModulation = false;
            // 2. change the power
            } else {
                if (txPower > input.getRxThreshold()) {
                    txPower = (byte)((txPower - input.getRxLevelCur()) > 0 ? txPower - input.getRxLevelCur() : 0);
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }

        // create output
        setAirInterfacePac(createOutput(airInterfacePac));
        return true;
    }

    private MwAirInterfacePac createOutput(MwAirInterfacePac oldAirInterfacePac) {
        MwAirInterfacePacBuilder mWAirInterfacePacBuilder = new MwAirInterfacePacBuilder(oldAirInterfacePac);
        AirInterfaceConfigurationBuilder configurationBuilder = new AirInterfaceConfigurationBuilder(oldAirInterfacePac.getAirInterfaceConfiguration());
        configurationBuilder.setModulationMin(modulationMin);
        configurationBuilder.setTxPower(txPower);
        mWAirInterfacePacBuilder.setAirInterfaceConfiguration(configurationBuilder.build());
        return mWAirInterfacePacBuilder.build();
    }

    private double log2( double a) {
        return Math.log(a) / Math.log(2);
    }

    public MwAirInterfacePac getAirInterfacePac() {
        return airInterfacePac;
    }

    public void setAirInterfacePac(MwAirInterfacePac airInterfacePac) {
        this.airInterfacePac = airInterfacePac;
    }

    public short getModulationMin() {
        return modulationMin;
    }

    public byte getTxPower() {
        return txPower;
    }
}
