/*
 * callbacks_MicrowaveModel-ObjectClasses-MwConnection.c
 *
 *  Created on: Mar 22, 2016
 *      Author: compila
 */

#include "callbacks_MicrowaveModel-ObjectClasses-MwConnection.h"

/*
 * cb_get_all_air_interface_pac_keys
 * Returns all key elements (layerProtocol) of the MW_AirInterface_Pac list, along with their number
 */
status_t cb_get_all_air_interface_pac_keys(xmlChar** air_interface_pac_keys_list, int* num_of_keys)
{
	*num_of_keys = 0;

	xmlChar layerProtocol[256];
	xmlChar layerProtocolString[256];

	strcpy(layerProtocolString, "ifIndex1");
	strcpy(layerProtocol, LP_MWPS_PREFIX);
	strcat(layerProtocol, layerProtocolString);

	air_interface_pac_keys_list[*num_of_keys] = (xmlChar*) malloc(strlen(layerProtocol) + 1);
	YUMA_ASSERT(air_interface_pac_keys_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_pac_keys_list[*num_of_keys], layerProtocol);

	*num_of_keys += 1;

	strcpy(layerProtocolString, "ifIndex2");
	strcpy(layerProtocol, LP_MWPS_PREFIX);
	strcat(layerProtocol, layerProtocolString);

	air_interface_pac_keys_list[*num_of_keys] = (xmlChar*) malloc(strlen(layerProtocol) + 1);
	YUMA_ASSERT(air_interface_pac_keys_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_pac_keys_list[*num_of_keys], layerProtocol);

	*num_of_keys += 1;

	return NO_ERR;
}

/*
 * cb_get_all_air_interface_capability_keys_for_layer_protocol
 * Returns all key elements (airInterfaceID) of the airInterfaceCapabilityList list, along with their number, for a specific layerProtocol key
 */
status_t cb_get_all_air_interface_capability_keys_for_layer_protocol(const xmlChar* layer_protocol_key, xmlChar** air_interface_capability_key_list, int* num_of_keys)
{
	*num_of_keys = 0;

	air_interface_capability_key_list[*num_of_keys] = (xmlChar*) malloc(strlen("air_intf_id1") + 1);
	YUMA_ASSERT(air_interface_capability_key_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_capability_key_list[*num_of_keys], "air_intf_id1");

	*num_of_keys += 1;

	air_interface_capability_key_list[*num_of_keys] = (xmlChar*) malloc(strlen("air_intf_id2") + 1);
	YUMA_ASSERT(air_interface_capability_key_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_capability_key_list[*num_of_keys], "air_intf_id2");

	*num_of_keys += 1;

	return NO_ERR;
}

/*
 * cb_get_all_air_interface_capability_script_list_keys
 * Returns all key elements (scriptID) of the scriptList list, along with their number, for a specific airInterfaceID
 */
