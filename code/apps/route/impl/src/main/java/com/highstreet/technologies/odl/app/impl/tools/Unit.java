/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.tools;

/**
 * Created by odl on 17-6-8.
 */
public enum Unit
{
    k_bits_s, m_bits_s(1024, k_bits_s), m_byte_s(8 * 1024, k_bits_s);

    Unit(int ratio, Unit last)
    {
        this.ratio = ratio;
        this.last = last;
    }

    Unit()
    {
        this.ratio = 1;
        this.last = this;
    }

    private final int ratio;
    private final Unit last;

    public Double convert(double result, Unit from)
    {
        return result * ((double) from.ratio / (double) this.ratio);
    }
}
