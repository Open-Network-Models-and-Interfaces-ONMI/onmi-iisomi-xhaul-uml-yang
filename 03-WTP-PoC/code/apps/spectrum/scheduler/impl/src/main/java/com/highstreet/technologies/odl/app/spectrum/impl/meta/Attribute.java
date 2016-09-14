/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

/**
 * Created by olinchy on 16-9-3.
 */
public class Attribute
{
    public Attribute(DN dn, String attrName)
    {
        this.dn = dn;
        this.attrName = attrName;
    }

    // value sections
    private DN dn;
    private String attrName;

    public DN getDn()
    {
        return dn;
    }

    public String getAttrName()
    {
        return attrName;
    }

    @Override
    public String toString()
    {
        return "Attribute{" +
                "dn=" + dn +
                ", attrName='" + attrName + '\'' +
                '}';
    }
}
