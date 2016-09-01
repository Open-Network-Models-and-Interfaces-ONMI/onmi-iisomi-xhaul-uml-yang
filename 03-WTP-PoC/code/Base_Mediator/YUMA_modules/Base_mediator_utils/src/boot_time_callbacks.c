/*
 * boot_time_callbacks.c
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#include "boot_time_callbacks.h"
#include "utils.h"
#include "y_MicrowaveModel-ObjectClasses-AirInterface.h"
#include "y_CoreModel-CoreNetworkModule-ObjectClasses.h"

static const char* cb_get_boot_time_airInterfaceCapability_typeOfEquipment(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_txFrequencyMin(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_txFrequencyMax(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_rxFrequencyMin(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_rxFrequencyMax(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_adaptiveModulationIsAvail(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_mimoIsAvail(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_mimoChannels(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_alicIsAvail(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_atpcIsAvail(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_atpcRange(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_encryptionIsAvail(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_loopBackIsAvail(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_maintenanceTimerRange(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedAlarms(val_value_t *element);

static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_supportedChannelPlan(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistanceIsVariable(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistance(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_autoFreqSelectIsAvail(val_value_t *element);

static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_channelBandwidth(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_modulationScheme(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_informationRate(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMin(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMax(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_rxThreshold(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amUpshiftLevel(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amDownshiftLevel(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_xpicIsAvail(val_value_t *element);

static const char* cb_get_boot_time_airInterfaceConfiguration_airInterfaceName(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_radioSignalID(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_txFrequency(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_rxFrequency(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_txChannelBandwidth(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_rxChannelBandwidth(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_polarization(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_powerIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_transmitterIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_receiverIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_txPower(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_adaptiveModulationIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_modulationMin(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_modulationMax(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_xpicIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_mimoIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_alicIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_atpcIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_atpcThreshUpper(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_atpcThreshLower(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectRange(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_modulationIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_encryptionIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_cryptographicKey(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_loopBackIsOn(val_value_t *element);
static const char* cb_get_boot_time_airInterfaceConfiguration_maintenanceTimer(val_value_t *element);

static const char* cb_get_boot_time_airInterfaceConfiguration_problemKindSeverity(val_value_t *element);


static const char* cb_get_boot_time_NetworkElement_class_value(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_class_valueName(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_global_class_valueName(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_global_class_value(val_value_t *element);

static const char* cb_get_boot_time_NetworkElement_state_pac_operationalState(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_state_pac_administrativeControl(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_state_pac_administrativeState(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_state_pac_lifecycleState(val_value_t *element);

static const char* cb_get_boot_time_NetworkElement_ltpRefList_connectedLtpRef(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_ltpRefList_peerLtpRef(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_ltpRefList_physicalPortReference(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_ltpRefList_ltpDirection(val_value_t *element);

static const char* cb_get_boot_time_NetworkElement_lpList_layerProtocolName(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_lpList_configuredClientCapacity(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_lpList_lpDirection(val_value_t *element);
static const char* cb_get_boot_time_NetworkElement_lpList_terminationState(val_value_t *element);

/********************************************************************
* FUNCTION cb_get_all_air_interface_pac_keys
*
* Get an array representing the keys of MW_AirInterface_Pac list
*
* OUTPUTS:
* char** air_interface_pac_keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of interfaces found)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_pac_keys(char** air_interface_pac_keys_list, int* num_of_keys)
{
	*num_of_keys = 0;

	/*
	 * fill in the actual values for the MW_AirInterface_Pac layerProtocol list here. E.g.:
	 */

	char layerProtocol[256];

	strcpy(layerProtocol, "ifIndex1");

	air_interface_pac_keys_list[*num_of_keys] = (char*) malloc(strlen(layerProtocol) + 1);
	YUMA_ASSERT(air_interface_pac_keys_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_pac_keys_list[*num_of_keys], layerProtocol);

	*num_of_keys += 1;

	strcpy(layerProtocol, "ifIndex2");

	air_interface_pac_keys_list[*num_of_keys] = (char*) malloc(strlen(layerProtocol) + 1);
	YUMA_ASSERT(air_interface_pac_keys_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_pac_keys_list[*num_of_keys], layerProtocol);

	*num_of_keys += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_supported_channel_plan_list_keys
