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
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.Arrays;
import java.util.Collection;

import static org.junit.Assert.assertTrue;

/**
 * Created by olinchy on 9/30/16.
 */
@RunWith(Parameterized.class)
public class TestDNCompare
{
    private String left;
    private String right;

    public TestDNCompare(String left, String right)
    {
        this.left = left;
        this.right = right;
    }

    @Parameterized.Parameters
    public static Collection<Object[]> data()
    {
        return Arrays.asList(new Object[][]
                {
                        {"/Ems/20", "/Ems/5"},
                        {"/Ems/b", "/Ems/a"},
                });

    }

    @Test
    public void name() throws Exception
    {
        assertTrue(new DN(left).compareTo(new DN(right)) > 0);

    }
}
