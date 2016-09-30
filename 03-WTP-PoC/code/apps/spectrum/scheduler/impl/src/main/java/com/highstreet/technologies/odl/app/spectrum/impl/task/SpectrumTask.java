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
import com.highstreet.technologies.odl.app.spectrum.impl.meta.DN;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ThreadPoolExecutor;

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.NotEquals.notEqualsThen;
import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.When.when;

/**
 * Created by olinchy on 16-9-14.
 */
public class SpectrumTask implements Task
{
    private static final Logger LOG = LoggerFactory.getLogger(SpectrumTask.class);
    private static final String NODE_PATH = "network-topology:network-topology/topology/topology-netconf";
    private static final String NetElement_Path = NODE_PATH + "/node/%s/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement";
    private static final String LP_Path = NODE_PATH + "/node/%s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac/%s";
    private static final String AGENT_DN = "/Ne/%s/AirInterface/%s";

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
        Result<JsonNode> result = communicator.ls(NODE_PATH, "node");
        when(result::isSuccess, () ->
                result.getMo().forEach(node ->
                        node.forEach(elementNode ->
                        {
                            when(() -> elementNode.get("netconf-node-topology:connection-status").asText().equals("connected"), () ->
                            {
                                String neName;
                                Result<JsonNode> neNode = communicator.ls(
                                        String.format(NetElement_Path, neName = elementNode.get("node-id").asText()),
                                        "_ltpRefList");
                                when(neNode::isSuccess, () ->
                                        neNode.getMo().forEach(ne -> ne.findValues("_lpList").forEach(lf ->
                                        {
                                            String lpName = lf.findValue("uuid").asText();
                                            DN dnAgent = new DN(String.format(AGENT_DN, neName, lpName));
                                            String dnODL = String.format(LP_Path, neName, lpName);

                                            LOG.info("adding task to threadPool");

                                            when(() -> lpName.contains("MWPS"), () -> {
                                                executor.execute(() ->
                                                        notEqualsThen(agent.get(dnAgent, "txFrequency"),
                                                                communicator.get(dnODL, "txFrequency"),
                                                                () -> communicator.set(dnODL, "txFrequency", agent.get(dnAgent, "txFrequency"))));

                                                executor.execute(() ->
                                                        notEqualsThen(agent.get(dnAgent, "rxFrequency"),
                                                                communicator.get(dnODL, "rxFrequency"),
                                                                () -> communicator.set(dnODL, "rxFrequency", agent.get(dnAgent, "rxFrequency"))));
                                            });

                                        })));
                            });
                        })));
    }
}
