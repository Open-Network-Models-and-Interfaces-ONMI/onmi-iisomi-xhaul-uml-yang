/**
 *
 */
package org.opendaylight.mwtn.base.netconf;

import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.mwtn.base.internalTypes.InventoryInformation;

/**
 * @author herbert
 *
 */
public class ONFCoreEmpty implements ONFCoreNetworkElementRepresentation {

    private String mountPointNodeName = "";


    ONFCoreEmpty(String mountPointNodeName) {
        this.mountPointNodeName = mountPointNodeName;
    }

    @Override
    public void initialReadFromNetworkElement() {
    }

    @Override
    public String getMountPointNodeName() {
        return mountPointNodeName;
    }

    @Override
    public void resetPMIterator() {
    }

    @Override
    public boolean hasNext() {
        return false;
    }

    @Override
    public void next() {
    }

    @Override
    public AllPm getHistoricalPM() {
        return AllPm.EMPTY;
    }

    @Override
    public String pmStatusToString() {
        return "ONFCoreEmpty";
    }

    @Override
    public int removeAllCurrentProblemsOfNode() {
        return 0;
    }

    @Override
    public void doRegisterMicrowaveEventListener(MountPoint mointPoint) {
        //Do nothing
    }

    @Override
    public void prepareCheck() {
        //Do nothing here
    }

    @Override
    public boolean checkAndConnectionToMediatorIsOk() {
        return false;
    }

    @Override
    public boolean checkAndConnectionToNeIsOk() {
        return false;
    }

    @Override
    public void initSynchronizationExtension() {
    }

	@Override
	public InventoryInformation getInventoryInformation() {
		return InventoryInformation.DEFAULT;
	}

	@Override
	public InventoryInformation getInventoryInformation(String layerProtocolFilter) {
		return InventoryInformation.DEFAULT;
	}

}
