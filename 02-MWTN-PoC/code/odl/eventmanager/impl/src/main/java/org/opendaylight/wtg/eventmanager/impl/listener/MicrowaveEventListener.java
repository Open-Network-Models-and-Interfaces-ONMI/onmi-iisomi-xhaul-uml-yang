/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.wtg.eventmanager.impl.listener;

import org.opendaylight.wtg.eventmanager.impl.xml.AttributeValueChangedNotificationXml;
import org.opendaylight.wtg.eventmanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.wtg.eventmanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.wtg.eventmanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.wtg.eventmanager.impl.xml.XmlMapper;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.MicrowaveModelNotificationsListener;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectCreationNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ProblemNotification;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MicrowaveEventListener implements MicrowaveModelNotificationsListener {

	private static final Logger LOG = LoggerFactory.getLogger(MicrowaveEventListener.class);

	private String nodeName;
	private WebsocketmanagerService websocketmanagerService;
	private XmlMapper xmlMapper;

	public MicrowaveEventListener(String nodeName, WebsocketmanagerService websocketmanagerService,
			XmlMapper xmlMapper) {
		super();
		this.nodeName = nodeName;
		this.websocketmanagerService = websocketmanagerService;
		this.xmlMapper = xmlMapper;
	}

	@Override
	public void onAttributeValueChangedNotification(AttributeValueChangedNotification notification) {
		LOG.info("Got event of type :: {}", AttributeValueChangedNotification.class.getSimpleName());

		WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
		AttributeValueChangedNotificationXml notificationXml = new AttributeValueChangedNotificationXml(nodeName,
				notification);

		builder.setNodeName(nodeName);
		builder.setEventType(AttributeValueChangedNotification.class.getSimpleName());
		builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
		websocketmanagerService.websocketEvent(builder.build());
	}

	@Override
	public void onObjectCreationNotification(ObjectCreationNotification notification) {
		LOG.info("Got event of type :: {}", ObjectCreationNotification.class.getSimpleName());

		WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
		ObjectCreationNotificationXml notificationXml = new ObjectCreationNotificationXml(nodeName, notification);

		builder.setNodeName(nodeName);
		builder.setEventType(ObjectCreationNotification.class.getSimpleName());
		builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
		websocketmanagerService.websocketEvent(builder.build());
	}

	@Override
	public void onObjectDeletionNotification(ObjectDeletionNotification notification) {
		LOG.info("Got event of type :: {}", ObjectDeletionNotification.class.getSimpleName());

		WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
		ObjectDeletionNotificationXml notificationXml = new ObjectDeletionNotificationXml(nodeName, notification);

		builder.setNodeName(nodeName);
		builder.setEventType(ObjectDeletionNotification.class.getSimpleName());
		builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
		websocketmanagerService.websocketEvent(builder.build());
	}

	@Override
	public void onProblemNotification(ProblemNotification notification) {
		LOG.info("Got event of type :: {}", ProblemNotification.class.getSimpleName());

		WebsocketEventInputBuilder builder = new WebsocketEventInputBuilder();
		ProblemNotificationXml notificationXml = new ProblemNotificationXml(nodeName, notification);

		builder.setNodeName(nodeName);
		builder.setEventType(ProblemNotification.class.getSimpleName());
		builder.setXmlEvent(xmlMapper.getXmlString(notificationXml));
		websocketmanagerService.websocketEvent(builder.build());
	}
}
