/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl;

import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.api.NeCommunicator;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.*;
import com.highstreet.technologies.odl.app.spectrum.impl.task.SpectrumTask;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.scheduler.rev150105.SchedulerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.Singleton.getInstance;

public class SchedulerProvider implements BindingAwareProvider, AutoCloseable
{
    private static final Logger LOG = LoggerFactory.getLogger(SchedulerProvider.class);
    private BindingAwareBroker.RpcRegistration<SchedulerService> schedulerService;

    @Override
    public void onSessionInitiated(ProviderContext session)
    {
        schedulerService = session.addRpcImplementation(SchedulerService.class, new SchedulerRpc());

        getInstance(TaskFactory.class).register("test", () ->
                new SpectrumTask(new DataAgent()
                {
                    @Override
                    public Object get(Attribute attr)
                    {
                        return String.valueOf(Integer.parseInt(attr.getDn().value(-1)) * 100);
                    }

                    @Override
                    public Result<Mo> find(
                            String typeName)
                    {
                        ArrayList<Mo> list = new ArrayList<>();
                        list.add(new Mo("AirInterface").setDN(new DN("/Ne/1/AirInterface/1")));
                        list.add(new Mo("AirInterface").setDN(new DN("/Ne/1/AirInterface/2")));
                        list.add(new Mo("AirInterface").setDN(new DN("/Ne/1/AirInterface/3")));
                        return new Successful<>(list);
                    }
                }, new NeCommunicator()
                {
                    @Override
                    public void set(Attribute attribute, Object value)
                    {
                        LOG.info("setting " + attribute.toString() + "with value: " + value.toString() + " to ne");
                    }

                    @Override
                    public Object running(Attribute attr)
                    {
                        return String.valueOf(Integer.parseInt(attr.getDn().value(-1)) * 150);
                    }
                }));

        LOG.info("TaskFactory initiated");
        LOG.info("SchedulerProvider Session Initiated");
    }

    @Override
    public void close() throws Exception
    {
        LOG.info("SchedulerProvider Closed");
        if (schedulerService != null)
            schedulerService.close();
    }
}
