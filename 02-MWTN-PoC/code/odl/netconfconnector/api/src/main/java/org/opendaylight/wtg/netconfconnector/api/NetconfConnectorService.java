package org.opendaylight.wtg.netconfconnector.api;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement;

public interface NetconfConnectorService {

	public void nodeConnected(NetworkElement networkElement);

	public void nodeDisconnected(NetworkElement networkElement);
}
