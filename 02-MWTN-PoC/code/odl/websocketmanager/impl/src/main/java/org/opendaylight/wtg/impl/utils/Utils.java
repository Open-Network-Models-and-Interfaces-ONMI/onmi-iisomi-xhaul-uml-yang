package org.opendaylight.wtg.impl.utils;

import java.util.HashMap;

import org.opendaylight.wtg.impl.dto.UserDto;

import io.netty.channel.ChannelHandlerContext;

public class Utils {

	public static final String MSG_KEY_DATA = "data";
	public static final String MSG_KEY_SCOPES = "scopes";
	public static final String MSG_KEY_PARAM = "param";
	public static final String MSG_KEY_VALUE = "value";
	public static final String MSG_KEY_SCOPE = "scope";
	public static HashMap<String, UserDto> hmClientScopes = new HashMap<String, UserDto>();
	public static HashMap<String, ChannelHandlerContext> hmChannelContexts = new HashMap<String, ChannelHandlerContext>();

	public static enum SCOPE {
		ObjectCreationNotification, ObjectDeletionNotification, AttributeValueChangeNotification,ProblemNotification
	};
	
}
