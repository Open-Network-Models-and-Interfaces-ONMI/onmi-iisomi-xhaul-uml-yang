/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

/**
 * Created by olinchy on 6/6/14 for MO_JAVA for ${PROJECT_NAME}.
 */
public class Maybe<T> implements Serializable
{
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T value;
    private boolean present = false;

    public Maybe()
    {
        this(null);
    }
    public Maybe(T t)
    {
        this.value = t;
        this.present = t == null ? false : true;
    }

    public boolean isPresent()
    {
        return present;
    }

    public void setPresent(boolean present)
    {
        this.present = present;
    }

    public boolean nothing()
    {
        return !present;
    }

    public T getValue()
    {
        if (present)
        {
            return value;
        }
        return null;
    }

    public void setValue(T value)
    {
        this.value = value;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
        {
            return true;
        }
        if (o == null || getClass() != o.getClass())
        {
            return false;
        }

        Maybe maybe = (Maybe) o;

        return !(value != null ? !value.equals(maybe.value) : maybe.value != null);
    }

    @Override
    public int hashCode()
    {
        return value != null ? value.hashCode() : 0;
    }

    @Override
    public String toString()
    {
        return "Maybe{" +
                "value=" + value +
                ", present=" + present +
                '}';
    }
}
