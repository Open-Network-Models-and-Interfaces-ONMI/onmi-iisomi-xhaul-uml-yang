package org.opendaylight.mwtn.base.netconf;

import com.google.common.base.Optional;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.ReadTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.xml.XmlMapper;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNodeConnectionStatus.ConnectionStatus;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Create a Network Element representation according to the capability information.
 * The capabilities are more than an ODL-QName. After the ? other terms than "revision" are provided.
 *
 */
public class ONFCoreNetworkElementFactory {

    private static final Logger LOG = LoggerFactory.getLogger(ONFCoreNetworkElementFactory.class);

    public static ONFCoreNetworkElementRepresentation create( String mountPointNodeName,
            DataBroker dataBroker, WebsocketmanagerService websocketmanagerService,
            XmlMapper xmlMapper, HtDatabaseEventsService databaseService, InstanceIdentifier<Node> instanceIdentifier,
            DataBroker mountpointDataBroker ) {

        ReadTransaction tx=dataBroker.newReadOnlyTransaction();
        ONFCoreNetworkElementRepresentation res = null;

        try {
            Optional<Node> nodeOption = tx.read(LogicalDatastoreType.OPERATIONAL,instanceIdentifier).checkedGet();
            if (nodeOption.isPresent()) {
                Node node = nodeOption.get();
                NetconfNode nnode=node.getAugmentation(NetconfNode.class);
                if (nnode != null) {
                    ConnectionStatus csts=nnode.getConnectionStatus();
                    if (csts == ConnectionStatus.Connected) {
                        Capabilities capabilities = new Capabilities(nnode.getAvailableCapabilities().getAvailableCapability());

                        LOG.info("Mountpoint {} capabilities {}",mountPointNodeName, capabilities);

                        res = ONFCoreNetworkElement10.build(mountPointNodeName, capabilities, mountpointDataBroker, websocketmanagerService, xmlMapper, databaseService );
                        if (res == null) {
                            res = ONFCoreNetworkElement12.build(mountPointNodeName, capabilities, mountpointDataBroker, websocketmanagerService, xmlMapper, databaseService);
                        }
                    }
                }
            }
        } catch (ReadFailedException | IllegalArgumentException e) {
            LOG.warn("Can not generate specific NE Version representation. ", e);
        }
        if (res == null) {
            res = new ONFCoreEmpty(mountPointNodeName);
        }

        LOG.info("Mointpoint {} started as {}", mountPointNodeName,res.getClass().getSimpleName() );

        return res;
    }


}
