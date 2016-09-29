/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Attribute;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Failure;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Successful;
import com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by olinchy on 9/23/16.
 */
public class RestfulODLCommunicator implements Communicator
{
    private static String odlPath = "http://localhost:8181/restconf/operational/";
    private static Client client = Client.create();


    @Override
    public void set(Attribute attribute, Object value)
    {

    }

    @Override
    public Object running(Attribute attr)
    {
        return null;
    }

    @Override
    public Result<JsonNode> ls(String path, String targetName)
    {
        try
        {
            ArrayList<JsonNode> res = new ArrayList<>();
            WebResource resource = client.resource(odlPath + path);
            String get = resource.get(String.class);
            Iterator<JsonNode> it = JsonUtil.toNode(get).findValue(targetName).elements();
            while (it.hasNext())
            {
                res.add(it.next());
            }
            return new Successful<>(res);

        }
        catch (Throwable e)
        {
            return new Failure<>();
        }
    }

}
