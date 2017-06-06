/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.impl;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcRegistration;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
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

    @Override
    public void onSessionInitiated(ProviderContext session) {
        LOG.info("WebsocketmanagerProvider Session Initiated");
        webserverThread = new Thread(this);
        webserverThread.start();
        websocketService = session.addRpcImplementation(WebsocketmanagerService.class, new WebsocketImpl());
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
