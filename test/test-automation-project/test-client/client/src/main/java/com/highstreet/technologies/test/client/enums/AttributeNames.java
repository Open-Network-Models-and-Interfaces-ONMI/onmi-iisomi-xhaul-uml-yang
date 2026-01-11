/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.client.enums;

import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.impl.AttributeBuilder;

public enum AttributeNames {
   // AirInterfaceCapability
    adaptiveModulationIsAvail_airInterfaceCapability("adaptiveModulationIsAvail", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    alicIsAvail_airInterfaceCapability("alicIsAvail", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    atpcIsAvail_airInterfaceCapability("atpcIsAvail", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    atpcRange_airInterfaceCapability("atpcRange", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    encryptionIsAvail_airInterfaceCapability("encryptionIsAvail", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    loopBackIsAvail_airInterfaceCapability("loopBackIsAvail", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    maintenanceTimerRange_airInterfaceCapability("maintenanceTimerRange", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    mimoChannels_airInterfaceCapability("mimoChannels", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    mimoIsAvail_airInterfaceCapability("mimoIsAvail", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    rxFrequencyMax_airInterfaceCapability("rxFrequencyMax", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    rxFrequencyMin_airInterfaceCapability("rxFrequencyMin", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    supportedAlarms_airInterfaceCapability("supportedAlarms", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    supportedChannelPlanList_airInterfaceCapability("supportedChannelPlanList", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    txFrequencyMax_airInterfaceCapability("txFrequencyMax", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    txFrequencyMin_airInterfaceCapability("txFrequencyMin", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
    typeOfEquipment_airInterfaceCapability("typeOfEquipment", false, SubObjectClass.airInterfaceCapability, ConditionalPackage.MW_AirInterface_Pac),
   // AirInterfaceConfiguration
    adaptiveModulationIsOn_airInterfaceConfiguration("adaptiveModulationIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    airInterfaceName_airInterfaceConfiguration("airInterfaceName", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    alicIsOn_airInterfaceConfiguration("alicIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    atpcIsOn_airInterfaceConfiguration("atpcIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    atpcThreshLower_airInterfaceConfiguration("atpcThreshLower", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    atpcThreshUpper_airInterfaceConfiguration("atpcThreshUpper", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    autoFreqSelectIsOn_airInterfaceConfiguration("autoFreqSelectIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    autoFreqSelectRange_airInterfaceConfiguration("autoFreqSelectRange", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    cryptographicKey_airInterfaceConfiguration("cryptographicKey", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    encryptionIsOn_airInterfaceConfiguration("encryptionIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    loopBackIsOn_airInterfaceConfiguration("loopBackIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    maintenanceTimer_airInterfaceConfiguration("maintenanceTimer", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    mimoIsOn_airInterfaceConfiguration("mimoIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    modulationIsOn_airInterfaceConfiguration("modulationIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    modulationMax_airInterfaceConfiguration("modulationMax", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    modulationMin_airInterfaceConfiguration("modulationMin", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    polarization_airInterfaceConfiguration("polarization", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    powerIsOn_airInterfaceConfiguration("powerIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    problemKindSeverityList_airInterfaceConfiguration("problemKindSeverityList", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    radioSignalID_airInterfaceConfiguration("radioSignalID", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    receiverIsOn_airInterfaceConfiguration("receiverIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    rxChannelBandwidth_airInterfaceConfiguration("rxChannelBandwidth", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    rxFrequency_airInterfaceConfiguration("rxFrequency", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    transmitterIsOn_airInterfaceConfiguration("transmitterIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    txChannelBandwidth_airInterfaceConfiguration("txChannelBandwidth", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    txFrequency_airInterfaceConfiguration("txFrequency", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    txPower_airInterfaceConfiguration("txPower", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
    xpicIsOn_airInterfaceConfiguration("xpicIsOn", true, SubObjectClass.airInterfaceConfiguration, ConditionalPackage.MW_AirInterface_Pac),
   // AirInterfaceCurrentPerformance
    currentPerformanceDataList_airInterfaceCurrentPerformance("currentPerformanceDataList", false, SubObjectClass.airInterfaceCurrentPerformance, ConditionalPackage.MW_AirInterface_Pac),
   // AirInterfaceCurrentProblems
    currentProblemList_airInterfaceCurrentProblems("currentProblemList", false, SubObjectClass.airInterfaceCurrentProblems, ConditionalPackage.MW_AirInterface_Pac),
   // AirInterfaceDiversityCapability
    availableKindsOfDiversity_airInterfaceDiversityCapability("availableKindsOfDiversity", false, SubObjectClass.airInterfaceDiversityCapability, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
    supportedAlarms_airInterfaceDiversityCapability("supportedAlarms", false, SubObjectClass.airInterfaceDiversityCapability, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
   // AirInterfaceDiversityConfiguration
    airInterfaceDiversity_airInterfaceDiversityConfiguration("airInterfaceDiversity", true, SubObjectClass.airInterfaceDiversityConfiguration, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
    airInterfaceLtpList_airInterfaceDiversityConfiguration("airInterfaceLtpList", true, SubObjectClass.airInterfaceDiversityConfiguration, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
    problemKindSeverityList_airInterfaceDiversityConfiguration("problemKindSeverityList", true, SubObjectClass.airInterfaceDiversityConfiguration, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
   // AirInterfaceDiversityCurrentPerformance
    currentPerformanceDataList_airInterfaceDiversityCurrentPerformance("currentPerformanceDataList", false, SubObjectClass.airInterfaceDiversityCurrentPerformance, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
   // AirInterfaceDiversityCurrentProblems
    currentProblemList_airInterfaceDiversityCurrentProblems("currentProblemList", false, SubObjectClass.airInterfaceDiversityCurrentProblems, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
   // AirInterfaceDiversityHistoricalPerformances
    historicalPerformanceDataList_airInterfaceDiversityHistoricalPerformances("historicalPerformanceDataList", false, SubObjectClass.airInterfaceDiversityHistoricalPerformances, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
   // AirInterfaceDiversityStatus
    airInterfaceDiversityStatus_airInterfaceDiversityStatus("airInterfaceDiversityStatus", false, SubObjectClass.airInterfaceDiversityStatus, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
    lastStatusChange_airInterfaceDiversityStatus("lastStatusChange", false, SubObjectClass.airInterfaceDiversityStatus, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
    snirCur_airInterfaceDiversityStatus("snirCur", false, SubObjectClass.airInterfaceDiversityStatus, ConditionalPackage.MW_AirInterfaceDiversity_Pac),
   // AirInterfaceHistoricalPerformances
    historicalPerformanceDataList_airInterfaceHistoricalPerformances("historicalPerformanceDataList", false, SubObjectClass.airInterfaceHistoricalPerformances, ConditionalPackage.MW_AirInterface_Pac),
   // AirInterfaceStatus
    alicIsUp_airInterfaceStatus("alicIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    atpcIsUp_airInterfaceStatus("atpcIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    autoFreqSelectIsUp_airInterfaceStatus("autoFreqSelectIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    informationRateCur_airInterfaceStatus("informationRateCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    lastStatusChange_airInterfaceStatus("lastStatusChange", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    linkIsUp_airInterfaceStatus("linkIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    localEndPointId_airInterfaceStatus("localEndPointId", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    loopBackIsUp_airInterfaceStatus("loopBackIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    mimoIsUp_airInterfaceStatus("mimoIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    modulationCur_airInterfaceStatus("modulationCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    radioPowerIsUp_airInterfaceStatus("radioPowerIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    remoteEndPointId_airInterfaceStatus("remoteEndPointId", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    rfTempCur_airInterfaceStatus("rfTempCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    rxFrequencyCur_airInterfaceStatus("rxFrequencyCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    rxLevelCur_airInterfaceStatus("rxLevelCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    snirCur_airInterfaceStatus("snirCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    txFrequencyCur_airInterfaceStatus("txFrequencyCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    txLevelCur_airInterfaceStatus("txLevelCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    xpdCur_airInterfaceStatus("xpdCur", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
    xpicIsUp_airInterfaceStatus("xpicIsUp", false, SubObjectClass.airInterfaceStatus, ConditionalPackage.MW_AirInterface_Pac),
   // EthernetContainerCapability
    bundlingIsAvail_ethernetContainerCapability("bundlingIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    encryptionIsAvail_ethernetContainerCapability("encryptionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    ipv4CompressionIsAvail_ethernetContainerCapability("ipv4CompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    ipv6CompressionIsAvail_ethernetContainerCapability("ipv6CompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    layer2CompressionIsAvail_ethernetContainerCapability("layer2CompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    layer4CompressionIsAvail_ethernetContainerCapability("layer4CompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    mplsCompressionIsAvail_ethernetContainerCapability("mplsCompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    packetCompressionIsAvail_ethernetContainerCapability("packetCompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    qInQCompressionIsAvail_ethernetContainerCapability("qInQCompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    supportedAlarms_ethernetContainerCapability("supportedAlarms", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
    vlanCompressionIsAvail_ethernetContainerCapability("vlanCompressionIsAvail", false, SubObjectClass.ethernetContainerCapability, ConditionalPackage.MW_EthernetContainer_Pac),
   // EthernetContainerConfiguration
    containerID_ethernetContainerConfiguration("containerID", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    cryptographicKey_ethernetContainerConfiguration("cryptographicKey", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    encryptionIsOn_ethernetContainerConfiguration("encryptionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    ipv4CompressionIsOn_ethernetContainerConfiguration("ipv4CompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    ipv6CompressionIsOn_ethernetContainerConfiguration("ipv6CompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    layer2CompressionIsOn_ethernetContainerConfiguration("layer2CompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    layer4CompressionIsOn_ethernetContainerConfiguration("layer4CompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    mplsCompressionIsOn_ethernetContainerConfiguration("mplsCompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    packetCompressionIsOn_ethernetContainerConfiguration("packetCompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    problemKindSeverityList_ethernetContainerConfiguration("problemKindSeverityList", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    qInQCompressionIsOn_ethernetContainerConfiguration("qInQCompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    segmentsIDList_ethernetContainerConfiguration("segmentsIDList", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
    vlanCompressionIsOn_ethernetContainerConfiguration("vlanCompressionIsOn", true, SubObjectClass.ethernetContainerConfiguration, ConditionalPackage.MW_EthernetContainer_Pac),
   // EthernetContainerCurrentPerformance
    currentPerformanceDataList_ethernetContainerCurrentPerformance("currentPerformanceDataList", false, SubObjectClass.ethernetContainerCurrentPerformance, ConditionalPackage.MW_EthernetContainer_Pac),
   // EthernetContainerCurrentProblems
    currentProblemList_ethernetContainerCurrentProblems("currentProblemList", false, SubObjectClass.ethernetContainerCurrentProblems, ConditionalPackage.MW_EthernetContainer_Pac),
   // EthernetContainerHistoricalPerformances
    historicalPerformanceDataList_ethernetContainerHistoricalPerformances("historicalPerformanceDataList", false, SubObjectClass.ethernetContainerHistoricalPerformances, ConditionalPackage.MW_EthernetContainer_Pac),
   // EthernetContainerStatus
    lastStatusChange_ethernetContainerStatus("lastStatusChange", false, SubObjectClass.ethernetContainerStatus, ConditionalPackage.MW_EthernetContainer_Pac),
   // HybridMwStructureCapability
    structureId_hybridMwStructureCapability("structureId", false, SubObjectClass.hybridMwStructureCapability, ConditionalPackage.MW_HybridMwStructure_Pac),
    supportedAlarms_hybridMwStructureCapability("supportedAlarms", false, SubObjectClass.hybridMwStructureCapability, ConditionalPackage.MW_HybridMwStructure_Pac),
    supportedTdmStructureTypesList_hybridMwStructureCapability("supportedTdmStructureTypesList", false, SubObjectClass.hybridMwStructureCapability, ConditionalPackage.MW_HybridMwStructure_Pac),
   // HybridMwStructureConfiguration
    numberOfTdmSegmentsToBeReserved_hybridMwStructureConfiguration("numberOfTdmSegmentsToBeReserved", true, SubObjectClass.hybridMwStructureConfiguration, ConditionalPackage.MW_HybridMwStructure_Pac),
    problemKindSeverityList_hybridMwStructureConfiguration("problemKindSeverityList", true, SubObjectClass.hybridMwStructureConfiguration, ConditionalPackage.MW_HybridMwStructure_Pac),
    structureType_hybridMwStructureConfiguration("structureType", true, SubObjectClass.hybridMwStructureConfiguration, ConditionalPackage.MW_HybridMwStructure_Pac),
   // HybridMwStructureCurrentPerformance
    currentPerformanceDataList_hybridMwStructureCurrentPerformance("currentPerformanceDataList", false, SubObjectClass.hybridMwStructureCurrentPerformance, ConditionalPackage.MW_HybridMwStructure_Pac),
   // HybridMwStructureCurrentProblems
    currentProblemList_hybridMwStructureCurrentProblems("currentProblemList", false, SubObjectClass.hybridMwStructureCurrentProblems, ConditionalPackage.MW_HybridMwStructure_Pac),
   // HybridMwStructureHistoricalPerformances
    historicalPerformanceDataList_hybridMwStructureHistoricalPerformances("historicalPerformanceDataList", false, SubObjectClass.hybridMwStructureHistoricalPerformances, ConditionalPackage.MW_HybridMwStructure_Pac),
   // HybridMwStructureStatus
    lastStatusChange_hybridMwStructureStatus("lastStatusChange", false, SubObjectClass.hybridMwStructureStatus, ConditionalPackage.MW_HybridMwStructure_Pac),
    segmentStatusList_hybridMwStructureStatus("segmentStatusList", false, SubObjectClass.hybridMwStructureStatus, ConditionalPackage.MW_HybridMwStructure_Pac),
   // PureEthernetStructureCapability
    structureId_pureEthernetStructureCapability("structureId", false, SubObjectClass.pureEthernetStructureCapability, ConditionalPackage.MW_PureEthernetStructure_Pac),
    supportedAlarms_pureEthernetStructureCapability("supportedAlarms", false, SubObjectClass.pureEthernetStructureCapability, ConditionalPackage.MW_PureEthernetStructure_Pac),
   // PureEthernetStructureConfiguration
    problemKindSeverityList_pureEthernetStructureConfiguration("problemKindSeverityList", true, SubObjectClass.pureEthernetStructureConfiguration, ConditionalPackage.MW_PureEthernetStructure_Pac),
   // PureEthernetStructureCurrentPerformance
    currentPerformanceDataList_pureEthernetStructureCurrentPerformance("currentPerformanceDataList", false, SubObjectClass.pureEthernetStructureCurrentPerformance, ConditionalPackage.MW_PureEthernetStructure_Pac),
   // PureEthernetStructureCurrentProblems
    currentProblemList_pureEthernetStructureCurrentProblems("currentProblemList", false, SubObjectClass.pureEthernetStructureCurrentProblems, ConditionalPackage.MW_PureEthernetStructure_Pac),
   // PureEthernetStructureHistoricalPerformances
    historicalPerformanceDataList_pureEthernetStructureHistoricalPerformances("historicalPerformanceDataList", false, SubObjectClass.pureEthernetStructureHistoricalPerformances, ConditionalPackage.MW_PureEthernetStructure_Pac),
   // PureEthernetStructureStatus
    lastStatusChange_pureEthernetStructureStatus("lastStatusChange", false, SubObjectClass.pureEthernetStructureStatus, ConditionalPackage.MW_PureEthernetStructure_Pac),
    segmentStatusList_pureEthernetStructureStatus("segmentStatusList", false, SubObjectClass.pureEthernetStructureStatus, ConditionalPackage.MW_PureEthernetStructure_Pac),
   // TdmContainerCapability
    supportedAlarms_tdmContainerCapability("supportedAlarms", false, SubObjectClass.tdmContainerCapability, ConditionalPackage.MW_TdmContainer_Pac),
    supportedTdmContainerTypesList_tdmContainerCapability("supportedTdmContainerTypesList", false, SubObjectClass.tdmContainerCapability, ConditionalPackage.MW_TdmContainer_Pac),
   // TdmContainerConfiguration
    containerID_tdmContainerConfiguration("containerID", true, SubObjectClass.tdmContainerConfiguration, ConditionalPackage.MW_TdmContainer_Pac),
    containerType_tdmContainerConfiguration("containerType", true, SubObjectClass.tdmContainerConfiguration, ConditionalPackage.MW_TdmContainer_Pac),
    problemKindSeverityList_tdmContainerConfiguration("problemKindSeverityList", true, SubObjectClass.tdmContainerConfiguration, ConditionalPackage.MW_TdmContainer_Pac),
    segmentID_tdmContainerConfiguration("segmentID", true, SubObjectClass.tdmContainerConfiguration, ConditionalPackage.MW_TdmContainer_Pac),
   // TdmContainerCurrentPerformance
    currentPerformanceDataList_tdmContainerCurrentPerformance("currentPerformanceDataList", false, SubObjectClass.tdmContainerCurrentPerformance, ConditionalPackage.MW_TdmContainer_Pac),
   // TdmContainerCurrentProblems
    currentProblemList_tdmContainerCurrentProblems("currentProblemList", false, SubObjectClass.tdmContainerCurrentProblems, ConditionalPackage.MW_TdmContainer_Pac),
   // TdmContainerHistoricalPerformances
    historicalPerformanceDataList_tdmContainerHistoricalPerformances("historicalPerformanceDataList", false, SubObjectClass.tdmContainerHistoricalPerformances, ConditionalPackage.MW_TdmContainer_Pac),
   // TdmContainerStatus
    lastStatusChange_tdmContainerStatus("lastStatusChange", false, SubObjectClass.tdmContainerStatus, ConditionalPackage.MW_TdmContainer_Pac);

	private final String labelId;
	private final Boolean readWrite;
	private final SubObjectClass subObjectClass;
	private final ConditionalPackage conditionalPackage;

	private AttributeNames(final String labelId, final Boolean readWrite, final SubObjectClass subObjectClass, final ConditionalPackage conditionalPackage ) {
		this.labelId = labelId;
		this.readWrite = readWrite;
		this.subObjectClass = subObjectClass;
		this.conditionalPackage = conditionalPackage;
	}

	public String getLabelId() {
		return this.labelId;
	}
	
	public Boolean isReadWrite() {
		return this.readWrite;
	}
	
	public SubObjectClass getSubObjectClass() {
		return this.subObjectClass;
	}
	
	public ConditionalPackage getConditionalPackage() {
		return this.conditionalPackage;
	}
	
	public Attribute getAttribute(String layerProtocol) {
		return new AttributeBuilder(this.conditionalPackage, layerProtocol, this.subObjectClass)
				.setAttribute(this)
				.build();
	}
	
	@Override
	public String toString() {
		return this.labelId;
	}
}