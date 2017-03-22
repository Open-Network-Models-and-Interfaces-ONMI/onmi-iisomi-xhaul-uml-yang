/*
 * configuration_callbacks.c
 *
 *  Created on: Aug 30, 2016
 *      Author: compila
 */

#include "configuration_callbacks.h"
#include "y_microwave-model.h"

static status_t cb_send_to_device_air_interface_configuration_air_interface_name(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_radio_signal_id(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_tx_frequency(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_rx_frequency(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_tx_channel_bandwidth(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_rx_channel_bandwidth(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_polarization(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_power_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_transmitter_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_receiver_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_tx_power(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_adaptive_modulation_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_modulation_min(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_modulation_max(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_xpic_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_mimo_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_alic_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_atpc_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_atpc_thresh_upper(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_atpc_thresh_lower(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_auto_freq_select_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_auto_freq_select_range(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_modulation_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_encryption_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_cryptographic_key(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_loop_back_kind_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_air_interface_configuration_maintenance_timer(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);

static status_t cb_send_to_device_air_interface_configuration_problem_kind_name(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
static status_t cb_send_to_device_air_interface_configuration_problem_kind_severity(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);

static status_t cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_name(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
static status_t cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_severity(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);

status_t cb_send_to_device_ethernet_container_configuration_element_value(val_value_t *element, const xmlChar* k_mw_ethernet_container_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_container_id(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_structure_id_ref(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_segment_id_ref(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_packet_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_layer2_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_vlan_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_q_in_q_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_mpls_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_ipv4_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_ipv6_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_layer4_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_encryption_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);
static status_t cb_send_to_device_ethernet_container_configuration_cryptographic_key(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol);

static status_t cb_send_to_device_ethernet_container_configuration_problem_kind_name(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar *k_mw_ethernet_container_pac_ethernetContainerConfiguration_problemKindSeverityList_problemKindName);
static status_t cb_send_to_device_ethernet_container_configuration_problem_kind_severity( val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar *k_mw_ethernet_container_pac_ethernetContainerConfiguration_problemKindSeverityList_problemKindName);




/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_element_value
*
* Callback function for setting the value of the specific element on the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
status_t cb_send_to_device_air_interface_configuration_element_value(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	if (strcmp(element->name, y_microwave_model_N_air_interface_name) == 0)
	{
		return cb_send_to_device_air_interface_configuration_air_interface_name(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_radio_signal_id) == 0)
	{
		return cb_send_to_device_air_interface_configuration_radio_signal_id(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_tx_frequency) == 0)
	{
		return cb_send_to_device_air_interface_configuration_tx_frequency(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_rx_frequency) == 0)
	{
		return cb_send_to_device_air_interface_configuration_rx_frequency(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_tx_channel_bandwidth) == 0)
	{
		return cb_send_to_device_air_interface_configuration_tx_channel_bandwidth(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_rx_channel_bandwidth) == 0)
	{
		return cb_send_to_device_air_interface_configuration_rx_channel_bandwidth(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_polarization) == 0)
	{
		return cb_send_to_device_air_interface_configuration_polarization(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_power_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_power_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_transmitter_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_transmitter_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_receiver_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_receiver_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_tx_power) == 0)
	{
		return cb_send_to_device_air_interface_configuration_tx_power(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_adaptive_modulation_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_adaptive_modulation_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_modulation_min) == 0)
	{
		return cb_send_to_device_air_interface_configuration_modulation_min(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_modulation_max) == 0)
	{
		return cb_send_to_device_air_interface_configuration_modulation_max(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_xpic_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_xpic_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_mimo_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_mimo_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_alic_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_alic_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_atpc_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_atpc_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_atpc_thresh_upper) == 0)
	{
		return cb_send_to_device_air_interface_configuration_atpc_thresh_upper(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_atpc_thresh_lower) == 0)
	{
		return cb_send_to_device_air_interface_configuration_atpc_thresh_lower(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_auto_freq_select_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_auto_freq_select_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_auto_freq_select_range) == 0)
	{
		return cb_send_to_device_air_interface_configuration_auto_freq_select_range(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_modulation_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_modulation_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_encryption_is_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_encryption_is_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_cryptographic_key) == 0)
	{
		return cb_send_to_device_air_interface_configuration_cryptographic_key(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_loop_back_kind_on) == 0)
	{
		return cb_send_to_device_air_interface_configuration_loop_back_kind_on(element, k_mw_air_interface_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_maintenance_timer) == 0)
	{
		return cb_send_to_device_air_interface_configuration_maintenance_timer(element, k_mw_air_interface_pac_layer_protocol);
	}

	return NO_ERR;
}

status_t cb_send_to_device_air_interface_configuration_problem_kind_severity_list_element_value(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
	if (strcmp(element->name, y_microwave_model_N_problem_kind_name) == 0)
	{
		return cb_send_to_device_air_interface_configuration_problem_kind_name(element, k_mw_air_interface_pac_layer_protocol, k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
	}
	else if (strcmp(element->name, y_microwave_model_N_problem_kind_severity) == 0)
	{
		return cb_send_to_device_air_interface_configuration_problem_kind_severity(element, k_mw_air_interface_pac_layer_protocol, k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
	}

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_air_interface_name
*
* Callback function for setting the value of airInterfaceName leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_air_interface_name(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_radio_signal_id
*
* Callback function for setting the value of radioSignalId leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_radio_signal_id(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_tx_frequency
*
* Callback function for setting the value of txFrequency leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_tx_frequency(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_rx_frequency
*
* Callback function for setting the value of rxFrequency leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_rx_frequency(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_tx_channel_bandwidth
*
* Callback function for setting the value of txChannelBandwidth leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_tx_channel_bandwidth(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_rx_channel_bandwidth
*
* Callback function for setting the value of rxChannelBandwidth leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_rx_channel_bandwidth(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_polarization
*
* Callback function for setting the value of polarization leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_polarization(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_power_is_on
*
* Callback function for setting the value of powerIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_power_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_transmitter_is_on
*
* Callback function for setting the value of transmitterIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_transmitter_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_receiver_is_on
*
* Callback function for setting the value of receiverIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_receiver_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_tx_power
*
* Callback function for setting the value of txPower leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_tx_power(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_adaptive_modulation_is_on
*
* Callback function for setting the value of adaptiveModulationIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_adaptive_modulation_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_modulation_min
*
* Callback function for setting the value of modulationMin leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_modulation_min(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_modulation_max
*
* Callback function for setting the value of modulationMax leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_modulation_max(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_xpic_is_on
*
* Callback function for setting the value of xpicIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_xpic_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_mimo_is_on
*
* Callback function for setting the value of mimoIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_mimo_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_alic_is_on
*
* Callback function for setting the value of alicIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_alic_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_atpc_is_on
*
* Callback function for setting the value of atpcIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_atpc_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_atpc_thresh_upper
*
* Callback function for setting the value of atpcThreshUpper leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_atpc_thresh_upper(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_atpc_thresh_lower
*
* Callback function for setting the value of atpcThreshLower leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_atpc_thresh_lower(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_auto_freq_select_is_on
*
* Callback function for setting the value of autoFreqSelectIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_auto_freq_select_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_auto_freq_select_range
*
* Callback function for setting the value of autoFreqSelectRange leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_auto_freq_select_range(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_modulation_is_on
*
* Callback function for setting the value of modulationIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_modulation_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_encryption_is_on
*
* Callback function for setting the value of encryptionIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_encryption_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_cryptographic_key
*
* Callback function for setting the value of cryptographicKey leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_cryptographic_key(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_loop_back_kind_on
*
* Callback function for setting the value of loopBackKindOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_loop_back_kind_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_maintenance_timer
*
* Callback function for setting the value of maintenanceTimer leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_maintenance_timer(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_problem_kind_name
*
* Callback function for setting the value of problemKindName leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_problem_kind_name(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_air_interface_configuration_problem_kind_severity
*
* Callback function for setting the value of problemKindSeverity leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_air_interface_configuration_problem_kind_severity(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

status_t cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_severity_list_element_value(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
    if (strcmp(element->name, y_microwave_model_N_problem_kind_name) == 0)
    {
        return cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_name(element, k_mw_air_interface_pac_layer_protocol, k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
    }
    else if (strcmp(element->name, y_microwave_model_N_problem_kind_severity) == 0)
    {
        return cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_severity(element, k_mw_air_interface_pac_layer_protocol, k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
    }

    return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_name
*
* Callback function for setting the value of problemKindName leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_name(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
    YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
    /*
     * Send the new configured value to the device
     * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
     */

    return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_severity
*
* Callback function for setting the value of problemKindSeverity leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_pure_ethernet_structure_configuration_problem_kind_severity(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol, const xmlChar* k_mw_air_interface_pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
    YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
    /*
     * Send the new configured value to the device
     * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
     */

    return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_element_value
*
* Callback function for setting the value of the specific element on the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
status_t cb_send_to_device_ethernet_container_configuration_element_value(val_value_t *element, const xmlChar* k_mw_ethernet_container_pac_layer_protocol)
{
	if (strcmp(element->name, y_microwave_model_N_container_id) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_container_id(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_structure_id_ref) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_structure_id_ref(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_segment_id_ref) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_segment_id_ref(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_packet_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_packet_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_layer2_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_layer2_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_vlan_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_vlan_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_q_in_q_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_q_in_q_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_mpls_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_mpls_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_ipv4_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_ipv4_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_ipv6_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_ipv6_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_layer4_compression_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_layer4_compression_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_encryption_is_on) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_encryption_is_on(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	else if (strcmp(element->name, y_microwave_model_N_cryptographic_key) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_cryptographic_key(element, k_mw_ethernet_container_pac_layer_protocol);
	}
	return NO_ERR;
}

status_t cb_send_to_device_ethernet_container_configuration_problem_kind_severity_list_element_value(val_value_t *element, const xmlChar* k_mw_ethernet_container_pac_layer_protocol, const xmlChar* k_mw_ethernet_container_pac_ethernetContainerConfiguration_problemKindSeverityList_problemKindName)
{
	if (strcmp(element->name, y_microwave_model_N_problem_kind_name) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_problem_kind_name(element, k_mw_ethernet_container_pac_layer_protocol, k_mw_ethernet_container_pac_ethernetContainerConfiguration_problemKindSeverityList_problemKindName);
	}
	else if (strcmp(element->name, y_microwave_model_N_problem_kind_severity) == 0)
	{
		return cb_send_to_device_ethernet_container_configuration_problem_kind_severity(element, k_mw_ethernet_container_pac_layer_protocol, k_mw_ethernet_container_pac_ethernetContainerConfiguration_problemKindSeverityList_problemKindName);
	}

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_container_id
*
* Callback function for setting the value of containerId leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_container_id(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_structure_id_ref
*
* Callback function for setting the value of structureIdRef leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_structure_id_ref(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_segment_id_ref
*
* Callback function for setting the value of segmentIdRef leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_segment_id_ref(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_packet_compression_is_on
*
* Callback function for setting the value of packetCompressionIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_packet_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_layer2_compression_is_on
*
* Callback function for setting the value of layer2_compression_is_on leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_layer2_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_vlan_compression_is_on
*
* Callback function for setting the value of vlanCompressionIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_vlan_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_q_in_q_compression_is_on
*
* Callback function for setting the value of qInQCompressionIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_q_in_q_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_mpls_compression_is_on
*
* Callback function for setting the value of mplsCompressionIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_mpls_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_ipv4_compression_is_on
*
* Callback function for setting the value of ipv4_compression_is_on leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_ipv4_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_ipv6_compression_is_on
*
* Callback function for setting the value of ipv6_compression_is_on leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_ipv6_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_layer4_compression_is_on
*
* Callback function for setting the value of layer4_compression_is_on leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_layer4_compression_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_encryption_is_on
*
* Callback function for setting the value of encryptionIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_encryption_is_on(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_cryptographic_key
*
* Callback function for setting the value of cryptographicKey leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_cryptographic_key(val_value_t *element, const xmlChar* k_mw_air_interface_pac_layer_protocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_problem_kind_name
*
* Callback function for setting the value of problemKindName leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_problem_kind_name(
                                       val_value_t *element,
                                       const xmlChar* k_mw_air_interface_pac_layer_protocol,
                                       const xmlChar *k_mw_ethernet_container_pac_ethernetContainerConfiguration_problemKindSeverityList_problemKindName)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_ethernet_container_configuration_problem_kind_severity
*
* Callback function for setting the value of problemKindSeverity leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_ethernet_container_configuration_problem_kind_severity(
                                       val_value_t *element,
                                       const xmlChar* k_mw_air_interface_pac_layer_protocol,
                                       const xmlChar *k_mw_ethernet_container_pac_ethernetContainerConfiguration_problemKindSeverityList_problemKindName)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

