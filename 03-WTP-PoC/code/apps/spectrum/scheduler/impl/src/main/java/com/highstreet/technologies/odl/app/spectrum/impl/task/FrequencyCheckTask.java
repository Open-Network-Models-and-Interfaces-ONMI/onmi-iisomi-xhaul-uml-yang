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

import static com.highstreet.technologies.odl.app.spectrum.impl.primitive.When.when;

/**
 * Created by odl on 10/25/16.
 */
public class FrequencyCheckTask extends SpectrumTask {
    private final DataAgent agent;

    public FrequencyCheckTask(DataAgent agent, Communicator communicator) {
        super(agent, communicator);
        this.agent = agent;
    }

    @Override
    public void execute() {
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
                                            String layerProtocolName = lf.findValue("layerProtocolName").asText();
                                            DN dnAgent = new DN(String.format(AGENT_DN, neName));
                                            if (neName.startsWith("Nokia"))
                                                dnAgent = new DN(String.format(AGENT_DN, neName + '-' + lpName));
                                            String dnODL = String.format(LP_Path, neName, lpName);

                                            final String[] value = {"N/A"};
                                            DN finalDnAgent = dnAgent;
                                            when(() -> layerProtocolName.equalsIgnoreCase("MWPS"), () ->
                                            {
                                                when(() -> {
                                                    try {
                                                        return !agent.ls(new DN(finalDnAgent.toString()).append("txFrequency")).contains(value[0] = String.valueOf(communicator.get(dnODL, "txFrequency")));
                                                    } catch (Exception e) {
                                                        return true;
                                                    }
                                                }, () -> System.out.println(dnODL.replace("network-topology:network-topology/topology/topology-netconf/node/", "")
                                                        .replace("/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac", "")
                                                        + " the txFrequency configured " + value[0] + " is not in the list"));
                                                when(() -> {
                                                    try {
                                                        return !agent.ls(new DN(finalDnAgent.toString()).append("rxFrequency")).contains(value[0] = String.valueOf(communicator.get(dnODL, "rxFrequency")));
                                                    } catch (Exception e) {
                                                        return true;
                                                    }
                                                }, () -> System.out.println(dnODL.replace("network-topology:network-topology/topology/topology-netconf/node/", "")
                                                        .replace("/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac", "")
                                                        + " the rxFrequency configured " + value[0] + " is not in the list"));
                                            });



                                        })));
                            });

                            when(() -> !(elementNode.get("netconf-node-topology:connection-status").asText().equals("connected")), () -> System.out.println(elementNode.get("node-id") + " is offline"));
                        })));

    }
}
