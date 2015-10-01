/*
 * Copyright 2014-2015 Open Networking Laboratory
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.onosproject.cli.net;

import org.apache.karaf.shell.commands.Argument;
import org.apache.karaf.shell.commands.Command;
import org.onosproject.net.Link;
import org.onosproject.net.link.LinkService;

import org.onosproject.net.ConnectPoint;
import org.onosproject.net.flow.TrafficSelector;
import org.onosproject.net.flow.TrafficTreatment;
import org.onosproject.net.intent.Constraint;
import org.onosproject.net.intent.Intent;
import org.onosproject.net.intent.IntentService;
import org.onosproject.net.intent.LinkCollectionIntent;

import com.google.common.collect.ImmutableSet;

import java.util.HashSet;
import java.util.List;

/**
 * Installs point-to-point connectivity extra intent.
 */
@Command(scope = "onos", name = "add-point-intent-ext",
         description = "Installs point-to-point connectivity extended intent")
public class AddPointToPointIntentExtendedCommand extends ConnectivityIntentCommand {

    @Argument(index = 0, name = "ingressDevice",
              description = "Ingress Device/Port Description",
              required = true, multiValued = false)
    String ingressDeviceString = null;

    @Argument(index = 1, name = "egressDevice",
              description = "Egress Device/Port Description",
              required = true, multiValued = false)
    String egressDeviceString = null;

    @Argument(index = 2, name = "ingressLinkPort",
              description = "Ingress Device/Port Description",
              required = true, multiValued = false)
    String ingressLinkPortString = null;

    @Argument(index = 3, name = "egressLinkPort",
              description = "Egress Device/Port Description",
              required = true, multiValued = false)
    String egressLinkPortString = null;

    @Override
    protected void execute() {
        IntentService intentService = get(IntentService.class);

        ConnectPoint ingressDev = ConnectPoint.deviceConnectPoint(ingressDeviceString);

        ConnectPoint egressDev = ConnectPoint.deviceConnectPoint(egressDeviceString);


        LinkService linkService = get(LinkService.class);

        ConnectPoint ingressLink = ConnectPoint.deviceConnectPoint(ingressLinkPortString);

        ConnectPoint egressLink = ConnectPoint.deviceConnectPoint(egressLinkPortString);

        final HashSet<Link> links = new HashSet<>();
        Link link = linkService.getLink(ingressLink, egressLink);
        links.add(link);

        TrafficSelector selector = buildTrafficSelector();
        TrafficTreatment treatment = buildTrafficTreatment();

        List<Constraint> constraints = buildConstraints();

        Intent intent = LinkCollectionIntent.builder()
                .appId(appId())
                .key(key())
                .selector(selector)
                .treatment(treatment)
                .links(links)
                .ingressPoints(ImmutableSet.of(ingressDev))
                .egressPoints(ImmutableSet.of(egressDev))
                .constraints(constraints)
                .priority(priority())
                .build();
        intentService.submit(intent);
        print("link intent submitted:\n%s", intent.toString());
    }
}
