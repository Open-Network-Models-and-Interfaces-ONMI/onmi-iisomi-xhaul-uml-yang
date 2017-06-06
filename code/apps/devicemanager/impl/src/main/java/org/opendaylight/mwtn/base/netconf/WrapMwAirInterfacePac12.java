/**
 *
 */
package org.opendaylight.mwtn.base.netconf;

import java.util.ArrayList;
import java.util.List;
import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AirInterfaceCurrentProblemTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AirInterfaceHistoricalPerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.MwAirInterfacePacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceConfiguration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceCurrentProblems;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceHistoricalPerformances;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Not yet used
 * @author herbert
 *
 */
public class WrapMwAirInterfacePac12 {

    private static final Logger LOG = LoggerFactory.getLogger(WrapMwAirInterfacePac12.class);

    private final String mountPointNodeName;
    private final DataBroker netconfNodeDataBroker;

    public WrapMwAirInterfacePac12(String mountPointNodeName, DataBroker netconfNodeDataBroker) {
        this.mountPointNodeName = mountPointNodeName;
        this.netconfNodeDataBroker = netconfNodeDataBroker;
    }

    /**
     * Read problems of specific interfaces
     * Classes
     * - MwAirInterfacePac
     * - MwAirInterfacePacKey
     * - AirInterfaceCurrentProblemTypeG
     * - AirInterfaceCurrentProblems (org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.mw.air._interface.pac.AirInterfaceCurrentProblems)
     * - CurrentProblemList (org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.air._interface.current.problems.g.CurrentProblemList)
     *
     * @param interfacePacUuid Interface indentifier
     * @param resultList used to add the current alarms of this interface
     * @return same like resultList
     */
    public List<ProblemNotificationXml> readTheFaultsOfMwAirInterfacePac(UniversalId interfacePacUuid, List<ProblemNotificationXml> resultList) {

        LOG.info("DBRead Get {} MWAirInterfacePac: {}", mountPointNodeName, interfacePacUuid.getValue());

        //Step 2.2: construct data and the relative iid
        InstanceIdentifier<AirInterfaceCurrentProblems> mwAirInterfaceIID = InstanceIdentifier
                .builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(interfacePacUuid))
                .child(AirInterfaceCurrentProblems.class)
                .build();

        //Step 2.3: read to the config data store
        AirInterfaceCurrentProblems airProblems = GenericTransactionUtils.readData(netconfNodeDataBroker, LogicalDatastoreType.OPERATIONAL, mwAirInterfaceIID);

        if (airProblems == null) {
            LOG.debug("DBRead AirProblems Id {} no CurrentProblemsList", interfacePacUuid);
        } else {
            for ( AirInterfaceCurrentProblemTypeG problem : airProblems.getCurrentProblemList()) {
                resultList.add(new ProblemNotificationXml(mountPointNodeName, interfacePacUuid.getValue(),
                        problem.getProblemName(), InternalSeverity.valueOf(problem.getProblemSeverity()),
                        problem.getSequenceNumber().toString(), InternalDateAndTime.valueOf(problem.getTimeStamp())));

            }
        }
        return resultList;
    }


    /**
     * Read performance data of MwAirInterfacePac
     * @param lp layer protocol object from network element
     * @return list with performance records of the related interface
     */
    public List<ExtendedAirInterfaceHistoricalPerformanceType12> readTheHistoricalPerformanceDataOfMwAirInterfacePac(Lp lp) {

        String uuId = lp.getUuid().getValue();

        List<ExtendedAirInterfaceHistoricalPerformanceType12> resultList = new ArrayList<>();
        LOG.debug("DBRead Get {} MWAirInterfacePac: {}", mountPointNodeName, uuId);
        //----
        UniversalId mwAirInterfacePacuuId = new UniversalId(uuId);
        //Step 2.1: construct data and the relative iid
        InstanceIdentifier<AirInterfaceConfiguration> mwAirInterfaceConfigurationIID = InstanceIdentifier
                .builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(mwAirInterfacePacuuId))
                .child(AirInterfaceConfiguration.class)
                .build();
        AirInterfaceConfiguration airConfiguration = GenericTransactionUtils.readData(netconfNodeDataBroker, LogicalDatastoreType.OPERATIONAL, mwAirInterfaceConfigurationIID);

        //Step 2.2: construct data and the relative iid
        InstanceIdentifier<AirInterfaceHistoricalPerformances> mwAirInterfaceHistoricalPerformanceIID = InstanceIdentifier
                .builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(mwAirInterfacePacuuId))
                .child(AirInterfaceHistoricalPerformances.class)
                .build();

        //Step 2.3: read to the config data store
        AirInterfaceHistoricalPerformances airHistoricalPerformanceData = GenericTransactionUtils.readData(netconfNodeDataBroker, LogicalDatastoreType.OPERATIONAL, mwAirInterfaceHistoricalPerformanceIID);

        if (airHistoricalPerformanceData == null) {
            LOG.debug("DBRead MWAirInterfacePac Id {} no HistoricalPerformances", mwAirInterfacePacuuId);
        } else {
            //org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170320.air._interface.historical.performances.g.HistoricalPerformanceDataList
            List<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.air._interface.historical.performances.g.HistoricalPerformanceDataList> airHistPMList = airHistoricalPerformanceData.getHistoricalPerformanceDataList();
            LOG.debug("DBRead MWAirInterfacePac Id {} Records intermediate: {}",mwAirInterfacePacuuId, airHistPMList.size());
            if (airHistPMList != null) {
                for ( AirInterfaceHistoricalPerformanceTypeG pmRecord : airHistoricalPerformanceData.getHistoricalPerformanceDataList()) {
                    resultList.add(new ExtendedAirInterfaceHistoricalPerformanceType12(pmRecord, airConfiguration));
                }
            }
        }
        LOG.debug("DBRead MWAirInterfacePac Id {} Records result: {}",mwAirInterfacePacuuId, resultList.size());
        return resultList;
    }

}
