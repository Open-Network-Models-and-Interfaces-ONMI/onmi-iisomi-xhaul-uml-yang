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

char* cb_get_boot_time_element_value(val_value_t *element, const char* moduleName);
/*
 * module: MicrowaveModel-ObjectClasses-AirInterface
 */
status_t cb_get_all_air_interface_pac_keys(char **air_interface_pac_keys_list, int *num_of_keys);
status_t cb_get_all_supported_channel_plan_list_keys(const char *air_interface_pac_key, char **supported_channel_plan_list_key_entries, int *num_of_keys);
status_t cb_get_all_transmission_mode_id_list_keys(const char *air_interface_pac_key, const char *supported_channel_plan_key, char **transmission_mode_id_list_key_entries, int *num_of_keys);
status_t cb_get_all_problem_kind_severity_list_keys(const char *air_interface_pac_key, char **problem_kind_severity_list_key_entries, int *num_of_keys);

status_t cb_get_all_co_channel_group_id_keys(char **co_channel_group_id_keys_list, int *num_of_keys);
status_t cb_get_all_co_channel_group_air_interface_list_id_keys(const char *co_channel_group_id_key, char **co_channel_group_air_interface_list_entries, int *num_of_entries);

/*
 * module: CoreModel-CoreNetworkModule-ObjectClasses
 */
status_t cb_get_all_server_ltp_ref_leaf_list_elements_for_ltp(char* ltp_uuid, char** server_ltp_ref_leaf_list, int* num_of_elements);
status_t cb_get_all_client_ltp_ref_leaf_list_elements_for_ltp(char* ltp_uuid, char** client_ltp_ref_leaf_list, int* num_of_elements);

/*
 * module: MicrowaveModel-ObjectClasses-PureEthernetStructure
 */
status_t cb_get_all_pure_eth_structure_pac_keys(char** air_pure_eth_sructure_keys_list, int* num_of_keys);

/*
 * module: MicrowaveModel-ObjectClasses-EthernetContainer
 */
status_t cb_get_all_ethernet_container_pac_keys(char** ethernet_container_pac_keys_list, int* num_of_keys);

status_t cb_get_all_ethernet_container_problem_kind_severity_list_keys(const char *ethernet_container_pac_key, char **problem_kind_severity_list_key_entries, int *num_of_keys);

status_t cb_get_all_segment_id_list_keys(const char *ethernet_container_pac_key, char **segment_id_list_key_entries, int *num_of_keys);

#endif /* BOOT_TIME_CALLBACKS_H_ */
