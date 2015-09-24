package org.onosproject.wireless.shape.cli;


import com.google.common.collect.Lists;
import org.apache.karaf.shell.commands.Argument;
import org.apache.karaf.shell.commands.Command;
import org.onosproject.cli.AbstractShellCommand;
import org.onosproject.net.DefaultAnnotations;
import org.onosproject.net.Device;
import org.onosproject.net.DeviceId;
import org.onosproject.net.MastershipRole;
import org.onosproject.net.Port;
import org.onosproject.net.device.DefaultPortDescription;
import org.onosproject.net.device.DeviceProvider;
import org.onosproject.net.device.DeviceProviderRegistry;
import org.onosproject.net.device.DeviceProviderService;
import org.onosproject.net.device.DeviceService;
import org.onosproject.net.device.DeviceStore;
import org.onosproject.net.device.PortDescription;
import org.onosproject.net.provider.AbstractProvider;
import org.onosproject.net.provider.ProviderId;

import java.util.List;

@Command(scope = "onos", name = "annotate-port",
        description = "Annotates network model entities")
public class AnnotatePortCommand extends AbstractShellCommand {

    static final ProviderId PID = new ProviderId("cfg", "org.onosproject.rest");

    @Argument(index = 0, name = "uri", description = "Device ID",
            required = true, multiValued = false)
    String uri = null;

    @Argument(index = 1, name = "key", description = "Annotation key",
            required = true, multiValued = false)
    String key = null;

    @Argument(index = 2, name = "value",
            description = "Annotation value (null to remove)",
            required = false, multiValued = false)
    String value = null;

    @Override
    protected void execute() {
        DeviceService service = get(DeviceService.class);
//        DeviceStore deviceStore = get(DeviceStore.class);
        Device device = service.getDevice(DeviceId.deviceId(uri));
        log.info(String.valueOf(device));
        List<Port> ports = service.getPorts(DeviceId.deviceId(uri));
        log.info(String.valueOf(ports));
        List<PortDescription> descs = Lists.newArrayList();
        DeviceProviderRegistry registry = get(DeviceProviderRegistry.class);
        DeviceProvider provider = new AnnotationProvider();
        for (Port port : ports) {
            DefaultAnnotations annotations = DefaultAnnotations.builder()
                    .set(key, value).build();
            descs.add(new DefaultPortDescription(port.number(),
                                                 port.isEnabled(), port.type(), port.portSpeed(), annotations));
        }
        try {
            DeviceProviderService providerService = registry.register(provider);
            log.info("update port");
            providerService.updatePorts(device.id(), descs);
        } finally {
            registry.unregister(provider);
        }

    }

    private static final class AnnotationProvider
            extends AbstractProvider implements DeviceProvider {
        private AnnotationProvider() {
            super(PID);
        }

        @Override
        public void triggerProbe(DeviceId deviceId) {
        }

        @Override
        public void roleChanged(DeviceId deviceId, MastershipRole newRole) {

        }

        @Override
        public boolean isReachable(DeviceId deviceId) {
            return false;
        }
    }
}
