package org.opendaylight.mwtn.base.netconf.wrapperc;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.opendaylight.yangtools.yang.binding.NotificationListener;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;

import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.AirInterfaceCurrentProblemTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.AirInterfaceDiversityCurrentProblemTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.AirInterfaceHistoricalPerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ContainerCurrentProblemTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ContainerHistoricalPerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MicrowaveModelListener;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwAirInterfaceDiversityPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwAirInterfaceDiversityPacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwAirInterfacePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwAirInterfacePacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwEthernetContainerPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwEthernetContainerPacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwHybridMwStructurePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwHybridMwStructurePacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwPureEthernetStructurePac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwPureEthernetStructurePacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwTdmContainerPac;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.MwTdmContainerPacKey;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.StructureCurrentProblemTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.air._interface.diversity.pac.AirInterfaceDiversityCurrentProblems;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.air._interface.pac.AirInterfaceConfiguration;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.air._interface.pac.AirInterfaceCurrentProblems;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.air._interface.pac.AirInterfaceHistoricalPerformances;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.ethernet.container.pac.EthernetContainerCurrentProblems;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.ethernet.container.pac.EthernetContainerHistoricalPerformances;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.hybrid.mw.structure.pac.HybridMwStructureCurrentProblems;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.pure.ethernet.structure.pac.PureEthernetStructureCurrentProblems;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.mw.tdm.container.pac.TdmContainerCurrentProblems;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.AttributeValueChangedNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ObjectCreationNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ObjectDeletionNotification;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ProblemNotification;

import org.opendaylight.mwtn.base.internalTypes.InternalDateAndTime;
import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;
import org.opendaylight.mwtn.base.netconf.ONFCOreNetworkElementCoreData;
import org.opendaylight.mwtn.base.netconf.ONFCoreNetworkElement12;
import org.opendaylight.mwtn.base.netconf.container.ExtendedAirInterfaceHistoricalPerformanceType1211;
import org.opendaylight.mwtn.base.netconf.container.ONFLayerProtocolName;
import org.opendaylight.mwtn.base.netconf.util.GenericTransactionUtils;
import org.opendaylight.mwtn.devicemanager.impl.xml.AttributeValueChangedNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectCreationNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ObjectDeletionNotificationXml;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;


public class WrapperMicrowaveModelRev180907 implements OnfMicrowaveModel, MicrowaveModelListener {

    private static final Logger LOG = LoggerFactory.getLogger(ONFCoreNetworkElement12.class);

    public static final QName QNAME = MwAirInterfacePac.QNAME;


    private ONFCOreNetworkElementCoreData coreData;

	private OnfMicrowaveModelNotification microwaveModelListener;


    /*-----------------------------------------------------------------------------
     * Setter/Getter
     */

    public void setCoreData(ONFCOreNetworkElementCoreData coreData) {
		this.coreData = coreData;
	}

	public ONFCOreNetworkElementCoreData getCoreData() {
		return coreData;
	}

