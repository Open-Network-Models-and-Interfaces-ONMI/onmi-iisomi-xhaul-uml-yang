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

/*
 * module: MicrowaveModel-ObjectClasses-AirInterface
 */
status_t cb_get_all_air_interface_current_problem_list_keys(char *air_interface_pac_key, char** current_problem_list_key_entries, int* num_of_keys);
status_t cb_get_all_air_interface_current_performance_list_keys(char *air_interface_pac_key, char **historical_performance_data_list_keys_entries, int *num_of_keys);
status_t cb_get_all_air_interface_historical_performance_list_keys(char *air_interface_pac_key, char **historical_performance_data_list_keys_entries, int *num_of_keys);

status_t cb_set_runtime_airInterfaceStatus_element_value(val_value_t **element);
status_t cb_set_runtime_airInterfaceCurrentProblems_element_value(val_value_t **element);
status_t cb_set_runtime_airInterfaceCurrentPerformance_element_value(val_value_t **element);
status_t cb_set_runtime_airInterfaceHistoricalPerformance_element_value(val_value_t **element);

/*
 * module: MicrowaveModel-ObjectClasses-EthernetContainer
 */
status_t cb_get_all_ethernet_container_current_problem_list_keys(char *ethernet_container_pac_key, char** current_problem_list_key_entries, int* num_of_keys);

status_t cb_set_runtime_ethernetContainerStatus_element_value(val_value_t **element);
status_t cb_set_runtime_ethernetContainerCurrentProblem_element_value(val_value_t **element);
status_t cb_set_runtime_ethernetContainerCurrentPerformance_element_value(val_value_t **element);
status_t cb_set_runtime_ethernetContainerHistoricalPerformance_element_value(val_value_t **element);

/*
 * module: MicrowaveModel-ObjectClasses-PureEthernetStructure
 */
status_t cb_get_all_pure_eth_structure_current_problem_list_keys(char *pure_eth_structure_pac_key, char** current_problem_list_key_entries, int* num_of_keys);

status_t cb_set_runtime_pureEthernetStructure_element_value(val_value_t **element);
status_t cb_set_runtime_pureEthernetStructureCurrentProblems_element_value(val_value_t **element);


#endif /* RUNTIME_CALLBACKS_H_ */
