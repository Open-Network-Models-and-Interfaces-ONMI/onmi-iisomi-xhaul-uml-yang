/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import java.io.Serializable;

public class Pair<FirstType, SecondType> implements Serializable
{
    public Pair()
    {
    }

    public Pair(FirstType first, SecondType second)
    {
        this.first = first;
        this.second = second;
    }

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public void setFirst(FirstType first)
    {
        this.first = first;
    }

    private FirstType first;
    private SecondType second;

    public static <T1, T2> Pair<T1, T2> pair(T1 t1, T2 t2)
    {
        return new Pair<T1, T2>(t1, t2);
    }

    public FirstType first()
    {
        return first;
    }

    public SecondType second()
    {
        return second;
    }

    @Override
    public int hashCode()
    {
        return 0;
    }

    @Override
    public boolean equals(Object o)
    {
        try
        {
            if (o instanceof Pair<?, ?>)
            {
                return (first.equals(((Pair<?, ?>) o).first) && second.equals(
                        ((Pair<?, ?>) o).second))
                        || (first.equals(((Pair<?, ?>) o).second) && second.equals(
                        ((Pair<?, ?>) o).first));
            }
        }
        catch (Exception e)
        {
        }

        return false;
    }

    @Override
    public String toString()
    {
        if (first.equals(second))
            return "[" + String.valueOf(first) + "]";
        return "[" + String.valueOf(first) + "," + String.valueOf(second) + "]";
    }

    public boolean match(Object o)
    {
        try
        {
            if (o instanceof Pair<?, ?>)
            {
                return (((Pair<?, ?>) o).first.toString().matches(first.toString())
                        && ((Pair<?, ?>) o).second
                        .toString().matches(second.toString()))
                        || (((Pair<?, ?>) o).first.toString().matches(second.toString())
                        && ((Pair<?, ?>) o).second
                        .toString().matches(first.toString()));
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    public void setSecond(SecondType t)
    {
        this.second = t;
    }
}