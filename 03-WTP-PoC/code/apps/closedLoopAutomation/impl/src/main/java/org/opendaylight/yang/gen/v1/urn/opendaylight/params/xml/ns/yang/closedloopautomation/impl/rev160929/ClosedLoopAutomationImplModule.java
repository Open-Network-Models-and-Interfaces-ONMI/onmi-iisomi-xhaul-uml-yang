package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.impl.rev160929;

import com.highstreet.technologies.odl.app.impl.ClosedLoopAutomationImpl;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.rev160919.ClosedLoopAutomationService;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClosedLoopAutomationImplModule extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.closedloopautomation.impl.rev160929.AbstractClosedLoopAutomationImplModule {
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
        LOG.info("createInstance start");
        System.out.println("createInstance start");
        final ClosedLoopAutomationImpl closedLoopAutomation = new ClosedLoopAutomationImpl(getDomDataProviderDependency(), this.bundleContext);
        getRpcRegistryDependency().addRpcImplementation(ClosedLoopAutomationService.class, closedLoopAutomation);
        return closedLoopAutomation;

//        NotificationService notificationService = session.getSALService(NotificationService.class);
//        notificationService.registerNotificationListener(new MicrowaveModelNotificationsHandler());

    }

}
