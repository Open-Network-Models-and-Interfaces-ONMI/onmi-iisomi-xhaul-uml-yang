package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.impl.rev170509;

import com.highstreet.technologies.odl.app.impl.ACMAlarmNotificationsHandler;
import com.highstreet.technologies.odl.app.impl.ReRoutingFCRouteProvider;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ReRoutingFCRouteImplModule extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.impl.rev170509.AbstractReRoutingFCRouteImplModule
{
    public ReRoutingFCRouteImplModule(
            org.opendaylight.controller.config.api.ModuleIdentifier identifier,
            org.opendaylight.controller.config.api.DependencyResolver dependencyResolver)
    {
        super(identifier, dependencyResolver);
    }

    public ReRoutingFCRouteImplModule(
            org.opendaylight.controller.config.api.ModuleIdentifier identifier,
            org.opendaylight.controller.config.api.DependencyResolver dependencyResolver,
            org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.reroutingfcroute.impl.rev170509.ReRoutingFCRouteImplModule oldModule,
            java.lang.AutoCloseable oldInstance)
    {
        super(identifier, dependencyResolver, oldModule, oldInstance);
    }

    private static final Logger LOG = LoggerFactory.getLogger(ReRoutingFCRouteImplModule.class);
    private BundleContext bundleContext;

    @Override
    public void customValidation()
    {
        // add custom validation form module attributes here.
    }

    @Override
    public java.lang.AutoCloseable createInstance()
    {
        LOG.info("CreateInstance");
        ReRoutingFCRouteProvider ic = new ReRoutingFCRouteProvider(bundleContext, getRpcRegistryDependency());
        getBrokerDependency().registerProvider(ic);

        LOG.info("Creating notification");
        getListenServiceDependency().registerNotificationListener(new ACMAlarmNotificationsHandler());

        return ic.getImpl();
    }

    public void setBundleContext(BundleContext bundleContext)
    {
        this.bundleContext = bundleContext;
    }
}
