package org.opendaylight.mwtn.maintenance;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetMaintenanceModeOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetRequiredNetworkElementKeysOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.SetMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.SetMaintenanceModeOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ShowRequiredNetworkElementInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ShowRequiredNetworkElementOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.TestMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.TestMaintenanceModeOutputBuilder;

public interface MaintenanceRPCServiceAPI {

	public GetRequiredNetworkElementKeysOutputBuilder getRequiredNetworkElementKeys();

	public ShowRequiredNetworkElementOutputBuilder showRequiredNetworkElement(ShowRequiredNetworkElementInput input);

	public GetMaintenanceModeOutputBuilder getMaintenanceMode(GetMaintenanceModeInput input);

	public SetMaintenanceModeOutputBuilder setMaintenanceMode(SetMaintenanceModeInput input);

	public TestMaintenanceModeOutputBuilder testMaintenanceMode(TestMaintenanceModeInput input);

}
