/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.tools;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;

/**
 * Created by olinchy on 6/15/17.
 */
public class DataBrokerHolder
{
    private static DataBroker dataBroker;

    public static DataBroker getDataBroker()
    {
        return dataBroker;
    }

    public static void setDataBroker(DataBroker dataBroker)
    {
        DataBrokerHolder.dataBroker = dataBroker;
    }
}
