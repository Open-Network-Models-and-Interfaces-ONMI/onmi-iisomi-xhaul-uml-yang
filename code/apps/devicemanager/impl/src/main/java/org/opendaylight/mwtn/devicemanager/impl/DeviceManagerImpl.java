/**
 * Copyright (c) 2017 highstreet technologies GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.mwtn.devicemanager.impl;

import com.google.common.base.Optional;
import com.google.common.io.Files;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import org.knopflerfish.service.log.LogService;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.MountPoint;
import org.opendaylight.controller.md.sal.binding.api.MountPointService;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.controller.sal.binding.api.RpcConsumerRegistry;
import org.opendaylight.mwtn.aaiConnector.impl.AaiProviderClient;
import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementFactory;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElementRepresentation;
import org.opendaylight.mwtn.base.toggleAlarmFilter.NotificationDelayService;
import org.opendaylight.mwtn.config.impl.AkkaConfig;
import org.opendaylight.mwtn.config.impl.EsConfig;
import org.opendaylight.mwtn.config.impl.GeoConfig;
import org.opendaylight.mwtn.config.impl.HtDevicemanagerConfiguration;
import org.opendaylight.mwtn.config.impl.PmConfig;
import org.opendaylight.mwtn.dcaeConnector.impl.DcaeProviderClient;
import org.opendaylight.mwtn.devicemanager.api.DeviceManagerService;
import org.opendaylight.mwtn.devicemanager.impl.database.service.HtDatabaseEventsService;
import org.opendaylight.mwtn.devicemanager.impl.listener.NetconfChangeListener;
import org.opendaylight.mwtn.devicemanager.impl.listener.ODLEventListener;
import org.opendaylight.mwtn.devicemanager.impl.xml.WebSocketServiceClient;
import org.opendaylight.mwtn.devicemanager.impl.xml.XmlMapper;
import org.opendaylight.mwtn.devicemonitor.impl.DeviceMonitorImpl;
import org.opendaylight.mwtn.index.impl.IndexConfigService;
import org.opendaylight.mwtn.index.impl.IndexMwtnService;
import org.opendaylight.mwtn.index.impl.IndexUpdateService;
import org.opendaylight.mwtn.maintenance.impl.MaintenanceServiceImpl;
import org.opendaylight.mwtn.performancemanager.impl.PerformanceManagerImpl;
import org.opendaylight.mwtn.performancemanager.impl.database.service.MicrowaveHistoricalPerformanceWriterService;
import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.netconf.notification._1._0.rev080714.CreateSubscriptionInput;
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
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.osgi.framework.ServiceReference;
import org.osgi.service.log.LogEntry;
import org.osgi.service.log.LogListener;
import org.osgi.service.log.LogReaderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeviceManagerImpl implements DeviceManagerService, BindingAwareProvider, AutoCloseable, ResyncNetworkElementsListener {

    private static final Logger LOG = LoggerFactory.getLogger(DeviceManagerImpl.class);
    private static final String MYDBKEYNAMEBASE = "SDN-Controller";

    // http://sendateodl:8181/restconf/operational/network-topology:network-topology/topology/topology-netconf
    private static final InstanceIdentifier<Topology> NETCONF_TOPO_IID = InstanceIdentifier
            .create(NetworkTopology.class)
            .child(Topology.class, new TopologyKey(new TopologyId(TopologyNetconf.QNAME.getLocalName())));
    private static final String STARTUPLOG_FILENAME = "etc/devicemanager.startup.log";
    //private static final String STARTUPLOG_FILENAME2 = "data/cache/devicemanager.startup.log";
    private final static LogListener startupLogListener = new MyLogListener();

    private ProviderContext session;
    private DataBroker dataBroker;
    private MountPointService mountService;
    private DeviceManagerApiServiceImpl rpcApiService;

    private WebSocketServiceClient webSocketService;
    private HtDatabaseEventsService databaseClientEvents;
    private ODLEventListener odlEventListener;
    private NetconfChangeListener netconfChangeListener;

    private final ConcurrentHashMap<String, ONFCoreNetworkElementRepresentation> networkElementRepresentations = new ConcurrentHashMap<>();
    private @Nullable PerformanceManagerImpl performanceManager = null;
    private ProviderClient dcaeProviderClient;
    private ProviderClient aotsMProvider;
    private @Nullable AaiProviderClient aaiProviderClient;
    private DeviceMonitorImpl deviceMonitor;
    private IndexUpdateService updateService;
    private IndexConfigService configService;
    private IndexMwtnService mwtnService;
    private HtDatabaseNode htDatabase;
    private Boolean initialized = false;
    private MaintenanceServiceImpl maintenanceService;
    private NotificationDelayService notificationDelayService;
    private Thread threadDoClearCurrentFaultByNodename = null;
    private int refreshCounter = 0;
    private AkkaConfig akkaConfig;

    @Override
    public void onSessionInitiated(ProviderContext pSession) {
        LOG.info("start log listener for devmgr startup");
        LogReaderService startupLog = startStartupLog(STARTUPLOG_FILENAME);
        LOG.info("Session Initiated start");

        this.session = pSession;
        this.dataBroker = pSession.getSALService(DataBroker.class);
        this.mountService = session.getSALService(MountPointService.class);

        // Start RPC Service
        this.rpcApiService = new DeviceManagerApiServiceImpl(session);

        // Get configuration
        HtDevicemanagerConfiguration config = HtDevicemanagerConfiguration.getConfiguration();
        this.akkaConfig = null;
        try {
            this.akkaConfig = AkkaConfig.load();
            LOG.debug("akka.conf loaded: "+akkaConfig.toString());
        } catch (Exception e1) {
            LOG.warn("problem loading akka.conf: " + e1.getMessage());
        }
        GeoConfig geoConfig = null;
        if (akkaConfig != null && akkaConfig.isCluster()) {
            LOG.info("cluster mode detected");
            if (GeoConfig.fileExists()) {
                try {
                    LOG.debug("try to load geoconfig");
                    geoConfig = GeoConfig.load();
                } catch (Exception err) {
                    LOG.warn("problem loading geoconfig: " + err.getMessage());
                }
            } else {
                LOG.debug("no geoconfig file found");
            }
        }
        else
        {
            LOG.info("single node mode detected");
        }

        this.notificationDelayService=new NotificationDelayService(config);

        EsConfig dbConfig = config.getEs();
        LOG.debug("esConfig=" + dbConfig.toString());
        // Start database
        htDatabase = HtDatabaseNode.start(dbConfig, akkaConfig,geoConfig);

        // init Database Values only if singleNode or clusterMember=1
        if (akkaConfig == null || akkaConfig.isSingleNode() || akkaConfig != null && akkaConfig.isCluster()
                && akkaConfig.getClusterConfig().getRoleMemberIndex() == 1) {
            // Create DB index if not existing and if database is running
            this.configService = new IndexConfigService(htDatabase);
            this.mwtnService = new IndexMwtnService(htDatabase);
        }
        // start service for device maintenance service
        this.maintenanceService = new MaintenanceServiceImpl(htDatabase);
        // Websockets
        this.webSocketService = new WebSocketServiceClient(pSession.getRpcService(WebsocketmanagerService.class),
                new XmlMapper());

        // DCAE
        this.dcaeProviderClient = new DcaeProviderClient(config, dbConfig.getCluster(), this);

        this.aaiProviderClient = new AaiProviderClient(config,this);
        // EM
        EsConfig emConfig = dbConfig.cloneWithIndex("sdnevents");

        if (emConfig == null) {
            LOG.warn("No {} configuration available. Don't start event manager");
        } else {
            this.databaseClientEvents = new HtDatabaseEventsService(htDatabase);

            String myDbKeyNameExtended=MYDBKEYNAMEBASE+"-"+dbConfig.getCluster();


            this.odlEventListener = new ODLEventListener(myDbKeyNameExtended, webSocketService, databaseClientEvents,
                    dcaeProviderClient, aotsMProvider,maintenanceService);
        }

        // PM
        PmConfig configurationPM = config.getPm();
        LOG.info("Performance manager configuration: {}", configurationPM);
        if (!configurationPM.isPerformanceManagerEnabled()) {

            LOG.info("No configuration available. Don't start performance manager");
        } else {
            @Nullable MicrowaveHistoricalPerformanceWriterService databaseClientHistoricalPerformance;
            databaseClientHistoricalPerformance = new MicrowaveHistoricalPerformanceWriterService(htDatabase);
            this.performanceManager = new PerformanceManagerImpl(60, databaseClientHistoricalPerformance);
        }

        // DUS (Database update service)
        LOG.debug("start db update service");
        this.updateService = new IndexUpdateService(htDatabase, dbConfig.getHost(), dbConfig.getCluster(),
                dbConfig.getNode());
        this.updateService.start();

        // RPC Service for specific services
        this.rpcApiService.setMaintenanceService(this.maintenanceService);
        this.rpcApiService.setResyncListener(this);
        // DM
        // DeviceMonitor has to be available before netconfSubscriptionManager is
        // configured
        LOG.debug("start DeviceMonitor Service");
        this.deviceMonitor = new DeviceMonitorImpl(dataBroker, odlEventListener);

        // netconfSubscriptionManager should be the last one because this is a callback
        // service
        LOG.debug("start NetconfSubscriptionManager Service");
        // this.netconfSubscriptionManager = new
        // NetconfSubscriptionManagerOfDeviceManager(this, dataBroker);
        // this.netconfSubscriptionManager.register();
        this.netconfChangeListener = new NetconfChangeListener(this, dataBroker);
        this.netconfChangeListener.register();

        synchronized (initialized) {
            initialized = true;
        }

        LOG.info("Session Initiated end");
        stopStartupLog(startupLog);
        LOG.info("stop log listener for devmgr startup");
    }

    @Override
    public void close() throws Exception {
        LOG.info("DeviceManagerImpl closing ...");

        close(performanceManager);
        close(dcaeProviderClient);
        close(aaiProviderClient);
        close(aotsMProvider);
        close(deviceMonitor);
        close(updateService, configService, mwtnService);
        close(htDatabase);
        close(netconfChangeListener);
        close(maintenanceService);
        close(rpcApiService);
        close(notificationDelayService);

        LOG.info("DeviceManagerImpl closing done");
    }

    /**
     * Used to close all Services, that should support AutoCloseable Pattern
     *
     * @param toClose
     * @throws Exception
     */
    private void close(AutoCloseable... toCloseList) throws Exception {
        for (AutoCloseable element : toCloseList) {
            if (element != null) {
                element.close();
            }
        }
    }

    /**
     * For each mounted device a mountpoint is created and this listener is called.
     *
     */
    @Override
    public void startListenerOnNodeForConnectedState(Action action, NodeId nNodeId, NetconfNode nNode) {

        String mountPointNodeName = nNodeId.getValue();
        LOG.info("Starting Event listener on Netconf for mountpoint {} Action {}", mountPointNodeName, action);

        if (!initialized) {
            LOG.warn("Devicemanager initialization still pending. Leave startup procedure. Mountpoint {}", mountPointNodeName);
            return;
        }

        if (networkElementRepresentations.containsKey(mountPointNodeName)) {
            LOG.warn("Mountpoint {} already registered. Leave startup procedure.", mountPointNodeName);
            return;
        }

        if (! isMaster(nNode) ) {
            //Change Devicemonitor-status to connected ... for non master mountpoints.
            deviceMonitor.deviceConnectSlaveIndication(mountPointNodeName);
            return;
        }

        synchronized (networkElementRepresentations) {

            InstanceIdentifier<Node> instanceIdentifier = NETCONF_TOPO_IID.child(Node.class,
                    new NodeKey(new NodeId(mountPointNodeName)));

            Optional<MountPoint> optionalMountPoint = null;
            int timeout = 10000;
            while (!(optionalMountPoint = mountService.getMountPoint(instanceIdentifier)).isPresent() && timeout > 0) {

                LOG.info("Event listener waiting for mount point for Netconf device :: Name : {}", mountPointNodeName);
                try {
                    Thread.sleep(1000);
                    timeout -= 1000;
                } catch (InterruptedException e) {
                    LOG.info("Event listener waiting for mount point for Netconf device :: Name : {} Time: {}",
                            mountPointNodeName, timeout);
                }
            }

            if (!optionalMountPoint.isPresent()) {
                LOG.warn("Event listener timeout while waiting for mount point for Netconf device :: Name : {} ",
                        mountPointNodeName);
                return;
            }

            // Mountpoint is present for sure
            MountPoint mountPoint = optionalMountPoint.get();

            DataBroker netconfNodeDataBroker = mountPoint.getService(DataBroker.class).orNull();
            if (netconfNodeDataBroker == null) {
                LOG.info("Mountpoint is slave mountpoint {}", mountPointNodeName);
                return;
            }

            LOG.info("Databroker service 1:{} 2:{}", dataBroker.hashCode(), netconfNodeDataBroker.hashCode());
            // getNodeInfoTest(dataBroker);

            //create automatic empty maintenance entry into db before reading and listening for problems
            this.maintenanceService.createIfNotExists(mountPointNodeName);

            // Setup microwaveEventListener for Notificationservice

            // MicrowaveEventListener microwaveEventListener = new
            // MicrowaveEventListener(mountPointNodeName, websocketmanagerService,
            // xmlMapper, databaseClientEvents);
            ONFCoreNetworkElementRepresentation ne = ONFCoreNetworkElementFactory.create(mountPointNodeName, dataBroker,
                    webSocketService, databaseClientEvents, instanceIdentifier, netconfNodeDataBroker, dcaeProviderClient,
                    aotsMProvider,maintenanceService,notificationDelayService);
            networkElementRepresentations.put(mountPointNodeName, ne);
            ne.doRegisterMicrowaveEventListener(mountPoint);

            // Register netconf stream
            registerNotificationStream(mountPointNodeName, mountPoint, "NETCONF");

            // -- Read data from NE
            ne.initialReadFromNetworkElement();
            ne.initSynchronizationExtension();

            // Setup Service that monitors registration/ deregistration of session
            odlEventListener.registration(mountPointNodeName);

            if (aaiProviderClient != null) {
                aaiProviderClient.onDeviceRegistered(mountPointNodeName);
            }
            // -- Register NE to performance manager
            if (performanceManager != null) {
                performanceManager.registration(mountPointNodeName, ne);
            }

            deviceMonitor.deviceConnectMasterIndication(mountPointNodeName, ne);

            LOG.info("Starting Event listener on Netconf device :: Name : {} finished", mountPointNodeName);

        }

    }

    // removeListenerOnNode
    @Override
    public void leaveConnectedState(NodeId nNodeId, NetconfNode nNode) {
        String mountPointNodeName = nNodeId.getValue();
        LOG.info("leaveConnectedState for device :: Name : {}", mountPointNodeName);

        this.maintenanceService.deleteIfNotRequired(mountPointNodeName);
        ONFCoreNetworkElementRepresentation ne = networkElementRepresentations.remove(mountPointNodeName);
        if (ne != null) {
            int problems = ne.removeAllCurrentProblemsOfNode();
            LOG.debug("Removed all {} problems from database at deregistration for {}", problems, mountPointNodeName);
            if (odlEventListener != null) {
                odlEventListener.deRegistration(mountPointNodeName);
            }
            if (performanceManager != null) {
                performanceManager.deRegistration(mountPointNodeName);
            }
            if (aaiProviderClient != null) {
                aaiProviderClient.onDeviceUnregistered(mountPointNodeName);
            }
        } else {
            LOG.info("No related ne object for mountpoint {} to deregister .", mountPointNodeName);
        }
        if (deviceMonitor != null) {
            deviceMonitor.deviceDisconnectIndication(mountPointNodeName);
        }

    }

    /*
    @Override
    public void mountpointNodeCreation(NodeId nNodeId, NetconfNode nNode) {
        String mountPointNodeName = nNodeId.getValue();
        LOG.info("mountpointNodeCreation {} {}", nNodeId.getValue(), nNode.getConnectionStatus());
        deviceMonitor.createMountpointIndication(mountPointNodeName);
    }
    */
    @Override
    public void mountpointNodeRemoved(NodeId nNodeId) {
        String mountPointNodeName = nNodeId.getValue();
        LOG.info("mountpointNodeRemoved {}", nNodeId.getValue());
        deviceMonitor.removeMountpointIndication(mountPointNodeName);
    }

    /**
     * Async RPC Interface implementation
     */
    @Override
    public @Nonnull List<String> doClearCurrentFaultByNodename(@Nullable List<String> nodeNamesInput) throws IllegalStateException {

        if (this.session == null) {
            throw new IllegalStateException("session not started");
        }

        if (this.databaseClientEvents == null) {
            throw new IllegalStateException("dbEvents service not instantiated");
        }

        if (threadDoClearCurrentFaultByNodename != null && threadDoClearCurrentFaultByNodename.isAlive()) {
            throw new IllegalStateException("A clear task is already active");
        } else {

            // Create list of mountpoints if input is empty, using the content in ES
            if (nodeNamesInput == null || nodeNamesInput.size() <= 0) {
                nodeNamesInput = this.databaseClientEvents.getAllNodesWithCurrentAlarms();
            }

            // Filter all mountpoints from input that were found and are known to this Cluster-node instance of DeviceManager
            final List<String> nodeNamesHandled = new ArrayList<>();
            for (String mountpointName : nodeNamesInput) {
                LOG.info("Work with mountpoint {}", mountpointName);

                if (odlEventListener != null && mountpointName.equals(odlEventListener.getOwnKeyName())) {

                    // SDN Controller related alarms
                    //  -- can not be recreated on all nodes in connected state
                    //  -- would result in a DCAE/AAI Notification
                    // Conclusion for 1810 Delivery ... not covered by RPC function (See issue #43)
                    LOG.info("Ignore SDN Controller related alarms for {}", mountpointName);
                    //this.databaseClientEvents.clearFaultsCurrentOfNode(mountpointName);
                    //nodeNamesHandled.add(mountpointName);

                } else {

                    InstanceIdentifier<Node> instanceIdentifier = NETCONF_TOPO_IID.child(Node.class,
                            new NodeKey(new NodeId(mountpointName)));
                    Optional<MountPoint> optionalMountPoint = mountService.getMountPoint(instanceIdentifier);

                    if (! optionalMountPoint.isPresent()) {
                        LOG.info("Remove Alarms for unknown mountpoint {}", mountpointName);
                        this.databaseClientEvents.clearFaultsCurrentOfNode(mountpointName);
                        nodeNamesHandled.add(mountpointName);
                    } else {
                        if (networkElementRepresentations.containsKey(mountpointName)) {
                            LOG.info("At node known mountpoint {}", mountpointName);
                            nodeNamesHandled.add(mountpointName);
                        } else {
                            LOG.info("At node unknown mountpoint {}", mountpointName);
                        }
                    }
                }
            }

            // Force a sync
            if (this.deviceMonitor != null) {
                this.deviceMonitor.refreshAlarmsInDb();
            }

            threadDoClearCurrentFaultByNodename = new Thread(() -> {
                refreshCounter++;
                LOG.info("Start refresh mountpoint task {}", refreshCounter);
                //    for(String nodeName:nodeNamesOutput) {
                for(String nodeName:nodeNamesHandled) {
                    ONFCoreNetworkElementRepresentation ne = networkElementRepresentations.get(nodeName);
                    if(ne!=null) {
                        LOG.info("Refresh mountpoint {}", nodeName);
                        ne.initialReadFromNetworkElement();
                    } else {
                        LOG.info("Unhandled mountpoint {}",nodeName);
                    }
                }
                LOG.info("End refresh mountpoint task {}", refreshCounter);
            });
            threadDoClearCurrentFaultByNodename.start();
            return nodeNamesHandled;
        }
    };

    /*---------------------------------------------------------------------
     * Private funtions
     */

    /**
     * Do the stream creation for the device.
     *
     * @param mountPointNodeName
     * @param mountPoint
     */
    private void registerNotificationStream(String mountPointNodeName, MountPoint mountPoint, String streamName) {

        final Optional<RpcConsumerRegistry> optionalRpcConsumerService = mountPoint
                .getService(RpcConsumerRegistry.class);
        if (optionalRpcConsumerService.isPresent()) {
            final RpcConsumerRegistry rpcConsumerRegitry = optionalRpcConsumerService.get();
            final NotificationsService rpcService = rpcConsumerRegitry.getRpcService(NotificationsService.class);
            if (rpcService == null) {
                LOG.warn("rpcService is null for mountpoint {}", mountPointNodeName);
            } else {
                final CreateSubscriptionInputBuilder createSubscriptionInputBuilder = new CreateSubscriptionInputBuilder();
                createSubscriptionInputBuilder.setStream(new StreamNameType(streamName));
                LOG.info("Event listener triggering notification stream {} for node {}", streamName, mountPointNodeName);
                try {
                    CreateSubscriptionInput createSubscriptionInput = createSubscriptionInputBuilder.build();
                    if (createSubscriptionInput == null) {
                        LOG.warn("createSubscriptionInput is null for mountpoint {}", mountPointNodeName);
                    } else {
                        rpcService.createSubscription(createSubscriptionInput);
                    }
                } catch (NullPointerException e) {
                    LOG.warn("createSubscription failed");
                }
            }
        } else {
            LOG.warn("No RpcConsumerRegistry avaialble.");
        }

    }

    /**
     * Get NE object
     * @param mountpoint mount point name
     * @return null or NE specific data
     */
    public @Nullable ONFCoreNetworkElementRepresentation getNeByMountpoint( String mountpoint ) {

        return networkElementRepresentations.get(mountpoint);

    }

    /* -- LOG related functions -- */

    private static LogReaderService startStartupLog(final String filename)
    {
        BundleContext ctx= FrameworkUtil.getBundle(DeviceManagerImpl.class).getBundleContext();
        ServiceReference<?> ref=ctx.getServiceReference(LogReaderService.class.getName());
        LogReaderService reader = (LogReaderService)ctx.getService(ref);
        reader.addLogListener(startupLogListener);
        return reader;
    }

    private static void stopStartupLog(LogReaderService rd)
    {
        if(rd!=null) {
            rd.removeLogListener(startupLogListener);
        }
    }

    private static class MyLogListener implements LogListener {

        private final File file  = new File(STARTUPLOG_FILENAME);
        //private final File file2  = new File(STARTUPLOG_FILENAME2);
        private final Charset charset  = StandardCharsets.UTF_8;
        private final Format format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        private final String regex = "^(\\[[^\\]]*\\])\\ (.*)$";
        private final Pattern pattern = Pattern.compile(regex, Pattern.MULTILINE);

        private String getSeverityString(int sev)
        {
            switch(sev)
            {
            case LogService.LOG_DEBUG:
                return "DEBUG";
            case LogService.LOG_ERROR:
                return "ERROR";
            case LogService.LOG_INFO:
                return "INFO";
            case LogService.LOG_WARNING:
                return "WARNING";
            default:
                return "UNKNOWN("+String.valueOf(sev)+")";
            }
        }
        @Override
        public void logged(LogEntry arg0) {
            final Matcher matcher = pattern.matcher(arg0.getMessage());
            String s;
            if (matcher.find()) {
                s=matcher.group(2);
            } else {
                s=arg0.getMessage();
            }
            try {
                Files.append(format.format(new Date(arg0.getTime()))+" ["+getSeverityString(arg0.getLevel())+"] "+s+"\n",file, charset);
                } catch (IOException e) {
                //LOG.debug("problem writing startup logfile "+file.getAbsolutePath()+" :" + e.getMessage());   //maybe produces an overflow
            }
            /*
            try {
                Files.append(format.format(new Date(arg0.getTime()))+" ["+getSeverityString(arg0.getLevel())+"] "+s+"\n",file2, charset);
                } catch (IOException e) {
                //LOG.debug("problem writing startup logfile "+file.getAbsolutePath()+" :" + e.getMessage());   //maybe produces an overflow
            }
            */
        }
    }

    private boolean isInClusterMode() {
        return this.akkaConfig==null?false:this.akkaConfig.isCluster();
    }

    private String getClusterNetconfNodeName() {
        return this.akkaConfig==null?"":this.akkaConfig.getClusterConfig().getClusterSeedNodeName("abc");
    }

    private boolean isMaster(NetconfNode nnode)
    {
        if(isInClusterMode())
        {
            LOG.debug("check if me is responsible for node");
            String masterNodeName = nnode.getClusteredConnectionStatus()==null?"null":nnode.getClusteredConnectionStatus().getNetconfMasterNode();
            /*List<NodeStatus> clusterNodeStatusList=nnode.getClusteredConnectionStatus()==null?null:nnode.getClusteredConnectionStatus().getNodeStatus();
            if(clusterNodeStatusList!=null)
            {
                for(NodeStatus s: clusterNodeStatusList)
                    LOG.debug("node "+s.getNode()+ " with status "+(s.getStatus()==null?"null":s.getStatus().getName()));
            }
            */
            String myNodeName=getClusterNetconfNodeName();
            LOG.debug("sdnMasterNode="+masterNodeName+" and sdnMyNode="+myNodeName);
            if(!masterNodeName.equals(myNodeName))
            {
                LOG.debug("netconf change but me is not master for this node");
                return false;
            }
        }
        return true;
    }

}