	@Override
	public void setOnfMicrowaveModelListener(OnfMicrowaveModelNotification microwaveModelListener) {
		this.microwaveModelListener = microwaveModelListener;
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T extends NotificationListener> T getNotificationListener() {
		return (T) this;
	}

    /*-----------------------------------------------------------------------------
     * Interfacefunctions
     */

    public void readTheFaultsOfMicrowaveModel(ONFLayerProtocolName lpName, Class<?> lpClass, UniversalId uuid,
    		List<ProblemNotificationXml> resultList) {

    	switch (lpName) {
    	case MWAirInterface:
    		readTheFaultsOfMwAirInterfacePac(uuid, resultList);
    		break;

    	case EthernetContainer12:
    		readTheFaultsOfMwEthernetContainerPac(uuid, resultList);
    		break;

    	case TDMContainer:
    		readTheFaultsOfMwTdmContainerPac(uuid, resultList);
    		break;

    	case Structure:
    		if (lpClass == MwHybridMwStructurePac.class) {
    			readTheFaultsOfMwHybridMwStructurePac(uuid, resultList);

    		} else if (lpClass == MwAirInterfaceDiversityPac.class) {
    			readTheFaultsOfMwAirInterfaceDiversityPac(uuid, resultList);

    		} else if (lpClass == MwPureEthernetStructurePac.class) {
    			readTheFaultsOfMwPureEthernetStructurePac(uuid, resultList);

    		} else {
    			LOG.warn("Unassigned lp model {} class {}", lpName, lpClass);
    		}
    		break;
        case Ethernet:
            // No alarms supported
            break;
        case EthernetContainer10:
        default:
            LOG.warn("Unassigned or not expected lp in model {}", lpName);
    	}
    }

	public List<? extends OtnHistoryDataG> readTheHistoricalPerformanceData(ONFLayerProtocolName lpName, Lp lp) {
    	switch (lpName) {
    	case MWAirInterface:
    		return readTheHistoricalPerformanceDataOfMwAirInterfacePac(lp);

    	case EthernetContainer12:
    		return readTheHistoricalPerformanceDataOfEthernetContainer(lp);

    	case EthernetContainer10:
    	case EthernetPhysical:
    	case Ethernet:
    	case TDMContainer:
    	case Structure:
    	case Unknown:
    		LOG.debug("Do not read HistoricalPM data for {} {}", lpName, lp.getUuid().getValue());
    		break;
    	}
    	return new ArrayList<>();
    }

	public Class<?> getClassForLtpExtension(QName qName) {
        Class<?> res = null;
        if (qName.equals(MwAirInterfacePac.QNAME)) {
            res = MwAirInterfacePac.class;
        } else if (qName.equals(MwAirInterfaceDiversityPac.QNAME)) {
            res = MwAirInterfaceDiversityPac.class;
        } else if (qName.equals(MwPureEthernetStructurePac.QNAME)) {
            res = MwPureEthernetStructurePac.class;
        } else if (qName.equals(MwHybridMwStructurePac.QNAME)) {
            res = MwHybridMwStructurePac.class;
        } else if (qName.equals(MwEthernetContainerPac.QNAME)) {
            res = MwEthernetContainerPac.class;
        } else if (qName.equals(MwTdmContainerPac.QNAME)) {
            res = MwTdmContainerPac.class;
        }
        LOG.info("Found QName {} mapped to {}", String.valueOf(qName), String.valueOf(res));
		return res;
	}

    /*-----------------------------------------------------------------------------
     * Reading problems for specific interface pacs
     */

    /**
     * Read problems of specific interfaces
     *
     * @param uuId Universal Id String of the interface
     * @return number of alarms
     */
    private List<ProblemNotificationXml> readTheFaultsOfMwAirInterfacePac(UniversalId interfacePacUuid,
            List<ProblemNotificationXml> resultList) {

        final Class<MwAirInterfacePac> clazzPac = MwAirInterfacePac.class;
        // final Class<MwAirInterfacePacKey> clazzPacKey = MwAirInterfacePacKey.class;
        // final Class<AirInterfaceCurrentProblems> clazzProblems =
        // AirInterfaceCurrentProblems.class;
        // final Class<AirInterfaceCurrentProblemTypeG> clazzProblem =
        // AirInterfaceCurrentProblemTypeG.class;

        LOG.info("DBRead Get problems for class {} from mountpoint {} for uuid {}", clazzPac.getSimpleName(),
        		coreData.getMountpoint(), interfacePacUuid.getValue());

        // Step 2.2: construct data and the relative iid
        InstanceIdentifier<AirInterfaceCurrentProblems> mwAirInterfaceIID = InstanceIdentifier
                .builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(interfacePacUuid))
                .child(AirInterfaceCurrentProblems.class).build();

        // Step 2.3: read to the config data store
        AirInterfaceCurrentProblems problems = GenericTransactionUtils.readData(coreData.getDataBroker(),
                LogicalDatastoreType.OPERATIONAL, mwAirInterfaceIID);

        if (problems == null) {
            LOG.debug("DBRead Id {} no AirInterfaceCurrentProblems", interfacePacUuid);
        } else if (problems.getCurrentProblemList() == null) {
            LOG.debug("DBRead Id {} empty CurrentProblemList", interfacePacUuid);
        } else {
            for (AirInterfaceCurrentProblemTypeG problem : problems.getCurrentProblemList()) {
                resultList.add(new ProblemNotificationXml(coreData.getMountpoint(), interfacePacUuid.getValue(),
                        problem.getProblemName(), InternalSeverity.valueOf(problem.getProblemSeverity()),
                        problem.getSequenceNumber().toString(), InternalDateAndTime.valueOf(problem.getTimeStamp())));
            }
        }
        return resultList;
    }

