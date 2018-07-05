/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.devicemanager.impl.listener;

import java.util.List;

import javax.annotation.Nullable;

import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.devicemanager.impl.ProviderClient;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.xml.AttributeValueChangedNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.WebSocketServiceClient;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AttributeValueChangedNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MicrowaveModelListener;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ObjectCreationNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ObjectDeletionNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ProblemNotification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Important: Websocket notification must be the last action.
 * @author herbert
 *
 */
public class MicrowaveEventListener12 implements MicrowaveModelListener {

    private static final Logger LOG = LoggerFactory.getLogger(MicrowaveEventListener12.class);

    private final String nodeName;
    private final WebSocketServiceClient webSocketService;
    //private final WebsocketmanagerService websocketmanagerService;
    //private final XmlMapper xmlMapper;
    private final HtDatabaseEventsService databaseService;
    private final ProviderClient dcaeProvider;
	private final @Nullable ProviderClient aotsmClient;

    public MicrowaveEventListener12(String nodeName, WebSocketServiceClient webSocketService,
            HtDatabaseEventsService databaseService, ProviderClient dcaeProvider,@Nullable ProviderClient aotsmClient) {
        super();
        this.nodeName = nodeName;
        //this.websocketmanagerService = websocketmanagerService;
        //this.xmlMapper = xmlMapper;
        this.webSocketService = webSocketService;
        this.databaseService = databaseService;
        this.dcaeProvider = dcaeProvider;
        this.aotsmClient = aotsmClient;
    }

    @Override
    public void onAttributeValueChangedNotification(AttributeValueChangedNotification notification) {
        LOG.debug("Got event of type :: {}", AttributeValueChangedNotification.class.getSimpleName());

        AttributeValueChangedNotificationXml notificationXml = new AttributeValueChangedNotificationXml(nodeName,
                String.valueOf(notification.getCounter()), InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue(), notification.getAttributeName(), notification.getNewValue());
        /*
        WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
        builder.setNodeName(nodeName);
        builder.setEventType(AttributeValueChangedNotification.class.getSimpleName());
        builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        WebsocketEventInput event= builder.build();
        websocketmanagerService.websocketEvent(event);
        */
        databaseService.writeEventLog(notificationXml);

        webSocketService.sendViaWebsockets(nodeName, notificationXml);
    }

    @Override
    public void onObjectCreationNotification(ObjectCreationNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectCreationNotification.class.getSimpleName());

        //ObjectCreationNotificationXml notificationXml = new ObjectCreationNotificationXml(nodeName, notification);
        ObjectCreationNotificationXml notificationXml = new ObjectCreationNotificationXml(    nodeName,
                notification.getCounter().toString(),
                InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue());
        /*
        WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
        builder.setNodeName(nodeName);
        builder.setEventType(notificationXml.getEventType());
        builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        websocketmanagerService.websocketEvent(builder.build());
        */
        databaseService.writeEventLog(notificationXml);

        webSocketService.sendViaWebsockets(nodeName, notificationXml);

    }

    @Override
    public void onObjectDeletionNotification(ObjectDeletionNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectDeletionNotification.class.getSimpleName());

        //ObjectDeletionNotificationXml notificationXml = new ObjectDeletionNotificationXml(nodeName, notification);
        ObjectDeletionNotificationXml notificationXml = new ObjectDeletionNotificationXml(nodeName,
                notification.getCounter().toString(),
                InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue()
                );
        /*
        WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
        builder.setNodeName(nodeName);
        builder.setEventType(ObjectDeletionNotification.class.getSimpleName());
        builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        websocketmanagerService.websocketEvent(builder.build());
        */
        databaseService.writeEventLog(notificationXml);

        webSocketService.sendViaWebsockets(nodeName, notificationXml);
    }

    @Override
    public void onProblemNotification(ProblemNotification notification) {
        LOG.debug("Got event of type :: {}", ProblemNotification.class.getSimpleName());

        ProblemNotificationXml notificationXml = new ProblemNotificationXml(nodeName, notification.getObjectIdRef().getValue(),
                notification.getProblem(), InternalSeverity.valueOf(notification.getSeverity()),
                notification.getCounter().toString(), InternalDateAndTime.valueOf(notification.getTimeStamp()));
        /*
        WebsocketEventInputBuilder wsBuilder = new WebsocketEventInputBuilder();
        wsBuilder.setNodeName(nodeName);
        wsBuilder.setEventType(ProblemNotification.class.getSimpleName());
        wsBuilder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
        websocketmanagerService.websocketEvent(wsBuilder.build());
        */

        databaseService.writeFaultLog(notificationXml);
        databaseService.updateFaultCurrent(notificationXml);

        dcaeProvider.sendProblemNotification(nodeName, notificationXml);
        if(aotsmClient!=null)
        	aotsmClient.sendProblemNotification(nodeName, notificationXml);

        webSocketService.sendViaWebsockets(nodeName, notificationXml);

    }

    private void initCurrentProblem(ProblemNotificationXml notificationXml) {
        databaseService.updateFaultCurrent(notificationXml);
        if(aotsmClient!=null)
        	aotsmClient.sendProblemNotification(this.nodeName, notificationXml);
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
