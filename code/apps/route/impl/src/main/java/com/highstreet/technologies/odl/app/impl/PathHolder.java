/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import com.highstreet.technologies.odl.app.impl.delegates.LtpInOdlCreator;
import com.highstreet.technologies.odl.app.impl.delegates.PathDelegate;
import com.highstreet.technologies.odl.app.impl.tools.NeExecutor;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.common.api.data.TransactionCommitFailedException;

import java.util.ArrayList;

/**
 * Created by odl on 17-6-2.
 */
public class PathHolder
{
    public PathHolder(DataBroker dataBroker, Integer vlanId)
    {
        this.pathDelegate = new PathDelegate(dataBroker, vlanId);
    }

    private final PathDelegate pathDelegate;
    private ArrayList<NeExecutor> list = new ArrayList<>();
    private LtpInOdlCreator ltpCreator = new LtpInOdlCreator();

    public void add(NeExecutor to)
    {
        list.add(to);
        pathDelegate.add(to.getLtp());
    }

    public void commit() throws TransactionCommitFailedException
    {
        list.forEach(NeExecutor::commit);
        pathDelegate.commit();
    }

    public void clear(int vlanId) throws TransactionCommitFailedException
    {
        list.forEach(neExecutor -> neExecutor.clear(vlanId));
        pathDelegate.clear();
    }

    public LtpInOdlCreator getLtpCreator()
    {
        return ltpCreator;
    }
}
