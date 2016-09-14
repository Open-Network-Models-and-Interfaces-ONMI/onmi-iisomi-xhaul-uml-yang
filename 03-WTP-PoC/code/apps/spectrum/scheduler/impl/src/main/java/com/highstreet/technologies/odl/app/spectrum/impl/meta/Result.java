/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import java.io.Serializable;
import java.util.List;

/**
 * Created by olinchy on 16-9-14.
 */
public abstract class Result<T> implements Serializable
{
    public abstract boolean isSuccess();

    public Throwable exception()
    {
        return null;
    }

    public abstract List<T> getMo();
}
