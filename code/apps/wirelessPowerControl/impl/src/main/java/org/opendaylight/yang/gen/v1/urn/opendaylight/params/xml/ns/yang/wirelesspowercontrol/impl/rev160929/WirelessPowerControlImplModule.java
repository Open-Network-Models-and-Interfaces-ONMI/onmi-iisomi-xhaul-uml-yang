package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.wirelesspowercontrol.impl.rev160929;

import com.highstreet.technologies.odl.app.impl.WirelessPowerControlCreator;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WirelessPowerControlImplModule extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.wirelesspowercontrol.impl.rev160929.AbstractWirelessPowerControlImplModule {
    private static final Logger LOG = LoggerFactory.getLogger(WirelessPowerControlImplModule.class);
    private BundleContext bundleContext;

    public WirelessPowerControlImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
        super(identifier, dependencyResolver);
    }

    public WirelessPowerControlImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver, WirelessPowerControlImplModule oldModule, java.lang.AutoCloseable oldInstance) {
        super(identifier, dependencyResolver, oldModule, oldInstance);
    }

    public void setBundleContext(final BundleContext bundleContext) {
        this.bundleContext = bundleContext;
    }
    @Override
    public void customValidation() {
        // add custom validation form module attributes here.
    }

    @Override
    public java.lang.AutoCloseable createInstance() {
        LOG.info("CreateInstance");
        WirelessPowerControlCreator ic = new WirelessPowerControlCreator(bundleContext, getRpcRegistryDependency());
        getBrokerDependency().registerProvider(ic);

        return ic.getImpl();
    }

}