status_t cb_get_all_air_interface_capability_script_list_keys(xmlChar** air_interface_capability_script_list_key_list, int* num_of_keys)
{
	*num_of_keys = 0;

	air_interface_capability_script_list_key_list[*num_of_keys] = (xmlChar*) malloc(strlen("1204") + 1);
	YUMA_ASSERT(air_interface_capability_script_list_key_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_capability_script_list_key_list[*num_of_keys], "1204");

	*num_of_keys += 1;

	air_interface_capability_script_list_key_list[*num_of_keys] = (xmlChar*) malloc(strlen("1205") + 1);
	YUMA_ASSERT(air_interface_capability_script_list_key_list[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_capability_script_list_key_list[*num_of_keys], "1205");

	*num_of_keys += 1;

	return NO_ERR;
}

/*
 * cb_get_all_structure_pac_keys
 * Returns all key elements (layerProtocol) of the MW_Structure_Pac list, along with their number
 * For the moment, since we have a 1:1 relationship with the MW_AirInterface_Pac, we just call that function.
 */
status_t cb_get_all_structure_pac_keys(xmlChar** structure_pac_keys_list, int* num_of_structure_pac_keys)
{
	*num_of_structure_pac_keys = 0;

	xmlChar layerProtocol[256] = {0};
	xmlChar layerProtocolString[256] = {0};

	strcpy(layerProtocolString, "ifIndex1");
	strcpy(layerProtocol, LP_MWS_PREFIX);
	strcat(layerProtocol, layerProtocolString);

	structure_pac_keys_list[*num_of_structure_pac_keys] = (xmlChar*) malloc(strlen(layerProtocol) + 1);
	YUMA_ASSERT(structure_pac_keys_list[*num_of_structure_pac_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(structure_pac_keys_list[*num_of_structure_pac_keys], layerProtocol);

	*num_of_structure_pac_keys += 1;

	strcpy(layerProtocolString, "ifIndex2");
	strcpy(layerProtocol, LP_MWS_PREFIX);
	strcat(layerProtocol, layerProtocolString);

	structure_pac_keys_list[*num_of_structure_pac_keys] = (xmlChar*) malloc(strlen(layerProtocol) + 1);
	YUMA_ASSERT(structure_pac_keys_list[*num_of_structure_pac_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(structure_pac_keys_list[*num_of_structure_pac_keys], layerProtocol);

	*num_of_structure_pac_keys += 1;

	return NO_ERR;
}

/*
 * cb_get_all_container_pac_keys
 * Returns all key elements (layerProtocol) of the MW_Container_Pac list, along with their number
 */
status_t cb_get_all_container_pac_keys(xmlChar** container_pac_keys_list, int* num_of_container_pac_keys)
{
	*num_of_container_pac_keys = 0;

	xmlChar layerProtocol[256] = {0};
	xmlChar layerProtocolString[256] = {0};

	strcpy(layerProtocolString, "multiRadioIfIndex1");
	strcpy(layerProtocol, LP_ETH_CTP_PREFIX);
	strcat(layerProtocol, layerProtocolString);

	container_pac_keys_list[*num_of_container_pac_keys] = (xmlChar*) malloc(strlen(layerProtocol) + 1);
	YUMA_ASSERT(container_pac_keys_list[*num_of_container_pac_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(container_pac_keys_list[*num_of_container_pac_keys], layerProtocol);

	*num_of_container_pac_keys += 1;

	return NO_ERR;
}

/*
 * Get the airInterfaceName attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_air_interface_configuration_air_interface_name(xmlChar* air_interface_pac_key, xmlChar** air_interface_name)
{
	xmlChar* airIntName = "AirIntfName";

	*air_interface_name = (xmlChar*) malloc(strlen(airIntName) + 1);
	YUMA_ASSERT(*air_interface_name == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*air_interface_name, airIntName);

	return NO_ERR;
}

/*
 * Get the radioSignalId attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_air_interface_configuration_radio_signal_id(xmlChar* air_interface_pac_key, xmlChar** radio_signal_id)
{
	xmlChar* radioSignalId;
	xmlChar readAttribute[128];
	xmlChar buffer[256];
	int radioSigId = 0, n = 0, found = 0;

    FILE *fp = NULL;

    fp = fopen("/home/compila/app/poc2-md/yang-modules/mediatorConfig.txt", "r+");

    if (fp != NULL)
    {
    	*radio_signal_id = (xmlChar*) malloc(20 + 1);
    	YUMA_ASSERT(*radio_signal_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

    	while (! feof(fp))
    	{
    		fgets(buffer, 256, fp);
    		n = sscanf(buffer, "radioSignalId: %s %d", &readAttribute, &radioSigId);
    		if (n == 2)
    		{
				if (strcmp(readAttribute, air_interface_pac_key) == 0)
				{
					sprintf(*radio_signal_id, "%d", radioSigId);
					found = 1;
					break;
				}
    		}
    	}
    	fclose(fp);
    }
    else
    {
    	if (found == 0) //nothing found in the config file
		{
			sprintf(*radio_signal_id, "0");
		}
    	YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "Failed to get the radioSignalId! Config file not found! /home/compila/app/poc2-md/yang-modules/mediatorConfig.txt missing!");
    }

	return NO_ERR;
}

/*
 * Get the txFrequency attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_configuration_tx_frequency(xmlChar* air_interface_pac_key, xmlChar** tx_frequency_string)
{
	xmlChar txFreqStr[] = "12345";

	*tx_frequency_string = (xmlChar*) malloc(strlen(txFreqStr) + 1);
	YUMA_ASSERT(*tx_frequency_string == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*tx_frequency_string, txFreqStr);

	return NO_ERR;
}

/*
 * Get the rFrequency attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_configuration_rx_frequency(xmlChar* air_interface_pac_key, xmlChar** rx_frequency_string)
{
	xmlChar* rxFreqStr = "54321";

	*rx_frequency_string = (xmlChar*) malloc(strlen(rxFreqStr) + 1);
	YUMA_ASSERT(*rx_frequency_string == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*rx_frequency_string, rxFreqStr);

	return NO_ERR;
}

/*
 * Get the txChannelBandwidth attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_configuration_tx_channel_bandwidth(xmlChar* air_interface_pac_key, xmlChar** tx_channel_bandwidth)
{
	xmlChar* txChannelBandwidth = "28000";

	*tx_channel_bandwidth = (xmlChar*) malloc(strlen(txChannelBandwidth) + 1);
	YUMA_ASSERT(*tx_channel_bandwidth == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*tx_channel_bandwidth, txChannelBandwidth);

	return NO_ERR;
}

/*
 * Get the rxChannelBandwidth attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_configuration_rx_channel_bandwidth(xmlChar* air_interface_pac_key, xmlChar** rx_channel_bandwidth)
{
	xmlChar* rxChannelBandwidth = "28000";

	*rx_channel_bandwidth = (xmlChar*) malloc(strlen(rxChannelBandwidth) + 1);
	YUMA_ASSERT(*rx_channel_bandwidth == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*rx_channel_bandwidth, rxChannelBandwidth);

	return NO_ERR;
}

/*
 * Get the powerIsOn attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_air_interface_configuration_power_is_on(xmlChar* air_interface_pac_key, xmlChar** power_is_on)
{
	xmlChar* powerIsOn = "true";

	*power_is_on = (xmlChar*) malloc(strlen(powerIsOn) + 1);
	YUMA_ASSERT(*power_is_on == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*power_is_on, powerIsOn);

	return NO_ERR;
}

/*
 * Get the transmitterIsOn attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_air_interface_configuration_transmitter_is_on(xmlChar* air_interface_pac_key, xmlChar** transmitter_is_on)
{
	xmlChar* transmitterIsOn = "true";

	*transmitter_is_on = (xmlChar*) malloc(strlen(transmitterIsOn) + 1);
	YUMA_ASSERT(*transmitter_is_on == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*transmitter_is_on, transmitterIsOn);

	return NO_ERR;
}

/*
 * Get the txPower attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a int64
 */
status_t cb_get_air_interface_configuration_tx_power(xmlChar* air_interface_pac_key, xmlChar** tx_power)
{
	xmlChar* txPower = "3";

	*tx_power = (xmlChar*) malloc(strlen(txPower) + 1);
	YUMA_ASSERT(*tx_power == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*tx_power, txPower);

	return NO_ERR;
}

/*
 * Get the adaptiveModulationIsOn attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_air_interface_configuration_adaptive_modulation_is_on(xmlChar* air_interface_pac_key, xmlChar** adaptive_modulation_is_on)
{
	xmlChar* adaptiveModulationIsOn = "true";

	*adaptive_modulation_is_on = (xmlChar*) malloc(strlen(adaptiveModulationIsOn) + 1);
	YUMA_ASSERT(*adaptive_modulation_is_on == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*adaptive_modulation_is_on, adaptiveModulationIsOn);

	return NO_ERR;
}

/*
 * Get the modulationMin attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_configuration_modulation_min(xmlChar* air_interface_pac_key, xmlChar** modulation_min)
{
	xmlChar* modulationMin = "4";

	*modulation_min = (xmlChar*) malloc(strlen(modulationMin) + 1);
	YUMA_ASSERT(*modulation_min == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*modulation_min, modulationMin);

	return NO_ERR;
}

/*
 * Get the modulationMax attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_configuration_modulation_max(xmlChar* air_interface_pac_key, xmlChar** modulation_max)
{
	xmlChar* modulationMax = "1024";

	*modulation_max = (xmlChar*) malloc(strlen(modulationMax) + 1);
	YUMA_ASSERT(*modulation_max == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*modulation_max, modulationMax);

	return NO_ERR;
}

/*
 * Get the xpicIsOn attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_air_interface_configuration_xpic_is_on(xmlChar* air_interface_pac_key, xmlChar** xpic_is_on)
{
	xmlChar* xpicIsOn = "false";

	*xpic_is_on = (xmlChar*) malloc(strlen(xpicIsOn) + 1);
	YUMA_ASSERT(*xpic_is_on == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*xpic_is_on, xpicIsOn);

	return NO_ERR;
}

/*
 * Get the typeOfEquipment attribute for a specific airInterfaceID key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_air_interface_capabilities_type_of_equipment(xmlChar* air_interface_id_key, xmlChar** type_of_equipment)
{
	xmlChar* typeOfEquipment = "Microwave";

	*type_of_equipment = (xmlChar*) malloc(strlen(typeOfEquipment) + 1);
	YUMA_ASSERT(*type_of_equipment == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*type_of_equipment, typeOfEquipment);

	return NO_ERR;
}

/*
 * Get the supportedChannelPlans attribute for a specific airInterfaceID key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_air_interface_capabilities_supported_channel_plans(xmlChar* air_interface_id_key, xmlChar** supported_channel_plans)
{
	xmlChar* supportedChannelPlans = "ETSI";

	*supported_channel_plans = (xmlChar*) malloc(strlen(supportedChannelPlans) + 1);
	YUMA_ASSERT(*supported_channel_plans == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*supported_channel_plans, supportedChannelPlans);

	return NO_ERR;
}

/*
 * Get the txFrequencyMin attribute for a specific airInterfaceID key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_capabilities_tx_frequency_min(xmlChar* air_interface_id_key, xmlChar** tx_frequency_min)
{
	xmlChar* txFrequencyMin = "14750000";

	*tx_frequency_min = (xmlChar*) malloc(strlen(txFrequencyMin) + 1);
	YUMA_ASSERT(*tx_frequency_min == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*tx_frequency_min, txFrequencyMin);

	return NO_ERR;
}

/*
 * Get the txFrequencyMax attribute for a specific airInterfaceID key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_capabilities_tx_frequency_max(xmlChar* air_interface_id_key, xmlChar** tx_frequency_max)
{
	xmlChar* txFrequencyMax = "14830000";

	*tx_frequency_max = (xmlChar*) malloc(strlen(txFrequencyMax) + 1);
	YUMA_ASSERT(*tx_frequency_max == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*tx_frequency_max, txFrequencyMax);

	return NO_ERR;
}

/*
 * Get the rxFrequencyMin attribute for a specific airInterfaceID key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_capabilities_rx_frequency_min(xmlChar* air_interface_id_key, xmlChar** rx_frequency_min)
{
	xmlChar* rxFrequencyMin = "15130000";

	*rx_frequency_min = (xmlChar*) malloc(strlen(rxFrequencyMin) + 1);
	YUMA_ASSERT(*rx_frequency_min == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*rx_frequency_min, rxFrequencyMin);

	return NO_ERR;
}

/*
 * Get the rxFrequencyMax attribute for a specific airInterfaceID key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_capabilities_rx_frequency_max(xmlChar* air_interface_id_key, xmlChar** rx_frequency_max)
{
	xmlChar* rxFrequencyMax = "15250000";

	*rx_frequency_max = (xmlChar*) malloc(strlen(rxFrequencyMax) + 1);
	YUMA_ASSERT(*rx_frequency_max == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*rx_frequency_max, rxFrequencyMax);

	return NO_ERR;
}

/*
 * Get the adaptiveModulationIsAvail attribute for a specific airInterfaceID key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_air_interface_capabilities_adaptive_modulation_is_available(xmlChar* air_interface_id_key, xmlChar** adaptive_modulation_is_available)
{
	xmlChar* adaptiveModulationIsAvailable = "true";

	*adaptive_modulation_is_available = (xmlChar*) malloc(strlen(adaptiveModulationIsAvailable) + 1);
	YUMA_ASSERT(*adaptive_modulation_is_available == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*adaptive_modulation_is_available, adaptiveModulationIsAvailable);

	return NO_ERR;
}

/*
 * Get the channelBandwidth attribute for a specific scriptID key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_capabilities_script_channel_bandwidth(xmlChar* script_id_key, xmlChar** channel_bandwidth)
{
	xmlChar* channelBandwidth;

	if (strcmp(script_id_key, "1204") == 0)
	{
		channelBandwidth = "28000";
	}
	else if (strcmp(script_id_key, "1205") == 0)
	{
		channelBandwidth = "56000";
	}

	*channel_bandwidth = (xmlChar*) malloc(strlen(channelBandwidth) + 1);
	YUMA_ASSERT(*channel_bandwidth == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*channel_bandwidth, channelBandwidth);

	return NO_ERR;
}

/*
 * Get the modulationScheme attribute for a specific scriptID key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_air_interface_capabilities_script_modulation_scheme(xmlChar* script_id_key, xmlChar** modulation_scheme)
{
	xmlChar* modulationScheme;

	if (strcmp(script_id_key, "1204") == 0)
	{
		modulationScheme = "256";
	}
	else if (strcmp(script_id_key, "1205") == 0)
	{
		modulationScheme = "1024";
	}

	*modulation_scheme = (xmlChar*) malloc(strlen(modulationScheme) + 1);
	YUMA_ASSERT(*modulation_scheme == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*modulation_scheme, modulationScheme);

	return NO_ERR;
}

/*
 * Get the txPowerMin attribute for a specific scriptID key
 * We pass the value as string, but it needs to represent an int64
 */
status_t cb_get_air_interface_capabilities_script_tx_power_min(xmlChar* script_id_key, xmlChar** tx_power_min)
{
	xmlChar* txPowerMin = "2";

	*tx_power_min = (xmlChar*) malloc(strlen(txPowerMin) + 1);
	YUMA_ASSERT(*tx_power_min == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*tx_power_min, txPowerMin);

	return NO_ERR;
}

/*
 * Get the txPowerMax attribute for a specific scriptID key
 * We pass the value as string, but it needs to represent an int64
 */
status_t cb_get_air_interface_capabilities_script_tx_power_max(xmlChar* script_id_key, xmlChar** tx_power_max)
{
	xmlChar* txPowerMax = "24";

	*tx_power_max = (xmlChar*) malloc(strlen(txPowerMax) + 1);
	YUMA_ASSERT(*tx_power_max == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*tx_power_max, txPowerMax);

	return NO_ERR;
}

/*
 * Get the xpicIsAvail attribute for a specific scriptID key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_air_interface_capabilities_script_xpic_is_avail(xmlChar* script_id_key, xmlChar** xpic_is_avail)
{
	xmlChar* xpicIsAvail = "false";

	*xpic_is_avail = (xmlChar*) malloc(strlen(xpicIsAvail) + 1);
	YUMA_ASSERT(*xpic_is_avail == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*xpic_is_avail, xpicIsAvail);

	return NO_ERR;
}

/*
 * Get the txFrequencyCur attribute for a specific layerProtocol key
 */
status_t cb_get_air_interface_status_tx_frequency_cur(xmlChar* air_interface_pac_key, uint64* tx_frequency_cur)
{
	*tx_frequency_cur = 14800000;

	return NO_ERR;
}

/*
 * Get the rxFrequencyCur attribute for a specific layerProtocol key
 */
status_t cb_get_air_interface_status_rx_frequency_cur(xmlChar* air_interface_pac_key, uint64* rx_frequency_cur)
{
	*rx_frequency_cur = 15100000;

	return NO_ERR;
}

/*
 * Get the txLevelCur attribute for a specific layerProtocol key
 */
status_t cb_get_air_interface_status_tx_level_cur(xmlChar* air_interface_pac_key, int64* tx_level_cur)
{
	*tx_level_cur = -40;

	return NO_ERR;
}

/*
 * Get the rxLevelCur attribute for a specific layerProtocol key
 */
status_t cb_get_air_interface_status_rx_level_cur(xmlChar* air_interface_pac_key, int64* rx_level_cur)
{
	*rx_level_cur = -41;

	return NO_ERR;
}

/*
 * Get the snrCur attribute for a specific layerProtocol key
 */
status_t cb_get_air_interface_status_snr_cur(xmlChar* air_interface_pac_key, int64* snr_cur)
{
	*snr_cur = -42;

	return NO_ERR;
}

/*
 * Get the linkIsUp attribute for a specific layerProtocol key
 */
status_t cb_get_air_interface_status_link_is_up(xmlChar* air_interface_pac_key, boolean* link_is_up)
{
	*link_is_up = TRUE;

	return NO_ERR;
}

/*
 * Get the xpicIsUp attribute for a specific layerProtocol key
 */
status_t cb_get_air_interface_status_xpic_is_up(xmlChar* air_interface_pac_key, boolean* xpic_is_up)
{
	*xpic_is_up = TRUE;

	return NO_ERR;
}

/*
 * cb_get_all_air_interface_current_problems_for_layer_protocol_key
 * Returns all problemList elements of the airInterfaceCurrentProblemList container, along with their number, for a specific layerProtocol key
 */
status_t cb_get_all_air_interface_current_problems_for_layer_protocol_key(const xmlChar* air_interface_pac_key, xmlChar** air_interface_current_problems_list, int* num_of_problems)
{
	*num_of_problems = 0;

	air_interface_current_problems_list[*num_of_problems] = (xmlChar*) malloc(strlen("Alarm: LOF on Radio") + 1);
	YUMA_ASSERT(air_interface_current_problems_list[*num_of_problems] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_current_problems_list[*num_of_problems], "Alarm: LOF on Radio");

	*num_of_problems += 1;

	air_interface_current_problems_list[*num_of_problems] = (xmlChar*) malloc(strlen("Alarm: Cable open") + 1);
	YUMA_ASSERT(air_interface_current_problems_list[*num_of_problems] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(air_interface_current_problems_list[*num_of_problems], "Alarm: Cable open");

	*num_of_problems += 1;

	return NO_ERR;
}

/*
 * Get the serverID attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_structure_configuration_server_id(xmlChar* structure_pac_key, xmlChar** server_id)
{
	xmlChar* serverId = "serverID";

	*server_id = (xmlChar*) malloc(strlen(serverId) + 1);
	YUMA_ASSERT(*server_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*server_id, serverId);

	return NO_ERR;
}

/*
 * Get the structureID attribute for a specific layerProtocol key
 */
status_t cb_get_structure_capability_structure_id(xmlChar* structure_pac_key, xmlChar** structure_id)
{
	*structure_id = (xmlChar*) malloc(strlen(structure_pac_key) + 1);
	YUMA_ASSERT(*structure_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*structure_id, structure_pac_key);

	return NO_ERR;
}

status_t cb_get_maximum_capacity_of_the_interface(xmlChar* structure_pac_key, uint64* maximumBitrate)
{
	*maximumBitrate = 360000; //360 Mbps

	return NO_ERR;
}

status_t cb_get_current_capacity_of_the_interface(xmlChar* structure_pac_key, uint64* currentBitrate)
{
	*currentBitrate = 300000; //300 Mbps

	return NO_ERR;
}

status_t cb_get_structure_capability_current_number_of_timeslots(xmlChar* structure_pac_key, uint64* currentNumberOfTimeSlots)
{
	status_t res = NO_ERR;
	uint64 currentBitrate = 0;

	res = cb_get_current_capacity_of_the_interface(structure_pac_key, &currentBitrate);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not get cb_get_current_capacity_of_the_interface for key=%s", structure_pac_key);

	*currentNumberOfTimeSlots = currentBitrate / TIME_SLOT_CAPACITY;

	return NO_ERR;
}

/*
 * Get the totalNumberOfTimeSlots attribute for a specific layerProtocol key
 */
status_t cb_get_structure_capability_total_number_of_timeslots(xmlChar* const structure_pac_key, uint64* totalNumberOfTimeSlots)
{
	status_t res = NO_ERR;
	uint64 maxBitrate = 0;

	res = cb_get_maximum_capacity_of_the_interface(structure_pac_key, &maxBitrate);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not get cb_get_maximum_capacity_of_the_interface for key=%s", structure_pac_key);

	*totalNumberOfTimeSlots = maxBitrate / TIME_SLOT_CAPACITY;

	return NO_ERR;
}

/*
 * Get the timeSlotCapacity attribute for a specific layerProtocol key
 */
status_t cb_get_structure_capability_time_slot_capacity(xmlChar* structure_pac_key, uint64* timeSlotCapacity)
{
	*timeSlotCapacity = TIME_SLOT_CAPACITY;

	return NO_ERR;
}

/*
 * cb_get_all_structure_status_time_slot_status_keys_for_layer_protocol_key
 * Returns all key elements (structureID.timeSlotID) of the timeSlotStatusList list, along with their number, for a specific layerProtocol key
 */
status_t cb_get_all_structure_status_time_slot_status_keys_for_layer_protocol_key(const xmlChar* structure_pac_key, xmlChar** air_structure_status_time_slot_status_key_list, int* num_of_time_slots)
{
	status_t res = NO_ERR;
	int i;

	YUMA_ASSERT(num_of_time_slots == NULL, return ERR_INTERNAL_MEM, "NULL Pointer");

	res = cb_get_structure_capability_total_number_of_timeslots(structure_pac_key, num_of_time_slots);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_MEM, "Could not cb_get_structure_capability_total_number_of_timeslots!");

	for (i = 0; i<*num_of_time_slots; ++i)
	{
		xmlChar key[128], index[10];
		strcpy(key, structure_pac_key);
		strcat(key, ".");
		sprintf(index, "%d", i + 1);
		strcat(key, index);

		air_structure_status_time_slot_status_key_list[i] = (xmlChar*) malloc(strlen(key) + 1);
		YUMA_ASSERT(air_structure_status_time_slot_status_key_list[i] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		strcpy(air_structure_status_time_slot_status_key_list[i], key);
	}

	return NO_ERR;
}

/*
 * Get the structureID attribute for a specific timeSlotStatusList key
 */
status_t cb_get_structure_status_time_slot_status_list_structure_id(xmlChar* air_structure_status_time_slot_status_key_list_entry, xmlChar** structure_id)
{
	xmlChar* structureIdCopy = strdup(air_structure_status_time_slot_status_key_list_entry);
	YUMA_ASSERT(structureIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	xmlChar* structureId = strtok(structureIdCopy, ".");
	YUMA_ASSERT(structureId == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	*structure_id = (xmlChar*) malloc(strlen(structureId) + 1);
	YUMA_ASSERT(*structure_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*structure_id, structureId);

	free(structureIdCopy);

	return NO_ERR;
}

/*
 * Get the timeSlotID attribute for a specific timeSlotStatusList key
 */
status_t cb_get_structure_status_time_slot_status_list_time_slot_id(xmlChar* air_structure_status_time_slot_status_key_list_entry, xmlChar** time_slot_id)
{
	xmlChar* timeSlotIdCopy = strdup(air_structure_status_time_slot_status_key_list_entry);
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	xmlChar* timeSlotId = strtok(timeSlotIdCopy, ".");
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	timeSlotId = strtok(NULL, ".");
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	*time_slot_id = (xmlChar*) malloc(strlen(timeSlotId) + 1);
	YUMA_ASSERT(*time_slot_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*time_slot_id, timeSlotId);

	free(timeSlotIdCopy);

	return NO_ERR;
}

/*
 * Get the operationalStatus attribute for a specific timeSlotStatusList key
 * OperationalState needs to be ENABLED or DISABLED, as defined in CoreModel-CoreFoundationModule-StateModel
 */
status_t cb_get_structure_status_time_slot_status_list_operational_status(xmlChar* air_structure_status_time_slot_status_key_list_entry, xmlChar** operational_status)
{
	status_t res = NO_ERR;

	xmlChar* timeSlotIdCopy = strdup(air_structure_status_time_slot_status_key_list_entry);
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	xmlChar* timeSlotId = strtok(timeSlotIdCopy, ".");
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	timeSlotId = strtok(NULL, ".");
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	int timeSlotIdInt;

	int result = sscanf(timeSlotId, "%d", &timeSlotIdInt);
	YUMA_ASSERT(result != 1, return ERR_INTERNAL_VAL, "Could not get the timeSlotValue from string=%s!", timeSlotId);

	xmlChar* operationalStatus[10];
	uint64 num_of_current_time_slots;
	res = cb_get_structure_capability_current_number_of_timeslots(air_structure_status_time_slot_status_key_list_entry, &num_of_current_time_slots);

	if (timeSlotIdInt <= num_of_current_time_slots)
	{
		strcpy(operationalStatus, "ENABLED");
	}
	else
	{
		strcpy(operationalStatus, "DISABLED");
	}

	*operational_status = (xmlChar*) malloc(strlen(operationalStatus) + 1);
	YUMA_ASSERT(*operational_status == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*operational_status, operationalStatus);

	free(timeSlotIdCopy);

	return NO_ERR;
}

/*
 * Get the containerID attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_container_capability_container_id(xmlChar* container_pac_key, xmlChar** container_id)
{
	*container_id = (xmlChar*) malloc(strlen(container_pac_key) + 1);
	YUMA_ASSERT(*container_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*container_id, container_pac_key);

	return NO_ERR;
}

/*
 * Get the containerName attribute for a specific uuid key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_container_capability_container_name(xmlChar* container_uuid_key, xmlChar** container_name)
{
	xmlChar* containerName = "Ethernet";

	*container_name = (xmlChar*) malloc(strlen(containerName) + 1);
	YUMA_ASSERT(*container_name == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*container_name, containerName);

	return NO_ERR;
}

/*
 * Get the numberOfTimeSlotsRequired attribute for a specific uuid key
 * We pass the value as string, but it needs to represent an uint64
 */
status_t cb_get_container_capability_number_of_time_slots_required(xmlChar* containerName , xmlChar** number_of_time_slots_required)
{
	xmlChar* numberOfTimeSlotsRequired = "0";

	*number_of_time_slots_required = (xmlChar*) malloc(strlen(numberOfTimeSlotsRequired) + 1);
	YUMA_ASSERT(*number_of_time_slots_required == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*number_of_time_slots_required, numberOfTimeSlotsRequired);

	return NO_ERR;
}

/*
 * Get the bundlingIsAvail attribute for a specific uuid key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_container_capability_bundling_is_avail(xmlChar* containerName , xmlChar** bundling_is_avail)
{
	xmlChar* bundlingIsAvail = "true";

	*bundling_is_avail = (xmlChar*) malloc(strlen(bundlingIsAvail) + 1);
	YUMA_ASSERT(*bundling_is_avail == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*bundling_is_avail, bundlingIsAvail);

	return NO_ERR;
}

/*
 * Get the uuid attribute for a specific layer protocol key
 * We pass the value as string, but it needs to represent a boolean
 */
status_t cb_get_container_configuration_uuid(xmlChar* container_pac_key, xmlChar** uuid)
{
	*uuid = (xmlChar*) malloc(strlen(container_pac_key) + 1);
	YUMA_ASSERT(*uuid == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*uuid, container_pac_key);

	return NO_ERR;
}

/*
 * cb_get_all_container_capabilities_available_kinds_of_containers_keys_for_layer_protocol_key
 * Returns all key elements (uuid) of the availableKindsOfContainerList  list, along with their number, for a specific layerProtocol key
 */
status_t cb_get_all_container_capabilities_available_kinds_of_containers_keys_for_layer_protocol_key(const xmlChar* container_pac_key, xmlChar** container_type_keys, int* num_of_keys)
{
	*num_of_keys = 0;

	container_type_keys[*num_of_keys] = (xmlChar*) malloc(strlen(container_pac_key) + 1);
	YUMA_ASSERT(container_type_keys[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(container_type_keys[*num_of_keys], container_pac_key);

	*num_of_keys += 1;

	return NO_ERR;
}

/*
 * cb_get_container_configuration_time_slot_id_keys_for_layer_protocol_key
 * Returns all key elements (structureID.timeSlotID) of the timeSlotIDList list, along with their number, for a specific layerProtocol key
 */
status_t cb_get_container_configuration_time_slot_id_keys_for_layer_protocol_key(const xmlChar* container_pac_key, xmlChar** container_configuration_time_slot_id_keys, int* num_of_keys)
{
	status_t res = NO_ERR;
    xmlChar* structure_pac_keys_list[MAX_NUMBER_OF_STRUCTURE_PAC] = {0};
	int num_of_structure_pac_keys = 0, num_of_time_slots = 0;
	int i, j;
	*num_of_keys = 0;

	res = cb_get_all_structure_pac_keys(structure_pac_keys_list, &num_of_structure_pac_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not cb_get_all_structure_pac_keys!");

	for (i = 0; i<num_of_structure_pac_keys; i++)
	{
		xmlChar* structure_pac_key_entry = strdup(structure_pac_keys_list[i]);

		res = cb_get_structure_capability_total_number_of_timeslots(structure_pac_key_entry, &num_of_time_slots);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not cb_get_structure_capability_total_number_of_timeslots!");

		for (j = 0; j < num_of_time_slots; ++j)
		{
			xmlChar key[128], index[10];
			strcpy(key, structure_pac_key_entry);
			strcat(key, ".");
			sprintf(index, "%d", j + 1);
			strcat(key, index);

			container_configuration_time_slot_id_keys[*num_of_keys] = (xmlChar*) malloc(strlen(key) + 1);
			YUMA_ASSERT(container_configuration_time_slot_id_keys[*num_of_keys] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

			strcpy(container_configuration_time_slot_id_keys[*num_of_keys], key);
			*num_of_keys += 1;
		}

		free(structure_pac_key_entry);
	}

	return NO_ERR;
}

/*
 * Get the structureID attribute for a specific timeSlotIdList key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_container_config_structure_id(xmlChar* container_config_time_slot_id_key, xmlChar** structure_id)
{
	xmlChar* structureIdCopy = strdup(container_config_time_slot_id_key);
	YUMA_ASSERT(structureIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	xmlChar* structureId = strtok(structureIdCopy, ".");
	YUMA_ASSERT(structureId == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	*structure_id = (xmlChar*) malloc(strlen(structureId) + 1);
	YUMA_ASSERT(*structure_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*structure_id, structureId);

	free(structureIdCopy);

	return NO_ERR;
}

/*
 * Get the timeSlotID attribute for a specific timeSlotIdList key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_container_config_time_slot_id(xmlChar* container_config_time_slot_id_list_key, xmlChar** time_slot_id)
{
	xmlChar* timeSlotIdCopy = strdup(container_config_time_slot_id_list_key);
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	xmlChar* timeSlotId = strtok(timeSlotIdCopy, ".");
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	timeSlotId = strtok(NULL, ".");
	YUMA_ASSERT(timeSlotIdCopy == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	*time_slot_id = (xmlChar*) malloc(strlen(timeSlotId) + 1);
	YUMA_ASSERT(*time_slot_id == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*time_slot_id, timeSlotId);

	free(timeSlotIdCopy);

	return NO_ERR;
}

/*
 * Get the containerStatus attribute for a specific layerProtocol key
 * We pass the value as string, but it needs to represent a string
 */
status_t cb_get_container_status(xmlChar* container_pac_key, xmlChar** container_status)
{
	xmlChar* containerStatus = "OPERATIONAL_UP";

	*container_status = (xmlChar*) malloc(strlen(containerStatus) + 1);
	YUMA_ASSERT(*container_status == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(*container_status, containerStatus);

	return NO_ERR;
}

status_t cb_set_air_interface_configuration_air_interface_name(xmlChar* air_interface_pac_key, const xmlChar* air_interface_name)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_radio_signal_id(xmlChar* air_interface_pac_key, const xmlChar* radio_signal_id)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_tx_frequency(xmlChar* air_interface_pac_key, const xmlChar* tx_frequency_string)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_rx_frequency(xmlChar* air_interface_pac_key, const xmlChar* rx_frequency_string)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_tx_channel_bandwidth(xmlChar* air_interface_pac_key, const xmlChar* tx_channel_bandwidth)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_rx_channel_bandwidth(xmlChar* air_interface_pac_key, const xmlChar* rx_channel_bandwidth)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_power_is_on(xmlChar* air_interface_pac_key, const xmlChar* power_is_on)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_transmitter_is_on(xmlChar* air_interface_pac_key, const xmlChar* transmitter_is_on)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_tx_power(xmlChar* air_interface_pac_key, const xmlChar* tx_power)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_adaptive_modulation_is_on(xmlChar* air_interface_pac_key, const xmlChar* adaptive_modulation_is_on)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_modulation_min(xmlChar* air_interface_pac_key, const xmlChar* modulation_min)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_modulation_max(xmlChar* air_interface_pac_key, const xmlChar** modulation_max)
{
	return NO_ERR;
}

status_t cb_set_air_interface_configuration_xpic_is_on(xmlChar* air_interface_pac_key, const xmlChar* xpic_is_on)
{
	return NO_ERR;
}

status_t cb_set_structure_configuration_server_id(xmlChar* structure_pac_key, const xmlChar* server_id)
{
	return NO_ERR;
}

status_t cb_set_container_configuration_uuid(xmlChar* container_pac_key, const xmlChar* uuid)
{
	return NO_ERR;
}

status_t cb_set_container_configuration_time_slot_id_keys_for_layer_protocol_key(const xmlChar* container_pac_key, const xmlChar* container_configuration_time_slot_id_keys)
{
	return NO_ERR;
}
