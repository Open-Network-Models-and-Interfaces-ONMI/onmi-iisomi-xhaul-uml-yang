/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.meta;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil;

import java.util.HashMap;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil.toObject;

/**
 * Created by olinchy on 16-9-14.
 */
public class Mo
{
    private String moClass;
    private String dn;
    private HashMap<String, Object> mo = new HashMap<>();

    public Mo()
    {

    }

    public Mo(String moClass)
    {
        this.moClass = moClass;
    }

    public HashMap<String, Object> getMo()
    {
        return mo;
    }

    public void setMo(HashMap<String, Object> mo)
    {
        this.mo = mo;
    }

    public String getMoClass()
    {
        return moClass;
    }

    public void setMoClass(String moClass)
    {
        this.moClass = moClass;
    }

    public Mo setAttr(String attrName, Object value)
    {
        mo.put(attrName, value);
        return this;
    }

    public <T> T to(Class<T> meta) throws Exception
    {
        return toObject(JsonUtil.toNode(this.mo).toString(), meta);
    }

    @Override
    public String toString()
    {
        try
        {
            return JsonUtil.toString(this);
        } catch (Exception e)
        {
            return "mo {}";
        }
    }

    @JsonSerialize(using = DNJsonSerializer.class)
    public DN getDn()
    {
        return new DN(dn);
    }

    @JsonDeserialize(using = DNJsonDeserializer.class)
    public Mo setDn(DN dn)
    {
        this.dn = dn.toString();
        return this;
    }

    public Object get(String fieldName)
    {
        return this.mo.get(fieldName);
    }


}
