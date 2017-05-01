package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.impl.rev170317;

import org.opendaylight.mwtn.devicemanager.impl.DeviceManagerImpl;

public class DeviceManagerImplModule extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.impl.rev170317.AbstractDeviceManagerImplModule {
    public DeviceManagerImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
        super(identifier, dependencyResolver);
    }

    public DeviceManagerImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver, org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.impl.rev170317.DeviceManagerImplModule oldModule, java.lang.AutoCloseable oldInstance) {
        super(identifier, dependencyResolver, oldModule, oldInstance);
    }

    @Override
    public void customValidation() {
        // add custom validation form module attributes here.
    }

    @Override
    public java.lang.AutoCloseable createInstance() {
        DeviceManagerImpl deviceManagerImpl = new DeviceManagerImpl();
        getBrokerDependency().registerProvider(deviceManagerImpl);
        return deviceManagerImpl;
    }

}
