/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.primitive;

/**
 * Created by olinchy on 16-9-14.
 */
public class When
{
    public static void when(True is, Then then)
    {
        if (is.true_())
            then.then();
    }
}
