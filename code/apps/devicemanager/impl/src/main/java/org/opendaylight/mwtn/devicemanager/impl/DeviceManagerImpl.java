/**
 * Copyright (c) 2017 highstreet technologies GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.mwtn.devicemanager.impl;

import com.google.common.base.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.md.sal.binding.api.ReadTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.controller.sal.binding.api.RpcConsumerRegistry;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementFactory;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.config.impl.HtConfiguration;
import org.opendaylight.mwtn.config.impl.HtDatabaseConfigService;
import org.opendaylight.mwtn.deviceMonitor.impl.DeviceMonitorImpl;
import org.opendaylight.mwtn.devicemanager.api.DeviceManagerService;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.listener.NetconfSubscriptionManagerOfDeviceManager;
import org.opendaylight.mwtn.devicemanager.impl.listener.ODLEventListener;
import org.opendaylight.mwtn.devicemanager.impl.xml.WebSocketServiceClient;
import org.opendaylight.mwtn.devicemanager.impl.xml.XmlMapper;
import org.opendaylight.mwtn.ecompConnector.impl.EventProviderClient;
import org.opendaylight.mwtn.performancemanager.impl.PerformanceManagerImpl;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.netconf.notification._1._0.rev080714.CreateSubscriptionInputBuilder;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.netconf.notification._1._0.rev080714.NotificationsService;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.netconf.notification._1._0.rev080714.StreamNameType;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNodeConnectionStatus.ConnectionStatus;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.network.topology.topology.topology.types.TopologyNetconf;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.websocketmanager.rev150105.WebsocketmanagerService;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NetworkTopology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.NodeId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.TopologyId;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.Topology;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.TopologyKey;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.Node;
import org.opendaylight.yang.gen.v1.urn.tbd.params.xml.ns.yang.network.topology.rev131021.network.topology.topology.NodeKey;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DeviceManagerImpl implements DeviceManagerService, BindingAwareProvider, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(DeviceManagerImpl.class);
    private static final String MYCONFIGURATIONID = "org.opendaylight.mwtn.eventmanager";
    private static final String PMCONFIGURATIONID = "org.opendaylight.mwtn.performancemanager";
    private static final String MYDBKEYNAME = "SDN-Controller";

    //http://sendateodl:8181/restconf/operational/network-topology:network-topology/topology/topology-netconf
    private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
            .create(NetworkTopology.class)
            .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));

    private ProviderContext session;
    private DataBroker dataBroker;

    private WebSocketServiceClient webSocketService;
    //private WebsocketmanagerService websocketmanagerService;
    //private XmlMapper xmlMapper;
    private HtDatabaseEventsService databaseClientEvents;
    private MicrowaveHistoricalPerformanceWriterService databaseClientHistoricalPerformance;
    private ODLEventListener odlEventListener;
    private NetconfSubscriptionManagerOfDeviceManager netconfSubscriptionManager;

    //private HashMap<String, MicrowaveEventListener> microwaveEventListeners;
    private final HashMap<String, ONFCoreNetworkElementRepresentation> networkElementRepresentations = new HashMap<>();
    private PerformanceManagerImpl performanceManager;
    private EventProviderClient ecompProvider;
    private DeviceMonitorImpl deviceMonitor;


    @Override
    public void onSessionInitiated(ProviderContext pSession) {
        LOG.info("Session Initiated start");
        this.session = pSession;
        this.dataBroker = pSession.getSALService(DataBroker.class);

        this.webSocketService = new WebSocketServiceClient(
                pSession.getRpcService(WebsocketmanagerService.class),
                new XmlMapper());

        //this.websocketmanagerService = pSession.getRpcService(WebsocketmanagerService.class);
        //this.xmlMapper = new XmlMapper();

        // Get configuration data from database on localhost server
        HtDatabaseConfigService htConfigurationService = new HtDatabaseConfigService();

        //ECOMP
        this.ecompProvider = new EventProviderClient(htConfigurationService);

        //EM
        HtConfiguration configurationEvenManager = htConfigurationService.getHtConfiguration(MYCONFIGURATIONID);
        if (configurationEvenManager == null) {

            LOG.warn("No {} configuration available. Don't start event manager", MYCONFIGURATIONID);

        } else {

            this.databaseClientEvents = new HtDatabaseEventsService(configurationEvenManager.getIndex(), configurationEvenManager.getHost(),
                    configurationEvenManager.getCluster(), configurationEvenManager.getNode(), MYCONFIGURATIONID);

            this.odlEventListener = new ODLEventListener(MYDBKEYNAME, webSocketService, databaseClientEvents, ecompProvider);
            this.netconfSubscriptionManager = new NetconfSubscriptionManagerOfDeviceManager(this, dataBroker);
            this.netconfSubscriptionManager.register();

        }

        //PM
        HtConfiguration configurationPM = htConfigurationService.getHtConfiguration(PMCONFIGURATIONID);
        if (configurationPM == null) {

            LOG.warn("No {} configuration available. Don't start performance manager", PMCONFIGURATIONID);

        } else {

            this.databaseClientHistoricalPerformance = new MicrowaveHistoricalPerformanceWriterService(configurationPM.getIndex(), configurationPM.getHost(),
                    configurationPM.getCluster(), configurationPM.getNode(), PMCONFIGURATIONID);
            this.performanceManager = new PerformanceManagerImpl(60, databaseClientHistoricalPerformance);
        }

        //DeviceMonitor
        this.deviceMonitor = new DeviceMonitorImpl(odlEventListener);

        LOG.info("Session Initiated end");
    }

    @Override
    public void close() throws Exception {
        LOG.info("EventManagerImpl closing");
        if (performanceManager != null) {
            performanceManager.close();
        }
        this.deviceMonitor.close();
    }

    @Override
    public void startListenerOnNode(NodeId nNodeId, NetconfNode nNode) {

        String mountPointNodeName = nNodeId.getValue();
        LOG.info("Starting Event listener on Netconf device :: Name : {}", mountPointNodeName);

        MountPointService mountService = session.getSALService(MountPointService.class);

        InstanceIdentifier<Node> instanceIdentifier = NETCONF_TOPO_IID.child(Node.class,
                new NodeKey(new NodeId(mountPointNodeName)));

        Optional<MountPoint> optionalMountPoint = null;
        int timeout = 10000;
        while ( !(optionalMountPoint = mountService.getMountPoint(instanceIdentifier)).isPresent() && timeout > 0) {

            LOG.info("Event listener waiting for mount point for Netconf device :: Name : {}", mountPointNodeName);
            try {
                Thread.sleep(1000);
                timeout -= 1000;
            } catch (InterruptedException e) {
                LOG.info("Event listener waiting for mount point for Netconf device :: Name : {} Time: {}", mountPointNodeName, timeout);
            }
        }

        if (!optionalMountPoint.isPresent()) {
            LOG.warn("Event listener timeout while waiting for mount point for Netconf device :: Name : {} ", mountPointNodeName);
            return;
        }

        //Mountpoint is present for sure
        MountPoint mountPoint = optionalMountPoint.get();

        DataBroker netconfNodeDataBroker = mountPoint.getService(DataBroker.class).get();
        LOG.info("Databroker service 1:{} 2:{}", dataBroker.hashCode(), netconfNodeDataBroker.hashCode());
        //getNodeInfoTest(dataBroker);


        //Setup Service that monitors registration/ deregistration of session
        odlEventListener.registration(mountPointNodeName);

        //Setup microwaveEventListener for Notificationservice

        //MicrowaveEventListener microwaveEventListener = new MicrowaveEventListener(mountPointNodeName, websocketmanagerService, xmlMapper, databaseClientEvents);
        ONFCoreNetworkElementRepresentation ne = ONFCoreNetworkElementFactory.create(
                mountPointNodeName, dataBroker, webSocketService,
                databaseClientEvents, instanceIdentifier, netconfNodeDataBroker,
                ecompProvider);
        networkElementRepresentations.put(mountPointNodeName, ne);
        ne.doRegisterMicrowaveEventListener(mountPoint);

        /*{ Shiftet to generic NE
        final Optional<NotificationService> optionalNotificationService = mountPoint.getService(NotificationService.class);
        final NotificationService notificationService = optionalNotificationService.get();
        //notificationService.registerNotificationListener(microwaveEventListener);
        notificationService.registerNotificationListener(ne.doRegisterMicrowaveEventListener());
        }*/

        //Register netconf stream
        {
            final String streamName = "NETCONF";
            final Optional<RpcConsumerRegistry> optionalRpcConsumerService = mountPoint.getService(RpcConsumerRegistry.class);
            final RpcConsumerRegistry rpcConsumerRegitry = optionalRpcConsumerService.get();
            final NotificationsService rpcService = rpcConsumerRegitry.getRpcService(NotificationsService.class);

            final CreateSubscriptionInputBuilder createSubscriptionInputBuilder = new CreateSubscriptionInputBuilder();
            createSubscriptionInputBuilder.setStream(new StreamNameType(streamName));
            LOG.info("Event listener triggering notification stream {} for node {}", streamName, mountPointNodeName);
            try {
                rpcService.createSubscription(createSubscriptionInputBuilder.build());  //  <----- Problem hier
            } catch (NullPointerException e) {
                LOG.warn("createSubscription failed", e.getMessage());
            }
        }

        //-- Read data from NE
        ne.initialReadFromNetworkElement();
        //-- Register NE to performance manager
        performanceManager.registration(mountPointNodeName, ne);

        deviceMonitor.deviceConnectIndication(mountPointNodeName, ne);

        LOG.info("Starting Event listener on Netconf device :: Name : {} finished", mountPointNodeName);
    }

    @Override
    public void removeListenerOnNode(NodeId nNodeId, NetconfNode nNode) {
        String mountPointNodeName = nNodeId.getValue();
        LOG.info("Removing NetworkElementRepresetations for device :: Name : {}", mountPointNodeName);
        ONFCoreNetworkElementRepresentation ne = networkElementRepresentations.remove(mountPointNodeName);
        if (ne != null) {
            int problems = ne.removeAllCurrentProblemsOfNode();
            LOG.debug("Removed all {} problems from database at deregistration",problems);
        } else {
            LOG.warn("No related microwaveEventListener");
        }
        deviceMonitor.deviceDisconnectIndication(mountPointNodeName);
        odlEventListener.deRegistration(mountPointNodeName);
        performanceManager.deRegistration(mountPointNodeName);
    }

    @Override
    public void mountpointNodeCreation(NodeId nNodeId, NetconfNode nNode) {
        LOG.info("mountpointNodeCreation {} {}", nNodeId.getValue(), nNode.getConnectionStatus());
        String mountPointNodeName = nNodeId.getValue();
        deviceMonitor.createMountpointIndication(mountPointNodeName);
    }

    @Override
    public void mountpointNodeRemoved(NodeId nNodeId) {
        LOG.info("mountpointNodeRemoved {}", nNodeId.getValue());
        String mountPointNodeName = nNodeId.getValue();
        deviceMonitor.removeMountpointIndication(mountPointNodeName);
    }

    /* Old implementation */
    @Override
    public void startListenerOnNode(String mountPointNodeName) {
        LOG.info("Depreciated startListenerOnNode {}", mountPointNodeName);
    }

    /* Old implementation */
    @Override
    public void removeListenerOnNode(String mountPointNodeName) {
        LOG.info("Depreciated removeListenerOnNode {}", mountPointNodeName);
    }


    /*-----------------------------------------------------------------------------------------------------------------------------
     * Informational
     */

    // Referenz: https://github.com/opendaylight/coretutorials/blob/master/ncmount/impl/src/main/java/ncmount/impl/NcmountProvider.java
    // Keyzeile: NetconfNode nnode=node.getAugmentation(NetconfNode.class);
    public static void getNodeInfoTest(DataBroker dataBroker){
        List<Node> nodes;
        ReadTransaction tx=dataBroker.newReadOnlyTransaction();
        try {
            Optional<Topology> topoO = tx.read(LogicalDatastoreType.OPERATIONAL,NETCONF_TOPO_IID).checkedGet();
            if (! topoO.isPresent()) {
                LOG.error("XXX Can not read node config from datastore");
                return;
            } else {
                Topology topo = topoO.get();
                nodes=topo.getNode();

                List<String> results=new ArrayList<>();
                for (  Node node : nodes) {
                    LOG.info("XXX Node: {}",node);
                    results.add(node.getNodeId().getValue());
                }

                nodes=tx.read(LogicalDatastoreType.OPERATIONAL,NETCONF_TOPO_IID).checkedGet().get().getNode();

                results=new ArrayList<>();
                for (  Node node : nodes) {
                    LOG.info("XXX Node: {}",node);
                    NetconfNode nnode=node.getAugmentation(NetconfNode.class);
                    if (nnode != null) {
                        ConnectionStatus csts=nnode.getConnectionStatus();
                        if (csts == ConnectionStatus.Connected) {
                            List<String> capabilities=nnode.getAvailableCapabilities().getAvailableCapability();
                            LOG.info("XXX Capabilities: {}",capabilities);
                        }
                    }
                    results.add(node.getNodeId().getValue());
                }
            }
        }
        catch (  ReadFailedException e) {
            LOG.error("XXX Failed1 to read node config from datastore",e);
        }
        catch (  IllegalStateException e) {
            LOG.error("XXX Failed2 to read node config from datastore",e);
        }
    }


}
