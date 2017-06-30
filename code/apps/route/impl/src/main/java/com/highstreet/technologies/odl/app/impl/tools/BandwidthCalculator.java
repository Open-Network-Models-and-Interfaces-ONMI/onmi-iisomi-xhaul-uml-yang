/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.DecimalFormat;

import static com.google.common.math.DoubleMath.log2;

/**
 * Created by odl on 17-6-8.
 */
public class BandwidthCalculator
{
    private static final Logger LOG = LoggerFactory.getLogger(BandwidthCalculator.class);

    public BandwidthCalculator(Integer txChannelBandwidth, Short modulationCur, Byte codeRateCur)
    {
        LOG.info("bandwidth: " + txChannelBandwidth + " modulationCur: " + modulationCur + " codeRate: " + codeRateCur);
        this.result = txChannelBandwidth * log2(modulationCur) * (0.8) / 1.15;
    }

    private static DecimalFormat df = new DecimalFormat("#.00");
    private final double result;

    public Double calc(Unit unit)
    {
        return Double.valueOf(df.format(unit.convert(result, Unit.k_bits_s)));
    }

    public Double calc()
    {
        return Double.valueOf(df.format(result));
    }
}
