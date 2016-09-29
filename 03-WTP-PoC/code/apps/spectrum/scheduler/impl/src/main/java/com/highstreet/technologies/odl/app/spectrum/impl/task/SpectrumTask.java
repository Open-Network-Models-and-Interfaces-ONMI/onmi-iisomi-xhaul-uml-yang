/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.spectrum.impl.task;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.api.Communicator;
import com.highstreet.technologies.odl.app.spectrum.impl.api.DataAgent;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Attribute;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.ThreadPoolExecutor;

import static com.highstreet.technologies.odl.app.spectrum.impl.policy.NotEqualConfigurationPolicy.execute;

/**
 * Created by olinchy on 16-9-14.
 */
public class SpectrumTask implements Task
{
    private static final Logger LOG = LoggerFactory.getLogger(SpectrumTask.class);
    private static final String NODE_PATH = "network-topology:network-topology/topology/topology-netconf/node";
    private static final String NetElement_Path = NODE_PATH + "/%s/" + "/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement";
    private static final String LP_Path = NODE_PATH + "/%s/" + "/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac/%s";

    private DataAgent agent;
    private Communicator communicator;

    public SpectrumTask(DataAgent agent, Communicator communicator)
    {
        this.agent = agent;
        this.communicator = communicator;
    }

    @Override
    public void executeIn(ThreadPoolExecutor executor)
    {
        // get all airInterfaces
        Result<JsonNode> result = communicator.ls(NODE_PATH, "node");
        if (!result.isSuccess())
            return;
        for (JsonNode node : result.getMo())
        {
            String status = node.get("netconf-node-topology:connection-status").asText();
            if (status.equals("connected"))
            {
                String neName;
                Result<JsonNode> neNode = communicator.ls(String.format(NetElement_Path, neName = node.get("node-id").asText()), "_ltpRefList");
                if (neNode.isSuccess())
                {
                    for (JsonNode ne : neNode.getMo())
                    {
                        ne.findValue("_ltpRefList");
                        Iterator<JsonNode> it = ne.findValue("_ltpRefList").elements();
                        while (it.hasNext())
                        {
                            JsonNode node1 = it.next();
                            String lpName = node1.findValue("_lpList").findValue("uuid").asText();

                            compareInNe(String.format(LP_Path, neName, lpName), executor);
                        }

                    }
                }
            }
        }
    }

    private void compareInNe(String dnString, ThreadPoolExecutor executor)
    {
        DN dn = new DN(dnString);
        LOG.info("adding task to threadPool");
        executor.execute(() -> execute(agent, communicator, new Attribute(dn, "txFrequency")));
        executor.execute(() -> execute(agent, communicator, new Attribute(dn, "rxFrequency")));

    }
}
