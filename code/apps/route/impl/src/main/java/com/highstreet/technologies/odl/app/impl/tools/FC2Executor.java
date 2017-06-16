/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.tools;

import com.highstreet.technologies.odl.app.impl.delegates.LtpInOdlCreator;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.Fc;

/**
 * Created by odl on 17-6-3.
 */
public class FC2Executor
{
    public NeExecutor to(Fc fc, Integer vlanid, LtpInOdlCreator ltpCreator) throws ReadFailedException
    {
        return new NeExecutor(fc, vlanid, ltpCreator);
    }
}
