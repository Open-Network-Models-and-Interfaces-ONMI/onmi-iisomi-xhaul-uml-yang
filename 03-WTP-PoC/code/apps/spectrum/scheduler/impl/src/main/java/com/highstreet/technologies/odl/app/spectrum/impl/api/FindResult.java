/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Maybe;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Mo;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by olinchy on 3/23/15 for mosjava.
 */
public class FindResult extends Result<Mo>
{
    private int size = 0;
    public Maybe<Integer> transId;
    private ArrayList<Mo> moLst = new ArrayList<Mo>();

    public FindResult()
    {
    }

    public FindResult(Mo mo, Maybe<Integer> transactionID) throws Exception
    {
        this(transactionID, 1, mo);
    }

    public FindResult(ArrayList<Mo> moLst, int size, Maybe<Integer> transId)
    {
        this(transId, size, moLst.toArray(new Mo[moLst.size()]));
    }

    FindResult(Maybe<Integer> transId, int size, Mo... moArray)
    {
        moLst.addAll(Arrays.asList(moArray));
        this.transId = transId;
        this.size = size;
    }

    public FindResult(Maybe<Integer> transactionID)
    {
        this(new ArrayList<Mo>(), 0, transactionID);
    }

    public void merge(FindResult other)
    {
        moLst.addAll(other.moLst);
    }

    @Override
    public long getResult()
    {
        return 0;
    }

    @Override
    public boolean isSuccess()
    {
        return true;
    }

    @Override
    public Throwable exception()
    {
        return null;
    }

    @Override
    public List<Mo> getMo()
    {
        return moLst;
    }

    public int getSize()
    {
        return size;
    }

    public void setMo(ArrayList<Mo> moLst)
    {
        this.moLst = moLst;
    }

    @Override
    @JsonIgnore
    public Maybe<Integer> getTransId()
    {
        return transId;
    }
}
