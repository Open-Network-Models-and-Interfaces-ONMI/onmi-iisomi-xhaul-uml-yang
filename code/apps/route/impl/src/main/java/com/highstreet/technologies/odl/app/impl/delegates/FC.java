/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.delegates;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.Fc;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.route.rev150105.fc_desc.FcBuilder;

/**
 * Created by odl on 17-6-5.
 */
public class FC
{
    public String node;
    public String aEnd;
    public String zEnd;

    public Fc toFc()
    {
        FcBuilder fcBuilder = new FcBuilder();
        fcBuilder.setNodeName(node);
        fcBuilder.setAEnd(aEnd);
        fcBuilder.setZEnd(zEnd);
        return fcBuilder.build();
    }

    @Override
    public String toString()
    {
        return "FC{" +
                "node='" + node + '\'' +
                ", aEnd='" + aEnd + '\'' +
                ", zEnd='" + zEnd + '\'' +
                '}';
    }
}
