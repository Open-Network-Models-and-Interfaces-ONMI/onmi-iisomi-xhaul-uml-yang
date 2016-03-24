/*
	
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
	
*
	
* This program and the accompanying materials are made available under the
	
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
	
* and is available at http://www.eclipse.org/legal/epl-v10.html
	
*/

package org.opendaylight.wtg.eventmanager.impl.listener;

import org.opendaylight.wtg.eventmanager.forward.EventForwarder;
import org.opendaylight.yang.gen.v1.urn.onf.simpleairinterface.objectclasses.rev160222.SimpleAirInterfaceObjectClassesListener;
import org.opendaylight.yang.gen.v1.urn.onf.simpleairinterface.objectclasses.rev160222.LinkFailure;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LinkFailureListener implements SimpleAirInterfaceObjectClassesListener {

	private static final Logger LOG = LoggerFactory.getLogger(LinkFailureListener.class);
	private String nodeName;
	private EventForwarder eventForwarder;

	public LinkFailureListener(String nodeName, EventForwarder eventForwarder) {
		this.nodeName = nodeName;
		this.eventForwarder = eventForwarder;
	}

	@Override
	public void onLinkFailure(LinkFailure notification) {
		LOG.info("Received Event :: notification : {}, on Node : {}", notification, nodeName);

		String ifName = notification.getIfName();
		String event = "\n====EVENT====\nNode Name : " + nodeName + "\nNotification Type : "
				+ LinkFailure.class.getName() + "\nInterface Name : " + ifName;
		eventForwarder.sendEvent(event);
	}
}