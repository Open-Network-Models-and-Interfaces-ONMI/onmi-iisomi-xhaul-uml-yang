package org.opendaylight.mwtn.performancemanager.impl.database.types;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.opendaylight.mwtn.base.netconf.ExtendedAirInterfaceHistoricalPerformanceType12;
import org.opendaylight.mwtn.base.netconf.ExtendedAirInterfaceHistoricalPerformanceType1211;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AirInterfaceHistoricalPerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.AirInterfacePerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ContainerHistoricalPerformanceTypeG;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev170324.ContainerPerformanceTypeG;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author hanif
 *
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EsPerformanceData {

    @JsonIgnore
    private static final Logger LOG = LoggerFactory.getLogger(EsPerformanceData.class);

    @JsonIgnore
    private AirInterfacePerformanceTypeG dataAirInterface12 = null;
    @JsonIgnore
    private ContainerPerformanceTypeG dataEthContainer12 = null;

    @JsonIgnore
    private org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.AirInterfacePerformanceTypeG dataAirInterface1211 = null;
    @JsonIgnore
    private org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ContainerPerformanceTypeG dataEthContainer1211 = null;

    public <T extends OtnHistoryDataG> EsPerformanceData(T otnHistoryData) {

        if (otnHistoryData instanceof AirInterfaceHistoricalPerformanceTypeG) {
            this.dataAirInterface12 = ((AirInterfaceHistoricalPerformanceTypeG) otnHistoryData).getPerformanceData();
        } else if (otnHistoryData instanceof ContainerHistoricalPerformanceTypeG) {
            this.dataEthContainer12 = ((ContainerHistoricalPerformanceTypeG) otnHistoryData).getPerformanceData();
        } else if (otnHistoryData instanceof ExtendedAirInterfaceHistoricalPerformanceType1211) {
            this.dataAirInterface12 = ((ExtendedAirInterfaceHistoricalPerformanceType12) otnHistoryData)
                    .getAirInterfaceHistoricalPerformanceType().getPerformanceData();
        } else if (otnHistoryData instanceof org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.AirInterfaceHistoricalPerformanceTypeG) {
            this.dataAirInterface1211 = ((org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.AirInterfaceHistoricalPerformanceTypeG) otnHistoryData)
                    .getPerformanceData();
        } else if (otnHistoryData instanceof ContainerHistoricalPerformanceTypeG) {
            this.dataEthContainer1211 = ((org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.microwave.model.rev180927.ContainerHistoricalPerformanceTypeG) otnHistoryData)
                    .getPerformanceData();
        } else if (otnHistoryData instanceof ExtendedAirInterfaceHistoricalPerformanceType1211) {
            this.dataAirInterface1211 = ((ExtendedAirInterfaceHistoricalPerformanceType1211) otnHistoryData)
                    .getAirInterfaceHistoricalPerformanceType().getPerformanceData();
        } else {
            LOG.warn("Can not assign historical performance type {}", otnHistoryData.getClass().getName());
        }
    }

    @JsonGetter("es")
    public java.lang.Integer getEs() {
        return dataAirInterface12 != null ? dataAirInterface12.getEs()
                : dataAirInterface1211 != null ? dataAirInterface1211.getEs() : null;
    }

    @JsonGetter("ses")
    java.lang.Integer getSes() {
        return dataAirInterface12 != null ? dataAirInterface12.getSes()
                : dataAirInterface1211 != null ? dataAirInterface1211.getSes() : null;
    }

    @JsonGetter("cses")
    java.lang.Integer getCses() {
        return dataAirInterface12 != null ? dataAirInterface12.getCses()
                : dataAirInterface1211 != null ? dataAirInterface1211.getCses() : null;
    }

    @JsonGetter("unavailability")
    java.lang.Integer getUnavailability() {
        return dataAirInterface12 != null ? dataAirInterface12.getUnavailability()
                : dataAirInterface1211 != null ? dataAirInterface1211.getUnavailability() : null;
    }

    @JsonGetter("tx-level-min")
    java.lang.Byte getTxLevelMin() {
        return dataAirInterface12 != null ? dataAirInterface12.getTxLevelMin()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTxLevelMin() : null;
    }

    @JsonGetter("tx-level-max")
    java.lang.Byte getTxLevelMax() {
        return dataAirInterface12 != null ? dataAirInterface12.getTxLevelMin()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTxLevelMin() : null;
    }

    @JsonGetter("tx-level-avg")
    java.lang.Byte getTxLevelAvg() {
        return dataAirInterface12 != null ? dataAirInterface12.getTxLevelMin()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTxLevelMin() : null;
    }

    @JsonGetter("rx-level-min")
    java.lang.Byte getRxLevelMin() {
        return dataAirInterface12 != null ? dataAirInterface12.getTxLevelMin()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTxLevelMin() : null;
    }

    @JsonGetter("rx-level-max")
    java.lang.Byte getRxLevelMax() {
        return dataAirInterface12 != null ? dataAirInterface12.getRxLevelMax()
                : dataAirInterface1211 != null ? dataAirInterface1211.getRxLevelMax() : null;
    }

    @JsonGetter("rx-level-avg")
    java.lang.Byte getRxLevelAvg() {
        return dataAirInterface12 != null ? dataAirInterface12.getRxLevelAvg()
                : dataAirInterface1211 != null ? dataAirInterface1211.getRxLevelAvg() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time2-states")
    java.lang.Integer getTime2States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime2States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime2States() : null;
    }

    @JsonGetter("time4-states-s")
    java.lang.Integer getTime4StatesS() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime4StatesS()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime4StatesS() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time4-states")
    java.lang.Integer getTime4States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime4States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime4States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time8-states")
    java.lang.Integer getTime8States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime8States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime8States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time16-states-s")
    java.lang.Integer getTime16StatesS() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime16StatesS()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime16StatesS() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time16-states")
    java.lang.Integer getTime16States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime16States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime16States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time32-states")
    java.lang.Integer getTime32States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime32States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime32States() : null;
    }

    @JsonGetter("time64-states")
    java.lang.Integer getTime64States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime64States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime64States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time128-states")
    java.lang.Integer getTime128States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime128States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime128States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time256-states")
    java.lang.Integer getTime256States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime256States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime256States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time512-states")
    java.lang.Integer getTime512States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime512States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime512States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time512-states-l")
    java.lang.Integer getTime512StatesL() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime512StatesL()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime512StatesL() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time1024-states")
    java.lang.Integer getTime1024States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime1024States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime1024States() : null;
    }

    @JsonGetter("time1024-states-l")
    java.lang.Integer getTime1024StatesL() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime1024StatesL()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime1024StatesL() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time2048-states")
    java.lang.Integer getTime2048States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime2048States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime2048States() : null;
    }

    @JsonGetter("time2048-states-l")
    java.lang.Integer getTime2048StatesL() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime2048StatesL()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime2048StatesL() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time4096-states")
    java.lang.Integer getTime4096States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime4096States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime4096States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time4096-states-l")
    java.lang.Integer getTime4096StatesL() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime4096StatesL()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime4096StatesL() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time8192-states")
    java.lang.Integer getTime8192States() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime8192States()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime8192States() : null;
    }

    @SuppressWarnings("deprecation")
    @JsonGetter("time8192-states-l")
    java.lang.Integer getTime8192StatesL() {
        return dataAirInterface12 != null ? dataAirInterface12.getTime8192StatesL()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTime8192StatesL() : null;
    }

    @JsonGetter("snir-min")
    java.lang.Byte getSnirMin() {
        return dataAirInterface12 != null ? dataAirInterface12.getSnirMin()
                : dataAirInterface1211 != null ? dataAirInterface1211.getSnirMin() : null;
    }

    @JsonGetter("snir-max")
    java.lang.Byte getSnirMax() {
        return dataAirInterface12 != null ? dataAirInterface12.getSnirMax()
                : dataAirInterface1211 != null ? dataAirInterface1211.getSnirMax() : null;
    }

    @JsonGetter("snir-avg")
    java.lang.Byte getSnirAvg() {
        return dataAirInterface12 != null ? dataAirInterface12.getSnirAvg()
                : dataAirInterface1211 != null ? dataAirInterface1211.getSnirAvg() : null;
    }

    @JsonGetter("xpd-min")
    java.lang.Byte getXpdMin() {
        return dataAirInterface12 != null ? dataAirInterface12.getXpdMin()
                : dataAirInterface1211 != null ? dataAirInterface1211.getXpdMin() : null;
    }

    @JsonGetter("xpd-max")
    java.lang.Byte getXpdMax() {
        return dataAirInterface12 != null ? dataAirInterface12.getXpdMax()
                : dataAirInterface1211 != null ? dataAirInterface1211.getXpdMax() : null;
    }

    @JsonGetter("xpd-avg")
    java.lang.Byte getXpdAvg() {
        return dataAirInterface12 != null ? dataAirInterface12.getXpdAvg()
                : dataAirInterface1211 != null ? dataAirInterface1211.getXpdAvg() : null;
    }

    @JsonGetter("rf-temp-min")
    java.lang.Byte getRfTempMin() {
        return dataAirInterface12 != null ? dataAirInterface12.getRfTempMin()
                : dataAirInterface1211 != null ? dataAirInterface1211.getRfTempMin() : null;
    }

    @JsonGetter("rf-temp-max")
    java.lang.Byte getRfTempMax() {
        return dataAirInterface12 != null ? dataAirInterface12.getRfTempMax()
                : dataAirInterface1211 != null ? dataAirInterface1211.getRfTempMax() : null;
    }

    @JsonGetter("rf-temp-avg")
    java.lang.Byte getRfTempAvg() {
        return dataAirInterface12 != null ? dataAirInterface12.getRfTempAvg()
                : dataAirInterface1211 != null ? dataAirInterface1211.getRfTempAvg() : null;
    }

    @JsonGetter("defect-blocks-sum")
    java.lang.Short getDefectBlocksSum() {
        return dataAirInterface12 != null ? dataAirInterface12.getDefectBlocksSum()
                : dataAirInterface1211 != null ? dataAirInterface1211.getDefectBlocksSum() : null;
    }

    @JsonGetter("time-period")
    java.lang.Integer getTimePeriod() {
        return dataAirInterface12 != null ? dataAirInterface12.getTimePeriod()
                : dataEthContainer12 != null ? dataEthContainer12.getTimePeriod()
                : dataAirInterface1211 != null ? dataAirInterface1211.getTimePeriod()
                   : dataEthContainer1211 != null ? dataEthContainer1211.getTimePeriod() : null;
    }

    @JsonGetter("tx-ethernet-bytes-max-s")
    java.lang.Integer getTxEthernetBytesMaxS() {
        return dataEthContainer12 != null ? dataEthContainer12.getTxEthernetBytesMaxS()
                : dataEthContainer1211 != null ? dataEthContainer1211.getTxEthernetBytesMaxS() : null;
    }

    @JsonGetter("tx-ethernet-bytes-max-m")
    java.lang.Long getTxEthernetBytesMaxM() {
        return dataEthContainer12 != null ? dataEthContainer12.getTxEthernetBytesMaxM()
                : dataEthContainer1211 != null ? dataEthContainer1211.getTxEthernetBytesMaxM() : null;
    }

    @JsonGetter("tx-ethernet-bytes-sum")
    java.lang.Long getTxEthernetBytesSum() {
        return dataEthContainer12 != null ? dataEthContainer12.getTxEthernetBytesSum()
                : dataEthContainer1211 != null ? dataEthContainer1211.getTxEthernetBytesSum() : null;
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
