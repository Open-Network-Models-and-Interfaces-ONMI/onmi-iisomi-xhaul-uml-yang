/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.task;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.NeCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Attribute;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Mo;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;

import java.util.concurrent.ThreadPoolExecutor;

import static com.highstreet.technologies.odl.app.spectrum.impl.policy.NotEqualConfigurationPolicy.execute;

/**
 * Created by olinchy on 16-9-14.
 */
public class SpectrumTask implements Task
{
    private DataAgent agent;
    private NeCommunicator communicator;

    public SpectrumTask(DataAgent agent, NeCommunicator communicator)
    {
        this.agent = agent;
        this.communicator = communicator;
    }

    @Override
    public void executeIn(ThreadPoolExecutor executor)
    {
        // get all airInterfaces
        Result<Mo> result = agent.find("AirInterface");
        if (!result.isSuccess())
            return;
        for (Mo mo : result.getMo())
        {
            executor.execute(() -> execute(agent, communicator, new Attribute(mo.getDN(), "txFrequency")));
            executor.execute(() -> execute(agent, communicator, new Attribute(mo.getDN(), "rxFrequency")));
        }
    }
}
