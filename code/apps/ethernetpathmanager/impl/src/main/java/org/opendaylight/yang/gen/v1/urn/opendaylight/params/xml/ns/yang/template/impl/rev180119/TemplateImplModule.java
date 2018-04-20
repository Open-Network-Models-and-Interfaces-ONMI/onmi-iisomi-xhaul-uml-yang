package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.template.impl.rev180119;

import org.opendaylight.mwtn.ethernetpathmanager.EthernetPathManagerProvider;

public class TemplateImplModule extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.template.impl.rev180119.AbstractTemplateImplModule {
    public TemplateImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
        super(identifier, dependencyResolver);
    }

    public TemplateImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver, org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.template.impl.rev180119.TemplateImplModule oldModule, java.lang.AutoCloseable oldInstance) {
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
        EthernetPathManagerProvider provider = new EthernetPathManagerProvider();
        getBrokerDependency().registerProvider(provider);
        return provider;
    }


}
