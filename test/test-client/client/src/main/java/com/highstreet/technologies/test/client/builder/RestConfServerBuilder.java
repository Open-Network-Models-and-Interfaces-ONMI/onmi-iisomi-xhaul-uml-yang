/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.client.builder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.highstreet.technologies.test.client.api.Builder;
import com.highstreet.technologies.test.client.api.RestConfServer;
import com.highstreet.technologies.test.client.enums.Protocol;

public class RestConfServerBuilder implements Builder<RestConfServer> {

	private final String ipAddress; // required
	private final int port; // required
	private Protocol scheme; // optional
	private String user; // optional
	private String password; // optional

	public RestConfServerBuilder(String ipAddress, int port) {
		this.ipAddress = ipAddress;
		this.scheme = Protocol.http;
		this.port = port;
		this.user = "admin";
		this.password = "admin";
	}

	public RestConfServerBuilder(RestConfServer rcs) {
		this.ipAddress = rcs.getIpAddress();
		this.scheme = rcs.getScheme();
		this.port = rcs.getPort();
		this.user = rcs.getUser();
		this.password = rcs.getPassword();
	}

	public RestConfServerBuilder setScheme(Protocol scheme) {
		this.scheme = scheme;
		return this;
	}

	public RestConfServerBuilder setUser(String user) {
		this.user = user;
		return this;
	}

	public RestConfServerBuilder setPassword(String password) {
		this.user = password;
		return this;
	}

	private void validateRestConfServerObject(RestConfServerImpl restConfServer) {
		// Do some basic validations to check
		// if restConfServer object does not break any assumption of system
		if (restConfServer.ipAddress == "") {
			throw new IllegalStateException("Invalid IP Address");
		}
		if (restConfServer.port < 1) {
			throw new IllegalStateException("Port out of range");
		}
		if (restConfServer.user == "" || restConfServer.user == null || restConfServer.password == "" || restConfServer.password == null) {
			throw new IllegalStateException("Invalid user or password");
		}
	}

	@Override
	public RestConfServer build() {
		RestConfServerImpl restConfServer = new RestConfServerImpl(this);
		validateRestConfServerObject(restConfServer);
		return restConfServer;
	}
	
	private static final class RestConfServerImpl implements RestConfServer {

    	// All final attributes
    	private final String ipAddress; // required
    	private final int port; // required
    	private final Protocol scheme; // required
    	private final String user; // required
    	private final String password; // required

    	private RestConfServerImpl(RestConfServerBuilder builder) {
    		this.ipAddress = builder.ipAddress;
       		this.port = builder.port;
       		this.scheme = builder.scheme;
       	    this.user = builder.user;
    		this.password = builder.password;
    	}

    	@Override
		public String getIpAddress() {
			return this.ipAddress;
		}

		@Override
		public int getPort() {
			return this.port;
		}

		@Override
		public Protocol getScheme() {
			return this.scheme;
		}

		@Override
		public String getUser() {
			return this.user;
		}

		@Override
		public String getPassword() {
			return this.password;
		}

		@Override
		public String toJsonString() {
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.writeValueAsString(this);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
			return "{'error':'No JSON representation for a RestConfServer object.'}";
		}
    }
}
