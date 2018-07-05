/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.impl.websocket;

import static io.netty.handler.codec.http.HttpHeaders.isKeepAlive;
import static io.netty.handler.codec.http.HttpHeaders.setContentLength;
import static io.netty.handler.codec.http.HttpHeaders.Names.HOST;
import static io.netty.handler.codec.http.HttpMethod.GET;
import static io.netty.handler.codec.http.HttpResponseStatus.BAD_REQUEST;
import static io.netty.handler.codec.http.HttpResponseStatus.FORBIDDEN;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;
import static org.opendaylight.mwtn.impl.utils.Utils.hmChannelContexts;
import static org.opendaylight.mwtn.impl.utils.Utils.hmClientScopes;

import java.util.Map;

import org.json.JSONObject;
import org.opendaylight.mwtn.impl.dto.UserDto;
import org.opendaylight.mwtn.impl.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.websocketx.CloseWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PingWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PongWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshaker;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshakerFactory;
import io.netty.util.CharsetUtil;

public class WebSocketServerHandler extends SimpleChannelInboundHandler<Object> {
	private static final Logger LOG = LoggerFactory.getLogger(WebSocketServerHandler.class.getName());

	private static final String WEBSOCKET_PATH = "/websocket";

	public static final String KEY_NODENAME = "nodename";
	public static final String KEY_EVENTTYPE = "eventtype";
	public static final String KEY_XMLEVENT = "xmlevent";

	private WebSocketServerHandshaker handshaker;

	@Override
	public void channelRegistered(ChannelHandlerContext ctx) throws Exception {
		super.channelRegistered(ctx);
		hmChannelContexts.put(String.valueOf(ctx.hashCode()), ctx);
		LOG.info("Channel registered " + ctx.channel().toString());
	}

	@Override
	public void channelUnregistered(ChannelHandlerContext ctx) throws Exception {
		super.channelUnregistered(ctx);
		if (ctx != null) {
			String channelHashCode = String.valueOf(ctx.hashCode());
			hmChannelContexts.remove(channelHashCode);
			LOG.info("Channel unregistered " + ctx.channel().toString());
		}
	}

	@Override
	public void channelRead0(ChannelHandlerContext ctx, Object msg) throws Exception {
		if (msg instanceof FullHttpRequest) {
			handleHttpRequest(ctx, (FullHttpRequest) msg);
		} else if (msg instanceof WebSocketFrame) {
			handleWebSocketFrame(ctx, (WebSocketFrame) msg);
		}
	}

	public static void sendMessage(String nodeName, String eventType, String xmlEvent) {
		if (hmChannelContexts != null && hmChannelContexts.size() > 0) {
			for (Map.Entry<String, ChannelHandlerContext> entry : hmChannelContexts.entrySet()) {
				ChannelHandlerContext ctx = entry.getValue();

				try {
					UserDto clientDto = hmClientScopes.get(String.valueOf(ctx.hashCode()));
					if (clientDto.getScopes().get(eventType) != null) {
						sendBroadcast(ctx, xmlEvent);
					}
				} catch (Exception ioe) {
					LOG.warn(ioe.getMessage());
				}
			}
		}
	}
	public static void sendMessage(String xmlEvent) {
		if (hmChannelContexts != null && hmChannelContexts.size() > 0) {
			for (Map.Entry<String, ChannelHandlerContext> entry : hmChannelContexts.entrySet()) {
				ChannelHandlerContext ctx = entry.getValue();

				try {
					sendBroadcast(ctx, xmlEvent);

				} catch (Exception ioe) {
					LOG.warn(ioe.getMessage());
				}
			}
		}
	}
	private static void sendBroadcast(ChannelHandlerContext ctx, String message) {
		try {
			ctx.channel().write(new TextWebSocketFrame(message));
		} catch (Exception e) {
			LOG.warn(e.getMessage());
		}
		ctx.channel().flush();
	}

