/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.st;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.MosAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.RestfulODLCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Pair;
import com.highstreet.technologies.odl.app.spectrum.impl.task.SpectrumTask;
import org.junit.BeforeClass;
import org.junit.Test;

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by olinchy on 9/30/16.
 */
public class TestSpectrumTask
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
    public void given_fake_dataAgent_and_fake_set_communicator() throws Exception
    {
        Object[] obj = new Object[1];
        SpectrumTask task = new SpectrumTask(new DataAgent()
        {
            @Override
            public Object get(DN dnAgent, String attrName)
            {
                return 500;
            }

            @Override
            public List<String> ls(DN dnAgent) throws Exception
            {
                return new ArrayList<>();
            }
        }, new RestfulODLCommunicator()
        {
            @Override
            public void set(String dn, Pair<String, Object>... values)
            {
                obj[0] = values[0].second();
            }
        });
        task.execute();
    }

    @Test
    public void given_fake_dataAgent_and_ODLCommunicator() throws Exception
    {
        SpectrumTask task = new SpectrumTask(new DataAgent()
        {
            @Override
            public Object get(DN dnAgent, String attrName)
            {
                return null;
            }

            @Override
            public List<String> ls(DN dnAgent) throws Exception
            {
                return Arrays.asList(new String[]{"14400000", "14500000", "14600000"});
            }
        }, new RestfulODLCommunicator());
        for (int i = 0; i < 3; i++)
        {
            task.execute();
        }
    }

    @Test
    public void given_mosAgent() throws Exception
    {
        SpectrumTask task = new SpectrumTask(new MosAgent("http://localhost:8282/mos"), new RestfulODLCommunicator());

        for (int i = 0; i < 10; i++)
        {
            task.execute();
        }
    }

    @Test
    public void given_mos_and_fake_odl() throws Exception {
        SpectrumTask task = new SpectrumTask(new MosAgent("http://10.50.250.4:8282/mos"), new RestfulODLCommunicator("10.50.250.4:8181")
        {
            @Override
            public void set(String dn, Pair<String, Object>... values) {
                System.out.println("setting " + Arrays.asList(values) + " to "
                        + dn.replace("network-topology:network-topology/topology/topology-netconf/node/", "")
                        .replace("/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac", "")
                        .replace("/airInterfaceConfiguration", ""));
            }
        });
        task.execute();
    }

    @Test
    public void given_odl_all() throws Exception {
        SpectrumTask task = new SpectrumTask(new MosAgent("http://10.50.250.4:8282/mos"), new RestfulODLCommunicator("10.50.250.4:8181"));
        task.execute();
    }
}
