/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.googlecode.jsonrpc4j.JsonRpcHttpClient;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.*;
import com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil;
import org.eclipse.jetty.server.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.JsonUtil.newArrayNode;

/**
 * Created by olinchy on 9/27/16.
 */
public class MosAgent implements DataAgent
{
    private static final Logger logger = LoggerFactory.getLogger(JsonUtil.class);
    private static JsonRpcHttpClient client;
    private static String sessionId;

    public MosAgent(String url) throws MalformedURLException
    {
        client = new JsonRpcHttpClient(new URL(url));
        try
        {
            this.login();
        } catch (Exception e)
        {
            logger.warn("login to mos service failed!", e);
        }
    }

    protected <T> Result<T> methodShell(Executor<T> executor) throws Exception
    {
        StackTraceElement[] stackTraceElements = new Throwable().getStackTrace();
        logger.debug(stackTraceElements[2] + " is calling " + stackTraceElements[1]);
        try
        {
            return executor.post(executor.exec(), this);
        } catch (SessionNotFoundException e)
        {
            this.login();
            return executor.post(executor.exec(), this);
        } catch (Throwable e)
        {
            return executor.postException(e, this);
        }
    }

    private void login()
            throws Exception
    {
        JsonNode node;
        try
        {
            node = client.invoke(
                    "login",
                    new Object[]{"CLI", "ems", "ems", JsonUtil.toNode(new Maybe<Server>(null))},
                    JsonNode.class);
        } catch (Throwable throwable)
        {
            throw new Exception(throwable);
        }
        if (node.findValue("result").intValue() != 1)
        {
            sessionId = node.findValue("sessionId").textValue();
        } else
        {
            throw new Exception("login failed!");
        }
    }


    public Result<Mo> get(final DN... dns) throws Exception
    {
        return methodShell(
                new GetExecutor()
                {
                    @Override
                    public JsonNode exec() throws Exception
                    {
                        ArrayNode node = newArrayNode();
                        for (DN dn : dns)
                        {
                            try
                            {
                                ObjectNode mo = client.invoke(
                                        "get",
                                        new Object[]{sessionId, dn.toString(), new Maybe<Integer>(null)},
                                        ObjectNode.class);
                                node.add(mo);
                            } catch (Throwable throwable)
                            {
                                throw new Exception(throwable);
                            }
                        }
                        return node;
                    }
                });
    }


    @Override
    public Object get(DN dnAgent, String attrName)
    {
        try
        {
            Result<Mo> result = get(dnAgent);
            if (result.isSuccess())
            {
                Mo mo = result.getMo().get(0);
                return mo.get(attrName);
            }

        } catch (Exception e)
        {
            logger.warn("get attr " + attrName + "of " + dnAgent + " from data agent failed!", e);
        }
        return null;
    }
}
