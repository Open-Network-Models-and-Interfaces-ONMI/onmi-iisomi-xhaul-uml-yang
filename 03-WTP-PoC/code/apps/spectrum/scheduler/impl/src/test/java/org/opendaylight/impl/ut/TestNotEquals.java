/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.ut;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.Communicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Attribute;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Mo;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;
import com.highstreet.technologies.odl.app.spectrum.impl.policy.NotEqualConfigurationPolicy;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

/**
 * Created by olinchy on 16-9-14.
 */
public class TestNotEquals
{
    @Test
    public void name() throws Exception
    {
        final boolean[] isSetCalled = {false};
        NotEqualConfigurationPolicy.execute(new DataAgent()
        {
            @Override
            public Object get(Attribute attr)
            {
                return "1";
            }

            @Override
            public Result<Mo> find(
                    String typeName)
            {
                return null;
            }
        }, new Communicator()
        {
            @Override
            public void set(Attribute attribute, Object value)
            {
                isSetCalled[0] = true;
            }

            @Override
            public Object running(Attribute attr)
            {
                return "2";
            }

            @Override
            public Result<JsonNode> ls(String path, String targetName)
            {
                return null;
            }

        }, new Attribute(new DN("/A/1"), "txFrequency"));

        assertTrue(isSetCalled[0]);
    }
}
