/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import java.io.Serializable;

public class DN implements Serializable, Comparable<DN>
{
    public DN(String dn)
    {
        if (isDN(dn))
            wrapper = new DNWrapper(dn);
    }

    private static final long serialVersionUID = 1L;
    private DNWrapper wrapper;

    public static boolean isDN(String dnString)
    {
        return DNWrapper.is(dnString);
    }

    public DN parent()
    {
        return new DN(wrapper.parent());
    }

    public DN to(int index)
    {
        return new DN(wrapper.to(index));
    }

    public String value(int index)
    {
        return wrapper.value(index);
    }

    public DN to(String keyword) throws Exception
    {
        return new DN(wrapper.to(keyword));
    }

    public String value(String type)
    {
        return wrapper.value(type);
    }

    public DN append(String value)
    {
        return new DN(wrapper.append(value));
    }

    @Override
    public int compareTo(DN o)
    {
        return this.wrapper.compareTo(o.wrapper);
    }

    public boolean deeperThan(DN dn)
    {
        return wrapper.deeperThan(dn.wrapper);
    }

    public boolean isOffspringOf(DN dn)
    {
        return this.wrapper.isOffspringOf(dn.wrapper);
    }

    @Override
    public int hashCode()
    {
        return wrapper != null ? wrapper.hashCode() : 0;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DN dn = (DN) o;

        return !(wrapper != null ? !wrapper.equals(dn.wrapper) : dn.wrapper != null);
    }

    @Override
    public String toString()
    {
        if (wrapper == null)
        {
            return "";
        }
        return wrapper.to(-1);
    }
}


