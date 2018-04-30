package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.impl.rev180119;

import org.opendaylight.mwtn.opticalpathmanager.OpticalPathManagerProvider;

public class OpticalPathManagerImplModule extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.impl.rev180119.AbstractOpticalPathManagerImplModule {
    public OpticalPathManagerImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
        super(identifier, dependencyResolver);
    }

    public OpticalPathManagerImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver, org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.opticalpathmanager.impl.rev180119.OpticalPathManagerImplModule oldModule, java.lang.AutoCloseable oldInstance) {
        super(identifier, dependencyResolver, oldModule, oldInstance);
    }

    @Override
    public void customValidation() {
        // add custom validation form module attributes here.
    }

    //@Override
    //public java.lang.AutoCloseable createInstance() {
    //    // TODO:implement
    //    throw new java.lang.UnsupportedOperationException();
    //}

    @Override
    public java.lang.AutoCloseable createInstance() {
        OpticalPathManagerProvider provider = new OpticalPathManagerProvider();
        getBrokerDependency().registerProvider(provider);
        return provider;
    }


}
