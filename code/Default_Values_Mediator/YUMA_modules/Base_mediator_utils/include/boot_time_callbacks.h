/*
 * boot_time_callbacks.h
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#ifndef BOOT_TIME_CALLBACKS_H_
#define BOOT_TIME_CALLBACKS_H_

#include "status.h"
#include "val.h"

xmlChar* cb_get_boot_time_element_value(val_value_t *element, const xmlChar* moduleName);
/*
 * air-interface
 */
status_t cb_get_all_air_interface_pac_keys(xmlChar **keys_list, int *num_of_keys);
status_t cb_get_all_supported_loop_back_kind_list_key(const xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys);
status_t cb_get_all_supported_channel_plan_list_keys(const xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys);
status_t cb_get_all_transmission_mode_id_list_keys(const xmlChar *air_interface_pac_key, const xmlChar *supported_channel_plan_key, xmlChar **keys_list, int *num_of_keys);
status_t cb_get_all_problem_kind_severity_list_keys(const xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys);

status_t cb_get_all_co_channel_group_id_keys(xmlChar **co_channel_group_id_keys_list, int *num_of_keys);
status_t cb_get_all_co_channel_group_air_interface_list_keys(const xmlChar *co_channel_key, xmlChar **keys_list, int *num_of_keys);
status_t cb_get_all_co_channel_group_logical_termination_point_keys(const xmlChar *co_channel_key, xmlChar **keys_list, int *num_of_keys);

/*
 * pure-ethernet-structure
 */
status_t cb_get_all_pure_eth_structure_pac_keys(xmlChar** air_pure_eth_sructure_keys_list, int* num_of_keys);
status_t cb_get_all_pure_ethernet_structure_problem_kind_severity_list_keys(const xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys);

/*
 * hybrid-mw-structure
 */
status_t key_get_all_hybrid_structure_pac_keys(xmlChar** air_interface_pac_keys_list, int* num_of_keys);
status_t key_get_all_tdm_structure_name_list_keys(const xmlChar *layer_protocol_key, xmlChar** keys_list, int* num_of_keys);
status_t key_get_all_hybrid_structure_problem_kind_severity_list_keys(const xmlChar *layer_protocol_key, xmlChar** keys_list, int* num_of_keys);

/*
 * ethernet-container
 */
status_t cb_get_all_ethernet_container_pac_keys(xmlChar** ethernet_container_pac_keys_list, int* num_of_keys);

status_t cb_get_all_ethernet_container_problem_kind_severity_list_keys(const xmlChar *ethernet_container_pac_key, xmlChar **keys_list, int *num_of_keys);

status_t cb_get_all_structure_id_list_keys(const xmlChar *ethernet_container_pac_key, xmlChar **keys_list, int *num_of_keys);
status_t cb_get_all_segment_id_list_keys(const xmlChar *ethernet_container_pac_key, xmlChar **keys_list, int *num_of_keys);

/*
 * tdm-container
 */
status_t key_get_all_tdm_container(xmlChar** keys_list, int* num_of_keys);
status_t key_get_supported_tdm_container_types_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys);
status_t key_get_tdm_container_problem_kind_severity_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys);

/* core-model */
status_t key_get_all_network_elements(xmlChar** keys_list, int* num_of_elements);
status_t key_get_all_ltps(xmlChar** keys_list, int* num_of_keys);
status_t key_get_lp_list_by_ltp(xmlChar** nested_key, int num_of_nested_key, const xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_keys);
status_t key_get_all_name_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys);
status_t key_get_all_label_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys);
status_t key_get_all_extension_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys);
status_t key_get_all_localid_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys);
status_t key_get_client_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_elements);
status_t key_get_server_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_elements);
status_t key_get_all_physical_port_reference(xmlChar** nested_key, int num_of_nested_key, xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_keys);
status_t key_get_all_ltp_in_other_view(xmlChar** nested_key, int num_of_nested_key, xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_elements);

#endif /* BOOT_TIME_CALLBACKS_H_ */
