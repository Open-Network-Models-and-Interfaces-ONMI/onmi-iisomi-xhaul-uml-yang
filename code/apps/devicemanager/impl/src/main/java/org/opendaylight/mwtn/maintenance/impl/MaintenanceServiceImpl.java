package org.opendaylight.mwtn.maintenance.impl;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Nonnull;
import org.opendaylight.mwtn.base.database.EsBaseRequireNetworkElement;
import org.opendaylight.mwtn.base.database.HtDataBaseReaderAndWriter;
import org.opendaylight.mwtn.base.database.HtDatabaseClientAbstract;
import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.index.impl.IndexMwtnService;
import org.opendaylight.mwtn.maintenance.MaintenanceRPCServiceAPI;
import org.opendaylight.mwtn.maintenance.MaintenanceService;
import org.opendaylight.mwtn.maintenance.database.types.EsMaintenanceFilter;
import org.opendaylight.mwtn.maintenance.database.types.EsMaintenanceFilterDefinition;
import org.opendaylight.mwtn.maintenance.database.types.EsMaintenanceMode;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetMaintenanceModeOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.GetRequiredNetworkElementKeysOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.SetMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.SetMaintenanceModeOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ShowRequiredNetworkElementInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.ShowRequiredNetworkElementOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.TestMaintenanceModeInput;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.TestMaintenanceModeOutputBuilder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.show.required.network.element.output.RequiredNetworkElementBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MaintenanceServiceImpl implements MaintenanceService, MaintenanceRPCServiceAPI, AutoCloseable {

    private static final Logger LOG = LoggerFactory.getLogger(MaintenanceServiceImpl.class);

    /**
     * Use the Client Index
     */
    private HtDataBaseReaderAndWriter<EsMaintenanceMode> maintenanceRW;
    private HtDataBaseReaderAndWriter<EsBaseRequireNetworkElement> requiredNeRW;

    public MaintenanceServiceImpl(HtDatabaseClientAbstract client) {

        LOG.info("Create {} start", MaintenanceServiceImpl.class);

        try {
            // Create control structure
            maintenanceRW = new HtDataBaseReaderAndWriter<>(client, EsMaintenanceMode.ESDATATYPENAME, EsMaintenanceMode.class);
            requiredNeRW = new HtDataBaseReaderAndWriter<>(client, EsBaseRequireNetworkElement.ESDATATYPENAME, EsBaseRequireNetworkElement.class);

        } catch (Exception e) {
            LOG.error("Can not start database client. Exception: {}", e.getMessage());
        }
        LOG.info("Create {} finished. DB Service {} started.", MaintenanceServiceImpl.class,  client != null ? "sucessfully" : "not" );

    }

    public MaintenanceServiceImpl(HtDatabaseNode database) {
        this(new HtDatabaseClientAbstract(IndexMwtnService.INDEX,database));
    }

    /**
     * Get existing object for mountpoint to manage maintenance mode
     * @return Object with configuration
     */
    private @Nonnull EsMaintenanceMode getMaintenance(String mountpointId)
    {
        EsMaintenanceMode deviceMaintenanceMode = null;
        if (maintenanceRW != null) {
            deviceMaintenanceMode = maintenanceRW.doRead(mountpointId);
        }

        return deviceMaintenanceMode == null ? EsMaintenanceMode.getNotInMaintenance() : deviceMaintenanceMode;
    }
    /**
     * Check in required ne if entry exists for mountpointNodeName
     * @param mountPointNodeName
     * @return
     */
    private boolean isRequireNe(String mountPointNodeName) {
        EsBaseRequireNetworkElement ne=null;
        if( requiredNeRW!=null)
        {
            LOG.debug("searching for entry in required-networkelement for "+mountPointNodeName);
            ne = requiredNeRW.doRead(mountPointNodeName);
        } else {
            LOG.warn("cannot read db. no db reader writer initialized");
        }
        return ne!=null;
    }
    public EsMaintenanceMode createIfNotExists(String mountpointId)
    {
        EsMaintenanceMode deviceMaintenanceMode = null;
        if (maintenanceRW != null)
        {
             deviceMaintenanceMode = maintenanceRW.doRead(mountpointId);
             if(deviceMaintenanceMode==null)
             {
                 LOG.debug("creating empty maintenance object in database");
                 deviceMaintenanceMode=new EsMaintenanceMode(mountpointId);
                 EsMaintenanceFilter filter = new EsMaintenanceFilter();
                 filter.setDescription("");
                 filter.setStart(null);
                 filter.setEnd(null);
                 EsMaintenanceFilterDefinition definition=new EsMaintenanceFilterDefinition();
                 definition.setObjectIdRef("");
                 definition.setProblem("");
                 filter.setDefinition(definition);
                 deviceMaintenanceMode.addFilter(filter );
                 maintenanceRW.doWrite(deviceMaintenanceMode);
             } else {
                LOG.debug("maintenance object already exists in database");
            }
        } else {
            LOG.warn("cannot create maintenance obj. db reader/writer is null");
        }

        return deviceMaintenanceMode;
    }
    public void deleteIfNotRequired(String mountPointNodeName) {

        if(!this.isRequireNe(mountPointNodeName))
        {
            EsMaintenanceMode deviceMaintenanceMode = new EsMaintenanceMode(mountPointNodeName);
            if (maintenanceRW != null)
            {
                LOG.debug("removing maintenance object in database for "+mountPointNodeName);
                maintenanceRW.doRemove(deviceMaintenanceMode);
            } else {
                LOG.warn("cannot create maintenance obj. db reader/writer is null");
            }
        }

    }



    /*-------------------------------------------------
     * Interface AutoClosable
     */

    @Override
    public void close() throws Exception {
    }

    /*-------------------------------------------------
     * Interface MaintenanceRPCServiceAPI
     */

    @Override
    public GetRequiredNetworkElementKeysOutputBuilder getRequiredNetworkElementKeys() {
        GetRequiredNetworkElementKeysOutputBuilder outputBuilder = new GetRequiredNetworkElementKeysOutputBuilder();
        List<EsMaintenanceMode> all = maintenanceRW != null ? maintenanceRW.doReadAll() : new ArrayList<>();
        List<String> mountpointList = new ArrayList<>();
        for (EsMaintenanceMode oneOfAll : all) {
            mountpointList.add(oneOfAll.getEsId());

        }
        outputBuilder.setMountpointNames(mountpointList);
        return outputBuilder;
    }

    @Override
    public ShowRequiredNetworkElementOutputBuilder showRequiredNetworkElement(ShowRequiredNetworkElementInput input) {
        ShowRequiredNetworkElementOutputBuilder outputBuilder = new ShowRequiredNetworkElementOutputBuilder();
        EsMaintenanceMode maintenanceMode = new EsMaintenanceMode(input.getMountpointName());
        if (maintenanceRW != null) {
            maintenanceMode = maintenanceRW.doRead(maintenanceMode);
        }
        if (maintenanceMode != null) {
            RequiredNetworkElementBuilder valueBuilder = new RequiredNetworkElementBuilder();

            valueBuilder.setMountpointName(maintenanceMode.getNode());
            valueBuilder.setStatus(String.valueOf(maintenanceMode.isONFObjectInMaintenance("","")));
            valueBuilder.setDescription("Pretty description here");
            outputBuilder.setRequiredNetworkElement(valueBuilder.build());
        } else {
            LOG.warn("No info in database for {}",input.getMountpointName());
        }
        return outputBuilder;
    }

    @Override
    public GetMaintenanceModeOutputBuilder getMaintenanceMode(GetMaintenanceModeInput input) {
        EsMaintenanceMode maintenanceMode = null;
        GetMaintenanceModeOutputBuilder outputBuilder;
        if (maintenanceRW != null) {
            maintenanceMode = maintenanceRW.doRead(input.getMountpointName());
        }
        if (maintenanceMode != null) {
            outputBuilder = new GetMaintenanceModeOutputBuilder(maintenanceMode);
        } else {
            throw new IllegalArgumentException("No info in database for "+input.getMountpointName());
        }
        return outputBuilder;
    }

    @Override
    public SetMaintenanceModeOutputBuilder setMaintenanceMode(SetMaintenanceModeInput input) {

        SetMaintenanceModeOutputBuilder outputBuilder = new SetMaintenanceModeOutputBuilder();
        if (maintenanceRW != null) {
            EsMaintenanceMode m = new EsMaintenanceMode(input);
            if (maintenanceRW.doWrite(m) == null) {
                throw new IllegalArgumentException("Problem writing to database: "+input.getMountpointName());
            }
            outputBuilder = new SetMaintenanceModeOutputBuilder(m);
            LOG.info("Wrote maintenance object {}", m.toString());
        }
        return outputBuilder;
    }

    @Override
    public TestMaintenanceModeOutputBuilder testMaintenanceMode(TestMaintenanceModeInput input) {

        StringBuffer resultString = new StringBuffer();

        EsMaintenanceMode maintenanceMode = getMaintenance(input.getMountpointName());

        TestMaintenanceModeOutputBuilder outputBuilder = new TestMaintenanceModeOutputBuilder(maintenanceMode);

        ZonedDateTime now = EsMaintenanceFilter.valueOf(input.getTestDate());

        resultString.append("In database table: ");
        resultString.append(!(EsMaintenanceMode.getNotInMaintenance() == maintenanceMode));
        resultString.append(" Maintenance active: ");
        resultString.append(maintenanceMode.isONFObjectInMaintenance(input.getObjectIdRef(), input.getProblemName(), now));
        resultString.append(" at Timestamp: ");
        resultString.append(now);

        outputBuilder.setResultString(resultString.toString());

        return outputBuilder;
    }

    /*-------------------------------------------------
     * Interface MaintenaceService
     */

    @Override
    public boolean isONFObjectInMaintenance(String mountpointReference, String objectIdRef, String problem) {
        EsMaintenanceMode maintenanceMode = getMaintenance(mountpointReference);
        boolean res = maintenanceMode.isONFObjectInMaintenance(objectIdRef, problem);
        LOG.debug("inMaintenance={} for mountpoint/id/problem:{} {} {} Definition: {}",res, mountpointReference, objectIdRef, problem, this );
        return res;
    }



}