    /**
     * Read problems of specific interfaces
     *
     * @param uuId Universal index of Interfacepac
     * @return number of alarms
     */
    private List<ProblemNotificationXml> readTheFaultsOfMwEthernetContainerPac(UniversalId interfacePacUuid,
            List<ProblemNotificationXml> resultList) {

        final Class<MwEthernetContainerPac> clazzPac = MwEthernetContainerPac.class;
        // final Class<MwEthernetContainerPacKey> clazzPacKey =
        // MwEthernetContainerPacKey.class;
        // final Class<EthernetContainerCurrentProblems> clazzProblems =
        // EthernetContainerCurrentProblems.class;
        // final Class<ContainerCurrentProblemTypeG> clazzProblem =
        // ContainerCurrentProblemTypeG.class;

        LOG.info("DBRead Get problems for class {} from mountpoint {} for uuid {}", clazzPac.getSimpleName(),
                coreData.getMountpoint(), interfacePacUuid.getValue());

        InstanceIdentifier<EthernetContainerCurrentProblems> mwEthInterfaceIID = InstanceIdentifier
                .builder(MwEthernetContainerPac.class, new MwEthernetContainerPacKey(interfacePacUuid))
                .child(EthernetContainerCurrentProblems.class).build();

        EthernetContainerCurrentProblems problems = GenericTransactionUtils.readData(coreData.getDataBroker(),
                LogicalDatastoreType.OPERATIONAL, mwEthInterfaceIID);
        if (problems == null) {
            LOG.debug("DBRead Id {} no EthernetContainerCurrentProblems", interfacePacUuid);
        } else if (problems.getCurrentProblemList() == null) {
            LOG.debug("DBRead Id {} empty CurrentProblemsList", interfacePacUuid);
        } else {
            for (ContainerCurrentProblemTypeG problem : problems.getCurrentProblemList()) {
                resultList.add(new ProblemNotificationXml(coreData.getMountpoint(), interfacePacUuid.getValue(),
                        problem.getProblemName(), InternalSeverity.valueOf(problem.getProblemSeverity()),
                        problem.getSequenceNumber().toString(), InternalDateAndTime.valueOf(problem.getTimeStamp())));
            }
        }
        return resultList;
    }

