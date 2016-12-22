/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.client.api;

/**
 * The interface Address defines all necessary parameters to perform an HTTP-GET or HTTP-PUT
 * request to read or write a value of the ONF Wireless Model (TR 532).
 *
 */
public interface Address {

	/**
	 * Returns a RestConfServer object, which defines the IP address and user credentials of the
	 * restconf server of the opendaylight SDN controller.
	 * 
	 * @return the RestConfServer object
	 */
	public RestConfServer getRestConfServer();
	
	/**
	 * Returns a Node object, which defines the Name, IP address and user credentials of an
	 * netconf server (mount point).
	 * 
	 * @return a Node object
	 */
	public Node getNode();
	
	/**
	 * Returns an Attribute object, which defines the path to an ONF Wireless Model attribute.
	 * 
	 * @return an Attribute object
	 */
	public Attribute getAttribute();
	
	/**
	 * Returns a String object representing the entire Address object as JSON string.
	 * 
	 * @return a String object
	 */
	public String toJsonString();

}
