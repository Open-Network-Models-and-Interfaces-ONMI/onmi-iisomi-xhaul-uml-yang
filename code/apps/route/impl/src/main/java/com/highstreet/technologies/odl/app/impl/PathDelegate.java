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
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.TransactionCommitFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.ForwardingDirection;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.LayerProtocolNameEnumeration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.LtpPath;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.LtpPathListBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.LtpPathListKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointList;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.CreateInput;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;

import java.util.List;

import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.OPERATIONAL;

/**
 * Created by odl on 17-5-30.
 */
public class PathDelegate
{
    public PathDelegate(DataBroker dataBroker, CreateInput input) throws Exception
    {
        this.transaction = dataBroker.newReadWriteTransaction();
        try
        {
            this.ltpPath = transaction.read(LogicalDatastoreType.OPERATIONAL, LTP_PATH_ID).checkedGet().get();
            initPathBuilder(input);
        }
        catch (Exception e)
        {
            throw new Exception("Get LtpPath from ODL failed!", e);
        }
    }

    private void initPathBuilder(CreateInput input)
    {
        this.pathBuilder = new LtpPathListBuilder();
        pathBuilder.setForwardingDirection(ForwardingDirection.Bidirectional);
        pathBuilder.setLayerProtocolName(LayerProtocolNameEnumeration.ETH);
        String pathName;
        pathBuilder.setKey(new LtpPathListKey(pathName = "ltpPath_" + input.getVlanid()));
        pathBuilder.setPathId(String.valueOf(input.getVlanid()));
        pathBuilder.setPathName(pathName);
    }
    private static InstanceIdentifier<LtpPath> LTP_PATH_ID = InstanceIdentifier.create(LtpPath.class);
    private final ReadWriteTransaction transaction;
    private final LtpPath ltpPath;
    private LtpPathListBuilder pathBuilder;

    public void add(List<LogicalTerminationPointList> ltpList)
    {
        pathBuilder.getLogicalTerminationPointList().addAll(ltpList);
    }

    public void commit() throws TransactionCommitFailedException
    {
        ltpPath.getLtpPathList().add(pathBuilder.build());
        transaction.put(OPERATIONAL, LTP_PATH_ID, ltpPath);

        transaction.submit().checkedGet();
    }
}