    /**
     * Read problems of specific interfaces
     *
     * @param uuId Universal index of Interfacepac
     * @return number of alarms
     */
    private List<ProblemNotificationXml> readTheFaultsOfMwAirInterfaceDiversityPac(UniversalId interfacePacUuid,
            List<ProblemNotificationXml> resultList) {

        final Class<MwAirInterfaceDiversityPac> clazzPac = MwAirInterfaceDiversityPac.class;
        // final Class<MwAirInterfaceDiversityPacKey> clazzPacKey =
        // MwAirInterfaceDiversityPacKey.class;
        final Class<AirInterfaceDiversityCurrentProblems> clazzProblems = AirInterfaceDiversityCurrentProblems.class;
        // final Class<AirInterfaceDiversityCurrentProblemTypeG> clazzProblem =
        // AirInterfaceDiversityCurrentProblemTypeG.class;

        LOG.info("DBRead Get problems for class {} from mountpoint {} for uuid {}", clazzPac.getSimpleName(),
                coreData.getMountpoint(), interfacePacUuid.getValue());

        InstanceIdentifier<AirInterfaceDiversityCurrentProblems> mwEthInterfaceIID = InstanceIdentifier
                .builder(clazzPac, new MwAirInterfaceDiversityPacKey(interfacePacUuid)).child(clazzProblems).build();

        AirInterfaceDiversityCurrentProblems problems = GenericTransactionUtils.readData(coreData.getDataBroker(),
                LogicalDatastoreType.OPERATIONAL, mwEthInterfaceIID);
        if (problems == null) {
            LOG.debug("DBRead Id {} no AirInterfaceDiversityCurrentProblems", interfacePacUuid);
        } else if (problems.getCurrentProblemList() == null) {
            LOG.debug("DBRead Id {} empty CurrentProblemList", interfacePacUuid);
        } else {
            for (AirInterfaceDiversityCurrentProblemTypeG problem : problems.getCurrentProblemList()) {
                resultList.add(new ProblemNotificationXml(coreData.getMountpoint(), interfacePacUuid.getValue(),
                        problem.getProblemName(), InternalSeverity.valueOf(problem.getProblemSeverity()),
                        problem.getSequenceNumber().toString(), InternalDateAndTime.valueOf(problem.getTimeStamp())));
            }
        }
        return resultList;
    }

    /**
     * Read problems of specific interfaces
     *
     * @param uuId Universal index of Interfacepac
     * @return number of alarms
     */
    private List<ProblemNotificationXml> readTheFaultsOfMwPureEthernetStructurePac(UniversalId interfacePacUuid,
            List<ProblemNotificationXml> resultList) {

        final Class<MwPureEthernetStructurePac> clazzPac = MwPureEthernetStructurePac.class;
        // final Class<MwPureEthernetStructurePacKey> clazzPacKey =
        // MwPureEthernetStructurePacKey.class;
        final Class<PureEthernetStructureCurrentProblems> clazzProblems = PureEthernetStructureCurrentProblems.class;
        // final Class<StructureCurrentProblemTypeG> clazzProblem =
        // StructureCurrentProblemTypeG.class;

        LOG.info("DBRead Get problems for class {} from mountpoint {} for uuid {}", clazzPac.getSimpleName(),
                coreData.getMountpoint(), interfacePacUuid.getValue());

        InstanceIdentifier<PureEthernetStructureCurrentProblems> mwEthInterfaceIID = InstanceIdentifier
                .builder(clazzPac, new MwPureEthernetStructurePacKey(interfacePacUuid)).child(clazzProblems).build();

        PureEthernetStructureCurrentProblems problems = GenericTransactionUtils.readData(coreData.getDataBroker(),
                LogicalDatastoreType.OPERATIONAL, mwEthInterfaceIID);
        if (problems == null) {
            LOG.debug("DBRead Id {} no PureEthernetStructureCurrentProblems", interfacePacUuid);
        } else if (problems.getCurrentProblemList() == null) {
            LOG.debug("DBRead Id {} empty CurrentProblemsList", interfacePacUuid);
        } else {
            for (StructureCurrentProblemTypeG problem : problems.getCurrentProblemList()) {
                resultList.add(new ProblemNotificationXml(coreData.getMountpoint(), interfacePacUuid.getValue(),
                        problem.getProblemName(), InternalSeverity.valueOf(problem.getProblemSeverity()),
                        problem.getSequenceNumber().toString(), InternalDateAndTime.valueOf(problem.getTimeStamp())));
            }
        }
        return resultList;
    }

