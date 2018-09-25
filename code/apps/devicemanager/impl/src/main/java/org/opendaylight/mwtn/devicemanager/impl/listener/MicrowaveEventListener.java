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
import org.opendaylight.mwtn.base.toggleAlarmFilter.NotificationDelayFilter;
import org.opendaylight.mwtn.base.toggleAlarmFilter.NotificationDelayService;
import org.opendaylight.mwtn.base.toggleAlarmFilter.NotificationDelayedListener;
import org.opendaylight.mwtn.devicemanager.impl.ProviderClient;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.xml.AttributeValueChangedNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.WebSocketServiceClient;
import org.opendaylight.mwtn.maintenance.MaintenaceService;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.AttributeValueChangedNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.MicrowaveModelNotificationsListener;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ObjectCreationNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ObjectDeletionNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160809.ProblemNotification;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.SeverityType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * Important: Websocket notificatin must be the last action.
 * @author herbert
 *
 */
public class MicrowaveEventListener implements MicrowaveModelNotificationsListener, NotificationDelayedListener<ProblemNotification> {

    private static final Logger LOG = LoggerFactory.getLogger(MicrowaveEventListener.class);

    private final String nodeName;
    private final WebSocketServiceClient webSocketService;
    private final HtDatabaseEventsService databaseService;
    private final ProviderClient dcaeProvider;
	private final @Nullable ProviderClient aotsmClient;
	private final MaintenaceService maintenanceService;
	private final NotificationDelayFilter<ProblemNotification> delayFilter;


    public MicrowaveEventListener(String nodeName, WebSocketServiceClient webSocketService,
            HtDatabaseEventsService databaseService, ProviderClient dcaeProvider,@Nullable ProviderClient aotsmClient, MaintenaceService maintenanceService, NotificationDelayService notificationDelayService) {
        super();
        this.nodeName = nodeName;
        this.webSocketService = webSocketService;
        this.databaseService = databaseService;
        this.dcaeProvider = dcaeProvider;
        this.aotsmClient = aotsmClient;
        this.maintenanceService = maintenanceService;
        this.delayFilter=notificationDelayService.getInstance10(nodeName,this);
    }

    @Override
    public void onAttributeValueChangedNotification(AttributeValueChangedNotification notification) {
        LOG.debug("Got event of type :: {}", AttributeValueChangedNotification.class.getSimpleName());

        AttributeValueChangedNotificationXml notificationXml = new AttributeValueChangedNotificationXml(nodeName,
                String.valueOf(notification.getCounter()), InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue(), notification.getAttributeName(), notification.getNewValue());

        databaseService.writeEventLog(notificationXml);
        // Last notification to client to make shure that database already changed
        webSocketService.sendViaWebsockets(nodeName, notificationXml);
    }

    @Override
    public void onObjectCreationNotification(ObjectCreationNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectCreationNotification.class.getSimpleName());

        ObjectCreationNotificationXml notificationXml = new ObjectCreationNotificationXml( nodeName,
                        notification.getCounter().toString(),
                        InternalDateAndTime.valueOf(notification.getTimeStamp()),
                        notification.getObjectIdRef().getValue());

        databaseService.writeEventLog(notificationXml);

        webSocketService.sendViaWebsockets(nodeName, notificationXml);

    }

    @Override
    public void onObjectDeletionNotification(ObjectDeletionNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectDeletionNotification.class.getSimpleName());

        ObjectDeletionNotificationXml notificationXml = new ObjectDeletionNotificationXml(nodeName,
                notification.getCounter().toString(),
                InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue()
                );

        databaseService.writeEventLog(notificationXml);
        webSocketService.sendViaWebsockets(nodeName, notificationXml);
    }

    @Override
	public void onProblemNotification(ProblemNotification notification) {

		LOG.debug("Got event of type :: {}", ProblemNotification.class.getSimpleName());

		ProblemNotificationXml notificationXml = new ProblemNotificationXml(nodeName,
				notification.getObjectIdRef().getValue(), notification.getProblem(),
				InternalSeverity.valueOf(notification.getSeverity()), notification.getCounter().toString(),
				InternalDateAndTime.valueOf(notification.getTimeStamp()));

		databaseService.writeFaultLog(notificationXml);
		databaseService.updateFaultCurrent(notificationXml);

		if (NotificationDelayFilter.isEnabled()) {
			if(notification.getSeverity() == SeverityType.NonAlarmed)
				delayFilter.clearAlarmNotification(notification.getProblem(), notification);
			else
				delayFilter.pushAlarmNotification(notification.getProblem(), notification);
		} else {

			this.pushAlarmIfNotInMaintenance(notificationXml);
		}
		webSocketService.sendViaWebsockets(nodeName, notificationXml);
	}


	@Override
	public void onNotificationDelay(ProblemNotification notification) {

    	 LOG.debug("Got delayed event of type :: {}", ProblemNotification.class.getSimpleName());

         ProblemNotificationXml notificationXml = new ProblemNotificationXml(nodeName, notification.getObjectIdRef().getValue(),
                 notification.getProblem(), InternalSeverity.valueOf(notification.getSeverity()),
                 notification.getCounter().toString(), InternalDateAndTime.valueOf(notification.getTimeStamp()));

       this.pushAlarmIfNotInMaintenance(notificationXml);
  	}
	 private void pushAlarmIfNotInMaintenance(ProblemNotificationXml notificationXml)
	    {
	    	if (!maintenanceService.isONFObjectInMaintenance(nodeName, notificationXml.getObjectId(),
					notificationXml.getProblem())) {
				if (dcaeProvider != null) {
					dcaeProvider.sendProblemNotification(nodeName, notificationXml);
				}
				if (aotsmClient != null) {
					aotsmClient.sendProblemNotification(nodeName, notificationXml);
				}
			} else {
				LOG.debug("Notification will not be sent to external services. Device " + this.nodeName
						+ " is in maintenance mode");
			}
	    }
    private void initCurrentProblem(ProblemNotificationXml notificationXml) {
        databaseService.updateFaultCurrent(notificationXml);
        if (aotsmClient != null) {
        	aotsmClient.sendProblemNotification(this.nodeName, notificationXml);
        }
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
