package org.opendaylight.mwtn.base.netconf;

import org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.yang.types.rev130715.DateAndTime;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.GranularityPeriodType;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.ObjectIdentifier;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.AirInterfaceConfigurationG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.AirInterfaceHistoricalPerformanceTypeG;
import org.opendaylight.yangtools.yang.binding.DataContainer;

public class ExtendedAirInterfaceHistoricalPerformanceType1211 implements OtnHistoryDataG, LinkIdentifyingObject {

    private final AirInterfaceHistoricalPerformanceTypeG airInterfaceHistoricalPerformanceType;
    private final AirInterfaceConfigurationG airInterfaceConfiguration;

    public ExtendedAirInterfaceHistoricalPerformanceType1211(AirInterfaceHistoricalPerformanceTypeG data, AirInterfaceConfigurationG conf) {
        this.airInterfaceHistoricalPerformanceType = data;
        this.airInterfaceConfiguration = conf;
    }


    public AirInterfaceHistoricalPerformanceTypeG getAirInterfaceHistoricalPerformanceType() {
        return airInterfaceHistoricalPerformanceType;
    }


    public AirInterfaceConfigurationG getAirInterfaceConfiguration() {
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

    @SuppressWarnings("deprecation")
    @Override
    public String getSignalId() {
        return airInterfaceConfiguration.getRadioSignalId();
    }


    @Override
    public String toString() {
        return "ExtendedAirInterfaceHistoricalPerformanceType [airInterfaceHistoricalPerformanceType="
                + airInterfaceHistoricalPerformanceType + ", airInterfaceConfiguration=" + airInterfaceConfiguration
                + "]";
    }





}
