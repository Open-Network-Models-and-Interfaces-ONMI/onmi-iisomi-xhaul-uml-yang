/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.route;

import com.highstreet.technologies.odl.app.impl.tools.BandwidthCalculator;
import com.highstreet.technologies.odl.app.impl.tools.Unit;
import org.junit.Test;

/**
 * Created by odl on 17-6-8.
 */
public class TestBandwidthCalculator
{
    @Test
    public void testCalc() throws Exception
    {
        BandwidthCalculator bc = new BandwidthCalculator(56000, (short) 64, (byte) 90);
        System.out.println(bc.calc());
        System.out.println(bc.calc(Unit.m_bits_s));
        System.out.println(bc.calc(Unit.m_byte_s));
        System.out.println(bc.calc(Unit.k_bits_s));
    }
}
