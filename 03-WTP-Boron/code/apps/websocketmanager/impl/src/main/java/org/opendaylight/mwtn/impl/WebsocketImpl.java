/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.impl;

import java.util.concurrent.Future;

import org.opendaylight.mwtn.impl.websocket.WebSocketServerHandler;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;

public class WebsocketImpl implements WebsocketmanagerService {

	@Override
	public Future<RpcResult<WebsocketEventOutput>> websocketEvent(WebsocketEventInput input) {
		try {
			WebsocketEventOutputBuilder outputBuilder = new WebsocketEventOutputBuilder();

			WebSocketServerHandler.sendMessage(input.getNodeName(), input.getEventType(), input.getXmlEvent());
			outputBuilder.setResponse("OK");
			return RpcResultBuilder.success(outputBuilder.build()).buildFuture();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
