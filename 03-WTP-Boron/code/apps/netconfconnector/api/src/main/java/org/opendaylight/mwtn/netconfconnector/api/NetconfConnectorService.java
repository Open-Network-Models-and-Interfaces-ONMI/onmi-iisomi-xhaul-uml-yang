/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.netconfconnector.api;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement;

public interface NetconfConnectorService {

	public void nodeConnected(NetworkElement networkElement);

	public void nodeDisconnected(NetworkElement networkElement);
}
