/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.devicemanager.impl.listener;

import java.util.List;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.xml.AttributeValueChangedNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.XmlMapper;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AttributeValueChangedNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MicrowaveModelListener;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ObjectCreationNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ObjectDeletionNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MicrowaveEventListener12 implements MicrowaveModelListener {

    private static final Logger LOG = LoggerFactory.getLogger(MicrowaveEventListener12.class);

    private final String nodeName;
    private final WebsocketmanagerService websocketmanagerService;
    private final XmlMapper xmlMapper;
    private final HtDatabaseEventsService databaseService;

    public MicrowaveEventListener12(String nodeName, WebsocketmanagerService websocketmanagerService,
            XmlMapper xmlMapper, HtDatabaseEventsService databaseService) {
        super();
        this.nodeName = nodeName;
        this.websocketmanagerService = websocketmanagerService;
        this.xmlMapper = xmlMapper;
        this.databaseService = databaseService;

    }

    @Override
    public void onAttributeValueChangedNotification(AttributeValueChangedNotification notification) {
        LOG.debug("Got event of type :: {}", AttributeValueChangedNotification.class.getSimpleName());

        AttributeValueChangedNotificationXml notificationXml = new AttributeValueChangedNotificationXml(nodeName,
                notification);

        WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
        builder.setNodeName(nodeName);
        builder.setEventType(AttributeValueChangedNotification.class.getSimpleName());
        builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        WebsocketEventInput event= builder.build();
        websocketmanagerService.websocketEvent(event);

        databaseService.writeEventLog(notificationXml);
    }

    @Override
    public void onObjectCreationNotification(ObjectCreationNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectCreationNotification.class.getSimpleName());

        ObjectCreationNotificationXml notificationXml = new ObjectCreationNotificationXml(nodeName, notification);

        WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
        builder.setNodeName(nodeName);
        builder.setEventType(ObjectCreationNotification.class.getSimpleName());
        builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        websocketmanagerService.websocketEvent(builder.build());

        databaseService.writeEventLog(notificationXml);

    }

    @Override
    public void onObjectDeletionNotification(ObjectDeletionNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectDeletionNotification.class.getSimpleName());

        WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
        ObjectDeletionNotificationXml notificationXml = new ObjectDeletionNotificationXml(nodeName, notification);

        builder.setNodeName(nodeName);
        builder.setEventType(ObjectDeletionNotification.class.getSimpleName());
        builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        websocketmanagerService.websocketEvent(builder.build());

        databaseService.writeEventLog(notificationXml);
    }

    @Override
    public void onProblemNotification(ProblemNotification notification) {
        LOG.debug("Got event of type :: {}", ProblemNotification.class.getSimpleName());

        ProblemNotificationXml notificationXml = new ProblemNotificationXml(nodeName, notification);

        WebsocketEventInputBuilder wsBuilder = new WebsocketEventInputBuilder();
        wsBuilder.setNodeName(nodeName);
        wsBuilder.setEventType(ProblemNotification.class.getSimpleName());
        wsBuilder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        websocketmanagerService.websocketEvent(wsBuilder.build());

        databaseService.writeFaultLog(notificationXml);
        databaseService.updateFaultCurrent(notificationXml);

    }

    private void initCurrentProblem(ProblemNotificationXml notificationXml) {
        databaseService.updateFaultCurrent(notificationXml);

    }

    /**
     * Called to initialize with the current status and notify the clients
     * @param notificationXmlList List with problems
     */
    public void initCurrentProblem(List<ProblemNotificationXml> notificationXmlList) {

        for (ProblemNotificationXml notificationXml : notificationXmlList) {
            initCurrentProblem(notificationXml);
        }

    }

    /**
     * Called on exit to remove everything from the current list.
     * @return Number of deleted objects
     */
    public int removeAllCurrentProblemsOfNode() {
        int deleted = databaseService.clearFaultsCurrentOfNode(nodeName);
        return deleted;
    }

}
