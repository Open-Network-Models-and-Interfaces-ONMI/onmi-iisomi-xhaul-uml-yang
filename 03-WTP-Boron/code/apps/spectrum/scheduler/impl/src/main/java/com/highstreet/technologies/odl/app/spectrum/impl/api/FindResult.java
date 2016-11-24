/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.highstreet.technologies.odl.app.spectrum.impl.meta.Maybe;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Mo;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * Created by olinchy on 3/23/15 for mosjava.
 */
public class FindResult extends Result<Mo>
{
    public int result;
    public LinkedHashMap<String, Object> mo = new LinkedHashMap<>();

    public FindResult()
    {
    }

    @Override
    public long getResult()
    {
        return result;
    }

    @Override
    public boolean isSuccess()
    {
        return true;
    }

    @Override
    public List<Mo> getMo()
    {
        ArrayList<Mo> list = new ArrayList<>();
        Mo mo = new Mo();
        mo.setMo(this.mo);
        list.add(mo);
        return list;
    }

    @Override
    public Maybe<Integer> getTransId()
    {
        return new Maybe<>();
    }
}
