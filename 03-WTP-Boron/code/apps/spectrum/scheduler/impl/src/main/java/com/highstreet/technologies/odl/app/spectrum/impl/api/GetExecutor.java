/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.*;

import java.util.ArrayList;
import java.util.Iterator;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil.toObject;

/**
 * Created by olinchy on 3/18/15 for mosjava.
 */
public abstract class GetExecutor implements Executor<Mo>
{
    @Override
    public Result<Mo> post(JsonNode result, DataAgent service) throws Exception
    {
        if (result.elements().hasNext())
        {
            return toResult(result);
        }
        return new Failure<>();
    }

    private Result<Mo> toResult(JsonNode result)
    {
        ArrayList<Mo> lst = new ArrayList<>();
        Iterator<JsonNode> it = result.elements();
        Maybe<Integer> transId = null;
        while (it.hasNext())
        {
            FindResult res = toObject(it.next().toString(), FindResult.class);
            if (transId == null)
                transId = res.getTransId();
            if (res.getMo().size() > 0)
                lst.add(res.getMo().get(0));
        }
        return new Successful<>(lst, transId);
    }

    @Override
    public Result postException(Throwable throwable, DataAgent service)
    {
        return new Failure(throwable);
    }
}