	@Override
	public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
		ctx.flush();
	}

	private void handleHttpRequest(ChannelHandlerContext ctx, FullHttpRequest req) throws Exception {
		// Handle a bad request.
		if (!req.getDecoderResult().isSuccess()) {
			sendHttpResponse(ctx, req, new DefaultFullHttpResponse(HTTP_1_1, BAD_REQUEST));
			return;
		}

		// Allow only GET methods.
		if (req.getMethod() != GET) {
			sendHttpResponse(ctx, req, new DefaultFullHttpResponse(HTTP_1_1, FORBIDDEN));
			return;
		}

		// Handshake
		WebSocketServerHandshakerFactory wsFactory = new WebSocketServerHandshakerFactory(getWebSocketLocation(req),
				null, false);
		handshaker = wsFactory.newHandshaker(req);
		if (handshaker == null) {
			WebSocketServerHandshakerFactory.sendUnsupportedWebSocketVersionResponse(ctx.channel());
		} else {
			handshaker.handshake(ctx.channel(), req);
		}
	}

	private void handleWebSocketFrame(ChannelHandlerContext ctx, WebSocketFrame frame) {

		// Check for closing frame
		if (frame instanceof CloseWebSocketFrame) {
			handshaker.close(ctx.channel(), (CloseWebSocketFrame) frame.retain());
			return;
		}
		if (frame instanceof PingWebSocketFrame) {
			ctx.channel().write(new PongWebSocketFrame(frame.content().retain()));
			return;
		}
		if (!(frame instanceof TextWebSocketFrame)) {
			throw new UnsupportedOperationException(
					String.format("%s frame types not supported", frame.getClass().getName()));
		}

		String request = ((TextWebSocketFrame) frame).text();
		LOG.info(String.format("%s received %s", ctx.channel(), request));
		if(!manageClientRequest(ctx, request));
			manageClientRequest2(ctx, request);
		}

	/*
	 * broadcast message to all your clients
	 */
	private void manageClientRequest2(ChannelHandlerContext ctx, String request) {
		try {
			JSONObject o=new JSONObject(request);
			if(o.has(KEY_NODENAME) && o.has(KEY_EVENTTYPE) && o.has(KEY_EVENTTYPE))
				sendMessage(o.getString(KEY_NODENAME),o.getString(KEY_EVENTTYPE),o.getString(KEY_XMLEVENT));
		} catch (Exception e) {
			LOG.warn("handle ws request failed:"+e.getMessage());
		}
	}
	private boolean manageClientRequest(ChannelHandlerContext ctx, String request) {
		boolean ret=false;
		try {
			JSONObject jsonMessage = new JSONObject(request);
			if(jsonMessage.has(Utils.MSG_KEY_DATA))
			{
				String data = jsonMessage.getString(Utils.MSG_KEY_DATA);
				if (data.equals(Utils.MSG_KEY_SCOPES)) {
					ret=true;
					String sessionId = String.valueOf(ctx.hashCode());
					UserDto clientDto = new UserDto();
					clientDto.setScopes(jsonMessage.getJSONArray(Utils.MSG_KEY_SCOPES));
					clientDto.setUserId(sessionId);
					hmClientScopes.put(sessionId, clientDto);
					ctx.channel().write(new TextWebSocketFrame(
							"You are connected to the Opendaylight Websocket server and scopes are : " + request + ""));
				}
			}
		} catch (Exception e) {
			LOG.warn("problem set scope: "+e.getMessage());
			ctx.channel().write(new TextWebSocketFrame("Your request to the Opendaylight Websocket server is >> "
					+ request + " << which failed because of following exception >> " + e.toString()));
		}
		return ret;
	}

	private static void sendHttpResponse(ChannelHandlerContext ctx, FullHttpRequest req, FullHttpResponse res) {
		// Generate an error page if response getStatus code is not OK (200).
		if (res.getStatus().code() != 200) {
			ByteBuf buf = Unpooled.copiedBuffer(res.getStatus().toString(), CharsetUtil.UTF_8);
			res.content().writeBytes(buf);
			buf.release();
			setContentLength(res, res.content().readableBytes());
		}

		// Send the response and close the connection if necessary.
		ChannelFuture f = ctx.channel().writeAndFlush(res);
		if (!isKeepAlive(req) || res.getStatus().code() != 200) {
			f.addListener(ChannelFutureListener.CLOSE);
		}
	}

	@Override
	public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
		LOG.info("Exception caught {}");
		ctx.close();
	}

	private static String getWebSocketLocation(FullHttpRequest req) {
		return "ws://" + req.headers().get(HOST) + WEBSOCKET_PATH;
	}

}
