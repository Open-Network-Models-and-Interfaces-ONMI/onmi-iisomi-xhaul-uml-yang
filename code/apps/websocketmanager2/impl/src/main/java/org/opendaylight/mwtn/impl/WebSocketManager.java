package org.opendaylight.mwtn.impl;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.concurrent.Future;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
import org.json.JSONObject;
import org.opendaylight.mwtn.impl.WebSocketManagerSocket.EventInputCallback;
import org.opendaylight.mwtn.impl.utils.AkkaConfig;
import org.opendaylight.mwtn.impl.utils.AkkaConfig.ClusterConfig;
import org.opendaylight.mwtn.impl.utils.AkkaConfig.ClusterNodeInfo;
import org.opendaylight.mwtn.impl.websocket.SyncWebSocketClient;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventOutput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketEventOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.opendaylight.yangtools.yang.common.RpcResult;
import org.opendaylight.yangtools.yang.common.RpcResultBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebSocketManager extends WebSocketServlet implements WebsocketmanagerService {

	/**
	 * 
	 */
	private static final long serialVersionUID = -681665669062744439L;
	
	private static final Logger LOG = LoggerFactory.getLogger(WebSocketManager.class.getName());

	private static final int PORT = 8085;
	private ArrayList<URI> clusterNodeClients;

	@Override
	public void configure(WebSocketServletFactory factory) {
		// set a 10 second timeout
		factory.getPolicy().setIdleTimeout(10000);

		// register Socket as the WebSocket to create on Upgrade
		factory.register(WebSocketManagerSocket.class);

		AkkaConfig cfg = null;
		try {
			cfg = AkkaConfig.load();
		} catch (Exception e) {
			LOG.warn("problem loading akka config: " + e.getMessage());
		}
		if (cfg != null && cfg.isCluster()) {
			this.initWSClients(cfg.getClusterConfig());
		}
	}

	private void initWSClients(ClusterConfig clusterConfig) {
		clusterNodeClients = new ArrayList<URI>();
		for (ClusterNodeInfo nodeConfig : clusterConfig.getSeedNodes()) {
			if (clusterConfig.isMe(nodeConfig))
				continue;
			String url = String.format("ws://%s:%d/websocket", nodeConfig.getRemoteAddress(), PORT);
			try {
				LOG.debug("registering ws client for " + url);
				clusterNodeClients.add(new URI(url));
			} catch (URISyntaxException e) {
				LOG.warn("problem instantiating wsclient for url: " + url);
			}
		}
	}
	
	private final EventInputCallback rpcEventInputCallback=new EventInputCallback() {

		@Override
		public void onMessagePushed(String message) throws Exception {

			LOG.debug("onMessagePushed: "+message);
			if(WebSocketManager.this.clusterNodeClients!=null &&
					WebSocketManager.this.clusterNodeClients.size()>0)
			{
				SyncWebSocketClient client;
				for(URI clientURI : WebSocketManager.this.clusterNodeClients)
				{
					client=new SyncWebSocketClient(clientURI);
					LOG.debug("try to push message to "+client.getURI());
					client.openAndSendAndCloseSync(message);
				}
			}
		}
	};

	@Override
	public Future<RpcResult<WebsocketEventOutput>> websocketEvent(WebsocketEventInput input) {
		 LOG.debug("Send message '{}'", input);
	        try {
	            WebsocketEventOutputBuilder outputBuilder = new WebsocketEventOutputBuilder();
	            final String s=input.getXmlEvent();
	            WebSocketManagerSocket.broadCast(input.getNodeName(), input.getEventType(),s );
	            outputBuilder.setResponse("OK");
	            try {
	            	JSONObject o=new JSONObject();
	            	o.put(WebSocketManagerSocket.KEY_NODENAME, input.getNodeName());
	            	o.put(WebSocketManagerSocket.KEY_EVENTTYPE, input.getEventType());
	            	o.put(WebSocketManagerSocket.KEY_XMLEVENT, input.getXmlEvent());
	            	this.rpcEventInputCallback.onMessagePushed(o.toString());
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

}
