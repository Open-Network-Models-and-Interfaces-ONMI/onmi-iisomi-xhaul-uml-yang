/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.client;

import java.util.ArrayList;
import java.util.List;

import com.highstreet.technologies.test.client.api.Address;
import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.api.Node;
import com.highstreet.technologies.test.client.api.RestConfServer;
import com.highstreet.technologies.test.client.api.Value;
import com.highstreet.technologies.test.client.builder.AddressBuilder;
import com.highstreet.technologies.test.client.builder.AttributeBuilder;
import com.highstreet.technologies.test.client.builder.NodeBuilder;
import com.highstreet.technologies.test.client.builder.RestConfServerBuilder;
import com.highstreet.technologies.test.client.builder.ValueBuilder;
import com.highstreet.technologies.test.client.enums.ConditionalPackage;
import com.highstreet.technologies.test.client.enums.SubObjectClass;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for Test Client.
 */
public class TestClientTest extends TestCase {
	/**
	 * Create the test case
	 *
	 * @param testName
	 *            name of the test case
	 */
	public TestClientTest(String testName) {
		super(testName);
	}

	/**
	 * @return the suite of tests being tested
	 */
	public static Test suite() {
		return new TestSuite(TestClientTest.class);
	}

	/**
	 * Basic Tests :-)
	 */
	public void testApp() {

		final String rcs = "{\"ipAddress\":\"127.0.0.1\",\"port\":8181,\"scheme\":\"http\",\"user\":\"admin\",\"password\":\"admin\"}";
		final String node = "{\"nodeId\":\"NetConfServer\",\"ipAddress\":\"127.0.0.1\",\"port\":830,\"user\":\"admin\",\"password\":\"admin\"}";
		final String attribute = "{\"conditionalPackage\":\"MW_AirInterface_Pac\",\"layerProtocol\":\"layerProtocol\",\"subObjectClass\":\"airInterfaceConfiguration\",\"attribute\":\"airInterfaceName\"}";
		final String address = "{\"node\":" + node + ",\"attribute\":" + attribute + ",\"restConfServer\":" + rcs + "}";
		final String list = "[\"item1\",\"item2\"]";
		
		assertEquals("createRestConfServerObject", rcs, createRestConfServerObject().toJsonString());
		assertEquals("createNodeObject", node, createNodeObject().toJsonString());
		assertEquals("createAttributeObject", attribute, createAttributeObject().toJsonString());
		assertEquals("createAddressObject", address, createAddressObject().toJsonString());
		
		assertEquals("createStringValueObject", "{\"value\":\"string-value\"}", createStringValueObject().toJsonString());
		assertEquals("createIntegerValueObject", "{\"value\":-123456}", createIntegerValueObject().toJsonString());
		assertEquals("createNodeValueObject", "{\"value\":" + node + "}", createNodeValueObject().toJsonString());
		assertEquals("createListValueObject", "{\"value\":" + list + "}", createListValueObject().toJsonString());
		
	}

	private RestConfServer createRestConfServerObject() {

		return new RestConfServerBuilder("127.0.0.1", 8181)
                    .setUser("admin")
                    .setPassword("admin")
                    .build();
		
	}

	private Node createNodeObject() {

		return new NodeBuilder("NetConfServer", "127.0.0.1")
                .setPort(830)
                .setUser("admin")
                .setPassword("admin")
                .build();
		
	}

	private Attribute createAttributeObject() {

		return new AttributeBuilder(ConditionalPackage.MW_AirInterface_Pac, "layerProtocol", SubObjectClass.airInterfaceConfiguration)
                .setAttribute("airInterfaceName")
                .build();
		
	}
	
	private Address createAddressObject() {
		
		RestConfServer rcs = createRestConfServerObject();
		Node n = createNodeObject();
		Attribute a = createAttributeObject();
		
		return new AddressBuilder(rcs, n, a)
                .build();
		
	}

	private Value<String> createStringValueObject() {
		Value<String> string = (Value<String>) new ValueBuilder("string-value")
				.build();
		return string;
	}

	private Value<Integer> createIntegerValueObject() {
		Value<Integer> integer = (Value<Integer>) new ValueBuilder(-123456)
				.build();
		return integer;
	}

	private Value<Node> createNodeValueObject() {
		Value<Node> node = (Value<Node>) new ValueBuilder(createNodeObject())
				.build();
		return node;
	}

	private Value<List> createListValueObject() {
		List<String> list = new ArrayList<String>();
		list.add("item1");
		list.add("item2");
		
		Value<List> lv = (Value<List>) new ValueBuilder(list).build();
		return lv;
	}
}
