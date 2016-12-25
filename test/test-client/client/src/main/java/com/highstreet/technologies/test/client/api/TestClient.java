/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.client.api;


import javax.ws.rs.core.MultivaluedHashMap;

import com.highstreet.technologies.test.client.enums.Layer;

public interface TestClient {
	
	public Result get(Attribute attribute);
	
	public Result set(Attribute attribute, Value<?> value);	  

	public RestConfServer getRestConfServer();	  

	public Node getNode();	  

	public MultivaluedHashMap<Layer, String> getLayerProtocolIds();
}
