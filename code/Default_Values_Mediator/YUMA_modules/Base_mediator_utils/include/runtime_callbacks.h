/*
 * runtime_callbacks.h
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#ifndef RUNTIME_CALLBACKS_H_
#define RUNTIME_CALLBACKS_H_

#include "status.h"
#include "val.h"
#include "utils.h"

xmlChar* cb_get_runtime_element_value(val_value_t *element, const xmlChar* moduleName);
/*
 * module: air-interface
 */
status_t cb_get_all_air_interface_current_problem_list_keys(xmlChar *air_interface_pac_key, xmlChar** keys_list, int* num_of_keys);
status_t cb_get_all_air_interface_current_performance_list_keys(xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys);
status_t cb_get_all_air_interface_historical_performance_list_keys(xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys);

status_t cb_set_runtime_element_value(val_value_t **element);

/*
 * module: pure-ethernet-structure
 */
status_t cb_get_all_pure_eth_structure_current_problem_list_keys(xmlChar *pure_eth_structure_pac_key, xmlChar** keys_list, int* num_of_keys);

/*
 * module: hybrid-mw-structure
 */
status_t key_get_all_hybrid_structure_current_problem_list_keys(xmlChar *layer_protocol_key, xmlChar** keys_list, int* num_of_entries);
status_t key_get_all_hybrid_structure_current_performance_list_keys(xmlChar *hybrid_mw_structure_pac_key, xmlChar** keys_list, int* num_of_keys);
status_t key_get_all_hybrid_structure_historical_performance_list_keys(xmlChar *hybrid_mw_structure_pac_key, xmlChar** keys_list, int* num_of_keys);

/*
 * module: ethernet-container
 */
status_t cb_get_all_ethernet_container_current_problem_list_keys(xmlChar *ethernet_container_pac_key, xmlChar** keys_list, int* num_of_keys);

/*
 * module: tdm-container
 */
status_t key_get_tdm_container_current_problem_list(const xmlChar *tdm_container_pac_key, xmlChar** keys_list, int* num_of_keys);
status_t key_get_tdm_container_current_performance_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys);
status_t key_get_tdm_container_historical_performance_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys);

#endif /* RUNTIME_CALLBACKS_H_ */
