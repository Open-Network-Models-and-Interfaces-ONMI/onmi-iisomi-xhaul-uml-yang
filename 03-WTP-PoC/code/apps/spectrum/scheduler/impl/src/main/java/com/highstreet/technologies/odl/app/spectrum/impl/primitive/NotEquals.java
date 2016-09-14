/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.primitive;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.When.when;

/**
 * Created by olinchy on 16-9-9.
 */
public class NotEquals
{
    public static void notEqualsThen(Object left, Object right, Then then)
    {
        when(() -> !left.equals(right), then);
    }
}
