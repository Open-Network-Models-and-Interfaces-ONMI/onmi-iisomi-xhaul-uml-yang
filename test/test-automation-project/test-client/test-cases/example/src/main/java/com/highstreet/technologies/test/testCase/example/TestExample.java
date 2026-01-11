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
import java.util.ArrayList;
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
		final String odlUser = "test-client";
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
		final ArrayList<String> expectedNetconfCapabilities = new ArrayList<String>();

		expectedNetconfCapabilities.add("urn:ietf:params:netconf:capability:notification:1.0");

		expectedNetconfCapabilities.add("(uri:onf:G_874_1_model-Imported_Data_Types?revision=2016-07-10)G_874_1_model-Imported_Data_Types");
		expectedNetconfCapabilities.add("(uri:onf:G_874_1_model-Imported_Information_Object_Classes-X_721?revision=2016-07-10)G_874_1_model-Imported_Information_Object_Classes-X_721");
		expectedNetconfCapabilities.add("(uri:onf:G_874_1_model-Imported_Information_Object_Classes-X_739?revision=2016-07-10)G_874_1_model-Imported_Information_Object_Classes-X_739");
		expectedNetconfCapabilities.add("(uri:onf:G_874_1_model-Imported_Information_Object_Classes-Q_822?revision=2016-08-11)G_874_1_model-Imported_Information_Object_Classes-Q_822");
		expectedNetconfCapabilities.add("(uri:onf:G_874_1_model-Type_Definitions?revision=2016-07-10)G_874_1_model-Type_Definitions");
		expectedNetconfCapabilities.add("(uri:onf:G_874_1_model-Object_Classes?revision=2016-07-10)G_874_1_model-Object_Classes");

		expectedNetconfCapabilities.add("(uri:onf:CoreModel-CoreFoundationModule-TypeDefinitions?revision=2016-07-01)CoreModel-CoreFoundationModule-TypeDefinitions");
		expectedNetconfCapabilities.add("(uri:onf:CoreModel-CoreFoundationModule-StateModel?revision=2016-08-09)CoreModel-CoreFoundationModule-StateModel");
		expectedNetconfCapabilities.add("(uri:onf:CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages?revision=2016-07-10)CoreModel-CoreFoundationModule-SuperClassesAndCommonPackages");
		expectedNetconfCapabilities.add("(uri:onf:CoreModel-CoreNetworkModule-TypeDefinitions?revision=2016-07-10)CoreModel-CoreNetworkModule-TypeDefinitions");
		expectedNetconfCapabilities.add("(uri:onf:CoreModel-CoreNetworkModule-ObjectClasses?revision=2016-08-11)CoreModel-CoreNetworkModule-ObjectClasses");

		expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-Notifications?revision=2016-08-09)MicrowaveModel-Notifications");
		expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-TypeDefinitions?revision=2016-09-02)MicrowaveModel-TypeDefinitions");
		expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-ObjectClasses-SuperClasses?revision=2016-08-09)MicrowaveModel-ObjectClasses-SuperClasses");
		expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-ObjectClasses-AirInterface?revision=2016-09-01)MicrowaveModel-ObjectClasses-AirInterface");
		// expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-ObjectClasses-AirInterfaceDiversity?revision=2016-09-02)MicrowaveModel-ObjectClasses-AirInterfaceDiversity");
		
		expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-ObjectClasses-PureEthernetStructure?revision=2016-09-02)MicrowaveModel-ObjectClasses-PureEthernetStructure");
		// expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-ObjectClasses-HybridMwStructure?revision=2016-09-02)MicrowaveModel-ObjectClasses-HybridMwStructure");

		expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-ObjectClasses-EthernetContainer?revision=2016-09-02)MicrowaveModel-ObjectClasses-EthernetContainer");
		// expectedNetconfCapabilities.add("(uri:onf:MicrowaveModel-ObjectClasses-TdmContainer?revision=2016-09-02)MicrowaveModel-ObjectClasses-TdmContainer");
		
		return new NodeBuilder(mediatorName)
				.setIpAddress(mediatorIp)
				.setPort(mediatorPort)
				.setUser(mediatorUser)
				.setPassword(mediatorPassword)
				.setExpectedNetconfCapabilities(expectedNetconfCapabilities)
				.build();
	}

	private static String getTimeAsIso8601() {
		TimeZone tz = TimeZone.getTimeZone("UTC");
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		df.setTimeZone(tz);
		return df.format(new Date());
	}
	
	private static void runTestCaseAirInterfaceName() {

		// select an interesting attribute of the wireless model
		final AttributeNames attributeName = AttributeNames.airInterfaceName_airInterfaceConfiguration;

		// Start
		String out = String.format("START Test for %1s", attributeName);
		System.out.println(out);

		// create TestClient to get access to RestConf GET and SET methods
		final RestConfServer restConfServer = createRestConfServer();
		final Node node = createNode();
		final TestClient validationClient = new TestClientBuilder(restConfServer, node)
				.build();

		// Define the entire address for a wireless attribute using restconf of ODL
		final MultivaluedHashMap<Layer, String> layerProtocols = validationClient.getLayerProtocolIds();
		final List<String> airInterfaces = layerProtocols.get(Layer.AIRINTERFACE);

		final String layerProtocol = airInterfaces.get(airInterfaces.size() - 1);
		final Attribute attribute = attributeName.getAttribute(layerProtocol);

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
