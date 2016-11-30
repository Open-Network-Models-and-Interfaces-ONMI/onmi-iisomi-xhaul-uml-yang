/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.netconfconnector.impl.connect;

import org.opendaylight.mwtn.netconfconnector.api.connect.NetconfConnectionModel;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;

public class NetconfConnectionManager {

	private static final Logger LOG = LoggerFactory.getLogger(NetconfConnectionManager.class);

	private static final String REST_SERVER_IP = "localhost";
	private static final String REST_SERVER_PORT = "8181";
	private static final String REST_USERNAME = "admin";
	private static final String REST_PASSWORD = "admin";

	private static final String REST_REGISTER_NODE = "http://" + REST_SERVER_IP + ":" + REST_SERVER_PORT
			+ "/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules";
	private static final String REST_DELETE_NODE = "http://" + REST_SERVER_IP + ":" + REST_SERVER_PORT
			+ "/restconf/config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector";

	public static boolean initiateConnection(NetworkElement networkElement) {
		boolean isConnected = false;

		NetconfConnectionModel connectionModel = new NetconfConnectionModel();
		connectionModel.setName(networkElement.getName());
		connectionModel.setAddress(networkElement.getIp());
		connectionModel.setPort(Integer.parseInt(networkElement.getPort()));
		connectionModel.setUsername(networkElement.getUsername());
		connectionModel.setPassword(networkElement.getPassword());
		connectionModel.setTcpOnly(false);

		Client client = Client.create();
		final HTTPBasicAuthFilter authFilter = new HTTPBasicAuthFilter(REST_USERNAME, REST_PASSWORD);
		client.addFilter(authFilter);
		WebResource webResource = client.resource(REST_REGISTER_NODE);
		String input = connectionModel.getNetconfConnectionXML();
		ClientResponse response = webResource.type("application/xml").post(ClientResponse.class, input);
		int code = response.getStatus();
		if (code == 204) {
			// TODO
			// isConnected to be verified from the mount point.
			isConnected = true;

		} else {
			LOG.warn(
					"Initiate connection failed with Netconf device Netconf device :: Name : {}, IP : {} :: Response Code : {}",
					networkElement.getName(), networkElement.getIp(), code);
		}
		return isConnected;
	}

	public static boolean terminateConnection(NetworkElement networkElement) {
		boolean isTerminated = false;
		String name = networkElement.getName();

		Client client = Client.create();
		final HTTPBasicAuthFilter authFilter = new HTTPBasicAuthFilter(REST_USERNAME, REST_PASSWORD);
		client.addFilter(authFilter);
		WebResource webResource = client.resource(REST_DELETE_NODE + "/" + name);
		ClientResponse response = webResource.type("application/xml").delete(ClientResponse.class);
		int code = response.getStatus();

		if (code == 200) {
			isTerminated = true;
		} else {
			LOG.warn(
					"Terminate connection failed with Netconf device Netconf device :: Name : {}, IP : {} :: Response Code : {}",
					networkElement.getName(), networkElement.getIp(), code);
		}
		return isTerminated;
	}
}
