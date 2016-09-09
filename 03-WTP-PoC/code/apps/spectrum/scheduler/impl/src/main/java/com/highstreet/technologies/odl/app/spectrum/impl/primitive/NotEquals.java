/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.primitive;

import com.highstreet.technologies.odl.app.spectrum.impl.Then;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Attribute;

/**
 * Created by olinchy on 16-9-9.
 */
public class NotEquals
{
    public static void is(Attribute planned, Attribute running, Then then)
    {
        if (planned.equals(running))
            then.then();
    }
}
