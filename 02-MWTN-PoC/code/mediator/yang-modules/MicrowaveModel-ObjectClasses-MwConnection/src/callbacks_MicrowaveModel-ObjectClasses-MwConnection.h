/*
 * callbacks_MicrowaveModel-ObjectClasses-MwConnection.h
 *
 *  Created on: Mar 22, 2016
 *      Author: compila
 */

#ifndef YANG_MODULES_MICROWAVEMODEL_OBJECTCLASSES_MWCONNECTION_SRC_CALLBACKS_MICROWAVEMODEL_OBJECTCLASSES_MWCONNECTION_H_
#define YANG_MODULES_MICROWAVEMODEL_OBJECTCLASSES_MWCONNECTION_SRC_CALLBACKS_MICROWAVEMODEL_OBJECTCLASSES_MWCONNECTION_H_

#include "status.h"
#include <xmlstring.h>
#include "../utils/utils.h"
#include "procdefs.h"


status_t cb_get_all_air_interface_pac_keys(xmlChar** air_interface_pac_keys_list, int* num_of_keys);
status_t cb_get_all_air_interface_capability_keys_for_layer_protocol(const xmlChar* layer_protocol_key, xmlChar** air_interface_capability_key_list, int* num_of_keys);
status_t cb_get_all_air_interface_capability_script_list_keys(xmlChar** air_interface_capability_script_list_key_list, int* num_of_keys);

status_t cb_get_all_structure_pac_keys(xmlChar** structure_pac_keys_list, int* num_of_structure_pac_keys);

status_t cb_get_all_container_pac_keys(xmlChar** container_pac_keys_list, int* num_of_container_pac_keys);

status_t cb_get_air_interface_configuration_air_interface_name(xmlChar* air_interface_pac_key, xmlChar** air_interface_name);
status_t cb_get_air_interface_configuration_radio_signal_id(xmlChar* air_interface_pac_key, xmlChar** radio_signal_id);
status_t cb_get_air_interface_configuration_tx_frequency(xmlChar* air_interface_pac_key, xmlChar** tx_frequency_string);
status_t cb_get_air_interface_configuration_rx_frequency(xmlChar* air_interface_pac_key, xmlChar** rx_frequency_string);
status_t cb_get_air_interface_configuration_tx_channel_bandwidth(xmlChar* air_interface_pac_key, xmlChar** tx_channel_bandwidth);
status_t cb_get_air_interface_configuration_rx_channel_bandwidth(xmlChar* air_interface_pac_key, xmlChar** rx_channel_bandwidth);
status_t cb_get_air_interface_configuration_power_is_on(xmlChar* air_interface_pac_key, xmlChar** poerr_is_on);
status_t cb_get_air_interface_configuration_transmitter_is_on(xmlChar* air_interface_pac_key, xmlChar** transmitter_is_on);
status_t cb_get_air_interface_configuration_tx_power(xmlChar* air_interface_pac_key, xmlChar** tx_power);
status_t cb_get_air_interface_configuration_adaptive_modulation_is_on(xmlChar* air_interface_pac_key, xmlChar** adaptive_modulation_is_on);
status_t cb_get_air_interface_configuration_modulation_min(xmlChar* air_interface_pac_key, xmlChar** modulation_min);
status_t cb_get_air_interface_configuration_modulation_max(xmlChar* air_interface_pac_key, xmlChar** modulation_max);
status_t cb_get_air_interface_configuration_xpic_is_on(xmlChar* air_interface_pac_key, xmlChar** xpic_is_on);

status_t cb_set_air_interface_configuration_air_interface_name(xmlChar* air_interface_pac_key, const xmlChar* air_interface_name);
status_t cb_set_air_interface_configuration_radio_signal_id(xmlChar* air_interface_pac_key, const xmlChar* radio_signal_id);
status_t cb_set_air_interface_configuration_tx_frequency(xmlChar* air_interface_pac_key, const xmlChar* tx_frequency_string);
status_t cb_set_air_interface_configuration_rx_frequency(xmlChar* air_interface_pac_key, const xmlChar* rx_frequency_string);
status_t cb_set_air_interface_configuration_tx_channel_bandwidth(xmlChar* air_interface_pac_key, const xmlChar* tx_channel_bandwidth);
status_t cb_set_air_interface_configuration_rx_channel_bandwidth(xmlChar* air_interface_pac_key, const xmlChar* rx_channel_bandwidth);
status_t cb_set_air_interface_configuration_power_is_on(xmlChar* air_interface_pac_key, const xmlChar* power_is_on);
status_t cb_set_air_interface_configuration_transmitter_is_on(xmlChar* air_interface_pac_key, const xmlChar* transmitter_is_on);
status_t cb_set_air_interface_configuration_tx_power(xmlChar* air_interface_pac_key, const xmlChar* tx_power);
status_t cb_set_air_interface_configuration_adaptive_modulation_is_on(xmlChar* air_interface_pac_key, const xmlChar* adaptive_modulation_is_on);
status_t cb_set_air_interface_configuration_modulation_min(xmlChar* air_interface_pac_key, const xmlChar* modulation_min);
status_t cb_set_air_interface_configuration_modulation_max(xmlChar* air_interface_pac_key, const xmlChar** modulation_max);
status_t cb_set_air_interface_configuration_xpic_is_on(xmlChar* air_interface_pac_key, const xmlChar* xpic_is_on);

