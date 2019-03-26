package org.opendaylight.mwtn.impl.websocket;

import java.net.URI;
import java.net.URISyntaxException;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SyncWebSocketClient extends WebSocketClient {

	private static final Logger LOG = LoggerFactory.getLogger(SyncWebSocketClient.class.getName());
	private String messageToSend;

	public SyncWebSocketClient(URI serverUri) {
		super(serverUri);
		// TODO Auto-generated constructor stub
	}

	public SyncWebSocketClient(String uri) throws URISyntaxException {
		this(new URI(uri));
	}

	@Override
	public void onClose(int arg0, String arg1, boolean arg2) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onError(Exception arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onMessage(String arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onOpen(ServerHandshake arg0) {
		LOG.debug("ws opened");
		if(this.messageToSend!=null)
		{
			LOG.debug("try to send: "+this.messageToSend);
			this.send(this.messageToSend);
			this.messageToSend=null;
		}

	}

	public void openAndSendAsync(String message)
	{
		this.messageToSend=message;
		this.connect();
	}
	public void openAndSendAndCloseSync(String message)
	{
		try {
			this.connectBlocking();
		} catch (InterruptedException e) {
			LOG.warn("problem connecting:"+e.getMessage());
		}
		this.send(message);
		try {
			this.closeBlocking();
		} catch (InterruptedException e) {
			LOG.warn("problem disconnecting:"+e.getMessage());

		}
	}


}