    /**
     * Read problems of specific interfaces
     *
     * @param uuId Universal index of Interfacepac
     * @return number of alarms
     */
    private List<ProblemNotificationXml> readTheFaultsOfMwHybridMwStructurePac(UniversalId interfacePacUuid,
            List<ProblemNotificationXml> resultList) {

        final Class<MwHybridMwStructurePac> clazzPac = MwHybridMwStructurePac.class;
        // final Class<MwHybridMwStructurePacKey> clazzPacKey =
        // MwHybridMwStructurePacKey.class;
        final Class<HybridMwStructureCurrentProblems> clazzProblems = HybridMwStructureCurrentProblems.class;
        // final Class<HybridMwStructureCurrentProblemsG> clazzProblem =
        // HybridMwStructureCurrentProblemsG.class;

        LOG.info("DBRead Get problems for class {} from mountpoint {} for uuid {}", clazzPac.getSimpleName(),
                coreData.getMountpoint(), interfacePacUuid.getValue());

        InstanceIdentifier<HybridMwStructureCurrentProblems> mwEthInterfaceIID = InstanceIdentifier
                .builder(clazzPac, new MwHybridMwStructurePacKey(interfacePacUuid)).child(clazzProblems).build();

        HybridMwStructureCurrentProblems problems = GenericTransactionUtils.readData(coreData.getDataBroker(),
                LogicalDatastoreType.OPERATIONAL, mwEthInterfaceIID);
        if (problems == null) {
            LOG.debug("DBRead Id {} no HybridMwStructureCurrentProblems", interfacePacUuid);
        } else if (problems.getCurrentProblemList() == null) {
            LOG.debug("DBRead Id {} empty CurrentProblemsList", interfacePacUuid);
        } else {
            for (StructureCurrentProblemTypeG problem : problems.getCurrentProblemList()) {
                resultList.add(new ProblemNotificationXml(coreData.getMountpoint(), interfacePacUuid.getValue(),
                        problem.getProblemName(), InternalSeverity.valueOf(problem.getProblemSeverity()),
                        problem.getSequenceNumber().toString(), InternalDateAndTime.valueOf(problem.getTimeStamp())));
            }
        }
        return resultList;
    }

    /**
     * Read problems of specific interfaces. TODO Goal for future implementation
     * without usage of explicit new. Key is generated by newInstance() function
     * here to verify this approach.
     *
     * @param uuId Universal index of Interfacepac
     * @return number of alarms
     * @throws SecurityException
     * @throws NoSuchMethodException
     * @throws InvocationTargetException
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     * @throws InstantiationException
     */
    private List<ProblemNotificationXml> readTheFaultsOfMwTdmContainerPac(UniversalId interfacePacUuid,
            List<ProblemNotificationXml> resultList) {

        final Class<MwTdmContainerPac> clazzPac = MwTdmContainerPac.class;
        final Class<MwTdmContainerPacKey> clazzPacKey = MwTdmContainerPacKey.class;
        final Class<TdmContainerCurrentProblems> clazzProblems = TdmContainerCurrentProblems.class;
        // final Class<ContainerCurrentProblemTypeG> clazzProblem =
        // ContainerCurrentProblemTypeG.class;

        LOG.info("DBRead Get problems for class {} from mountpoint {} for uuid {}", clazzPac.getSimpleName(),
                coreData.getMountpoint(), interfacePacUuid.getValue());

        try {
            // -- Specific part 1
            Constructor<MwTdmContainerPacKey> cons = clazzPacKey.getConstructor(UniversalId.class); // Avoid new()
            InstanceIdentifier<TdmContainerCurrentProblems> mwEthInterfaceIID = InstanceIdentifier
                    .builder(clazzPac, cons.newInstance(interfacePacUuid)).child(clazzProblems).build();

            // -- Specific part 2
            TdmContainerCurrentProblems problems = GenericTransactionUtils.readData(coreData.getDataBroker(),
                    LogicalDatastoreType.OPERATIONAL, mwEthInterfaceIID);
            if (problems == null) {
                LOG.debug("DBRead Id {} no TdmContainerCurrentProblems", interfacePacUuid);
            } else if (problems.getCurrentProblemList() == null) {
                LOG.debug("DBRead Id {} empty CurrentProblemsList", interfacePacUuid);
            } else {
                // -- Specific part 3
                for (ContainerCurrentProblemTypeG problem : problems.getCurrentProblemList()) {
                    resultList.add(new ProblemNotificationXml(coreData.getMountpoint(), interfacePacUuid.getValue(),
                            problem.getProblemName(), InternalSeverity.valueOf(problem.getProblemSeverity()),
                            problem.getSequenceNumber().toString(),
                            InternalDateAndTime.valueOf(problem.getTimeStamp())));
                }
            }
        } catch (NoSuchMethodException | SecurityException | InstantiationException | IllegalAccessException
                | IllegalArgumentException | InvocationTargetException e) {
            LOG.warn("Could not reade instance of MwTdmContainerPacKey: ", e);
        }
        return resultList;
    }

