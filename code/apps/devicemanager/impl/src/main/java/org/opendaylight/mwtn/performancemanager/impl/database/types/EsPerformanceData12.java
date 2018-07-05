package org.opendaylight.mwtn.performancemanager.impl.database.types;

import org.opendaylight.mwtn.base.netconf.ExtendedAirInterfaceHistoricalPerformanceType12;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AirInterfaceHistoricalPerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AirInterfacePerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ContainerHistoricalPerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ContainerPerformanceTypeG;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EsPerformanceData12 {

    @JsonIgnore
    private static final Logger LOG = LoggerFactory.getLogger(EsPerformanceData12.class);

    @JsonIgnore
    private AirInterfacePerformanceTypeG dataAirInterface;
    @JsonIgnore
    private ContainerPerformanceTypeG dataEthContainer;

    public <T extends OtnHistoryDataG> EsPerformanceData12(T ff) {

        dataAirInterface = null;
        dataEthContainer = null;

        if (ff instanceof AirInterfaceHistoricalPerformanceTypeG ) {
            this.dataAirInterface = ((AirInterfaceHistoricalPerformanceTypeG)ff).getPerformanceData();
        } else if (ff instanceof ContainerHistoricalPerformanceTypeG) {
            this.dataEthContainer = ((ContainerHistoricalPerformanceTypeG)ff).getPerformanceData();
        } else if (ff instanceof ExtendedAirInterfaceHistoricalPerformanceType12) {
            this.dataAirInterface = ((ExtendedAirInterfaceHistoricalPerformanceType12)ff).getAirInterfaceHistoricalPerformanceType().getPerformanceData();
        } else {
            LOG.warn("Can not assign historical performance type {}", ff.getClass().getName());
        }
    }

    @JsonGetter("es")
    public java.lang.Integer getEs() {
        return dataAirInterface != null ? dataAirInterface.getEs() : null;
    }

    @JsonGetter("ses")
    java.lang.Integer getSes() {
        return dataAirInterface != null ? dataAirInterface.getSes() : null;
    }

    @JsonGetter("cses")
    java.lang.Integer getCses() { return dataAirInterface != null ? dataAirInterface.getCses() : null; }

    @JsonGetter("unavailability")
    java.lang.Integer getUnavailability(){ return dataAirInterface != null ? dataAirInterface.getUnavailability() : null; }

    @JsonGetter("tx-level-min")
    java.lang.Byte getTxLevelMin(){ return dataAirInterface != null ? dataAirInterface.getTxLevelMin() : null; }

    @JsonGetter("tx-level-max")
    java.lang.Byte getTxLevelMax(){ return dataAirInterface != null ? dataAirInterface.getTxLevelMax() : null; }

    @JsonGetter("tx-level-avg")
    java.lang.Byte getTxLevelAvg(){ return dataAirInterface != null ? dataAirInterface.getTxLevelAvg() : null; }

    @JsonGetter("rx-level-min")
    java.lang.Byte getRxLevelMin(){ return dataAirInterface != null ? dataAirInterface.getRxLevelMin() : null; }

    @JsonGetter("rx-level-max")
    java.lang.Byte getRxLevelMax(){ return dataAirInterface != null ? dataAirInterface.getRxLevelMax() : null; }

    @JsonGetter("rx-level-avg")
    java.lang.Byte getRxLevelAvg(){ return dataAirInterface != null ? dataAirInterface.getRxLevelAvg() : null; }

    @JsonGetter("time2-states")
    java.lang.Integer getTime2States(){ return dataAirInterface != null ? dataAirInterface.getTime2States() : null; }

    @JsonGetter("time4-states-s")
    java.lang.Integer getTime4StatesS(){ return dataAirInterface != null ? dataAirInterface.getTime4StatesS() : null; }

    @JsonGetter("time4-states")
    java.lang.Integer getTime4States(){ return dataAirInterface != null ? dataAirInterface.getTime4States() : null; }

    @JsonGetter("time8-states")
    java.lang.Integer getTime8States(){ return dataAirInterface != null ? dataAirInterface.getTime8States() : null; }

    @JsonGetter("time16-states-s")
    java.lang.Integer getTime16StatesS(){ return dataAirInterface != null ? dataAirInterface.getTime16StatesS() : null; }

    @JsonGetter("time16-states")
    java.lang.Integer getTime16States(){ return dataAirInterface != null ? dataAirInterface.getTime16States() : null; }

    @JsonGetter("time32-states")
    java.lang.Integer getTime32States(){ return dataAirInterface != null ? dataAirInterface.getTime32States() : null; }

    @JsonGetter("time64-states")
    java.lang.Integer getTime64States(){ return dataAirInterface != null ? dataAirInterface.getTime64States() : null; }

    @JsonGetter("time128-states")
    java.lang.Integer getTime128States(){ return dataAirInterface != null ? dataAirInterface.getTime128States() : null; }

    @JsonGetter("time256-states")
    java.lang.Integer getTime256States(){ return dataAirInterface != null ? dataAirInterface.getTime256States() : null; }

    @JsonGetter("time512-states")
    java.lang.Integer getTime512States(){ return dataAirInterface != null ? dataAirInterface.getTime512States() : null; }

    @JsonGetter("time512-states-l")
    java.lang.Integer getTime512StatesL(){ return dataAirInterface != null ? dataAirInterface.getTime512StatesL() : null; }

    @JsonGetter("time1024-states")
    java.lang.Integer getTime1024States(){ return dataAirInterface != null ? dataAirInterface.getTime1024States() : null; }

    @JsonGetter("time1024-states-l")
    java.lang.Integer getTime1024StatesL(){ return dataAirInterface != null ? dataAirInterface.getTime1024StatesL() : null; }

    @JsonGetter("time2048-states")
    java.lang.Integer getTime2048States(){ return dataAirInterface != null ? dataAirInterface.getTime2048States() : null; }

    @JsonGetter("time2048-states-l")
    java.lang.Integer getTime2048StatesL(){ return dataAirInterface != null ? dataAirInterface.getTime2048StatesL() : null; }

    @JsonGetter("time4096-states")
    java.lang.Integer getTime4096States(){ return dataAirInterface != null ? dataAirInterface.getTime4096States() : null; }

    @JsonGetter("time4096-states-l")
    java.lang.Integer getTime4096StatesL(){ return dataAirInterface != null ? dataAirInterface.getTime4096StatesL() : null; }

    @JsonGetter("time8192-states")
    java.lang.Integer getTime8192States(){ return dataAirInterface != null ? dataAirInterface.getTime8192States() : null; }

    @JsonGetter("time8192-states-l")
    java.lang.Integer getTime8192StatesL(){ return dataAirInterface != null ? dataAirInterface.getTime8192StatesL() : null; }

    @JsonGetter("snir-min")
    java.lang.Byte getSnirMin(){ return dataAirInterface != null ? dataAirInterface.getSnirMin() : null; }

    @JsonGetter("snir-max")
    java.lang.Byte getSnirMax(){ return dataAirInterface != null ? dataAirInterface.getSnirMax() : null; }

    @JsonGetter("snir-avg")
    java.lang.Byte getSnirAvg(){ return dataAirInterface != null ? dataAirInterface.getSnirAvg() : null; }

    @JsonGetter("xpd-min")
    java.lang.Byte getXpdMin(){ return dataAirInterface != null ? dataAirInterface.getXpdMin() : null; }

    @JsonGetter("xpd-max")
    java.lang.Byte getXpdMax(){ return dataAirInterface != null ? dataAirInterface.getXpdMax() : null; }

    @JsonGetter("xpd-avg")
    java.lang.Byte getXpdAvg(){ return dataAirInterface != null ? dataAirInterface.getXpdAvg() : null; }

    @JsonGetter("rf-temp-min")
    java.lang.Byte getRfTempMin(){ return dataAirInterface != null ? dataAirInterface.getRfTempMin() : null; }

    @JsonGetter("rf-temp-max")
    java.lang.Byte getRfTempMax(){ return dataAirInterface != null ? dataAirInterface.getRfTempMax() : null; }

    @JsonGetter("rf-temp-avg")
    java.lang.Byte getRfTempAvg(){ return dataAirInterface != null ? dataAirInterface.getRfTempAvg() : null; }

    @JsonGetter("defect-blocks-sum")
    java.lang.Short getDefectBlocksSum(){ return dataAirInterface != null ? dataAirInterface.getDefectBlocksSum() : null; }

    @JsonGetter("time-period")
    java.lang.Integer getTimePeriod(){ return dataAirInterface != null ? dataAirInterface.getTimePeriod() : dataEthContainer != null ? dataEthContainer.getTimePeriod() : null ; }

    @JsonGetter("tx-ethernet-bytes-max-s")
    java.lang.Integer getTxEthernetBytesMaxS() {
        return dataEthContainer != null ? dataEthContainer.getTxEthernetBytesMaxS() : null;
    }

    @JsonGetter("tx-ethernet-bytes-max-m")
    java.lang.Long getTxEthernetBytesMaxM() {
        return dataEthContainer != null ? dataEthContainer.getTxEthernetBytesMaxM() : null;
    }

    @JsonGetter("tx-ethernet-bytes-sum")
    java.lang.Long getTxEthernetBytesSum() {
        return dataEthContainer != null ? dataEthContainer.getTxEthernetBytesSum() : null;
    }

    @Override
    public String toString() {
        return "EsPerformanceData [getEs()=" + getEs() + ", getSes()=" + getSes() + ", getCses()=" + getCses()
                + ", getUnavailability()=" + getUnavailability() + ", getTxLevelMin()=" + getTxLevelMin()
                + ", getTxLevelMax()=" + getTxLevelMax() + ", getTxLevelAvg()=" + getTxLevelAvg() + ", getRxLevelMin()="
                + getRxLevelMin() + ", getRxLevelMax()=" + getRxLevelMax() + ", getRxLevelAvg()=" + getRxLevelAvg()
                + ", getTime2States()=" + getTime2States() + ", getTime4StatesS()=" + getTime4StatesS()
                + ", getTime4States()=" + getTime4States() + ", getTime8States()=" + getTime8States()
                + ", getTime16StatesS()=" + getTime16StatesS() + ", getTime16States()=" + getTime16States()
                + ", getTime32States()=" + getTime32States() + ", getTime64States()=" + getTime64States()
                + ", getTime128States()=" + getTime128States() + ", getTime256States()=" + getTime256States()
                + ", getTime512States()=" + getTime512States() + ", getTime512StatesL()=" + getTime512StatesL()
                + ", getTime1024States()=" + getTime1024States() + ", getTime1024StatesL()=" + getTime1024StatesL()
                + ", getTime2048States()=" + getTime2048States() + ", getTime2048StatesL()=" + getTime2048StatesL()
                + ", getTime4096States()=" + getTime4096States() + ", getTime4096StatesL()=" + getTime4096StatesL()
                + ", getTime8192States()=" + getTime8192States() + ", getTime8192StatesL()=" + getTime8192StatesL()
                + ", getSnirMin()=" + getSnirMin() + ", getSnirMax()=" + getSnirMax() + ", getSnirAvg()=" + getSnirAvg()
                + ", getXpdMin()=" + getXpdMin() + ", getXpdMax()=" + getXpdMax() + ", getXpdAvg()=" + getXpdAvg()
                + ", getRfTempMin()=" + getRfTempMin() + ", getRfTempMax()=" + getRfTempMax() + ", getRfTempAvg()="
                + getRfTempAvg() + ", getDefectBlocksSum()=" + getDefectBlocksSum() + ", getTimePeriod()="
                + getTimePeriod() + ", getTxEthernetBytesMaxS()=" + getTxEthernetBytesMaxS()
                + ", getTxEthernetBytesMaxM()=" + getTxEthernetBytesMaxM() + ", getTxEthernetBytesSum()="
                + getTxEthernetBytesSum() + "]";
    }

}
