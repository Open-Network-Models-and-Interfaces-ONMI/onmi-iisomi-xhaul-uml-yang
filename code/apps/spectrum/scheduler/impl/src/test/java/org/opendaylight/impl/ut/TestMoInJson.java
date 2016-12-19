/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.ut;

import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Mo;
import com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil;
import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

/**
 * Created by olinchy on 9/27/16.
 */
public class TestMoInJson
{
    @Test
    public void test_to_mo_given_json_string() throws Exception
    {
        String moString = "{\"moClass\":\"AirInterface\",\"mo\":{\"rxFrequency\":559},\"dn\":\"/Ne/1/AirInterface/1\"}";
        Mo mo = JsonUtil.toObject(moString, Mo.class);

        assertTrue(mo != null);

        assertThat(mo.getMoClass(), is("AirInterface"));
        assertThat(mo.getDn(), is(new DN("/Ne/1/AirInterface/1")));
        assertThat(mo.get("rxFrequency"), is(559));
    }
}
