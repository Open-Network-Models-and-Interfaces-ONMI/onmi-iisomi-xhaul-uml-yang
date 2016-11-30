/*
 * dvm_boot_time_callbacks.c
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#include "dvm_boot_time_callbacks.h"

/*
 * module: MicrowaveModel-ObjectClasses-AirInterface
 */
status_t dvm_cb_get_all_air_interface_pac_keys(char **air_interface_pac_keys_list, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac/layerProtocol");

	return get_list_from_xpath(evalPath, air_interface_pac_keys_list, num_of_keys);
}

char* dvm_cb_get_boot_time_airInterfaceCapability_typeOfEquipment(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/typeOfEquipment", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_txFrequencyMin(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/txFrequencyMin", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_txFrequencyMax(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/txFrequencyMax", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_rxFrequencyMin(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/rxFrequencyMin", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_rxFrequencyMax(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/rxFrequencyMax", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_adaptiveModulationIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/adaptiveModulationIsAvail", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_mimoIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/mimoIsAvail", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_mimoChannels(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/mimoChannels", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_alicIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/alicIsAvail", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_atpcIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/atpcIsAvail", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_atpcRange(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/atpcRange", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_encryptionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/encryptionIsAvail", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_loopBackIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/loopBackIsAvail", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_maintenanceTimerRange(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/maintenanceTimerRange", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedAlarms(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedAlarms", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_supported_channel_plan_list_keys(const char *air_interface_pac_key, char **supported_channel_plan_list_key_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList/supportedChannelPlan", air_interface_pac_key);

	return get_list_from_xpath(evalPath, supported_channel_plan_list_key_entries, num_of_keys);
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistanceIsVariable(char *layerProtocolKeyString, char* supportedChannelPlanKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/duplexDistanceIsVariable",
			layerProtocolKeyString, supportedChannelPlanKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistance(char *layerProtocolKeyString, char* supportedChannelPlanKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/duplexDistance",
			layerProtocolKeyString, supportedChannelPlanKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_autoFreqSelectIsAvail(char *layerProtocolKeyString, char* supportedChannelPlanKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/autoFreqSelectIsAvail",
			layerProtocolKeyString, supportedChannelPlanKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_transmission_mode_id_list_keys(const char *air_interface_pac_key, const char *supported_channel_plan_key, char **transmission_mode_id_list_key_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList/transmissionModeId",
			air_interface_pac_key, supported_channel_plan_key);

	return get_list_from_xpath(evalPath, transmission_mode_id_list_key_entries, num_of_keys);
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_channelBandwidth(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/channelBandwidth",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_modulationScheme(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/modulationScheme",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_informationRate(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/informationRate",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMin(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/txPowerMin",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMax(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/txPowerMax",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_rxThreshold(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/rxThreshold",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amUpshiftLevel(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/amUpshiftLevel",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amDownshiftLevel(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/amDownshiftLevel",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_xpicIsAvail(char *layerProtocolKeyString, char* supportedChannelPlanKeyString, char* transmissionModeIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCapability/supportedChannelPlanList[supportedChannelPlan=\"%s\"]/transmissionModeList[transmissionModeId=\"%s\"]/xpicIsAvail",
			layerProtocolKeyString, supportedChannelPlanKeyString, transmissionModeIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_airInterfaceName(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/airInterfaceName", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_radioSignalID(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/radioSignalID", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_txFrequency(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/txFrequency", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_rxFrequency(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/rxFrequency", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_txChannelBandwidth(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/txChannelBandwidth", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_rxChannelBandwidth(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/rxChannelBandwidth", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_polarization(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/polarization", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_powerIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/powerIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_transmitterIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/transmitterIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_receiverIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/receiverIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_txPower(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/txPower", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_adaptiveModulationIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/adaptiveModulationIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_modulationMin(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/modulationMin", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_modulationMax(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/modulationMax", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_xpicIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/xpicIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_mimoIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/mimoIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_alicIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/alicIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_atpcIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/atpcIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_atpcThreshUpper(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/atpcThreshUpper", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_atpcThreshLower(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/atpcThreshLower", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/autoFreqSelectIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectRange(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/autoFreqSelectRange", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_modulationIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/modulationIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_encryptionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/encryptionIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_cryptographicKey(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/cryptographicKey", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_loopBackIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/loopBackIsOn", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_maintenanceTimer(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/maintenanceTimer", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_problem_kind_severity_list_keys(const char *air_interface_pac_key, char **problem_kind_severity_list_key_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/problemKindSeverityList/problemKindName", air_interface_pac_key);

	return get_list_from_xpath(evalPath, problem_kind_severity_list_key_entries, num_of_keys);
}

char* dvm_cb_get_boot_time_airInterfaceConfiguration_problemKindSeverity(char *layerProtocolKeyString, char* problemKindNameString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceConfiguration/problemKindSeverityList[problemKindName=\"%s\"]/problemKindSeverity",
			layerProtocolKeyString, problemKindNameString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

/*
 * module: MicrowaveModel-ObjectClasses-PureEthernetStructure
 */
status_t dvm_cb_get_all_pure_eth_structure_pac_keys(char** air_pure_eth_structure_keys_list, int* num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac/layerProtocol");

	return get_list_from_xpath(evalPath, air_pure_eth_structure_keys_list, num_of_keys);
}

char* dvm_cb_get_boot_time_pureEthernetStructure_structureID(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureCapability/structureId", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_pureEthernetStructure_problemKindSeverity(char *layerProtocolKeyString, char *problemKindNameKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureConfiguration/problemKindSeverityList[problemKindName=\"%s\"]/problemKindSeverity",
			layerProtocolKeyString, problemKindNameKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

/*
 * module: MicrowaveModel-ObjectClasses-EthernetContainer
 */
status_t dvm_cb_get_all_ethernet_container_pac_keys(char** ethernet_container_pac_keys_list, int* num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac/layerProtocol");

	return get_list_from_xpath(evalPath, ethernet_container_pac_keys_list, num_of_keys);
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_bundlingIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/bundlingIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_packetCompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/packetCompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_layer2CompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/layer2CompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_vlanCompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/vlanCompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_qInQCompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/qInQCompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_mplsCompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/mplsCompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_ipv4CompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/ipv4CompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_ipv6CompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/ipv6CompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_layer4CompressionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/layer4CompressionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_encryptionIsAvail(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/encryptionIsAvail",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerCapability_supportedAlarms(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCapability/supportedAlarms",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_segment_id_list_keys(const char *air_interface_pac_key, char **segment_id_list_key_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/segmentsIDList/structureIdRef", air_interface_pac_key);

	return get_list_from_xpath(evalPath, segment_id_list_key_entries, num_of_keys);
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_segmentIdRef(char *layerProtocolKeyString, char* structureIdRefKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/segmentsIDList[structureIdRef=\"%s\"]/segmentIdRef",
			layerProtocolKeyString, structureIdRefKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_containerID(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/containerID",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_packetCompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/packetCompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_layer2CompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/layer2CompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_vlanCompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/vlanCompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_qInQCompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/qInQCompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_mplsCompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/mplsCompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_ipv4CompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/ipv4CompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_ipv6CompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/ipv6CompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_layer4CompressionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/layer4CompressionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_encryptionIsOn(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/encryptionIsOn",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_ethernetContainerConfiguration_cryptographicKey(char *layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/cryptographicKey",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_ethernet_container_problem_kind_severity_list_keys(const char *ethernet_container_pac_key, char **problem_kind_severity_list_key_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerConfiguration/problemKindSeverityList/problemKindName",
				ethernet_container_pac_key);

	return get_list_from_xpath(evalPath, problem_kind_severity_list_key_entries, num_of_keys);
}
/*
 * module: CoreModel-CoreNetworkModule-ObjectClasses
 */
char* dvm_cb_get_boot_time_NetworkElement_uuid()
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/uuid");

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_state_pac_operationalState(void)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/operationalState");

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_state_pac_administrativeControl(void)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/administrativeControl");

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_state_pac_administrativeState(void)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/administrativeState");

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_state_pac_lifecycleState(void)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/lifecycleState");

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_lpList_layerProtocolName(char *ltpUuidString, char *lpUuidString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/_ltpRefList[uuid=\"%s\"]/_lpList[uuid=\"%s\"]/layerProtocolName",
			ltpUuidString, lpUuidString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_lpList_configuredClientCapacity(char *ltpUuidString, char *lpUuidString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/_ltpRefList[uuid=\"%s\"]/_lpList[uuid=\"%s\"]/configuredClientCapacity",
			ltpUuidString, lpUuidString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_lpList_lpDirection(char *ltpUuidString, char *lpUuidString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/_ltpRefList[uuid=\"%s\"]/_lpList[uuid=\"%s\"]/lpDirection",
			ltpUuidString, lpUuidString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_boot_time_NetworkElement_lpList_terminationState(char *ltpUuidString, char *lpUuidString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/_ltpRefList[uuid=\"%s\"]/_lpList[uuid=\"%s\"]/terminationState",
			ltpUuidString, lpUuidString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_server_ltp_ref_leaf_list_elements_for_ltp(char* ltp_uuid, char** server_ltp_ref_leaf_list, int* num_of_elements)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/_ltpRefList[uuid=\"%s\"]/_serverLtpRefList", ltp_uuid);

	return get_list_from_xpath(evalPath, server_ltp_ref_leaf_list, num_of_elements);
}

status_t dvm_cb_get_all_client_ltp_ref_leaf_list_elements_for_ltp(char* ltp_uuid, char** client_ltp_ref_leaf_list, int* num_of_elements)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/_ltpRefList[uuid=\"%s\"]/_clientLtpRefList", ltp_uuid);

	return get_list_from_xpath(evalPath, client_ltp_ref_leaf_list, num_of_elements);
}

char* dvm_cb_get_boot_time_NetworkElement_ltpRefList_physicalPortReference(char *ltpUuidString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/NetworkElement/_ltpRefList[uuid=\"%s\"]/physicalPortReference", ltpUuidString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
