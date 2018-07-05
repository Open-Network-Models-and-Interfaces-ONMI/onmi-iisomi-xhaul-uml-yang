/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.impl;

import java.util.concurrent.Future;

import org.json.JSONObject;
import org.opendaylight.mwtn.impl.websocket.WebSocketServerHandler;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebsocketImpl implements WebsocketmanagerService {

	public interface EventInputCallback
	{
		void onMessagePushed(final String message) throws Exception;
	}
    private static final Logger LOG = LoggerFactory.getLogger(WebsocketImpl.class);

    private final EventInputCallback cb;

    public WebsocketImpl()
    {
    	this(null);
    }
    public WebsocketImpl(EventInputCallback callback)
    {
    	this.cb=callback;
    }
	@Override
    public Future<RpcResult<WebsocketEventOutput>> websocketEvent(WebsocketEventInput input) {
        LOG.debug("Send message '{}'", input);
        try {
            WebsocketEventOutputBuilder outputBuilder = new WebsocketEventOutputBuilder();
            final String s=input.getXmlEvent();
            WebSocketServerHandler.sendMessage(input.getNodeName(), input.getEventType(),s );
            outputBuilder.setResponse("OK");
            if(this.cb!=null)
            try {
            	JSONObject o=new JSONObject();
            	o.put(WebSocketServerHandler.KEY_NODENAME, input.getNodeName());
            	o.put(WebSocketServerHandler.KEY_EVENTTYPE, input.getEventType());
            	o.put(WebSocketServerHandler.KEY_XMLEVENT, input.getXmlEvent());
            	this.cb.onMessagePushed(o.toString());
            }
            catch(Exception err)
            {
            	LOG.warn("problem pushing messsage to other nodes: "+err.getMessage());
            }
            return RpcResultBuilder.success(outputBuilder.build()).buildFuture();
        } catch (Exception e) {
            LOG.warn("Socketproblem: {}", e);
        }
        return null;
    }


	/*
	public void websocketSend(String message) {
		 LOG.debug("Send message '{}'", message);
	        try {
	            WebsocketEventOutputBuilder outputBuilder = new WebsocketEventOutputBuilder();
	            WebSocketServerHandler.sendMessage(message);
	            outputBuilder.setResponse("OK");

	        } catch (Exception e) {
	            LOG.warn("Socketproblem: {}", e);
	        }
	}
	*/
}
