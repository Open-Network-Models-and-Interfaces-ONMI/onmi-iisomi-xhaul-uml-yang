/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.ut;

import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import org.junit.Test;

/**
 * Created by olinchy on 9/30/16.
 */
public class TestDNCompareTimeCost
{
    @Test
    public void test_origin_time_cost() throws Exception
    {
        for (int i = 0; i < 10; i++)
        {
            long nano = System.nanoTime();
            int value = new DN("/Ems/1/Ne/1/H/1/J/4/K/7").compareTo(new DN("/Ems/1/Ne/1/H/1/J/4/K/7"));
            System.out.println(System.nanoTime() - nano);
        }
    }

}
