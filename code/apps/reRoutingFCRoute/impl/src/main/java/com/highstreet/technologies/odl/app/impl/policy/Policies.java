/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.policy;

import com.highstreet.technologies.odl.app.impl.topology.Vertex;

import java.util.List;

/**
 * Created by olinchy on 5/12/17.
 */
public class Policies
{
    private static Policy[] policies = new Policy[]{};

    public static boolean consent(List<Vertex> path)
    {
        for (Policy policy : policies)
        {
            if (!policy.consent(path))
            {
                return false;
            }
        }
        return true;
    }
}
