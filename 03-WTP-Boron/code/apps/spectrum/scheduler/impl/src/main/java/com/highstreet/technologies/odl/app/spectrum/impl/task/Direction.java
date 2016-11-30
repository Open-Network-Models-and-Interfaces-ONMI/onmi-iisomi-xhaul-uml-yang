/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.task;

import com.highstreet.technologies.odl.app.spectrum.impl.primitive.Next;

/**
 * Created by olinchy on 15/10/2016.
 */
public enum Direction implements Next
{
    ASC
            {
                @Override
                public int next(int currentIndex)
                {
                    return ++currentIndex;
                }
            },
    DESC
            {
                @Override
                public int next(int currentIndex)
                {
                    return --currentIndex;
                }
            };
}
