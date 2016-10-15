/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl;

import com.google.common.util.concurrent.Futures;
import com.highstreet.technologies.odl.app.spectrum.impl.task.Task;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.scheduler.rev150105.SchedulerService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.Singleton.getInstance;

/**
 * Created by olinchy on 16-9-9.
 */
public class SchedulerRpc implements SchedulerService
{
    private static final Logger LOG = LoggerFactory.getLogger(SchedulerRpc.class);
    ThreadPoolExecutor executor = new ThreadPoolExecutor(5, 20, 1, TimeUnit.SECONDS, new LinkedBlockingDeque<>());

    @Override
    public Future<RpcResult<Void>> next()
    {
        try
        {
            Task task = getInstance(TaskFactory.class).create("spectrum");
            task.executeIn(executor);
        } catch (Exception e)
        {
            LOG.warn("execute task failed!", e);
        }
        return Futures.immediateFuture(RpcResultBuilder.<Void>success().build());
    }
}
