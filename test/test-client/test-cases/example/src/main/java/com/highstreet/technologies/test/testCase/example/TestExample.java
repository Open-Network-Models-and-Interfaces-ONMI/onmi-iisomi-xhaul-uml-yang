/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.testCase.example;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import javax.ws.rs.core.MultivaluedHashMap;

import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.api.Node;
import com.highstreet.technologies.test.client.api.RestConfServer;
import com.highstreet.technologies.test.client.api.Result;
import com.highstreet.technologies.test.client.api.Value;
import com.highstreet.technologies.test.client.impl.NodeBuilder;
import com.highstreet.technologies.test.client.impl.RestConfServerBuilder;
import com.highstreet.technologies.test.client.impl.ValueBuilder;
import com.highstreet.technologies.test.client.enums.AttributeNames;
import com.highstreet.technologies.test.client.enums.Layer;
import com.highstreet.technologies.test.client.enums.Protocol;
import com.highstreet.technologies.test.client.api.TestClient;
import com.highstreet.technologies.test.client.impl.TestClientBuilder;

/**
 * TestExample
 * 
 * Implementation example for a java TestClient.
 *
 */
public class TestExample {
	
	private static RestConfServer createRestConfServer() {
		
		final String odlIpAddress = "192.168.1.106";
		final int odlRestConfPort = 8181;
		final Protocol oldScheme = Protocol.http;
		final String odlUser = "admin";
		final String odlPassword = "admin";
		
		return new RestConfServerBuilder(odlIpAddress, odlRestConfPort)
				.setScheme(oldScheme)
				.setUser(odlUser)
				.setPassword(odlPassword)
				.build();
	}

	private static Node createNode() {
		
		final String mediatorName = "Ceragon-11";
		final String mediatorIp = "192.168.1.107";
		final int mediatorPort = 830;
		final String mediatorUser = "compila";
		final String mediatorPassword = "compila+";
		
		return new NodeBuilder(mediatorName, mediatorIp)
				.setPort(mediatorPort)
				.setUser(mediatorUser)
				.setPassword(mediatorPassword)
				.build();
	}

	private static String getTimeAsIso8601() {
		TimeZone tz = TimeZone.getTimeZone("UTC");
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		df.setTimeZone(tz);
		return df.format(new Date());
	}
	
	private static void runTestCaseAirInterfaceName() {

		// create TestClient to get access to RestConf GET and SET methods
		final RestConfServer restConfServer = createRestConfServer();
		final Node node = createNode();
		final TestClient validationClient = new TestClientBuilder(restConfServer, node)
				.build();

		// Define the entire address for a wireless attribute using restconf of ODL
		final MultivaluedHashMap<Layer, String> layerProtocols = validationClient.getLayerProtocolIds();
		final List<String> airInterfaces = layerProtocols.get(Layer.AIRINTERFACE);

		final String layerProtocol = airInterfaces.get(airInterfaces.size() - 1);
		final AttributeNames attributeName = AttributeNames.airInterfaceName_airInterfaceConfiguration;
		final Attribute attribute = attributeName.getAttribute(layerProtocol);

		// Start
		String out = String.format("START Test for %1s",
				attribute.getAttribute());
		System.out.println(out);

		// read the interesting value
		Result getResult = validationClient.get(attribute);
		out = String.format("<<< [%1s] GET %2s: %3s (%4s)",
				getTimeAsIso8601(),
				attribute.getAttribute(),
				getResult.getValue().getValue().toString(),
				getResult.getValue().getValue().getClass().toString());
		System.out.println(out);
		
		// set the interesting value
		String airInterfaceNameValue = "newAirInterfaceName";
		Value<String> value = (Value<String>) new ValueBuilder(airInterfaceNameValue).build();
		Result setResult = validationClient.set(attribute, value);
		out = String.format(">>> [%1s] SET %2s to %3s (%4s); Status: %5s: %6s",
				getTimeAsIso8601(),
				attribute.getAttribute(),
				airInterfaceNameValue,
				value.getValue().getClass().toString(),
				setResult.getStatus(),
				setResult.getMessage());
		System.out.println(out);
		
		// read the interesting value
		Result result = validationClient.get(attribute);
		out = String.format("<<< [%1s] GET %2s: %3s (%4s)",
				getTimeAsIso8601(),
				attribute.getAttribute(),
				result.getValue().getValue().toString(),
				result.getValue().getValue().getClass().toString());
		System.out.println(out);
		
		// check
		if (result.getValue().getValue().toString().equals(airInterfaceNameValue)) {
			out = "SUCCESS!";
		} else {
			out = String.format("FAILED!\n\texpected: %1s\n\treceived: %2s", 
					airInterfaceNameValue,
					result.getValue().getValue().toString());
		}
		System.out.println(out + "\n\n");
	}

	public static void main(String[] args) {
		
		runTestCaseAirInterfaceName();
		// add more test cases
	}
	
}