*
* Get an array representing the keys of supportedChannelPlanList list
*
* INPUTS:
* char *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* char** supported_channel_plan_list_key_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_supported_channel_plan_list_keys(const char *air_interface_pac_key, char **supported_channel_plan_list_key_entries, int *num_of_keys)
{
	*num_of_keys = 0;

	/*
	 * fill in the actual values for the supportedChannelPlanList keys here, using the air_interface_pac_key as a key for finding the relevant information E.g.:
	 */

	char supportedChannelPlan[256];

	strcpy(supportedChannelPlan, "ETSI");

	supported_channel_plan_list_key_entries[*num_of_keys] = (char*) malloc(strlen(supportedChannelPlan) + 1);
	YUMA_ASSERT(supported_channel_plan_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(supported_channel_plan_list_key_entries[*num_of_keys], supportedChannelPlan);

	*num_of_keys += 1;

	strcpy(supportedChannelPlan, "FCC");

	supported_channel_plan_list_key_entries[*num_of_keys] = (char*) malloc(strlen(supportedChannelPlan) + 1);
	YUMA_ASSERT(supported_channel_plan_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(supported_channel_plan_list_key_entries[*num_of_keys], supportedChannelPlan);

	*num_of_keys += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_transmission_mode_id_list_keys
*
* Get an array representing the keys of transmissionModeList list
*
* INPUTS:
* const char *air_interface_pac_key - the key of the current interface
* const char *supported_channel_plan_key - the key of the current supportedChannelPlanList entry
* OUTPUTS:
* char** transmission_mode_id_list_key_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_transmission_mode_id_list_keys(const char *air_interface_pac_key, const char *supported_channel_plan_key, char **transmission_mode_id_list_key_entries, int *num_of_keys)
{
	*num_of_keys = 0;

	/*
	 * fill in the actual values for the transmissionModeList keys here, using the air_interface_pac_key and supported_channel_plan_key as keys for finding the relevant information E.g.:
	 */

	char transmissionModeId[256];

	if (strcmp(supported_channel_plan_key, "ETSI") == 0)
	{
		strcpy(transmissionModeId, "script_1");

		transmission_mode_id_list_key_entries[*num_of_keys] = (char*) malloc(strlen(transmissionModeId) + 1);
		YUMA_ASSERT(transmission_mode_id_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		strcpy(transmission_mode_id_list_key_entries[*num_of_keys], transmissionModeId);

		*num_of_keys += 1;

		strcpy(transmissionModeId, "script_2");

		transmission_mode_id_list_key_entries[*num_of_keys] = (char*) malloc(strlen(transmissionModeId) + 1);
		YUMA_ASSERT(transmission_mode_id_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		strcpy(transmission_mode_id_list_key_entries[*num_of_keys], transmissionModeId);

		*num_of_keys += 1;
	}
	else
	{
		strcpy(transmissionModeId, "script_3");

		transmission_mode_id_list_key_entries[*num_of_keys] = (char*) malloc(strlen(transmissionModeId) + 1);
		YUMA_ASSERT(transmission_mode_id_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		strcpy(transmission_mode_id_list_key_entries[*num_of_keys], transmissionModeId);

		*num_of_keys += 1;

		strcpy(transmissionModeId, "script_4");

		transmission_mode_id_list_key_entries[*num_of_keys] = (char*) malloc(strlen(transmissionModeId) + 1);
		YUMA_ASSERT(transmission_mode_id_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		strcpy(transmission_mode_id_list_key_entries[*num_of_keys], transmissionModeId);

		*num_of_keys += 1;

	}
	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_problem_kind_severity_list_keys
*
* Get an array representing the keys of problemKindSeverityList list
*
* INPUTS:
* char *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* char** problem_kind_severity_list_key_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_problem_kind_severity_list_keys(const char *air_interface_pac_key, char **problem_kind_severity_list_key_entries, int *num_of_keys)
{
	*num_of_keys = 0;

	/*
	 * fill in the actual values for the problemKindSeverityList keys here, using the air_interface_pac_key as a key for finding the relevant information E.g.:
	 */

	char problemKindName[256];

	strcpy(problemKindName, "alarm1");

	problem_kind_severity_list_key_entries[*num_of_keys] = (char*) malloc(strlen(problemKindName) + 1);
	YUMA_ASSERT(problem_kind_severity_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(problem_kind_severity_list_key_entries[*num_of_keys], problemKindName);

	*num_of_keys += 1;

	strcpy(problemKindName, "alarm2");

	problem_kind_severity_list_key_entries[*num_of_keys] = (char*) malloc(strlen(problemKindName) + 1);
	YUMA_ASSERT(problem_kind_severity_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(problem_kind_severity_list_key_entries[*num_of_keys], problemKindName);

	*num_of_keys += 1;

	strcpy(problemKindName, "alarm3");

	problem_kind_severity_list_key_entries[*num_of_keys] = (char*) malloc(strlen(problemKindName) + 1);
	YUMA_ASSERT(problem_kind_severity_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(problem_kind_severity_list_key_entries[*num_of_keys], problemKindName);

	*num_of_keys += 1;

	strcpy(problemKindName, "alarm4");

	problem_kind_severity_list_key_entries[*num_of_keys] = (char*) malloc(strlen(problemKindName) + 1);
	YUMA_ASSERT(problem_kind_severity_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(problem_kind_severity_list_key_entries[*num_of_keys], problemKindName);

	*num_of_keys += 1;

	strcpy(problemKindName, "alarm5");

	problem_kind_severity_list_key_entries[*num_of_keys] = (char*) malloc(strlen(problemKindName) + 1);
	YUMA_ASSERT(problem_kind_severity_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(problem_kind_severity_list_key_entries[*num_of_keys], problemKindName);

	*num_of_keys += 1;

	strcpy(problemKindName, "alarm6");

	problem_kind_severity_list_key_entries[*num_of_keys] = (char*) malloc(strlen(problemKindName) + 1);
	YUMA_ASSERT(problem_kind_severity_list_key_entries[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(problem_kind_severity_list_key_entries[*num_of_keys], problemKindName);

	*num_of_keys += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_co_channel_group_id_keys
*
* Get an array representing the keys of CoChannelGroup list
*
* OUTPUTS:
* char** co_channel_group_id_keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of co-channel groups found)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_co_channel_group_id_keys(char **co_channel_group_id_keys_list, int *num_of_keys)
{
	*num_of_keys = 0;

	/*
	 * fill in the actual values for the CoChannelGroup keys hereE.g.:
	 */

	char coChannelGroupId[256];

	strcpy(coChannelGroupId, "coChannelGroupId1");

	co_channel_group_id_keys_list[*num_of_keys] = (char*) malloc(strlen(coChannelGroupId) + 1);
	YUMA_ASSERT(co_channel_group_id_keys_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(co_channel_group_id_keys_list[*num_of_keys], coChannelGroupId);

	*num_of_keys += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_co_channel_group_air_interface_list_id_keys
*
* Get an array representing the leaf-list entries of airInterfaceList leaf-list
*
* INPUTS:
* char *co_channel_group_id_key - the key of the co-channel group
* OUTPUTS:
* char** co_channel_group_air_interface_list_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of interfaces found in the group)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_co_channel_group_air_interface_list_id_keys(const char *co_channel_group_id_key, char **co_channel_group_air_interface_list_entries, int *num_of_entries)
{
	*num_of_entries = 0;

	/*
	 * fill in the actual values for the CoChannelGroup keys hereE.g.:
	 */

	char coChannelGroupAirInterfaceListEntry[256];

	strcpy(coChannelGroupAirInterfaceListEntry, "LP-MWPS-TTP-ifIndex1");

	co_channel_group_air_interface_list_entries[*num_of_entries] = (char*) malloc(strlen(coChannelGroupAirInterfaceListEntry) + 1);
	YUMA_ASSERT(co_channel_group_air_interface_list_entries[*num_of_entries] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(co_channel_group_air_interface_list_entries[*num_of_entries], coChannelGroupAirInterfaceListEntry);

	*num_of_entries += 1;

	strcpy(coChannelGroupAirInterfaceListEntry, "LP-MWPS-TTP-ifIndex2");

	co_channel_group_air_interface_list_entries[*num_of_entries] = (char*) malloc(strlen(coChannelGroupAirInterfaceListEntry) + 1);
	YUMA_ASSERT(co_channel_group_air_interface_list_entries[*num_of_entries] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(co_channel_group_air_interface_list_entries[*num_of_entries], coChannelGroupAirInterfaceListEntry);

	*num_of_entries += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_boot_time_element_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
const char* cb_get_boot_time_element_value(val_value_t *element)
{
	if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_typeOfEquipment) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_typeOfEquipment(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txFrequencyMin) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_txFrequencyMin(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txFrequencyMax) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_txFrequencyMax(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxFrequencyMin) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_rxFrequencyMin(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxFrequencyMax) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_rxFrequencyMax(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_adaptiveModulationIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_adaptiveModulationIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_mimoIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_mimoIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_mimoChannels) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_mimoChannels(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_alicIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_alicIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_atpcIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcRange) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_atpcRange(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_encryptionIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_encryptionIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_loopBackIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_loopBackIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_maintenanceTimerRange) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_maintenanceTimerRange(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_supportedAlarms) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedAlarms(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_supportedChannelPlan) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_supportedChannelPlan(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_duplexDistanceIsVariable) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistanceIsVariable(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_duplexDistance) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistance(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_autoFreqSelectIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_autoFreqSelectIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_channelBandwidth) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_channelBandwidth(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationScheme) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_modulationScheme(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_informationRate) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_informationRate(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txPowerMin) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMin(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txPowerMax) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMax(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxThreshold) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_rxThreshold(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_amUpshiftLevel) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amUpshiftLevel(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_amDownshiftLevel) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amDownshiftLevel(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpicIsAvail) == 0)
	{
		return cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_xpicIsAvail(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemKindSeverity) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_problemKindSeverity(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_airInterfaceName) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_airInterfaceName(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_radioSignalID) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_radioSignalID(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txFrequency) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_txFrequency(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxFrequency) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_rxFrequency(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txChannelBandwidth) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_txChannelBandwidth(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxChannelBandwidth) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_rxChannelBandwidth(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_polarization) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_polarization(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_powerIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_powerIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_transmitterIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_transmitterIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_receiverIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_receiverIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txPower) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_txPower(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_adaptiveModulationIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_adaptiveModulationIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationMin) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_modulationMin(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationMax) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_modulationMax(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpicIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_xpicIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_mimoIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_mimoIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_alicIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_alicIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_atpcIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcThreshUpper) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_atpcThreshUpper(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcThreshLower) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_atpcThreshLower(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_autoFreqSelectIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_autoFreqSelectRange) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectRange(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_modulationIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_encryptionIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_encryptionIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_cryptographicKey) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_cryptographicKey(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_loopBackIsOn) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_loopBackIsOn(element);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_maintenanceTimer) == 0)
	{
		return cb_get_boot_time_airInterfaceConfiguration_maintenanceTimer(element);
	}

	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_valueName) == 0)
	{
		return cb_get_boot_time_NetworkElement_class_valueName(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_value) == 0)
	{
		return cb_get_boot_time_NetworkElement_class_value(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_operationalState) == 0)
	{
		return cb_get_boot_time_NetworkElement_state_pac_operationalState(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_administrativeControl) == 0)
	{
		return cb_get_boot_time_NetworkElement_state_pac_administrativeControl(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_administrativeState) == 0)
	{
		return cb_get_boot_time_NetworkElement_state_pac_administrativeState(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_lifecycleState) == 0)
	{
		return cb_get_boot_time_NetworkElement_state_pac_lifecycleState(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N__connectedLtpRef) == 0)
	{
		return cb_get_boot_time_NetworkElement_ltpRefList_connectedLtpRef(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N__peerLtpRef) == 0)
	{
		return cb_get_boot_time_NetworkElement_ltpRefList_peerLtpRef(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_physicalPortReference) == 0)
	{
		return cb_get_boot_time_NetworkElement_ltpRefList_physicalPortReference(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_ltpDirection) == 0)
	{
		return cb_get_boot_time_NetworkElement_ltpRefList_ltpDirection(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_layerProtocolName) == 0)
	{
		return cb_get_boot_time_NetworkElement_lpList_layerProtocolName(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_configuredClientCapacity) == 0)
	{
		return cb_get_boot_time_NetworkElement_lpList_configuredClientCapacity(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_lpDirection) == 0)
	{
		return cb_get_boot_time_NetworkElement_lpList_lpDirection(element);
	}
	else if (strcmp(element->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_terminationState) == 0)
	{
		return cb_get_boot_time_NetworkElement_lpList_terminationState(element);
	}


	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_typeOfEquipment
*
* Callback function for getting the value of the typeOfEquipment leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_typeOfEquipment(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information. E.g.:
	 */

	if (strcmp(VAL_STRING(layerProtocolKey), "LP-MWPS-TTP-ifIndex1") == 0)
	{
		return "MW_type_1";
	}
	if (strcmp(VAL_STRING(layerProtocolKey), "LP-MWPS-TTP-ifIndex2") == 0)
	{
		return "MW_type_2";
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_txFrequencyMin
*
* Callback function for getting the value of the txFrequencyMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_txFrequencyMin(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_txFrequencyMax
*
* Callback function for getting the value of the txFrequencyMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_txFrequencyMax(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_rxFrequencyMin
*
* Callback function for getting the value of the rxFrequencyMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_rxFrequencyMin(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_rxFrequencyMax
*
* Callback function for getting the value of the rxFrequencyMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_rxFrequencyMax(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_adaptiveModulationIsAvail
*
* Callback function for getting the value of the adaptiveModulationIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_adaptiveModulationIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_mimoIsAvail
*
* Callback function for getting the value of the mimoIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_mimoIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_mimoChannels
*
* Callback function for getting the value of the mimoChannels leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_mimoChannels(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_alicIsAvail
*
* Callback function for getting the value of the alicIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_alicIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_atpcIsAvail
*
* Callback function for getting the value of the atpcIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_atpcIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_atpcRange
*
* Callback function for getting the value of the atpcRange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_atpcRange(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_encryptionIsAvail
*
* Callback function for getting the value of the encryptionIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_encryptionIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_loopBackIsAvail
*
* Callback function for getting the value of the loopBackIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_loopBackIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_maintenanceTimerRange
*
* Callback function for getting the value of the maintenanceTimerRange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_maintenanceTimerRange(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedAlarms
*
* Callback function for getting the value of the supportedAlarms leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedAlarms(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find key for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_supportedChannelPlan
*
* Callback function for getting the value of the supportedChannelPlan leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_supportedChannelPlan(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and supportedChannelPlanKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistanceIsVariable
*
* Callback function for getting the value of the duplexDistanceIsVariable leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistanceIsVariable(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and supportedChannelPlanKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistance
*
* Callback function for getting the value of the duplexDistance leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_duplexDistance(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and supportedChannelPlanKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_autoFreqSelectIsAvail
*
* Callback function for getting the value of the autoFreqSelectIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_autoFreqSelectIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and supportedChannelPlanKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_channelBandwidth
*
* Callback function for getting the value of the channelBandwidth leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_channelBandwidth(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */
	if (strcmp(VAL_STRING(layerProtocolKey), "LP-MWPS-TTP-ifIndex1") == 0)
	{
		if (strcmp(VAL_STRING(supportedChannelPlanKey), "ETSI") == 0)
		{
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_1") == 0)
			{
				return "28";
			}
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_2") == 0)
			{
				return "28";
			}
		}
		if (strcmp(VAL_STRING(supportedChannelPlanKey), "FCC") == 0)
		{
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_3") == 0)
			{
				return "56";
			}
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_4") == 0)
			{
				return "56";
			}
		}
	}
	if (strcmp(VAL_STRING(layerProtocolKey), "LP-MWPS-TTP-ifIndex2") == 0)
	{
		if (strcmp(VAL_STRING(supportedChannelPlanKey), "ETSI") == 0)
		{
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_1") == 0)
			{
				return "14";
			}
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_2") == 0)
			{
				return "14";
			}
		}
		if (strcmp(VAL_STRING(supportedChannelPlanKey), "FCC") == 0)
		{
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_3") == 0)
			{
				return "7";
			}
			if (strcmp(VAL_STRING(transmissionModeIdKey), "script_4") == 0)
			{
				return "7";
			}
		}
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_modulationScheme
*
* Callback function for getting the value of the modulationScheme leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_modulationScheme(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_informationRate
*
* Callback function for getting the value of the informationRate leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_informationRate(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMin
*
* Callback function for getting the value of the txPowerMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMin(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMax
*
* Callback function for getting the value of the txPowerMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_txPowerMax(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_rxThreshold
*
* Callback function for getting the value of the rxThreshold leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_rxThreshold(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amUpshiftLevel
*
* Callback function for getting the value of the amUpshiftLevel leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amUpshiftLevel(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amDownshiftLevel
*
* Callback function for getting the value of the amDownshiftLevel leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_amDownshiftLevel(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_xpicIsAvail
*
* Callback function for getting the value of the xpicIsAvail leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceCapability_supportedChannelPlanList_transmissionModeList_xpicIsAvail(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *supportedChannelPlanKey = NULL;
	val_value_t *transmissionModeIdKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	supportedChannelPlanKey = agt_get_key_value(parentHavingKey, &lastkey);
	transmissionModeIdKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == supportedChannelPlanKey, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == transmissionModeIdKey, return NULL, "Could not find transmissionModeIdKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(supportedChannelPlanKey), return NULL, "Could not access value of the key %s for element %s", supportedChannelPlanKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(transmissionModeIdKey), return NULL, "Could not access value of the key %s for element %s", transmissionModeIdKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, supportedChannelPlanKey and transmissionModeIdKey as keys to find the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_problemKindSeverity
*
* Callback function for getting the value of the problemKindSeverity leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_problemKindSeverity(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *problemKindName = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	problemKindName = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == problemKindName, return NULL, "Could not find supportedChannelPlanKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
	YUMA_ASSERT(NULL == VAL_STRING(problemKindName), return NULL, "Could not access value of the key %s for element %s", problemKindName->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and problemKindName
	 */

	if (strcmp(VAL_STRING(problemKindName), "alarm1") == 0)
	{
		return "non-alarmed";
	}
	else if (strcmp(VAL_STRING(problemKindName), "alarm2") == 0)
	{
		return "warning";
	}
	else if (strcmp(VAL_STRING(problemKindName), "alarm3") == 0)
	{
		return "minor";
	}
	else if (strcmp(VAL_STRING(problemKindName), "alarm4") == 0)
	{
		return "major";
	}
	else if (strcmp(VAL_STRING(problemKindName), "alarm5") == 0)
	{
		return "critical";
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_airInterfaceName
*
* Callback function for getting the value of the airInterfaceName leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_airInterfaceName(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_radioSignalID
*
* Callback function for getting the value of the radioSignalID leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_radioSignalID(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_txFrequency
*
* Callback function for getting the value of the txFrequency leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_txFrequency(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return "15000000";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_rxFrequency
*
* Callback function for getting the value of the rxFrequency leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_rxFrequency(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_txChannelBandwidth
*
* Callback function for getting the value of the txChannelBandwidth leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_txChannelBandwidth(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_rxChannelBandwidth
*
* Callback function for getting the value of the rxChannelBandwidth leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_rxChannelBandwidth(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_polarization
*
* Callback function for getting the value of the polarization leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_polarization(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_powerIsOn
*
* Callback function for getting the value of the powerIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_powerIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_transmitterIsOn
*
* Callback function for getting the value of the transmitterIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_transmitterIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_receiverIsOn
*
* Callback function for getting the value of the receiverIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_receiverIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_txPower
*
* Callback function for getting the value of the txPower leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_txPower(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_adaptiveModulationIsOn
*
* Callback function for getting the value of the adaptiveModulationIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_adaptiveModulationIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_modulationMin
*
* Callback function for getting the value of the modulationMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_modulationMin(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_modulationMax
*
* Callback function for getting the value of the modulationMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_modulationMax(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_xpicIsOn
*
* Callback function for getting the value of the xpicIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_xpicIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_mimoIsOn
*
* Callback function for getting the value of the mimoIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_mimoIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_alicIsOn
*
* Callback function for getting the value of the alicIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_alicIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_atpcIsOn
*
* Callback function for getting the value of the atpcIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_atpcIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_atpcThreshUpper
*
* Callback function for getting the value of the atpcThreshUpper leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_atpcThreshUpper(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_atpcThreshLower
*
* Callback function for getting the value of the atpcThreshLower leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_atpcThreshLower(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectIsOn
*
* Callback function for getting the value of the autoFreqSelectIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectRange
*
* Callback function for getting the value of the autoFreqSelectRange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_autoFreqSelectRange(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_modulationIsOn
*
* Callback function for getting the value of the modulationIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_modulationIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_encryptionIsOn
*
* Callback function for getting the value of the encryptionIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_encryptionIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_cryptographicKey
*
* Callback function for getting the value of the cryptographicKey leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_cryptographicKey(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_loopBackIsOn
*
* Callback function for getting the value of the loopBackIsOn leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_loopBackIsOn(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_airInterfaceConfiguration_maintenanceTimer
*
* Callback function for getting the value of the maintenanceTimer leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_airInterfaceConfiguration_maintenanceTimer(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key for finding the information
	 */

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_class_valueName
*
* Callback function for getting the value of the valueName leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_class_valueName(val_value_t *element)
{
	val_value_t* grandParentDoingAttach = element->parent->parent;
	YUMA_ASSERT(NULL == grandParentDoingAttach, return NULL, "Could not find parent of parent element %s", element->name);

	if (strcmp(grandParentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_NetworkElement) == 0)
	{
		return cb_get_boot_time_NetworkElement_global_class_valueName(element);
	}
	else
	{
		return cb_get_boot_time_NetworkElement_global_class_valueName(element);
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_class_value
*
* Callback function for getting the value of the value leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_class_value(val_value_t *element)
{
	val_value_t* grandParentDoingAttach = element->parent->parent;
	YUMA_ASSERT(NULL == grandParentDoingAttach, return NULL, "Could not find parent of parent element %s", element->name);

	if (strcmp(grandParentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_NetworkElement) == 0)
	{
		return cb_get_boot_time_NetworkElement_global_class_value(element);
	}
	else
	{
		return cb_get_boot_time_NetworkElement_global_class_value(element);
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_global_class_valueName
*
* Callback function for getting the value of the valueName leaf for the global class
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_global_class_valueName(val_value_t *element)
{
	return "vName";
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_global_class_value
*
* Callback function for getting the value of the value leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_global_class_value(val_value_t *element)
{
	val_value_t* parentDoingAttach = element->parent;
	YUMA_ASSERT(NULL == parentDoingAttach, return NULL, "Could not find parent element %s", element->name);

	if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_nameList) == 0)
	{
		return "NE_Name1";
	}
	else if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_labelList) == 0)
	{
		return "label_1";
	}
	else if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_extensionList) == 0)
	{
		return "extension_1";
	}
	else if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_localIdList) == 0)
	{
		return "localId_1";
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_state_pac_operationalState
*
* Callback function for getting the value of the operationalState leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_state_pac_operationalState(val_value_t *element)
{
	val_value_t* parentDoingAttach = element->parent;
	YUMA_ASSERT(NULL == parentDoingAttach, return NULL, "Could not find parent element %s", element->name);

	if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_NetworkElement) == 0)
	{
		return "ENABLED";
	}
	else if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N__lpList) == 0)
	{
		return "DISABLED";
	}

	return "ENABLED";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_state_pac_administrativeControl
*
* Callback function for getting the value of the administrativeControl leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_state_pac_administrativeControl(val_value_t *element)
{
	val_value_t* parentDoingAttach = element->parent;
	YUMA_ASSERT(NULL == parentDoingAttach, return NULL, "Could not find parent element %s", element->name);

	if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_NetworkElement) == 0)
	{
		return "UNLOCK";
	}

	return "UNLOCK";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_state_pac_administrativeState
*
* Callback function for getting the value of the administrativeState leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_state_pac_administrativeState(val_value_t *element)
{
	val_value_t* parentDoingAttach = element->parent;
	YUMA_ASSERT(NULL == parentDoingAttach, return NULL, "Could not find parent element %s", element->name);

	if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_NetworkElement) == 0)
	{
		return "UNLOCKED";
	}

	return "UNLOCKED";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_state_pac_lifecycleState
*
* Callback function for getting the value of the lifecycleState leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_state_pac_lifecycleState(val_value_t *element)
{
	val_value_t* parentDoingAttach = element->parent;
	YUMA_ASSERT(NULL == parentDoingAttach, return NULL, "Could not find parent element %s", element->name);

	if (strcmp(parentDoingAttach->name, y_CoreModel_CoreNetworkModule_ObjectClasses_N_NetworkElement) == 0)
	{
		return "INSTALLED";
	}

	return "INSTALLED";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_all_server_ltp_ref_leaf_list_elements_for_ltp
*
* Get an array representing the elements of the _serverLtpRefList list
*
* INPUTS:
* ltp_uuid - the UUID of the LTP for which we want its server_ltp_ref_leaf_list
* OUTPUTS:
* char** server_ltp_ref_leaf_list - an array of strings containing the list of elements
* int* num_of_elements - the number of elements found
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_server_ltp_ref_leaf_list_elements_for_ltp(char* ltp_uuid, char** server_ltp_ref_leaf_list, int* num_of_elements)
{
	*num_of_elements = 0;

	/*
	 * fill in the actual values for the _serverLtpRefList list here. E.g.:
	 */

	char server_uuid[256];

	strcpy(server_uuid, "uuid1");

	server_ltp_ref_leaf_list[*num_of_elements] = (char*) malloc(strlen(server_uuid) + 1);
	YUMA_ASSERT(server_ltp_ref_leaf_list[*num_of_elements] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(server_ltp_ref_leaf_list[*num_of_elements], server_uuid);

	*num_of_elements += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_client_ltp_ref_leaf_list_elements_for_ltp
*
* Get an array representing the elements of the _clientLtpRefList list
*
* INPUTS:
* ltp_uuid - the UUID of the LTP for which we want its client_ltp_ref_leaf_list
* OUTPUTS:
* char** client_ltp_ref_leaf_list - an array of strings containing the list of elements
* int* num_of_elements - the number of elements found
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_client_ltp_ref_leaf_list_elements_for_ltp(char* ltp_uuid, char** client_ltp_ref_leaf_list, int* num_of_elements)
{
	*num_of_elements = 0;

	/*
	 * fill in the actual values for the _clientLtpRefList list here. E.g.:
	 */

	char client_uuid[256];

	strcpy(client_uuid, "uuid2");

	client_ltp_ref_leaf_list[*num_of_elements] = (char*) malloc(strlen(client_uuid) + 1);
	YUMA_ASSERT(client_ltp_ref_leaf_list[*num_of_elements] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(client_ltp_ref_leaf_list[*num_of_elements], client_uuid);

	*num_of_elements += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_ltp_ref_leaf_list_elements_for_ltp
*
* Get an array representing the elements of the _ltpRefList list
*
* INPUTS:
* ltp_uuid - the UUID of the LTP for which we want its ltp_ref_leaf_list
* OUTPUTS:
* char** ltp_ref_leaf_list - an array of strings containing the list of elements
* int* num_of_elements - the number of elements found
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ltp_ref_leaf_list_elements_for_ltp(char* ltp_uuid, char** ltp_ref_leaf_list, int* num_of_elements)
{
	*num_of_elements = 0;

	/*
	 * fill in the actual values for the _ltpRefList list here. E.g.:
	 */

	char ltp_ref_uuid[256];

	strcpy(ltp_ref_uuid, "uuid2");

	ltp_ref_leaf_list[*num_of_elements] = (char*) malloc(strlen(ltp_ref_uuid) + 1);
	YUMA_ASSERT(ltp_ref_leaf_list[*num_of_elements] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(ltp_ref_leaf_list[*num_of_elements], ltp_ref_uuid);

	*num_of_elements += 1;

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_ltpRefList_connectedLtpRef
*
* Callback function for getting the value of the _connectedLtpRef leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_ltpRefList_connectedLtpRef(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *uuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	uuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == uuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(uuidKey), return NULL, "Could not access value of the key %s for element %s", uuidKey->name, element->name);

	if (strcmp(VAL_STRING(uuidKey), "uuid2") == 0)
	{
		return "uuid15";
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_ltpRefList_peerLtpRef
*
* Callback function for getting the value of the _peerLtpRef leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_ltpRefList_peerLtpRef(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *uuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	uuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == uuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(uuidKey), return NULL, "Could not access value of the key %s for element %s", uuidKey->name, element->name);

	if (strcmp(VAL_STRING(uuidKey), "uuid2") == 0)
	{
		return "uuid15";
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_ltpRefList_physicalPortReference
*
* Callback function for getting the value of the physicalPortReference leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_ltpRefList_physicalPortReference(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *uuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	uuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == uuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(uuidKey), return NULL, "Could not access value of the key %s for element %s", uuidKey->name, element->name);

	return "reference1";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_ltpRefList_ltpDirection
*
* Callback function for getting the value of the ltpDirection leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_ltpRefList_ltpDirection(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *uuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	uuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == uuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(uuidKey), return NULL, "Could not access value of the key %s for element %s", uuidKey->name, element->name);

	return "BIDIRECTIONAL";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_lpList_layerProtocolName
*
* Callback function for getting the value of the layerProtocolName leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_lpList_layerProtocolName(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *ltpUuidKey = NULL;
	val_value_t *lpUuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	ltpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);
	lpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == ltpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(ltpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);
	YUMA_ASSERT(NULL == lpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(lpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);

	return "layerProtocolName1";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_lpList_configuredClientCapacity
*
* Callback function for getting the value of the configuredClientCapacity leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_lpList_configuredClientCapacity(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *ltpUuidKey = NULL;
	val_value_t *lpUuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	ltpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);
	lpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == ltpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(ltpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);
	YUMA_ASSERT(NULL == lpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(lpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);

	return "1000 kbps";

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_lpList_lpDirection
*
* Callback function for getting the value of the lpDirection leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_lpList_lpDirection(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *ltpUuidKey = NULL;
	val_value_t *lpUuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	ltpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);
	lpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == ltpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(ltpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);
	YUMA_ASSERT(NULL == lpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(lpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);

	if (strcmp(VAL_STRING(lpUuidKey), "uuid3") == 0)
	{
		return "BIDIRECTIONAL";
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_boot_time_NetworkElement_lpList_terminationState
*
* Callback function for getting the value of the terminationState leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static const char* cb_get_boot_time_NetworkElement_lpList_terminationState(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *ltpUuidKey = NULL;
	val_value_t *lpUuidKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	ltpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);
	lpUuidKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == ltpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(ltpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);
	YUMA_ASSERT(NULL == lpUuidKey, return NULL, "Could not find uuidKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(lpUuidKey), return NULL, "Could not access value of the key %s for element %s", ltpUuidKey->name, element->name);

	if (strcmp(VAL_STRING(lpUuidKey), "uuid3") == 0)
	{
		return "true";
	}

	return NULL;
}
