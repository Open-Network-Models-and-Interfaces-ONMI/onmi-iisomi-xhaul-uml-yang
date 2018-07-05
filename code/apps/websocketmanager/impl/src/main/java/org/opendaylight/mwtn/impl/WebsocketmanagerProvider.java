/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.impl;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.mwtn.impl.WebsocketImpl.EventInputCallback;
import org.opendaylight.mwtn.impl.utils.AkkaConfig;
import org.opendaylight.mwtn.impl.utils.AkkaConfig.ClusterConfig;
import org.opendaylight.mwtn.impl.utils.AkkaConfig.ClusterNodeInfo;
import org.opendaylight.mwtn.impl.websocket.SyncWebSocketClient;
import org.opendaylight.mwtn.impl.websocket.WebSocketServerInitializer;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

public class WebsocketmanagerProvider implements BindingAwareProvider, AutoCloseable, Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(WebsocketmanagerProvider.class);
    private static final int PORT = 8085;

    private Thread webserverThread;
    private final ServerBootstrap bootstrap = new ServerBootstrap();
    private final EventLoopGroup bossGroup = new NioEventLoopGroup();
    private final EventLoopGroup workerGroup = new NioEventLoopGroup();
    private RpcRegistration<WebsocketmanagerService> websocketService;

    private List<URI> clusterNodeClients=null;
	private final EventInputCallback rpcEventInputCallback=new EventInputCallback() {

		@Override
		public void onMessagePushed(String message) throws Exception {

			LOG.debug("onMessagePushed: "+message);
			if(WebsocketmanagerProvider.this.clusterNodeClients!=null &&
					WebsocketmanagerProvider.this.clusterNodeClients.size()>0)
			{
				SyncWebSocketClient client;
				for(URI clientURI : WebsocketmanagerProvider.this.clusterNodeClients)
				{
					client=new SyncWebSocketClient(clientURI);
					LOG.debug("try to push message to "+client.getURI());
					client.openAndSendAndCloseSync(message);

					//client.close();
				}
			}
		}
	};

    @Override
    public void onSessionInitiated(ProviderContext session) {
        LOG.info("WebsocketmanagerProvider Session Initiated");
        webserverThread = new Thread(this);
        webserverThread.start();
        websocketService = session.addRpcImplementation(WebsocketmanagerService.class, new WebsocketImpl(rpcEventInputCallback));
        AkkaConfig cfg =null;
        try {
			 cfg=AkkaConfig.load();
			} catch (Exception e) {
			LOG.warn("problem loading akka config: "+e.getMessage());
		}
        if(cfg!=null && cfg.isCluster())
		{
			this.initWSClients(cfg.getClusterConfig());
		}
    }

    private void initWSClients(ClusterConfig clusterConfig) {
    	clusterNodeClients=new ArrayList<URI>();
    	for(ClusterNodeInfo nodeConfig:clusterConfig.getSeedNodes())
    	{
    		if(clusterConfig.isMe(nodeConfig))
    			continue;
    		String url=String.format("ws://%s:%d/websocket", nodeConfig.getRemoteAddress(),PORT);
    		try {
    			LOG.debug("registering ws client for "+url);
				clusterNodeClients.add(new URI(url));
			} catch (URISyntaxException e) {
				LOG.warn("problem instantiating wsclient for url: "+url);
			}
    	}
	}

	@Override
    public void close() throws Exception {
        LOG.info("WebsocketmanagerProvider Closed");
        closeWebsocketServer();
        if (websocketService != null) {
            websocketService.close();
        }
    }

    @Override
    public void run() {
        // TODO Auto-generated method stub
        try {
            startWebSocketServer();
        } catch (Exception e) {
            LOG.warn("Exception occured while starting webSocket server {}",e);
        }
    }

    private void closeWebsocketServer() {
        if (bossGroup != null) {
            try {
                bossGroup.shutdownGracefully();
            } catch (Exception e) {
                LOG.warn("Exception occured while starting webSocket server {}",e);
            }
        }
        if (workerGroup != null) {
            try {
                workerGroup.shutdownGracefully();
            } catch (Exception e) {
                LOG.warn("Exception occured while starting webSocket server {}",e);
            }
        }
    }

    public void startWebSocketServer() throws Exception {
        try {
            bootstrap.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class)
                    .childHandler(new WebSocketServerInitializer());
            Channel channel = bootstrap.bind(PORT).sync().channel();
            LOG.info("Web socket server started at port " + PORT + '.');
            LOG.info("Open your browser and navigate to http://localhost:" + PORT + '/');
            channel.closeFuture().sync();
        } catch (Exception e) {
            LOG.warn("Exception in start websocket server ======== " + e.toString());
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

}
