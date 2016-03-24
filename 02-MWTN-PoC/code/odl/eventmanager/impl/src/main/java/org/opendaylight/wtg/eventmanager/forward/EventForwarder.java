/*
	
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
	
*
	
* This program and the accompanying materials are made available under the
	
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
	
* and is available at http://www.eclipse.org/legal/epl-v10.html
	
*/

package org.opendaylight.wtg.eventmanager.forward;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketInputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;

public class EventForwarder {

	private WebsocketmanagerService websocketmanagerService;

	public EventForwarder(WebsocketmanagerService websocketmanagerService) {
		this.websocketmanagerService = websocketmanagerService;
	}

	public void sendEvent(String event) {
		WebsocketInputBuilder inputBuilder = new WebsocketInputBuilder();
		inputBuilder.setProblemNotification(event);
		websocketmanagerService.websocket(inputBuilder.build());
	}
}
