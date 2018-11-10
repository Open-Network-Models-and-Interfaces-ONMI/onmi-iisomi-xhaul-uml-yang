/**
 *
 */
package org.opendaylight.mwtn.base.netconf;

import java.util.List;
import javax.annotation.Nonnull;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.mwtn.base.internalTypes.InventoryInformation;
import org.opendaylight.mwtn.base.netconf.container.Capabilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author herbert
 *
 */
public abstract class ONFCoreNetworkElementBase implements ONFCoreNetworkElementRepresentation {

    private static final Logger LOG = LoggerFactory.getLogger(ONFCoreNetworkElementBase.class);

    protected static final String EMPTY = "";

    protected final String mountPointNodeName;
    protected final DataBroker netconfNodeDataBroker;
    protected final Capabilities capabilities;
    protected final boolean isNetworkElementCurrentProblemsSupporting10;
	protected @Nonnull InventoryInformation inventoryInformation;


    protected ONFCoreNetworkElementBase(String mountPointNodeName,
            DataBroker netconfNodeDataBroker,
            Capabilities capabilities ) {
        LOG.info("Create ONFCoreNetworkElementBase");
        this.mountPointNodeName = mountPointNodeName;
        this.netconfNodeDataBroker = netconfNodeDataBroker;
        this.capabilities = capabilities;

        this.isNetworkElementCurrentProblemsSupporting10 = false;

    }

    @Override
    public String getMountPointNodeName() {
        return mountPointNodeName;
    }

    @Override
	public InventoryInformation getInventoryInformation() {
    	return getInventoryInformation(null);
    }

    @Override
	public InventoryInformation getInventoryInformation(String layerProtocolFilter) {
    	InventoryInformation res = new InventoryInformation(inventoryInformation);
    	res.setInterfaceUuidList(getFilteredInterfaceUuidsAsStringList(layerProtocolFilter));

    	return res;
    }

    /*---------------------------------------------------------------
     * Getter/ Setter
     */

	public String getMountpoint() {
		return mountPointNodeName;
	}
	public DataBroker getDataBroker() {
		return netconfNodeDataBroker;
	}

    /*-----------------------------------------------------------------------------
     * Sychronization
     */

    @Override
	public void initSynchronizationExtension() {
    }

	protected @Nonnull abstract List<String> getFilteredInterfaceUuidsAsStringList(String layerProtocolFilter);

}
