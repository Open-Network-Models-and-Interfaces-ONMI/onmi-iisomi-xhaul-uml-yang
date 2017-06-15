/*
 * Copyright © 2015 ZTE and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package com.highstreet.technologies.odl.app.impl.listener;

import com.highstreet.technologies.odl.app.impl.RouteRPC;
import com.highstreet.technologies.odl.app.impl.tools.BandwidthCalculator;
import com.highstreet.technologies.odl.app.impl.tools.DataBrokerHolder;
import com.highstreet.technologies.odl.app.impl.tools.NeExecutor;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170615.ThresholdOfPath;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.ltp.path.rev170615.threshold.of.path.Threshold;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.*;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfiguration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceStatus;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.CONFIGURATION;
import static org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType.OPERATIONAL;

/**
 * Created by odl on 17-6-6.
 */
public class ACMListener implements MicrowaveModelListener
{
    public ACMListener(String nodeName)
    {
        this.nodeName = nodeName;
    }

    private static final Logger LOG = LoggerFactory.getLogger(ACMListener.class);
    private static double bandwidth;

    static
    {
        ReadOnlyTransaction readOnlyTransaction = DataBrokerHolder.getDataBroker().newReadOnlyTransaction();
        InstanceIdentifier<Threshold> instanceIdentifier = InstanceIdentifier.create(ThresholdOfPath.class).child(
                Threshold.class);
        try
        {
            Threshold threshold = readOnlyTransaction.read(CONFIGURATION, instanceIdentifier).get().get();
            bandwidth = threshold.getMinimumBandwidth().doubleValue();
        }
        catch (Exception e)
        {
            LOG.warn("", e);
        }
        finally
        {
            readOnlyTransaction.close();
        }
    }

    private final String nodeName;

    @Override
    public void onAttributeValueChangedNotification(
            AttributeValueChangedNotification notification)
    {
//        AttributeValueChangedNotification{getAttributeName=modulationCur, getCounter=8, getNewValue=64, getObjectIdRef=UniversalId [_value=LP-MWPS-AIR-5-1], getTimeStamp=DateAndTime [_value=2017-06-07T05:00:31.9397Z], augmentations={}}
//        txCapacity = AirInterface::AirInterfaceConfiguration::txChannelBandwidth * log2(AirInterface::AirInterfaceStatus::modulationCur) * AirInterface::AirInterfaceStatus::informationRateCur / 1,15 ;
//        txCapacity = txChannelBandwidth * log2(modulationCur) * informationRateCur / 1,15 ;
        NeExecutor ne = RouteRPC.ne_map.get(nodeName);
        if (ne == null)
            return;
        try
        {
            if (notification.getAttributeName().equalsIgnoreCase("modulationCur"))
            {
                String lpId_airInterface = notification.getObjectIdRef().getValue();
                if (ne.isLtpOfThisOnPath(lpId_airInterface))
                {
                    AirInterfaceConfiguration airInterfaceConfiguration = ne.getUnderAirPac(
                            lpId_airInterface, AirInterfaceConfiguration.class, CONFIGURATION);
                    AirInterfaceStatus airInterfaceStatus = ne.getUnderAirPac(
                            lpId_airInterface, AirInterfaceStatus.class, OPERATIONAL);

                    Double txCapacity = new BandwidthCalculator(
                            airInterfaceConfiguration.getTxChannelBandwidth(), airInterfaceStatus.getModulationCur(),
                            airInterfaceStatus.getCodeRateCur()).calc();
                    if (txCapacity < bandwidth)
                    {
                        ne.reportSwitch();
                    }
                }
            }
        }
        catch (Exception e)
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
        String lpId_airInterface = "airIntf1-LP-1";
//        try
//        {
//            NeExecutor ne = RouteRPC.ne_map.get(nodeName);
//            if (nodeName == null)
//                return;
//            AirInterfaceConfiguration airInterfaceConfiguration = ne.getUnderAirPac(
//                    lpId_airInterface, AirInterfaceConfiguration.class, CONFIGURATION);
//            AirInterfaceStatus airInterfaceStatus = ne.getUnderAirPac(
//                    lpId_airInterface, AirInterfaceStatus.class, OPERATIONAL);
//
//            Double txCapacity = new BandwidthCalculator(
//                    airInterfaceConfiguration.getTxChannelBandwidth(), airInterfaceStatus.getModulationCur(),
//                    airInterfaceStatus.getCodeRateCur()).calc();
//            if (txCapacity < bandwidth)
//            {
//                ne.reportSwitch();
//            }
//        }
//        catch (Exception e)
//        {
//            LOG.warn("", e);
//        }
    }
}