    /*-----------------------------------------------------------------------------
     * Performance related data
     */

    /**
     * PM MwAirInterfacePac
     *
     * @param lp
     * @return
     */
    private List<ExtendedAirInterfaceHistoricalPerformanceType1211> readTheHistoricalPerformanceDataOfMwAirInterfacePac(
            Lp lp) {

        String uuId = lp.getUuid().getValue();

        List<ExtendedAirInterfaceHistoricalPerformanceType1211> resultList = new ArrayList<>();
        LOG.debug("DBRead Get {} MWAirInterfacePac: {}", coreData.getMountpoint(), uuId);
        // ----
        UniversalId mwAirInterfacePacuuId = new UniversalId(uuId);
        // Step 2.1: construct data and the relative iid
        InstanceIdentifier<AirInterfaceConfiguration> mwAirInterfaceConfigurationIID = InstanceIdentifier
                .builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(mwAirInterfacePacuuId))
                .child(AirInterfaceConfiguration.class).build();
        AirInterfaceConfiguration airConfiguration = GenericTransactionUtils.readData(coreData.getDataBroker(),
                LogicalDatastoreType.OPERATIONAL, mwAirInterfaceConfigurationIID);

        if (airConfiguration == null) {
            LOG.debug("DBRead MWAirInterfacePac Id {} no AirInterfaceConfiguration", mwAirInterfacePacuuId);

        } else {
            // Step 2.2: construct data and the relative iid
            InstanceIdentifier<AirInterfaceHistoricalPerformances> mwAirInterfaceHistoricalPerformanceIID = InstanceIdentifier
                    .builder(MwAirInterfacePac.class, new MwAirInterfacePacKey(mwAirInterfacePacuuId))
                    .child(AirInterfaceHistoricalPerformances.class).build();

            // Step 2.3: read to the config data store
            AirInterfaceHistoricalPerformances airHistoricalPerformanceData = GenericTransactionUtils.readData(
            		coreData.getDataBroker(), LogicalDatastoreType.OPERATIONAL, mwAirInterfaceHistoricalPerformanceIID);

            if (airHistoricalPerformanceData == null) {
                LOG.debug("DBRead MWAirInterfacePac Id {} no AirInterfaceHistoricalPerformances",
                        mwAirInterfacePacuuId);
            } else {
                // org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170320.air._interface.historical.performances.g.HistoricalPerformanceDataList
                List<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.air._interface.historical.performances.g.HistoricalPerformanceDataList> airHistPMList = airHistoricalPerformanceData
                        .getHistoricalPerformanceDataList();
                LOG.debug("DBRead MWAirInterfacePac Id {} Records intermediate: {}", mwAirInterfacePacuuId,
                        airHistPMList.size());
                if (airHistPMList != null) {
                    for (AirInterfaceHistoricalPerformanceTypeG pmRecord : airHistoricalPerformanceData
                            .getHistoricalPerformanceDataList()) {
                        resultList.add(new ExtendedAirInterfaceHistoricalPerformanceType1211(pmRecord, airConfiguration));
                    }
                }
            }
        }
        LOG.debug("DBRead MWAirInterfacePac Id {} Records result: {}", mwAirInterfacePacuuId, resultList.size());
        return resultList;
    }

    private List<ContainerHistoricalPerformanceTypeG> readTheHistoricalPerformanceDataOfEthernetContainer(Lp lp) {

        final String myName = "MWEthernetContainerPac";
        String uuId = lp.getUuid().getValue();

        List<ContainerHistoricalPerformanceTypeG> resultList = new ArrayList<>();
        LOG.debug("DBRead Get {} : {}", coreData.getMountpoint(), myName, uuId);
        // ----
        UniversalId ethContainerPacuuId = new UniversalId(uuId);
        // Step 2.2: construct data and the relative iid
        InstanceIdentifier<EthernetContainerHistoricalPerformances> ethContainerIID = InstanceIdentifier
                .builder(MwEthernetContainerPac.class, new MwEthernetContainerPacKey(ethContainerPacuuId))
                .child(EthernetContainerHistoricalPerformances.class).build();

        // Step 2.3: read to the config data store
        EthernetContainerHistoricalPerformances ethContainerHistoricalPerformanceData = GenericTransactionUtils
                .readData(coreData.getDataBroker(), LogicalDatastoreType.OPERATIONAL, ethContainerIID);

        if (ethContainerHistoricalPerformanceData == null) {
            LOG.debug("DBRead {} Id {} no HistoricalPerformances", myName, ethContainerPacuuId);
        } else {
            // import
            // org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170320.ethernet.container.historical.performances.g.HistoricalPerformanceDataList
             List<org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180907.ethernet.container.historical.performances.g.HistoricalPerformanceDataList> airHistPMList = ethContainerHistoricalPerformanceData
                    .getHistoricalPerformanceDataList();
            LOG.debug("DBRead {} Id {} Records intermediate: {}", myName, ethContainerPacuuId, airHistPMList.size());
            if (airHistPMList != null) {
                for (ContainerHistoricalPerformanceTypeG pmRecord : airHistPMList) {
                    resultList.add(pmRecord);
                }
            }
        }
        LOG.debug("DBRead {} Id {} Records result: {}", myName, ethContainerPacuuId, resultList.size());
        return resultList;
    }

    @Override
    public void onObjectCreationNotification(ObjectCreationNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectCreationNotification.class.getSimpleName());

        ObjectCreationNotificationXml notificationXml = new ObjectCreationNotificationXml(coreData.getMountpoint(),
                notification.getCounter().toString(),
                InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue());
        microwaveModelListener.onObjectCreationNotification(notificationXml);
	}

    @Override
    public void onObjectDeletionNotification(ObjectDeletionNotification notification) {
        LOG.debug("Got event of type :: {}", ObjectDeletionNotification.class.getSimpleName());

        ObjectDeletionNotificationXml notificationXml = new ObjectDeletionNotificationXml(coreData.getMountpoint(),
                notification.getCounter().toString(),
                InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue()
                );
        microwaveModelListener.onObjectDeletionNotification(notificationXml);
	}

    public void onProblemNotification(ProblemNotification notification) {

        LOG.debug("Got event of type :: {}", ProblemNotification.class.getSimpleName());

        ProblemNotificationXml notificationXml = new ProblemNotificationXml(coreData.getMountpoint(), notification.getObjectIdRef().getValue(),
                notification.getProblem(), InternalSeverity.valueOf(notification.getSeverity()),
                notification.getCounter().toString(), InternalDateAndTime.valueOf(notification.getTimeStamp()));

        microwaveModelListener.onProblemNotification(notificationXml);
	}

    @Override
    public void onAttributeValueChangedNotification(AttributeValueChangedNotification notification) {
        LOG.debug("Got event of type :: {}", AttributeValueChangedNotification.class.getSimpleName());

        AttributeValueChangedNotificationXml notificationXml = new AttributeValueChangedNotificationXml(coreData.getMountpoint(),
                String.valueOf(notification.getCounter()), InternalDateAndTime.valueOf(notification.getTimeStamp()),
                notification.getObjectIdRef().getValue(), notification.getAttributeName(), notification.getNewValue());

        microwaveModelListener.onAttributeValueChangedNotification(notificationXml);
	}

}
