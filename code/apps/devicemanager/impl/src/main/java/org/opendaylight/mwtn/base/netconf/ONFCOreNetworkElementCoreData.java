package org.opendaylight.mwtn.base.netconf;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.NetworkElement;

public interface ONFCOreNetworkElementCoreData {

	public String getMountpoint();
	public DataBroker getDataBroker();
	public NetworkElement getOptionalNetworkElement();

}
