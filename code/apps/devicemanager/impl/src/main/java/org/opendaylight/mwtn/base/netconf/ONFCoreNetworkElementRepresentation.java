package org.opendaylight.mwtn.base.netconf;

import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.mwtn.base.internalTypes.InventoryInformation;
import org.opendaylight.mwtn.deviceMonitor.impl.DeviceMonitorSupport;

public interface ONFCoreNetworkElementRepresentation extends DeviceMonitorSupport {

       public void initialReadFromNetworkElement();

       public String getMountPointNodeName();

       public void resetPMIterator();

       public boolean hasNext();

       public void next();

       public AllPm getHistoricalPM();

       public String pmStatusToString();

       public int removeAllCurrentProblemsOfNode();

       public void doRegisterMicrowaveEventListener(MountPoint mountPoint);

       public void initSynchronizationExtension();

       public InventoryInformation getInventoryInformation();

       public InventoryInformation getInventoryInformation(String layerProtocolFilter);

}
