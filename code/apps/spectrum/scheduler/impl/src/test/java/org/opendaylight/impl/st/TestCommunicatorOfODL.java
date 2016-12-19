/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.st;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.api.RestfulODLCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;
import org.junit.BeforeClass;
import org.junit.Test;

import java.net.Authenticator;
import java.net.PasswordAuthentication;

import static com.highstreet.technologies.odl.app.spectrum.impl.meta.Pair.pair;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

/**
 * Created by olinchy on 9/30/16.
 */
public class TestCommunicatorOfODL
{
    @BeforeClass
    public static void setUp() throws Exception
    {
        Authenticator.setDefault(new Authenticator()
        {
            @Override
            protected PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication("admin", "admin".toCharArray());
            }
        });
    }

    @Test
    public void test_ls() throws Exception
    {
        RestfulODLCommunicator communicator = new RestfulODLCommunicator();
        Result<JsonNode> res = communicator.ls("network-topology:network-topology/topology/topology-netconf", "node");

        assertTrue(res.isSuccess());
        assertThat(res.getMo().size(), is(2));
    }

    @Test
    public void test_set() throws Exception
    {
        RestfulODLCommunicator communicator = new RestfulODLCommunicator();
        communicator.set("network-topology:network-topology/topology/topology-netconf/node/mw-112/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac/LP-MWPS-ifIndex2/airInterfaceConfiguration", pair("txFrequency", 14800000));
    }
}
