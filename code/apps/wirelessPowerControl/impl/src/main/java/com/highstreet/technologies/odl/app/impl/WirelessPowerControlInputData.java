/*
 * Copyright (c) 2017 Frinx s.r.o. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

public class WirelessPowerControlInputData {
    private Integer currentThroughput;
    private Integer historicalThroughput;
    private Integer txChannelBandwidth;
    private Short modulationCur;
    private Byte codeRateCur;
    private Byte rxLevelCur;
    private Short rxThreshold;


    private short modulationMin;
    private short modulationMax;
    private byte txPower;

    public Integer getCurrentThroughput() {
        return currentThroughput;
    }

    public void setCurrentThroughput(Integer currentThroughput) {
        this.currentThroughput = currentThroughput;
    }

    public Integer getHistoricalThroughput() {
        return historicalThroughput;
    }

    public void setHistoricalThroughput(Integer historicalThroughput) {
        this.historicalThroughput = historicalThroughput;
    }

    public Integer getTxChannelBandwidth() {
        return txChannelBandwidth;
    }

    public void setTxChannelBandwidth(Integer txChannelBandwidth) {
        this.txChannelBandwidth = txChannelBandwidth;
    }

    public Short getModulationCur() {
        return modulationCur;
    }

    public void setModulationCur(Short modulationCur) {
        this.modulationCur = modulationCur;
    }

    public Byte getCodeRateCur() {
        return codeRateCur;
    }

    public void setCodeRateCur(Byte codeRateCur) {
        this.codeRateCur = codeRateCur;
    }

    public Byte getRxLevelCur() {
        return rxLevelCur;
    }

    public Short getRxThreshold() {
        return rxThreshold;
    }

    public void setRxThreshold(Short rxThreshold) {
        this.rxThreshold = rxThreshold;
    }

    public void setRxLevelCur(Byte rxLevelCur) {
        this.rxLevelCur = rxLevelCur;
    }

    public short getModulationMin() {
        return modulationMin;
    }

    public void setModulationMin(short modulationMin) {
        this.modulationMin = modulationMin;
    }

    public short getModulationMax() {
        return modulationMax;
    }

    public void setModulationMax(short modulationMax) {
        this.modulationMax = modulationMax;
    }

    public byte getTxPower() {
        return txPower;
    }

    public void setTxPower(byte txPower) {
        this.txPower = txPower;
    }
}
