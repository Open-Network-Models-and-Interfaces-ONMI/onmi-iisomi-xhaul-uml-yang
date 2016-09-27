/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Created by olinchy on 3/17/15 for mosjava.
 */
public class Failure<T> extends Result<T>
{
    @JsonProperty("result")
    public long errorCode;
    @JsonProperty("ex")
    public Throwable e;
    public Maybe<Integer> transId;

    public Failure(Throwable e)
    {
        this(1, e);
    }

    public Failure(Throwable e, Maybe<Integer> transId)
    {
        this(1, e, transId);
    }

    public Failure(int errorCode, Throwable e)
    {
        this(errorCode, e, new Maybe<Integer>(null));
    }

    public Failure(long errorCode, Throwable e, Maybe<Integer> transId)
    {
        this.errorCode = errorCode;
        this.e = e;
        this.transId = transId;
    }

    public Failure(Maybe<Integer> transId)
    {
        this(1, null, transId);
    }

    public Failure()
    {
        this(1, null);
    }

    @Override
    public long getResult()
    {
        return errorCode;
    }

    @Override
    @JsonIgnore
    public boolean isSuccess()
    {
        return false;
    }

    @Override
    @JsonProperty("ex")
    public Throwable exception()
    {
        return e;
    }

    @Override
    @JsonIgnore
    public List<T> getMo()
    {
        return null;
    }

    @Override
    public Maybe<Integer> getTransId()
    {
        return transId;
    }
}
