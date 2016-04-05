/*
 * callbacks_CoreModel-CoreNetworkModule-ObjectClasses.c
 *
 *  Created on: Mar 30, 2016
 *      Author: compila
 */

#include "callbacks_CoreModel-CoreNetworkModule-ObjectClasses.h"

status_t cb_get_network_element_value_name(xmlChar** value_name)
{
	YUMA_ASSERT(value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueName = "neName";

	*value_name = (xmlChar*) malloc(strlen(valueName) + 1);
	YUMA_ASSERT(*value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value_name, valueName);

	return NO_ERR;
}

status_t cb_get_network_element_value(xmlChar** value)
{
	YUMA_ASSERT(value == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueString = "Microwave-NE1";

	*value = (xmlChar*) malloc(strlen(valueString) + 1);
	YUMA_ASSERT(*value == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value, valueString);

	return NO_ERR;
}

status_t cb_get_network_element_uuid(xmlChar** uuid)
{
	YUMA_ASSERT(uuid == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar readAttribute[256];
	xmlChar buffer[256];
	int n = 0, found = 0;

	FILE *fp = NULL;

	fp = fopen("/home/compila/app/poc2-md/yang-modules/mediatorConfig.txt", "r+");

	if (fp != NULL)
	{
		*uuid = (xmlChar*) malloc(256);
		YUMA_ASSERT(*uuid == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		while (! feof(fp))
		{
			fgets(buffer, 256, fp);
			n = sscanf(buffer, "NeName: %s", &readAttribute);
			if (n == 1)
			{
				strcpy(*uuid, readAttribute);
				found = 1;
				break;
			}
		}
		if (found == 0) //nothing found in the config file
		{
			sprintf(*uuid, "Default-Microwave-NE1");
		}
		fclose(fp);
	}
	else
	{
		YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "Failed to get the radioSignalId! Config file not found! /home/compila/app/poc2-md/yang-modules/mediatorConfig.txt missing!");
	}

	return NO_ERR;
}

status_t cb_get_network_element_operational_state(xmlChar** operational_state)
{
	YUMA_ASSERT(operational_state == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* operationalState = "ENABLED";

	*operational_state = (xmlChar*) malloc(strlen(operationalState) + 1);
	YUMA_ASSERT(*operational_state == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*operational_state, operationalState);

	return NO_ERR;
}

status_t cb_get_network_element_administrative_control(xmlChar** administrative_control)
{
	YUMA_ASSERT(administrative_control == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* administrativeControl = "UNLOCK";

	*administrative_control = (xmlChar*) malloc(strlen(administrativeControl) + 1);
	YUMA_ASSERT(*administrative_control == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*administrative_control, administrativeControl);

	return NO_ERR;
}

status_t cb_get_network_element_administrative_state(xmlChar** administrative_state)
{
	YUMA_ASSERT(administrative_state == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* administrativeState = "UNLOCKED";

	*administrative_state = (xmlChar*) malloc(strlen(administrativeState) + 1);
	YUMA_ASSERT(*administrative_state == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*administrative_state, administrativeState);

	return NO_ERR;
}

status_t cb_get_network_element_lifecycle_state(xmlChar** lifecycle_state)
{
	YUMA_ASSERT(lifecycle_state == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* lifecycleState = "INSTALLED";

	*lifecycle_state = (xmlChar*) malloc(strlen(lifecycleState) + 1);
	YUMA_ASSERT(*lifecycle_state == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*lifecycle_state, lifecycleState);

	return NO_ERR;
}

status_t cb_get_network_element_local_id_list_value_name(xmlChar** value_name)
{
	YUMA_ASSERT(value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueName = "neName";

	*value_name = (xmlChar*) malloc(strlen(valueName) + 1);
	YUMA_ASSERT(*value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value_name, valueName);

	return NO_ERR;
}

status_t cb_get_network_element_local_id_list_value(xmlChar** value)
{
	YUMA_ASSERT(value == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueString = "Microwave-NE";

	*value = (xmlChar*) malloc(strlen(valueString) + 1);
	YUMA_ASSERT(*value == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value, valueString);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_value_name(xmlChar** value_name, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueName = "ltpName";

	*value_name = (xmlChar*) malloc(strlen(valueName) + 1);
	YUMA_ASSERT(*value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value_name, valueName);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_value(xmlChar** value, const xmlChar* k_LogicalTerminationPoint_uuid, ltp_type typeOfLtp)
{
	YUMA_ASSERT(value == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar valueString[256];
	switch (typeOfLtp)
	{
		case MWPS_TTP:
		{
			strcpy(valueString, LTP_MWPS_PREFIX);
			break;
		}
		case MWS_TTP:
		{
			strcpy(valueString, LTP_MWS_PREFIX);
			break;
		}
		case ETH_CTP:
		{
			strcpy(valueString, LTP_ETH_CTP_PREFIX);
			break;
		}
		default:
			YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "ERROR: Unknown typeOfLTP=%d!", typeOfLtp);
	}
	strcat(valueString, k_LogicalTerminationPoint_uuid);

	*value = (xmlChar*) malloc(strlen(valueString) + 1);
	YUMA_ASSERT(*value == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value, valueString);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_operational_state(xmlChar** operational_state, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(operational_state == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* operationalState = "ENABLED";

	*operational_state = (xmlChar*) malloc(strlen(operationalState) + 1);
	YUMA_ASSERT(*operational_state == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*operational_state, operationalState);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_administrative_control(xmlChar** administrative_control, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(administrative_control == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* administrativeControl = "UNLOCK";

	*administrative_control = (xmlChar*) malloc(strlen(administrativeControl) + 1);
	YUMA_ASSERT(*administrative_control == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*administrative_control, administrativeControl);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_administrative_state(xmlChar** administrative_state, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(administrative_state == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* administrativeState = "UNLOCKED";

	*administrative_state = (xmlChar*) malloc(strlen(administrativeState) + 1);
	YUMA_ASSERT(*administrative_state == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*administrative_state, administrativeState);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_lifecycle_state(xmlChar** lifecycle_state, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(lifecycle_state == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* lifecycleState = "INSTALLED";

	*lifecycle_state = (xmlChar*) malloc(strlen(lifecycleState) + 1);
	YUMA_ASSERT(*lifecycle_state == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*lifecycle_state, lifecycleState);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_local_id_list_value_name(xmlChar** value_name, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueNameString = "ltpLocId";

	*value_name = (xmlChar*) malloc(strlen(valueNameString) + 1);
	YUMA_ASSERT(*value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value_name, valueNameString);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_local_id_list_value(xmlChar** value, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(value == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	*value = (xmlChar*) malloc(strlen(k_LogicalTerminationPoint_uuid) + 1);
	YUMA_ASSERT(*value == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value, k_LogicalTerminationPoint_uuid);

	return NO_ERR;
}

status_t cb_get_logical_termination_point_uuid(xmlChar** uuid, const xmlChar* k_LogicalTerminationPoint_uuid, ltp_type typeOfLtp)
{
	YUMA_ASSERT(uuid == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar uuidString[256];
	switch (typeOfLtp)
	{
		case MWPS_TTP:
		{
			strcpy(uuidString, LTP_MWPS_PREFIX);
			break;
		}
		case MWS_TTP:
		{
			strcpy(uuidString, LTP_MWS_PREFIX);
			break;
		}
		case ETH_CTP:
		{
			strcpy(uuidString, LTP_ETH_CTP_PREFIX);
			break;
		}
		default:
			YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "ERROR: Unknown typeOfLTP=%d!", typeOfLtp);
	}
	strcat(uuidString, k_LogicalTerminationPoint_uuid);

	*uuid = (xmlChar*) malloc(strlen(uuidString) + 1);
	YUMA_ASSERT(*uuid == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*uuid, uuidString);

	return NO_ERR;
}

status_t cb_get_logical_termination_client_ltp_ref_list_entry(xmlChar** client_ltp_ref_list_entry, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(client_ltp_ref_list_entry == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* clientLtpRefList[256];
	strcpy(clientLtpRefList, LTP_MWPS_PREFIX);
	strcat(clientLtpRefList, k_LogicalTerminationPoint_uuid);

	*client_ltp_ref_list_entry = (xmlChar*) malloc(strlen(clientLtpRefList) + 1);
	YUMA_ASSERT(*client_ltp_ref_list_entry == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*client_ltp_ref_list_entry, clientLtpRefList);

	return NO_ERR;
}

status_t cb_get_logical_termination_server_ltp_ref_list_entry(xmlChar** server_ltp_ref_list_entry, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(server_ltp_ref_list_entry == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* serverLtpRefList[256];
	strcpy(serverLtpRefList, LTP_MWPS_PREFIX);
	strcat(serverLtpRefList, k_LogicalTerminationPoint_uuid);

	*server_ltp_ref_list_entry = (xmlChar*) malloc(strlen(serverLtpRefList) + 1);
	YUMA_ASSERT(*server_ltp_ref_list_entry == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*server_ltp_ref_list_entry, serverLtpRefList);

	return NO_ERR;
}


status_t cb_get_all_logical_termination_point_uuid(xmlChar** logical_termination_point_uuid_list, int* num_of_ltps)
{
	*num_of_ltps = 0;

	logical_termination_point_uuid_list[*num_of_ltps] = (xmlChar*) malloc(strlen("ifIndex1") + 1);
	YUMA_ASSERT(logical_termination_point_uuid_list[*num_of_ltps] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(logical_termination_point_uuid_list[*num_of_ltps], "ifIndex1");

	*num_of_ltps += 1;

	logical_termination_point_uuid_list[*num_of_ltps] = (xmlChar*) malloc(strlen("ifIndex2") + 1);
	YUMA_ASSERT(logical_termination_point_uuid_list[*num_of_ltps] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(logical_termination_point_uuid_list[*num_of_ltps], "ifIndex2");

	*num_of_ltps += 1;

	return NO_ERR;
}

status_t cb_get_all_logical_termination_point_multiradio_uuid( xmlChar** logical_termination_point_multiradio_uuid_list, int* num_of_multiradio_ltps)
{
	*num_of_multiradio_ltps = 0;

	logical_termination_point_multiradio_uuid_list[*num_of_multiradio_ltps] = (xmlChar*) malloc(strlen("multiRadioIfIndex1") + 1);
	YUMA_ASSERT(logical_termination_point_multiradio_uuid_list[*num_of_multiradio_ltps] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(logical_termination_point_multiradio_uuid_list[*num_of_multiradio_ltps], "multiRadioIfIndex1");

	*num_of_multiradio_ltps += 1;

	return NO_ERR;
}

status_t cb_get_all_layer_protocols_for_ltp_uuid(const xmlChar* logical_termination_point_uuid, xmlChar** layer_protocol_uuid_list, int* num_of_lps)
{
	*num_of_lps = 0;

	layer_protocol_uuid_list[*num_of_lps] = (xmlChar*) malloc(strlen("ifIndex1") + 1);
	YUMA_ASSERT(layer_protocol_uuid_list[*num_of_lps] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(layer_protocol_uuid_list[*num_of_lps], "ifIndex1");

	*num_of_lps += 1;

	return NO_ERR;
}

status_t cb_get_all_client_ltp_ref_leaf_list(const xmlChar* logical_termination_point_uuid, xmlChar** client_ltp_ref_leaf_list, int* num_of_client_ltp_ref_leaf_list, ltp_type typeOfLtp)
{
	status_t res = NO_ERR;
	*num_of_client_ltp_ref_leaf_list = 0;

	xmlChar ltpRefListEntry[256];

	switch (typeOfLtp)
	{
		case MWPS_TTP:
		{
			strcpy(ltpRefListEntry, LTP_MWS_PREFIX); //reversed here
			strcat(ltpRefListEntry, logical_termination_point_uuid);
			client_ltp_ref_leaf_list[*num_of_client_ltp_ref_leaf_list] = (xmlChar*) malloc(strlen(ltpRefListEntry) + 1);
			YUMA_ASSERT(client_ltp_ref_leaf_list[*num_of_client_ltp_ref_leaf_list] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

			strcpy(client_ltp_ref_leaf_list[*num_of_client_ltp_ref_leaf_list], ltpRefListEntry);

			*num_of_client_ltp_ref_leaf_list += 1;

			break;
		}
		case MWS_TTP:
		{
			xmlChar* logical_termination_point_multiradio_uuid_list[MAX_NUMBER_OF_LTPs];
			int num_of_multiradio_ltps;
			int i;

			res = cb_get_all_logical_termination_point_multiradio_uuid(logical_termination_point_multiradio_uuid_list, &num_of_multiradio_ltps);
			YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not cb_get_all_logical_termination_point_multiradio_uuid!");

			for (i=0; i<num_of_multiradio_ltps; ++i)
			{
				strcpy(ltpRefListEntry, LTP_ETH_CTP_PREFIX);
				strcat(ltpRefListEntry, logical_termination_point_multiradio_uuid_list[i]);

				client_ltp_ref_leaf_list[*num_of_client_ltp_ref_leaf_list] = (xmlChar*) malloc(strlen(ltpRefListEntry) + 1);
				YUMA_ASSERT(client_ltp_ref_leaf_list[*num_of_client_ltp_ref_leaf_list] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

				strcpy(client_ltp_ref_leaf_list[*num_of_client_ltp_ref_leaf_list], ltpRefListEntry);

				*num_of_client_ltp_ref_leaf_list += 1;
			}

			break;
		}
		case ETH_CTP:
		{
			return NO_ERR;
		}
		default:
			YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "ERROR: Unknown typeOfLTP=%d!", typeOfLtp);
	}

	return NO_ERR;
}

status_t cb_get_all_server_ltp_ref_leaf_list(const xmlChar* logical_termination_point_uuid, xmlChar** server_ltp_ref_leaf_list, int* num_of_server_ltp_ref_leaf_list, ltp_type typeOfLtp)
{
	status_t res = NO_ERR;
	*num_of_server_ltp_ref_leaf_list = 0;

	xmlChar ltpRefListEntry[256];

	switch (typeOfLtp)
	{
		case MWPS_TTP:
		{
			return NO_ERR;
		}
		case MWS_TTP:
		{
			strcpy(ltpRefListEntry, LTP_MWPS_PREFIX); //reversed here
			strcat(ltpRefListEntry, logical_termination_point_uuid);

			server_ltp_ref_leaf_list[*num_of_server_ltp_ref_leaf_list] = (xmlChar*) malloc(strlen(ltpRefListEntry) + 1);
			YUMA_ASSERT(server_ltp_ref_leaf_list[*num_of_server_ltp_ref_leaf_list] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

			strcpy(server_ltp_ref_leaf_list[*num_of_server_ltp_ref_leaf_list], ltpRefListEntry);

			*num_of_server_ltp_ref_leaf_list += 1;

			break;
		}
		case ETH_CTP:
		{
			xmlChar* logical_termination_point_uuid_list[MAX_NUMBER_OF_LTPs];
			int num_of_ltps;
			int i;

			res = cb_get_all_logical_termination_point_uuid(logical_termination_point_uuid_list, &num_of_ltps);
			YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not cb_get_all_logical_termination_point_uuid!");

			for (i=0; i<num_of_ltps; ++i)
			{
				strcpy(ltpRefListEntry, LTP_MWS_PREFIX); //reversed here
				strcat(ltpRefListEntry, logical_termination_point_uuid_list[i]);

				server_ltp_ref_leaf_list[*num_of_server_ltp_ref_leaf_list] = (xmlChar*) malloc(strlen(ltpRefListEntry) + 1);
				YUMA_ASSERT(server_ltp_ref_leaf_list[*num_of_server_ltp_ref_leaf_list] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

				strcpy(server_ltp_ref_leaf_list[*num_of_server_ltp_ref_leaf_list], ltpRefListEntry);

				*num_of_server_ltp_ref_leaf_list += 1;
			}

			break;
		}
		default:
			YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "ERROR: Unknown typeOfLTP=%d!", typeOfLtp);
	}

	return NO_ERR;
}

status_t cb_get_layer_protocol_uuid(xmlChar** uuid, const xmlChar* k_LayerProtocol_uuid, ltp_type typeOfLtp)
{
	YUMA_ASSERT(uuid == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar uuidString[256];
	switch (typeOfLtp)
	{
		case MWPS_TTP:
		{
			strcpy(uuidString, LP_MWPS_PREFIX);
			break;
		}
		case MWS_TTP:
		{
			strcpy(uuidString, LP_MWS_PREFIX);
			break;
		}
		case ETH_CTP:
		{
			strcpy(uuidString, LP_ETH_CTP_PREFIX);
			break;
		}
		default:
			YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "ERROR: Unknown typeOfLTP=%d!", typeOfLtp);
	}
	strcat(uuidString, k_LayerProtocol_uuid);

	*uuid = (xmlChar*) malloc(strlen(uuidString) + 1);
	YUMA_ASSERT(*uuid == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*uuid, uuidString);

	return NO_ERR;
}

status_t cb_get_layer_protocol_value_name(xmlChar** value_name, const xmlChar* k_LayerProtocol_uuid)
{
	YUMA_ASSERT(value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueName = "lpName";

	*value_name = (xmlChar*) malloc(strlen(valueName) + 1);
	YUMA_ASSERT(*value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value_name, valueName);

	return NO_ERR;
}

status_t cb_get_layer_protocol_value(xmlChar** value, const xmlChar* k_LayerProtocol_uuid, ltp_type typeOfLtp)
{
	YUMA_ASSERT(value == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar valueString[256];
	switch (typeOfLtp)
	{
		case MWPS_TTP:
		{
			strcpy(valueString, LP_MWPS_PREFIX);
			break;
		}
		case MWS_TTP:
		{
			strcpy(valueString, LP_MWS_PREFIX);
			break;
		}
		case ETH_CTP:
		{
			strcpy(valueString, LP_ETH_CTP_PREFIX);
			break;
		}
		default:
			YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "ERROR: Unknown typeOfLTP=%d!", typeOfLtp);
	}
	strcat(valueString, k_LayerProtocol_uuid);

	*value = (xmlChar*) malloc(strlen(valueString) + 1);
	YUMA_ASSERT(*value == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value, valueString);

	return NO_ERR;
}

status_t cb_get_layer_protocol_value_local_id_list_value_name(xmlChar** value_name, const xmlChar* k_LayerProtocol_uuid)
{
	YUMA_ASSERT(value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* valueNameString = "lpLocId";

	*value_name = (xmlChar*) malloc(strlen(valueNameString) + 1);
	YUMA_ASSERT(*value_name == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value_name, valueNameString);

	return NO_ERR;
}

status_t cb_get_layer_protocol_value_local_id_list_value(xmlChar** value, const xmlChar* k_LayerProtocol_uuid)
{
	YUMA_ASSERT(value == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	*value = (xmlChar*) malloc(strlen(k_LayerProtocol_uuid) + 1);
	YUMA_ASSERT(*value == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*value, k_LayerProtocol_uuid);

	return NO_ERR;
}

status_t cb_get_layer_protocol_name(xmlChar** layer_protocol_name, const xmlChar* k_LayerProtocol_uuid, ltp_type typeOfLtp)
{
	YUMA_ASSERT(layer_protocol_name == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar protocolName[20];
	switch (typeOfLtp)
	{
		case MWPS_TTP:
		{
			strcpy(protocolName, MWPS_STRING);
			break;
		}
		case MWS_TTP:
		{
			strcpy(protocolName, MWS_STRING);
			break;
		}
		case ETH_CTP:
		{
			strcpy(protocolName, ETH_CTP_STRING);
			break;
		}
		default:
			YUMA_ASSERT(TRUE, return ERR_INTERNAL_VAL, "ERROR: Unknown typeOfLTP=%d!", typeOfLtp);
	}

	*layer_protocol_name = (xmlChar*) malloc(strlen(protocolName) + 1);
	YUMA_ASSERT(*layer_protocol_name == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*layer_protocol_name, protocolName);

	return NO_ERR;
}

//we need a string that represents a uint64
status_t cb_get_layer_protocol_configured_client_capacity(xmlChar** configured_client_capacity, const xmlChar* k_LayerProtocol_uuid)
{
	YUMA_ASSERT(configured_client_capacity == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* configuredClientCapacity = "1000000"; //1Gbps

	*configured_client_capacity = (xmlChar*) malloc(strlen(configuredClientCapacity) + 1);
	YUMA_ASSERT(*configured_client_capacity == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*configured_client_capacity, configuredClientCapacity);

	return NO_ERR;
}

status_t cb_get_layer_protocol_lp_direction(xmlChar** lp_direction, const xmlChar* k_LayerProtocol_uuid)
{
	YUMA_ASSERT(lp_direction == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* lpDirection = "BIDIRECTIONAL";

	*lp_direction = (xmlChar*) malloc(strlen(lpDirection) + 1);
	YUMA_ASSERT(*lp_direction == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*lp_direction, lpDirection);

	return NO_ERR;
}

status_t cb_get_layer_protocol_termination_state(xmlChar** termination_state, const xmlChar* k_LayerProtocol_uuid)
{
	YUMA_ASSERT(termination_state == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* terminationState  = "true";

	*termination_state = (xmlChar*) malloc(strlen(terminationState) + 1);
	YUMA_ASSERT(*termination_state == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*termination_state, terminationState);

	return NO_ERR;
}

status_t cb_get_all_physical_port_references(const xmlChar* logical_termination_point_uuid, xmlChar** physical_port_reference_list, int* num_of_physical_port_references)
{
	*num_of_physical_port_references = 0;

	physical_port_reference_list[*num_of_physical_port_references] = (xmlChar*) malloc(strlen(logical_termination_point_uuid) + 1);
	YUMA_ASSERT(physical_port_reference_list[*num_of_physical_port_references] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

	strcpy(physical_port_reference_list[*num_of_physical_port_references], logical_termination_point_uuid);

	*num_of_physical_port_references += 1;

	return NO_ERR;
}

status_t cb_get_all_ltp_ref_leaf_list(const xmlChar* logical_termination_point_uuid, xmlChar** ltp_ref_list, int* num_of_ltp_ref, ltp_type typeOfLtp)
{
	status_t res = NO_ERR;
	*num_of_ltp_ref = 0;

	xmlChar* client_ltp_ref_leaf_list[MAX_NUMBER_OF_LTPs];
	int num_of_client_ltp_ref_leaf_list;
	int i;

	res = cb_get_all_client_ltp_ref_leaf_list(logical_termination_point_uuid, client_ltp_ref_leaf_list, &num_of_client_ltp_ref_leaf_list, typeOfLtp);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not cb_get_all_ltp_ref_leaf_list!");

	xmlChar* server_ltp_ref_leaf_list[MAX_NUMBER_OF_LTPs];
	int num_of_server_ltp_ref_leaf_list;

	res = cb_get_all_server_ltp_ref_leaf_list(logical_termination_point_uuid, server_ltp_ref_leaf_list, &num_of_server_ltp_ref_leaf_list, typeOfLtp);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not cb_get_all_ltp_ref_leaf_list!");

	for (i=0; i<num_of_client_ltp_ref_leaf_list; ++i)
	{
		ltp_ref_list[*num_of_ltp_ref] = (xmlChar*) malloc(strlen(client_ltp_ref_leaf_list[i]) + 1);
		YUMA_ASSERT(ltp_ref_list[*num_of_ltp_ref] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		strcpy(ltp_ref_list[*num_of_ltp_ref], client_ltp_ref_leaf_list[i]);

		*num_of_ltp_ref += 1;
	}

	for (i=0; i<num_of_server_ltp_ref_leaf_list; ++i)
	{
		ltp_ref_list[*num_of_ltp_ref] = (xmlChar*) malloc(strlen(server_ltp_ref_leaf_list[i]) + 1);
		YUMA_ASSERT(ltp_ref_list[*num_of_ltp_ref] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		strcpy(ltp_ref_list[*num_of_ltp_ref], server_ltp_ref_leaf_list[i]);

		*num_of_ltp_ref += 1;
	}

	return NO_ERR;
}

status_t cb_get_logical_termination_point_ltp_direction(xmlChar** ltp_direction, const xmlChar* k_LogicalTerminationPoint_uuid)
{
	YUMA_ASSERT(ltp_direction == NULL, return ERR_INTERNAL_MEM, "ERROR: NULL pointer received!");

	xmlChar* ltpDirection = "BIDIRECTIONAL";

	*ltp_direction = (xmlChar*) malloc(strlen(ltpDirection) + 1);
	YUMA_ASSERT(*ltp_direction == NULL, return ERR_INTERNAL_MEM, "ERROR: Could not allocate memory!");

	strcpy(*ltp_direction, ltpDirection);

	return NO_ERR;
}
