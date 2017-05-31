/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.ReadWriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.TransactionCommitFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.ForwardingDirection;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.LayerProtocolNameEnumeration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.LtpPath;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.LtpPathList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.LtpPathListBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.LtpPathListKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointList;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.CreateInput;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.CONFIGURATION;

/**
 * Created by odl on 17-5-30.
 */
public class PathDelegate
{
    public PathDelegate(DataBroker dataBroker, CreateInput input)
    {
        this.dataBroker = dataBroker;
        this.input = input;
        initPathBuilder();
    }

    private void initPathBuilder()
    {
        this.pathBuilder = new LtpPathListBuilder();
        pathBuilder.setForwardingDirection(ForwardingDirection.Bidirectional);
        pathBuilder.setLayerProtocolName(LayerProtocolNameEnumeration.ETH);
        String pathId;
        pathBuilder.setKey(new LtpPathListKey(pathId = UUID.randomUUID().toString()));
        pathBuilder.setPathId(pathId);
    }
    private static InstanceIdentifier<LtpPath> LTP_PATH_ID = InstanceIdentifier.create(LtpPath.class);
    private CreateInput input;
    private DataBroker dataBroker;
    private LtpPathListBuilder pathBuilder;

    public void add(List<LogicalTerminationPointList> ltpList)
    {
        if (pathBuilder.getLogicalTerminationPointList() == null)
            pathBuilder.setLogicalTerminationPointList(new ArrayList<>());
        pathBuilder.getLogicalTerminationPointList().addAll(ltpList);
    }

    public void commit() throws TransactionCommitFailedException
    {
        pathBuilder.setPathName(valueAt(pathBuilder.getLogicalTerminationPointList(), 0) + "_" + valueAt(
                pathBuilder.getLogicalTerminationPointList(), -1) + "_" + input.getVlanid());
        ReadWriteTransaction transaction = dataBroker.newReadWriteTransaction();
        transaction.put(
                CONFIGURATION, LTP_PATH_ID.child(LtpPathList.class, pathBuilder.getKey()),
                pathBuilder.build());

        transaction.submit().checkedGet();
    }

    private String valueAt(List<LogicalTerminationPointList> listT, int index)
    {
        if (index == -1 || index >= listT.size())
            index = listT.size() - 1;

        return listT.get(index).getLtpReference().getValue();
    }
}
