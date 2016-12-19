/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.impl.st;

import com.highstreet.technologies.odl.app.spectrum.impl.api.MosAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.RestfulODLCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.task.FrequencyCheckTask;
import org.junit.BeforeClass;
import org.junit.Test;

import java.net.Authenticator;
import java.net.PasswordAuthentication;

/**
 * Created by odl on 10/25/16.
 */
public class TestFrequencyCheckTask {

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
    public void checkODL() throws Exception {

        FrequencyCheckTask task = new FrequencyCheckTask(new MosAgent("http://10.50.250.4:8282/mos"), new RestfulODLCommunicator("10.50.250.4:8181"));

        task.execute();

    }
}
