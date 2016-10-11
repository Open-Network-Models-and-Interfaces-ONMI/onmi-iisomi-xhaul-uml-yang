package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.impl.rev160929;

import com.highstreet.technologies.odl.app.impl.ClosedLoopAutomationCreator;
import com.highstreet.technologies.odl.app.impl.MicrowaveModelNotificationsHandler;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClosedLoopAutomationImplModule extends AbstractClosedLoopAutomationImplModule {
    private static final Logger LOG = LoggerFactory.getLogger(ClosedLoopAutomationImplModule.class);
    private BundleContext bundleContext;

    public ClosedLoopAutomationImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver) {
        super(identifier, dependencyResolver);
    }

    public ClosedLoopAutomationImplModule(org.opendaylight.controller.config.api.ModuleIdentifier identifier, org.opendaylight.controller.config.api.DependencyResolver dependencyResolver, org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.impl.rev160929.ClosedLoopAutomationImplModule oldModule, java.lang.AutoCloseable oldInstance) {
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
        System.out.println("CreateInstance");


        ClosedLoopAutomationCreator ic = new ClosedLoopAutomationCreator(bundleContext, getRpcRegistryDependency());
        getBrokerDependency().registerProvider(ic);

        System.out.println("Creating notification");
        getListenServiceDependency().registerNotificationListener(new MicrowaveModelNotificationsHandler());

        return ic.getImpl();
    }

}
