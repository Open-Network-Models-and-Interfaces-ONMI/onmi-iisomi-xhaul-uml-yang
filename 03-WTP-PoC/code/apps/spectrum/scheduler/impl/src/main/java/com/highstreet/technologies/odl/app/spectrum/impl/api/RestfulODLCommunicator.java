/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Failure;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Successful;
import com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

import java.util.ArrayList;

/**
 * Created by olinchy on 9/23/16.
 */
public class RestfulODLCommunicator implements Communicator
{
    private static String odlPath = "http://localhost:8181/restconf/operational/";
    private static String odlPath_config = "http://localhost:8181/restconf/config/";
    private static Client client = Client.create();


    @Override
    public Result<JsonNode> ls(String path, String targetName)
    {
        try
        {
            ArrayList<JsonNode> res = new ArrayList<>();
            WebResource resource = client.resource(odlPath + path);
            String get = resource.get(String.class);
            JsonUtil.toNode(get).findValues(targetName).forEach(res::add);
            return new Successful<>(res);

        } catch (Throwable e)
        {
            return new Failure<>();
        }
    }

    @Override
    public Object get(String dn, String attrName)
    {
        WebResource resource = client.resource(odlPath + dn);
        JsonNode node = JsonUtil.toNode(resource.get(String.class)).findValue(attrName);
        return node.asText();
    }

    @Override
    public void set(String dn, String attrName, Object o)
    {
        WebResource resource = client.resource(odlPath_config + dn);
        JsonNode node = JsonUtil.toNode(resource.get(String.class));
        try
        {
            ((ObjectNode) node.get("airInterfaceConfiguration")).put(attrName, JsonUtil.toNode(o));
            resource.accept("application/json").type("application/json").put(node.toString());
        } catch (Exception e)
        {
            e.printStackTrace();
        }
    }

}
