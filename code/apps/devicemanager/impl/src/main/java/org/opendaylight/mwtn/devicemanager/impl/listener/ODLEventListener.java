/*
* Copyright (c) 2017 highstreet technologies GmbH and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.devicemanager.impl.listener;

import org.opendaylight.mwtn.base.netconf.NetconfTimeStamp;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.XmlMapper;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160710.UniversalId;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ObjectCreationNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ObjectCreationNotificationBuilder;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ObjectDeletionNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ObjectDeletionNotificationBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Responsible class for documenting changes in the ODL itself.
 * The occurence of such an event is documented in the database and to clients.
 * Specific example here is the registration or deregistration of a netconf device.
 * This service has an own eventcounter to apply to the ONF Coremodel netconf behaviour.
 *
 * @author herbert
 */

public class ODLEventListener {

    private static final Logger LOG = LoggerFactory.getLogger(ODLEventListener.class);

    private static final String ATTRIBUTENAME = "netconf-session";

    private final String ownKeyName;

    private final WebsocketmanagerService websocketmanagerService;
    private final HtDatabaseEventsService databaseService;

    private final XmlMapper xmlMapper;

    private int eventNumber;

    /**
     * Create a Service to document events to clients and within a database
     * @param ownKeyName The name of this service, that is used in the database as identification key.
     * @param websocketmanagerService service to direct messages to clients
     * @param xmlMapper mapping service that is used to create xml messages
     * @param databaseService service to write to the database
     */
    public ODLEventListener(String ownKeyName, WebsocketmanagerService websocketmanagerService,
            XmlMapper xmlMapper, HtDatabaseEventsService databaseService) {
        super();

        this.ownKeyName = ownKeyName;
        this.eventNumber = 0;
        this.databaseService = databaseService;
        this.websocketmanagerService = websocketmanagerService;
        this.xmlMapper = xmlMapper;

    }

    /**
     * A registration of a mountpoint occured.
     * @param registrationName Name of the event that is used as key in the database.
     */

    public void registration(String registrationName) {

        ObjectCreationNotificationBuilder builder = new ObjectCreationNotificationBuilder();
        builder.setCounter(popEvntNumber());
        builder.setObjectIdRef(new UniversalId(registrationName));
        builder.setObjectType(ATTRIBUTENAME);
        builder.setTimeStamp(NetconfTimeStamp.getTimeStamp());
        ObjectCreationNotification notification = builder.build();

        ObjectCreationNotificationXml cNotificationXml = new ObjectCreationNotificationXml(ownKeyName, notification);

        // Write first to prevent missing entries
        databaseService.writeEventLog(cNotificationXml);

        try {
            WebsocketEventInputBuilder wsBuilder = new WebsocketEventInputBuilder();
            wsBuilder.setNodeName(ownKeyName);
            wsBuilder.setEventType(ObjectCreationNotification.class.getSimpleName());
            wsBuilder.setXmlEvent(xmlMapper.getXmlString(cNotificationXml));
            websocketmanagerService.websocketEvent(wsBuilder.build());
        } catch (Exception e) {
            LOG.warn("Can not send websocket event registration for mountpoint {} {}", registrationName, e.toString());
        }

    }

    /**
     * A deregistration of a mountpoint occured.
     * @param registrationName Name of the event that is used as key in the database.
     */

    public void deRegistration(String registrationName) {

        ObjectDeletionNotificationBuilder builder2 = new ObjectDeletionNotificationBuilder();
        builder2.setCounter(popEvntNumber());
        builder2.setObjectIdRef(new UniversalId(registrationName));
        builder2.setTimeStamp(NetconfTimeStamp.getTimeStamp());
        ObjectDeletionNotification notification = builder2.build();

        ObjectDeletionNotificationXml dNotificationXml = new ObjectDeletionNotificationXml(ownKeyName, notification);

        // Write first to prevent missing entries
        databaseService.writeEventLog(dNotificationXml);

        try {
            WebsocketEventInputBuilder wsBuilder = new WebsocketEventInputBuilder();
            wsBuilder.setNodeName(ownKeyName);
            wsBuilder.setEventType(ObjectDeletionNotification.class.getSimpleName());
            wsBuilder.setXmlEvent(xmlMapper.getXmlString(dNotificationXml));
            websocketmanagerService.websocketEvent(wsBuilder.build());
        } catch (Exception e) {
            LOG.warn("Can not send websocket event deregistration for mountpoint {} {}", registrationName, e.toString());
        }

    }

    private int popEvntNumber() {
        return eventNumber++;
    }
}
