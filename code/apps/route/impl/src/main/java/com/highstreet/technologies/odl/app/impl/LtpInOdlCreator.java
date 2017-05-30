/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl;

import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointList;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointListBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170526.ltp.path.ltp.path.list.LogicalTerminationPointListKey;

/**
 * Created by odl on 17-5-30.
 */
public class LtpInOdlCreator
{
    public LtpInOdlCreator(String nodeName)
    {
        this.nodeName = nodeName;
    }

    private final String nodeName;

    public LogicalTerminationPointList create(String clientLtpName, String serverLtpName)
    {
        LogicalTerminationPointListBuilder builder = new LogicalTerminationPointListBuilder();
        builder.setPhysicalPortReference(serverLtpName);
        builder.setNodeReference(new UniversalId(nodeName));
        builder.setKey(new LogicalTerminationPointListKey(clientLtpName));
        builder.setLtpIndex(clientLtpName);
        return builder.build();
    }
}
