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
import com.highstreet.technologies.test.client.api.Node;

public class NodeBuilder implements Builder<Node> {

	private final String nodeId; // required
	private final String ipAddress; // required
	private int port; // optional
	private String user; // optional
	private String password; // optional

	public NodeBuilder(String nodeId, String ipAddress) {
		this.nodeId = nodeId;
		this.ipAddress = ipAddress;
		this.port = 830;
		this.user = "admin";
		this.password = "admin";
	}

	public NodeBuilder(Node node) {
		this.nodeId = node.getNodeId();
		this.ipAddress = node.getIpAddress();
		this.port = node.getPort();
		this.user = node.getUser();
		this.password = node.getPassword();
	}

	public NodeBuilder setPort(int port) {
		this.port = port;
		return this;
	}

	public NodeBuilder setUser(String user) {
		this.user = user;
		return this;
	}

	public NodeBuilder setPassword(String password) {
		this.password = password;
		return this;
	}

	private void validateNodeObject(NodeImpl node) {
		// Do some basic validations to check
		// if Node object does not break any assumption of system
		if (node.ipAddress == "") {
			throw new IllegalStateException("Invalid IP Address");
		}
		if (node.port < 1) {
			throw new IllegalStateException("Port out of range");
		}
		if (node.user == "" || node.user == null || node.password == "" || node.password == null) {
			throw new IllegalStateException("Invalid user or password");
		}
	}

	@Override
	public Node build() {
		NodeImpl node = new NodeImpl(this);
		validateNodeObject(node);
		return node;
	}
	private static final class NodeImpl implements Node {

    	// All final attributes
    	private final String nodeId; // required
    	private final String ipAddress; // required
    	private final int port; // required
    	private final String user; // required
    	private final String password; // required

    	private NodeImpl(NodeBuilder builder) {
    		this.nodeId = builder.nodeId;
    		this.ipAddress = builder.ipAddress;
    		this.port = builder.port;
    		this.user = builder.user;
    		this.password = builder.password;
    	}

    	@Override
		public String getNodeId() {
			return this.nodeId;
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
			return "{'error':'No JSON representation for a Node object.'}";
		}
    }
}
