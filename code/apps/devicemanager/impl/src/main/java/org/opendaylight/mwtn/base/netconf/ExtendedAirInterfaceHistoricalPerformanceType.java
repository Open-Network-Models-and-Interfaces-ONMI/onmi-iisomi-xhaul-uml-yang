package org.opendaylight.mwtn.base.netconf;

import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.typedefinitions.rev160701.DateAndTime;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.imported_data_types.rev160710.ObjectIdentifier;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.object_classes.rev160710.OTNHistoryData;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.type_definitions.rev160710.GranularityPeriodType;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.airinterface.rev160901.mw_airinterface_pac.AirInterfaceConfiguration;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.AirInterfaceHistoricalPerformanceType;
import org.opendaylight.yangtools.yang.binding.DataContainer;

public class ExtendedAirInterfaceHistoricalPerformanceType implements OTNHistoryData, LinkIdentifyingObject {

    private final AirInterfaceHistoricalPerformanceType airInterfaceHistoricalPerformanceType;
    private final AirInterfaceConfiguration airInterfaceConfiguration;

    public ExtendedAirInterfaceHistoricalPerformanceType(AirInterfaceHistoricalPerformanceType data, AirInterfaceConfiguration conf) {
        this.airInterfaceHistoricalPerformanceType = data;
        this.airInterfaceConfiguration = conf;
    }


    public AirInterfaceHistoricalPerformanceType getAirInterfaceHistoricalPerformanceType() {
        return airInterfaceHistoricalPerformanceType;
    }


    public AirInterfaceConfiguration getAirInterfaceConfiguration() {
        return airInterfaceConfiguration;
    }


    @Override
    public Class<? extends DataContainer> getImplementedInterface() {
        return airInterfaceHistoricalPerformanceType.getImplementedInterface();
    }

    @Override
    public String getHistoryDataId() {
        return airInterfaceHistoricalPerformanceType.getHistoryDataId();
    }

    @Override
    public DateAndTime getPeriodEndTime() {
        return airInterfaceHistoricalPerformanceType.getPeriodEndTime();
    }

    @Override
    public GranularityPeriodType getGranularityPeriod() {
        return airInterfaceHistoricalPerformanceType.getGranularityPeriod();
    }

    @Override
    public ObjectIdentifier getObjectClass() {
        return airInterfaceHistoricalPerformanceType.getObjectClass();
    }

    @Override
    public ObjectIdentifier getNameBinding() {
        return airInterfaceHistoricalPerformanceType.getNameBinding();
    }

    @Override
    public Boolean isSuspectIntervalFlag() {
        return airInterfaceHistoricalPerformanceType.isSuspectIntervalFlag();
    }

    @Override
    public String getSignalId() {
        return airInterfaceConfiguration.getRadioSignalID();
    }


    @Override
    public String toString() {
        return "ExtendedAirInterfaceHistoricalPerformanceType [airInterfaceHistoricalPerformanceType="
                + airInterfaceHistoricalPerformanceType + ", airInterfaceConfiguration=" + airInterfaceConfiguration
                + "]";
    }



}
