/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.listener;

import com.highstreet.technologies.odl.app.impl.tools.NeExecutor;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.*;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfiguration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Properties;

/**
 * Created by odl on 17-6-6.
 */
public class ACMListener implements MicrowaveModelListener
{
    public ACMListener(NeExecutor ne)
    {
        this.ne = ne;
    }

    private static final Logger LOG = LoggerFactory.getLogger(ACMListener.class);
    private static Properties properties = null;

    static
    {
        properties = new Properties();
        try
        {
            properties.load(ACMListener.class.getClassLoader().getResourceAsStream("conf.properties"));
        }
        catch (IOException e)
        {
            LOG.warn("", e);
        }
    }

    private final NeExecutor ne;

    @Override
    public void onAttributeValueChangedNotification(
            AttributeValueChangedNotification notification)
    {
//        AttributeValueChangedNotification{getAttributeName=modulationCur, getCounter=8, getNewValue=64, getObjectIdRef=UniversalId [_value=LP-MWPS-AIR-5-1], getTimeStamp=DateAndTime [_value=2017-06-07T05:00:31.9397Z], augmentations={}}
//        txCapacity = AirInterface::AirInterfaceConfiguration::txChannelBandwidth * log2(AirInterface::AirInterfaceStatus::modulationCur) * AirInterface::AirInterfaceStatus::informationRateCur / 1,15 ;
//        txCapacity = txChannelBandwidth * log2(modulationCur) * informationRateCur / 1,15 ;
        try
        {
            if (notification.getAttributeName().equalsIgnoreCase("modulationCur"))
            {
                String newValue = notification.getNewValue();
                String lpId_airInterface = notification.getObjectIdRef().getValue();
                if (ne.isLtpOfThisOnPath(lpId_airInterface))
                {
                    AirInterfaceConfiguration airInterfaceConfiguration = ne.getUnderAirPac(
                            lpId_airInterface, AirInterfaceConfiguration.class);
                    AirInterfaceStatus airInterfaceStatus = ne.getUnderAirPac(
                            lpId_airInterface, AirInterfaceStatus.class);

                    Double txCapacity = airInterfaceConfiguration.getTxChannelBandwidth() * (Math.log(
                            Double.valueOf(newValue)) / Math.log(2.0)) * airInterfaceStatus.getCodeRateCur() / 1.15;
                    if (txCapacity < Double.valueOf(properties.getProperty("BANDWIDTH")))
                    {
                        ne.reportSwitch();
                    }
                }
            }
        }
        catch (ReadFailedException e)
        {
            LOG.warn("handling attribute change: " + notification + " caught exception!", e);
        }
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
        LOG.info("receiving alarm: " + notification.toString());
    }
}
