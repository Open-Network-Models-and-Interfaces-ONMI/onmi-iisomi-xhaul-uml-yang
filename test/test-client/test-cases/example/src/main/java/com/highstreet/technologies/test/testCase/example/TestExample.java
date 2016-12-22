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
import java.util.TimeZone;

import com.highstreet.technologies.test.client.api.Address;
import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.api.Node;
import com.highstreet.technologies.test.client.api.RestConfServer;
import com.highstreet.technologies.test.client.api.Result;
import com.highstreet.technologies.test.client.api.Value;
import com.highstreet.technologies.test.client.builder.AddressBuilder;
import com.highstreet.technologies.test.client.builder.AttributeBuilder;
import com.highstreet.technologies.test.client.builder.NodeBuilder;
import com.highstreet.technologies.test.client.builder.RestConfServerBuilder;
import com.highstreet.technologies.test.client.builder.ValueBuilder;
import com.highstreet.technologies.test.client.enums.ConditionalPackage;
import com.highstreet.technologies.test.client.enums.Protocol;
import com.highstreet.technologies.test.client.enums.SubObjectClass;
import com.highstreet.technologies.test.client.impl.TestClient;

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

	private static Attribute createAttribute() {
		
		final ConditionalPackage conditionalPackage = ConditionalPackage.MW_AirInterface_Pac;
		final String layerProtocol = "LP-MWPS-ifIndex2";
		final SubObjectClass subObjectClass = SubObjectClass.airInterfaceConfiguration;
		final String attributeName = "airInterfaceName";
		
		return new AttributeBuilder(conditionalPackage, layerProtocol, subObjectClass)
				.setAttribute(attributeName)
				.build();
	}

	private static Address createAddress() {
		
		final RestConfServer restConfServer = createRestConfServer();
		final Node node = createNode();
		final Attribute attribute = createAttribute();
		
		return new AddressBuilder(restConfServer, node, attribute)
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
		TestClient validationClient = new TestClient();
		
		// Define the entire address for a wireless attribute using restconf of ODL
		Address address = createAddress();

		
		// Start
		String out = String.format("START Test for %2s",
				address.getAttribute().getAttribute());
		System.out.println(out);

		// read the interesting value
		Result getResult = validationClient.get(address);
		out = String.format("<<< [%1s] GET %2s: %3s (%4s)",
				getTimeAsIso8601(),
				address.getAttribute().getAttribute(),
				getResult.getValue().getValue().toString(),
				getResult.getValue().getValue().getClass().toString());
		System.out.println(out);
		
		// set the interesting value
		String airInterfaceNameValue = "newAirInterfaceName";
		Value<String> value = (Value<String>) new ValueBuilder(airInterfaceNameValue).build();
		Result setResult = validationClient.set(address, value);
		out = String.format(">>> [%1s] SET %2s to %3s (%4s); Status: %5s: %6s",
				getTimeAsIso8601(),
				address.getAttribute().getAttribute(),
				airInterfaceNameValue,
				value.getValue().getClass().toString(),
				setResult.getStatus(),
				setResult.getMessage());
		System.out.println(out);
		
		// read the interesting value
		Result result = validationClient.get(address);
		out = String.format("<<< [%1s] GET %2s: %3s (%4s)",
				getTimeAsIso8601(),
				address.getAttribute().getAttribute(),
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
