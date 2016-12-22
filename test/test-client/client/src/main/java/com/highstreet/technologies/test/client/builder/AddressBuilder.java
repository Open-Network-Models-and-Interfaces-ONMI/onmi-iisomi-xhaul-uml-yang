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
import com.highstreet.technologies.test.client.api.Address;
import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.api.Builder;
import com.highstreet.technologies.test.client.api.Node;
import com.highstreet.technologies.test.client.api.RestConfServer;

public class AddressBuilder implements Builder<Address> {

	private final RestConfServer restconfserver; // required
	private final Node node; // required
	private final Attribute attribute; // required

	public AddressBuilder(RestConfServer restconfserver, Node node, Attribute attribute) {
		this.restconfserver = restconfserver;
		this.node = node;
		this.attribute = attribute;
	}

	public AddressBuilder(Address address) {
		this.restconfserver = address.getRestConfServer();
		this.node = address.getNode();
		this.attribute = address.getAttribute();
	}

	private void validateAddressObject(AddressImpl address) {
		// Do some basic validations to check
		// if Address object does not break any assumption of system
		if (address.restconfserver == null) {
			throw new IllegalStateException("RestConfServer was not defined.");
		}
		if (address.node == null) {
			throw new IllegalStateException("Node was not defined.");
		}
		if (address.attribute == null) {
			throw new IllegalStateException("Attribute was not defined.");
		}
	}

	@Override
	public Address build() {
		AddressImpl address = new AddressImpl(this);
		validateAddressObject(address);
		return address;
	}
	
	private static final class AddressImpl implements Address {

    	// All final attributes
    	private final RestConfServer restconfserver; // required
    	private final Node node; // required
    	private final Attribute attribute; // required

    	private AddressImpl(AddressBuilder builder) {
    		this.restconfserver = builder.restconfserver;
    		this.node = builder.node;
    		this.attribute = builder.attribute;
    	}
		@Override
		public RestConfServer getRestConfServer() {
			return this.restconfserver;
		}

		@Override
		public Node getNode() {
			return this.node;
		}

		@Override
		public Attribute getAttribute() {
			return this.attribute;
		}

		@Override
		public String toJsonString() {
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.writeValueAsString(this);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
			return "{'error':'No JSON representation for a Address object.'}";
		}
    }
}
