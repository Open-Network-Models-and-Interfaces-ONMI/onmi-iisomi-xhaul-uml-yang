/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.delegates;

import java.util.Arrays;

/**
 * Created by odl on 17-6-5.
 */
public class Path
{
    public FC[] main_ltps;
    public FC[] backup_ltps;

    @Override
    public String toString()
    {
        return "Path{" +
                "main_ltps=" + Arrays.toString(main_ltps) +
                ", backup_ltps=" + Arrays.toString(backup_ltps) +
                '}';
    }
}
