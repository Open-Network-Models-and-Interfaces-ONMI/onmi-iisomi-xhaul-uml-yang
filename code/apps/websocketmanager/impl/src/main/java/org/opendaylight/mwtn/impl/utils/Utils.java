/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.impl.utils;

import java.util.HashMap;

import org.opendaylight.mwtn.impl.dto.UserDto;

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
		ObjectCreationNotification, ObjectDeletionNotification, AttributeValueChangedNotification, ProblemNotification
	};

}
