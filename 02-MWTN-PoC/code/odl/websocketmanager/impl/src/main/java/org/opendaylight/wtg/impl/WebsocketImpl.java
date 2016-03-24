
/*
 * Copyright Â© 2016 Wipro technologies and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.wtg.impl;

import java.util.concurrent.Future;

import org.opendaylight.wtg.impl.websocket.WebSocketServerHandler;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

public class WebsocketImpl implements WebsocketmanagerService {

	@Override
	public Future<RpcResult<WebsocketOutput>> websocket(WebsocketInput input) {
		try {
			WebsocketOutputBuilder outputBuilder = new WebsocketOutputBuilder();
			String objectCreationNotification = input.getObjectCreationNotification();
			String objectDeletionNotification = input.getObjectDeletionNotification();
			String attrValueChangeNotification = input.getAttributeValueChangeNotification();
			String problemNotification = input.getProblemNotification();
			WebSocketServerHandler.sendMessage(objectCreationNotification, objectDeletionNotification,
					attrValueChangeNotification, problemNotification);
			outputBuilder.setResponse(problemNotification);
			return RpcResultBuilder.success(outputBuilder.build()).buildFuture();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
