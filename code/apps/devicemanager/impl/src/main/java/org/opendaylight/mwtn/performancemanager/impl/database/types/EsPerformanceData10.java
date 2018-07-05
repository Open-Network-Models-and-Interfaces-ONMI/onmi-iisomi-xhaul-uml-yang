package org.opendaylight.mwtn.performancemanager.impl.database.types;

import org.opendaylight.mwtn.base.netconf.ExtendedAirInterfaceHistoricalPerformanceType;
import org.opendaylight.yang.gen.v1.uri.onf.g_874_1_model.object_classes.rev160710.OTNHistoryData;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.AirInterfaceHistoricalPerformanceType;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.AirInterfacePerformanceType;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.ContainerHistoricalPerformanceType;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.ContainerPerformanceType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EsPerformanceData10 {

    @JsonIgnore
    private static final Logger LOG = LoggerFactory.getLogger(EsPerformanceData10.class);

    //@JsonIgnore
    //private final org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.airinterfacehistoricalperformancetype.PerformanceData dataAirInterface;
    //@JsonIgnore
    //private final org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.containerhistoricalperformancetype.PerformanceData dataEthContainer;
    @JsonIgnore
    private AirInterfacePerformanceType dataAirInterface;
    @JsonIgnore
    private ContainerPerformanceType dataEthContainer;
    @JsonIgnore


    public <T extends OTNHistoryData> EsPerformanceData10(T ff) {

        if (ff instanceof AirInterfaceHistoricalPerformanceType ) {
            this.dataAirInterface = ((AirInterfaceHistoricalPerformanceType)ff).getPerformanceData();
            this.dataEthContainer = null;
            //org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160902.ContainerHistoricalPerformanceType
        } else if (ff instanceof ContainerHistoricalPerformanceType) {
            this.dataAirInterface = null;
            this.dataEthContainer = ((ContainerHistoricalPerformanceType)ff).getPerformanceData();
        } else if (ff instanceof ExtendedAirInterfaceHistoricalPerformanceType) {
            this.dataAirInterface = ((ExtendedAirInterfaceHistoricalPerformanceType)ff).getAirInterfaceHistoricalPerformanceType().getPerformanceData();
            this.dataEthContainer = null;
        } else {
            LOG.warn("Can not assign historical performance type {}", ff.getClass().getName());
            this.dataAirInterface = null;
            this.dataEthContainer = null;
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
    java.lang.Integer getTime2Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime2Symbols() : null; }

    @JsonGetter("time4-states-s")
    java.lang.Integer getTime4SymbolsS(){ return dataAirInterface != null ? dataAirInterface.getTime4SymbolsS() : null; }

    @JsonGetter("time4-states")
    java.lang.Integer getTime4Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime4Symbols() : null; }

    @JsonGetter("time8-states")
    java.lang.Integer getTime8Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime8Symbols() : null; }

    @JsonGetter("time16-states-s")
    java.lang.Integer getTime16SymbolsS(){ return dataAirInterface != null ? dataAirInterface.getTime16SymbolsS() : null; }

    @JsonGetter("time16-states")
    java.lang.Integer getTime16Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime16Symbols() : null; }

    @JsonGetter("time32-states")
    java.lang.Integer getTime32Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime32Symbols() : null; }

    @JsonGetter("time64-states")
    java.lang.Integer getTime64Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime64Symbols() : null; }

    @JsonGetter("time128-states")
    java.lang.Integer getTime128Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime128Symbols() : null; }

    @JsonGetter("time256-states")
    java.lang.Integer getTime256Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime256Symbols() : null; }

    @JsonGetter("time512-states")
    java.lang.Integer getTime512Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime512Symbols() : null; }

    @JsonGetter("time512-states-l")
    java.lang.Integer getTime512SymbolsL(){ return dataAirInterface != null ? dataAirInterface.getTime512SymbolsL() : null; }

    @JsonGetter("time1024-states")
    java.lang.Integer getTime1024Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime1024Symbols() : null; }

    @JsonGetter("time1024-states-l")
    java.lang.Integer getTime1024SymbolsL(){ return dataAirInterface != null ? dataAirInterface.getTime1024SymbolsL() : null; }

    @JsonGetter("time2048-states")
    java.lang.Integer getTime2048Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime2048Symbols() : null; }

    @JsonGetter("time2048-states-l")
    java.lang.Integer getTime2048SymbolsL(){ return dataAirInterface != null ? dataAirInterface.getTime2048SymbolsL() : null; }

    @JsonGetter("time4096-states")
    java.lang.Integer getTime4096Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime4096Symbols() : null; }

    @JsonGetter("time4096-states-l")
    java.lang.Integer getTime4096SymbolsL(){ return dataAirInterface != null ? dataAirInterface.getTime4096SymbolsL() : null; }

    @JsonGetter("time8192-states")
    java.lang.Integer getTime8192Symbols(){ return dataAirInterface != null ? dataAirInterface.getTime8192Symbols() : null; }

    @JsonGetter("time8192-states-l")
    java.lang.Integer getTime8192SymbolsL(){ return dataAirInterface != null ? dataAirInterface.getTime8192SymbolsL() : null; }

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
                + ", getTime2Symbols()=" + getTime2Symbols() + ", getTime4SymbolsS()=" + getTime4SymbolsS()
                + ", getTime4Symbols()=" + getTime4Symbols() + ", getTime8Symbols()=" + getTime8Symbols()
                + ", getTime16SymbolsS()=" + getTime16SymbolsS() + ", getTime16Symbols()=" + getTime16Symbols()
                + ", getTime32Symbols()=" + getTime32Symbols() + ", getTime64Symbols()=" + getTime64Symbols()
                + ", getTime128Symbols()=" + getTime128Symbols() + ", getTime256Symbols()=" + getTime256Symbols()
                + ", getTime512Symbols()=" + getTime512Symbols() + ", getTime512SymbolsL()=" + getTime512SymbolsL()
                + ", getTime1024Symbols()=" + getTime1024Symbols() + ", getTime1024SymbolsL()=" + getTime1024SymbolsL()
                + ", getTime2048Symbols()=" + getTime2048Symbols() + ", getTime2048SymbolsL()=" + getTime2048SymbolsL()
                + ", getTime4096Symbols()=" + getTime4096Symbols() + ", getTime4096SymbolsL()=" + getTime4096SymbolsL()
                + ", getTime8192Symbols()=" + getTime8192Symbols() + ", getTime8192SymbolsL()=" + getTime8192SymbolsL()
                + ", getSnirMin()=" + getSnirMin() + ", getSnirMax()=" + getSnirMax() + ", getSnirAvg()=" + getSnirAvg()
                + ", getXpdMin()=" + getXpdMin() + ", getXpdMax()=" + getXpdMax() + ", getXpdAvg()=" + getXpdAvg()
                + ", getRfTempMin()=" + getRfTempMin() + ", getRfTempMax()=" + getRfTempMax() + ", getRfTempAvg()="
                + getRfTempAvg() + ", getDefectBlocksSum()=" + getDefectBlocksSum() + ", getTimePeriod()="
                + getTimePeriod() + ", getTxEthernetBytesMaxS()=" + getTxEthernetBytesMaxS()
                + ", getTxEthernetBytesMaxM()=" + getTxEthernetBytesMaxM() + ", getTxEthernetBytesSum()="
                + getTxEthernetBytesSum() + "]";
    }

}
