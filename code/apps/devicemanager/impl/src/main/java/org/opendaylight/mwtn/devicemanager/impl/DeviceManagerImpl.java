/**
 * Copyright (c) 2017 highstreet technologies GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.mwtn.devicemanager.impl;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.concurrent.ConcurrentHashMap;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.controller.sal.binding.api.RpcConsumerRegistry;
import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementFactory;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.config.impl.EsConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.PmConfig;
import org.opendaylight.mwtn.deviceMonitor.impl.DeviceMonitorImpl;
import org.opendaylight.mwtn.devicemanager.api.DeviceManagerService;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.listener.NetconfChangeListener;
import org.opendaylight.mwtn.devicemanager.impl.listener.ODLEventListener;
import org.opendaylight.mwtn.devicemanager.impl.xml.WebSocketServiceClient;
import org.opendaylight.mwtn.devicemanager.impl.xml.XmlMapper;
import org.opendaylight.mwtn.ecompConnector.impl.EcompProviderClient;
import org.opendaylight.mwtn.index.impl.IndexConfigService;
import org.opendaylight.mwtn.index.impl.IndexMwtnService;
import org.opendaylight.mwtn.index.impl.IndexUpdateService;
import org.opendaylight.mwtn.performancemanager.impl.PerformanceManagerImpl;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.netconf.notification._1._0.rev080714.CreateSubscriptionInputBuilder;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.netconf.notification._1._0.rev080714.NotificationsService;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.netconf.notification._1._0.rev080714.StreamNameType;
import org.opendaylight.yang.gen.v1.urn.opendaylight.netconf.node.topology.rev150114.NetconfNode;
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

import com.google.common.base.Optional;


public class DeviceManagerImpl implements DeviceManagerService, BindingAwareProvider, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(DeviceManagerImpl.class);
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
    //private NetconfSubscriptionManagerOfDeviceManager netconfSubscriptionManager;
    private NetconfChangeListener netconfChangeListener;

    //private HashMap<String, MicrowaveEventListener> microwaveEventListeners;
    private final ConcurrentHashMap<String, ONFCoreNetworkElementRepresentation> networkElementRepresentations = new ConcurrentHashMap<>();
    private PerformanceManagerImpl performanceManager = null;
    private EcompProviderClient ecompProvider;
    private DeviceMonitorImpl deviceMonitor;
	private IndexUpdateService updateService;
	private IndexConfigService configService;
	private IndexMwtnService mwtnService;
	private HtDatabaseNode htDatabase;
	private Boolean initialized = false;

    @Override
    public void onSessionInitiated(ProviderContext pSession) {
        LOG.info("Session Initiated start");

        this.session = pSession;
        this.dataBroker = pSession.getSALService(DataBroker.class);

        //Get configuration
        HtDevicemanagerConfiguration config = HtDevicemanagerConfiguration.getConfiguration();
        EsConfig dbConfig=config.getEs();
        LOG.debug("esConfig="+dbConfig.toString());
        //Start database
        htDatabase = HtDatabaseNode.start(dbConfig);

        //Create DB index if not existing and if database is running.
        this.configService = new IndexConfigService(htDatabase, dbConfig.getHost(),dbConfig.getCluster(), dbConfig.getNode());
        this.mwtnService = new IndexMwtnService(htDatabase, dbConfig.getHost(),dbConfig.getCluster(), dbConfig.getNode());

        //Websockets
        this.webSocketService = new WebSocketServiceClient(
                pSession.getRpcService(WebsocketmanagerService.class),
                new XmlMapper());

        //ECOMP
        this.ecompProvider = new EcompProviderClient(config.getEcomp());

        //EM
        {
            this.databaseClientEvents = new HtDatabaseEventsService(dbConfig.getHost(),dbConfig.getCluster(), dbConfig.getNode());

            String myDbKeyNameExtended=MYDBKEYNAME;
            try {
				myDbKeyNameExtended += "-"+InetAddress.getLocalHost().getHostName();
			} catch (UnknownHostException e) {
				LOG.info("Can not query hostname: "+e.getMessage());
			}
            this.odlEventListener = new ODLEventListener(myDbKeyNameExtended, webSocketService, databaseClientEvents, ecompProvider);
        }

        //PM
        PmConfig configurationPM=config.getPm();
        LOG.info("Performance manager configuration: {}",configurationPM);
        if (!configurationPM.isPerformanceManagerEnabled()) {

        	LOG.info("No configuration available. Don't start performance manager");
        }
        else {

        	this.databaseClientHistoricalPerformance = new MicrowaveHistoricalPerformanceWriterService(configurationPM.getHost(), configurationPM.getCluster(), configurationPM.getNode());
        	this.performanceManager = new PerformanceManagerImpl(60, databaseClientHistoricalPerformance);
        }

        //DUS (Database update service)
        LOG.debug("start db update service");
        this.updateService = new IndexUpdateService(htDatabase, dbConfig.getHost(),dbConfig.getCluster(), dbConfig.getNode());
        this.updateService.start();

        //DM
        //DeviceMonitor has to be available before netconfSubscriptionManager is configured
        LOG.debug("start DeviceMonitor Service");
        this.deviceMonitor = new DeviceMonitorImpl(odlEventListener);

        // netconfSubscriptionManager should be the last one because this is a callback service
        LOG.debug("start NetconfSubscriptionManager Service");
        //this.netconfSubscriptionManager = new NetconfSubscriptionManagerOfDeviceManager(this, dataBroker);
        //this.netconfSubscriptionManager.register();
        this.netconfChangeListener = new NetconfChangeListener(this, dataBroker);
        this.netconfChangeListener.register();

        synchronized(initialized) {
            initialized = true;
        }

        LOG.info("Session Initiated end");
    }

    @Override
    public void close() throws Exception {
        LOG.info("DeviceManagerImpl closing ...");

        close(performanceManager);
        close(deviceMonitor);
        close(updateService, configService, mwtnService);
        close(htDatabase);
        close(netconfChangeListener);

        LOG.info("DeviceManagerImpl closing done");
    }

    /**
     * Used to close all Services, that should support AutoCloseable Pattern
     * @param toClose
     * @throws Exception
     */
    private void close(AutoCloseable... toCloseList) throws Exception {
    	for (int t=0; t < toCloseList.length; t++) {
    		if (toCloseList[t] != null)
    			toCloseList[t].close();
    	}
    }

    /**
     * For each mounted device a mountpoint is created and this listener is called.
     */
    @Override
    public void startListenerOnNode(NodeId nNodeId, NetconfNode nNode) {
    	synchronized(networkElementRepresentations) {

    		String mountPointNodeName = nNodeId.getValue();
    		LOG.info("Starting Event listener on Netconf device :: Name : {}", mountPointNodeName);

    		if (networkElementRepresentations.containsKey(mountPointNodeName)) {
    			LOG.warn("Mountpoint {} already registered. Leave startup procedure.", mountPointNodeName);
    		}
    		if (!initialized) {
    			LOG.warn("Devicemanager initialization still pending.");
    		}

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
    		ne.sync();
    		//-- Register NE to performance manager
    		if (performanceManager != null) {
    			performanceManager.registration(mountPointNodeName, ne);
    		}

    		deviceMonitor.deviceConnectIndication(mountPointNodeName, ne);

    		LOG.info("Starting Event listener on Netconf device :: Name : {} finished", mountPointNodeName);

    	}

    }

    @Override
    public void removeListenerOnNode(NodeId nNodeId, NetconfNode nNode) {
        String mountPointNodeName = nNodeId.getValue();
        LOG.info("Removing NetworkElementRepresetations for device :: Name : {}", mountPointNodeName);

        ONFCoreNetworkElementRepresentation ne = networkElementRepresentations.remove(mountPointNodeName);
        if (ne != null) {
            int problems = ne.removeAllCurrentProblemsOfNode();
            LOG.debug("Removed all {} problems from database at deregistration for {}",problems, mountPointNodeName);
        } else {
            LOG.warn("No related ne object for mountpoint {} to deregister .", mountPointNodeName);
        }
        if (deviceMonitor != null)
        	deviceMonitor.deviceDisconnectIndication(mountPointNodeName);
        if (odlEventListener != null)
        	odlEventListener.deRegistration(mountPointNodeName);
        if (performanceManager != null) {
            performanceManager.deRegistration(mountPointNodeName);
        }

    }

    @Override
    public void mountpointNodeCreation(NodeId nNodeId, NetconfNode nNode) {
        String mountPointNodeName = nNodeId.getValue();
        LOG.info("mountpointNodeCreation {} {}", nNodeId.getValue(), nNode.getConnectionStatus());
        deviceMonitor.createMountpointIndication(mountPointNodeName);
    }

    @Override
    public void mountpointNodeRemoved(NodeId nNodeId) {
        String mountPointNodeName = nNodeId.getValue();
        LOG.info("mountpointNodeRemoved {}", nNodeId.getValue());
        deviceMonitor.removeMountpointIndication(mountPointNodeName);
    }


}
