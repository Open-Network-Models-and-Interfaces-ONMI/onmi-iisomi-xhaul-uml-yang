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

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.When.when;

/**
 * Created by olinchy on 16-9-14.
 */
public class SpectrumTask implements Task
{
    protected static final String NODE_PATH = "network-topology:network-topology/topology/topology-netconf";
    protected static final String NetElement_Path = NODE_PATH + "/node/%s/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement";
    protected static final String LP_Path = NODE_PATH + "/node/%s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac/%s/airInterfaceConfiguration";
    protected static final String AGENT_DN = "/NE/%s/";

    protected Communicator communicator;
    private NextFrequencyGetter getter;

    public SpectrumTask(DataAgent agent, Communicator communicator)
    {
        this.communicator = communicator;
        getter = new NextFrequencyGetter(agent);
    }

    @Override
    public void execute()
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
                                            DN dnAgent = new DN(String.format(AGENT_DN, neName));
                                            if (neName.startsWith("Nokia"))
                                                dnAgent = new DN(String.format(AGENT_DN, neName + '-' + lpName));
                                            String layerProtocolName = lf.findValue("layerProtocolName").asText();
                                            String dnODL = String.format(LP_Path, neName, lpName);

                                            DN finalDnAgent = dnAgent;
                                            try
                                            {
                                                when(() -> layerProtocolName.equalsIgnoreCase("MWPS"), () ->
                                                        communicator.set(dnODL,
                                                                getter.next(finalDnAgent, lpName, "txFrequency", communicator.get(dnODL, "txFrequency")),
                                                                getter.next(finalDnAgent, lpName, "rxFrequency", communicator.get(dnODL, "rxFrequency"))));
                                            }
                                            catch (Throwable e)
                                            {
                                            }

                                        })));

                            });
                            when(() -> !(elementNode.get("netconf-node-topology:connection-status").asText().equals("connected")), () -> System.out.println(elementNode.get("node-id") + " is offline"));
                        })));
    }

}
