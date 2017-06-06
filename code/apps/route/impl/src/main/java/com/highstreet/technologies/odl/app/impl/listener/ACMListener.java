/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.listener;

import com.highstreet.technologies.odl.app.impl.stolen_xml.ProblemNotificationXml;
import com.highstreet.technologies.odl.app.impl.stolen_xml.XmlMapper;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by odl on 17-6-6.
 */
public class ACMListener implements MicrowaveModelNotificationsListener
{
    public ACMListener(String nodeName)
    {
        this.nodeName = nodeName;
    }

    private static final Logger LOG = LoggerFactory.getLogger(ACMListener.class);
    private static XmlMapper xmlMapper = new XmlMapper();
    private final String nodeName;

    @Override
    public void onAttributeValueChangedNotification(
            AttributeValueChangedNotification notification)
    {

    }

    @Override
    public void onObjectCreationNotification(
            ObjectCreationNotification notification)
    {

    }

    @Override
    public void onObjectDeletionNotification(
            ObjectDeletionNotification notification)
    {

    }

    @Override
    public void onProblemNotification(
            ProblemNotification notification)
    {
        ProblemNotificationXml notificationXml = new ProblemNotificationXml(nodeName, notification);
        String xmlString = xmlMapper.getXmlString(notificationXml);

        LOG.info("receiving alarm: " + xmlString);
    }
}