status_t cb_get_air_interface_capabilities_type_of_equipment(xmlChar* air_interface_id_key, xmlChar** type_of_equipment);
status_t cb_get_air_interface_capabilities_supported_channel_plans(xmlChar* air_interface_id_key, xmlChar** supported_channel_plans);
status_t cb_get_air_interface_capabilities_tx_frequency_min(xmlChar* air_interface_id_key, xmlChar** tx_frequency_min);
status_t cb_get_air_interface_capabilities_tx_frequency_max(xmlChar* air_interface_id_key, xmlChar** tx_frequency_max);
status_t cb_get_air_interface_capabilities_rx_frequency_min(xmlChar* air_interface_id_key, xmlChar** rx_frequency_min);
status_t cb_get_air_interface_capabilities_rx_frequency_max(xmlChar* air_interface_id_key, xmlChar** rx_frequency_max);
status_t cb_get_air_interface_capabilities_adaptive_modulation_is_available(xmlChar* air_interface_id_key, xmlChar** adaptive_modulation_is_available);

status_t cb_get_air_interface_capabilities_script_channel_bandwidth(xmlChar* script_id_key, xmlChar** channel_bandwidth);
status_t cb_get_air_interface_capabilities_script_modulation_scheme(xmlChar* script_id_key, xmlChar** modulation_scheme);
status_t cb_get_air_interface_capabilities_script_tx_power_min(xmlChar* script_id_key, xmlChar** tx_power_min);
status_t cb_get_air_interface_capabilities_script_tx_power_max(xmlChar* script_id_key, xmlChar** tx_power_max);
status_t cb_get_air_interface_capabilities_script_xpic_is_avail(xmlChar* script_id_key, xmlChar** xpic_is_avail);

status_t cb_get_air_interface_status_tx_frequency_cur(xmlChar* air_interface_pac_key, uint64* tx_frequency_cur);
status_t cb_get_air_interface_status_rx_frequency_cur(xmlChar* air_interface_pac_key, uint64* rx_frequency_cur);
status_t cb_get_air_interface_status_tx_level_cur(xmlChar* air_interface_pac_key, int64* tx_level_cur);
status_t cb_get_air_interface_status_rx_level_cur(xmlChar* air_interface_pac_key, int64* rx_level_cur);
status_t cb_get_air_interface_status_snr_cur(xmlChar* air_interface_pac_key, int64* snr_cur);
status_t cb_get_air_interface_status_link_is_up(xmlChar* air_interface_pac_key, boolean* link_is_up);
status_t cb_get_air_interface_status_xpic_is_up(xmlChar* air_interface_pac_key, boolean* xpic_is_up);

status_t cb_get_all_air_interface_current_problems_for_layer_protocol_key(const xmlChar* air_interface_pac_key, xmlChar** air_interface_current_problems_list, int* num_of_problems);

status_t cb_get_structure_configuration_server_id(xmlChar* structure_pac_key, xmlChar** server_id);

status_t cb_set_structure_configuration_server_id(xmlChar* structure_pac_key, const xmlChar* server_id);

status_t cb_get_structure_capability_structure_id(xmlChar* structure_pac_key, xmlChar** structure_id);
status_t cb_get_structure_capability_total_number_of_timeslots(xmlChar* const structure_pac_key, uint64* totalNumberOfTimeSlots);
status_t cb_get_structure_capability_time_slot_capacity(xmlChar* structure_pac_key, uint64* timeSlotCapacity);

status_t cb_get_all_structure_status_time_slot_status_keys_for_layer_protocol_key(const xmlChar* structure_pac_key, xmlChar** air_structure_status_time_slot_status_key_list, int* num_of_time_slots);

status_t cb_get_structure_status_time_slot_status_list_structure_id(xmlChar* air_structure_status_time_slot_status_key_list, xmlChar** structure_id);
status_t cb_get_structure_status_time_slot_status_list_time_slot_id(xmlChar* air_structure_status_time_slot_status_key_list, xmlChar** time_slot_id);
status_t cb_get_structure_status_time_slot_status_list_operational_status(xmlChar* air_structure_status_time_slot_status_key_list, xmlChar** operational_status);

status_t cb_get_container_capability_container_id(xmlChar* container_pac_key, xmlChar** container_id);
status_t cb_get_container_capability_container_name(xmlChar* containerName , xmlChar** container_name);
status_t cb_get_container_capability_number_of_time_slots_required(xmlChar* containerName , xmlChar** number_of_time_slots_required);
status_t cb_get_container_capability_bundling_is_avail(xmlChar* containerName , xmlChar** bundling_is_avail);

status_t cb_get_container_configuration_uuid(xmlChar* container_pac_key, xmlChar** uuid);
status_t cb_get_container_configuration_time_slot_id_keys_for_layer_protocol_key(const xmlChar* container_pac_key, xmlChar** container_configuration_time_slot_id_keys, int* num_of_keys);

status_t cb_set_container_configuration_uuid(xmlChar* container_pac_key, const xmlChar* uuid);
status_t cb_set_container_configuration_time_slot_id_keys_for_layer_protocol_key(const xmlChar* container_pac_key, const xmlChar* container_configuration_time_slot_id_keys);

status_t cb_get_all_container_capabilities_available_kinds_of_containers_keys_for_layer_protocol_key(const xmlChar* container_pac_key, xmlChar** container_type_keys, int* num_of_keys);

status_t cb_get_container_config_structure_id(xmlChar* container_config_time_slot_id_list_key, xmlChar** structure_id);
status_t cb_get_container_config_time_slot_id(xmlChar* container_config_time_slot_id_list_key, xmlChar** time_slot_id);

status_t cb_get_container_status(xmlChar* container_pac_key, xmlChar** container_status);

#endif /* YANG_MODULES_MICROWAVEMODEL_OBJECTCLASSES_MWCONNECTION_SRC_CALLBACKS_MICROWAVEMODEL_OBJECTCLASSES_MWCONNECTION_H_ */
