/*
 * Copyright © 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.policy;

import com.highstreet.technologies.odl.app.impl.topology.Vertex;

import java.util.List;

/**
 * Created by olinchy on 14/05/2017.
 */
public class MSDPolicy implements Policy
{
    @Override
    public boolean consent(List<Vertex> path)
    {
        return false;
    }
}
