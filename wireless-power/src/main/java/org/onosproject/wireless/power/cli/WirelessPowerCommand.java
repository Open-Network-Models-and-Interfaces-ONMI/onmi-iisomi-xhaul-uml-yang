package org.onosproject.wireless.power.cli;


import com.google.common.collect.Lists;
import org.apache.karaf.shell.commands.Argument;
import org.apache.karaf.shell.commands.Command;
import org.onosproject.cli.AbstractShellCommand;

import org.onosproject.net.DefaultAnnotations;
import org.onosproject.net.MastershipRole;
import org.onosproject.net.Port;
import org.onosproject.net.Device;
import org.onosproject.net.DeviceId;
import org.onosproject.net.device.DefaultPortDescription;
import org.onosproject.net.device.DeviceProvider;
import org.onosproject.net.device.DeviceProviderRegistry;
import org.onosproject.net.device.DeviceProviderService;
import org.onosproject.net.device.DeviceService;
import org.onosproject.net.device.PortDescription;
import org.onosproject.net.provider.AbstractProvider;
import org.onosproject.net.provider.ProviderId;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.Service;

import java.util.concurrent.atomic.AtomicLong;
import org.onosproject.openflow.controller.Dpid;
import org.onosproject.openflow.controller.OpenFlowController;
import org.onosproject.openflow.controller.OpenFlowEventListener;
import org.onosproject.openflow.controller.OpenFlowSwitch;

import static org.onosproject.openflow.controller.Dpid.dpid;
import static org.onosproject.openflow.controller.Dpid.uri;
import org.projectfloodlight.openflow.protocol.OFPortDesc;
import org.projectfloodlight.openflow.protocol.OFExperimenterPortWireless;
import org.projectfloodlight.openflow.protocol.OFPortDescPropWirelessTransport;
import org.projectfloodlight.openflow.protocol.OFPortModPropWirelessTransport;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterface;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportPortFeatureHeader;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterfacePropParamHeader;
import org.projectfloodlight.openflow.protocol.OFWirelessTransportInterfacePropParamTypes;
import org.projectfloodlight.openflow.protocol.OFWirelessTxCurrentCapacity;
import org.projectfloodlight.openflow.protocol.OFWirelessExperimenterPortMod;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsRequest;
import org.projectfloodlight.openflow.protocol.OFStatsReply;
import org.projectfloodlight.openflow.protocol.OFStatsType;
import org.projectfloodlight.openflow.protocol.OFExperimenterStatsReply;
import org.projectfloodlight.openflow.protocol.OFWirelessMultipartPortsReply;

import org.projectfloodlight.openflow.protocol.OFMessage;
import org.projectfloodlight.openflow.protocol.OFPortState;
import org.projectfloodlight.openflow.protocol.OFPortStatsEntry;
import org.projectfloodlight.openflow.protocol.OFPortStatsReply;
import org.projectfloodlight.openflow.protocol.OFPortStatus;
import org.projectfloodlight.openflow.protocol.OFVersion;

import org.projectfloodlight.openflow.types.OFPort;

import java.util.List;
import java.util.ArrayList;
import java.util.Collection;

@Command(scope = "onos", name = "wireless-port-power",
        description = "Modifies wireless port power")
public class WirelessPowerCommand extends AbstractShellCommand {

    static final ProviderId PID = new ProviderId("cfg", "org.onosproject.rest", false);

    @Argument(index = 0, name = "uri", description = "Device ID",
            required = true, multiValued = false)
    String uri = null;

    @Argument(index = 1, name = "port", description = "Port number",
            required = true, multiValued = false)
    String port = null;

    @Argument(index = 2, name = "value",
            description = "Wireless Tx power value (Kbps)",
            required = true, multiValued = false)
    String value = null;

    private OpenFlowController openFlowController = get(OpenFlowController.class);

    private final AtomicLong xidAtomic = new AtomicLong(1);

    @Override
    protected void execute() {
        log.info("Wireless power command: Device Id {}, Port {}, Tx power {}", uri, port, value);
        long portNum = Integer.parseInt(port);
        long power = Integer.parseInt(value);
        DeviceService service = get(DeviceService.class);
        Device device = service.getDevice(DeviceId.deviceId(uri));
        log.info("device id {}", device.id());

        sendWirelessPortModTxPower(device.id(), portNum, power);
    }

    private void sendWirelessPortModTxPower(DeviceId deviceId, long portNum, long power) {
        final Dpid dpid = dpid(deviceId.uri());
        if (openFlowController == null) {
            log.error("No openFlowController!");
            return;
        }
        OpenFlowSwitch sw = openFlowController.getSwitch(dpid(deviceId.uri()));
        if (sw == null || !sw.isConnected()) {
            log.error("sendWirelessPortMod(): OF Switch not obtained for device {}", uri);
            return;
        }

        log.info("sendWirelessPortMod(): Sending Experimenter Port Modify for {}/{}", uri, portNum);
        // Send OF Port Modify message towards the Network Element
        OFWirelessExperimenterPortMod portMod;
        List<OFPortModPropWirelessTransport> properties = new ArrayList<OFPortModPropWirelessTransport>();
        List<OFWirelessTransportPortFeatureHeader> features = new ArrayList<OFWirelessTransportPortFeatureHeader>();
        List<OFWirelessTransportInterfacePropParamHeader> paramList = new ArrayList<OFWirelessTransportInterfacePropParamHeader>();

        final List<OFPortDesc> portDescs = sw.getPorts();
        for (OFPortDesc portDesc : portDescs) {

            if (portDesc.getPortNo().equals(OFPort.of((int)portNum))) {
                Long statsXid = xidAtomic.getAndIncrement();
                // TX_POWER
                paramList.add((OFWirelessTransportInterfacePropParamHeader)sw.factory().buildWirelessTxPower()
                        .setTxPower((int)power)
                        .build());

                // Build the message
                features.add((OFWirelessTransportPortFeatureHeader)sw.factory().buildWirelessTransportInterface()
                        .setParams(paramList)
                        .build());
                properties.add(sw.factory().buildPortModPropWirelessTransport()
                        .setFeatures(features)
                        .build());

                portMod = sw.factory().buildWirelessExperimenterPortMod()
                        .setXid(statsXid)
                        .setPortNo(portDesc.getPortNo())
                        .setHwAddr(portDesc.getHwAddr())
                        .setConfig(0)
                        .setMask(0)
                        .setProperties(properties)
                        .build();

                sw.sendMsg(portMod);

                log.info("sendWirelessPortMod(): Port {}/{}, Tx power {}",
                        sw.getId(), portDesc.getPortNo(), power);
                break;
            }
        }

    }

}
