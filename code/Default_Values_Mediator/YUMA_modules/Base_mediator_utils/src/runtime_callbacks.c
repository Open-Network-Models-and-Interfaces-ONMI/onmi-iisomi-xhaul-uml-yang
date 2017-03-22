/*
 * runtime_callbacks.c
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#include "runtime_callbacks.h"
#include "y_microwave-model.h"
#include "y_microwave-model.h"
#include "y_microwave-model.h"
#include "y_core-model.h"

/********************************************************************
* FUNCTION cb_get_all_air_interface_current_problem_list_keys
*
* Get an array representing the keys of currentProblemList list
*
* INPUTS:
* xmlChar *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** air_interface_current_problem_list_key_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_current_problem_list_keys(xmlChar *air_interface_pac_key, xmlChar** current_problem_list_key_entries, int* num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac[layer-protocol=\"%s\"]/air-interface-current-problems/current-problem-list/sequence-number", air_interface_pac_key);

    return get_list_from_xpath(evalPath, current_problem_list_key_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_air_interface_current_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* xmlChar *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** air_interface_current_performance_list_keys_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_current_performance_list_keys(xmlChar *air_interface_pac_key, xmlChar **current_performance_data_list_keys_entries, int *num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac[layer-protocol=\"%s\"]/air-interface-current-performance/current-performance-data-list/scanner-id", air_interface_pac_key);

    return get_list_from_xpath(evalPath, current_performance_data_list_keys_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_air_interface_historical_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* xmlChar *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** air_interface_historical_performance_list_keys_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_historical_performance_list_keys(xmlChar *air_interface_pac_key, xmlChar **historical_performance_data_list_keys_entries, int *num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac[layer-protocol=\"%s\"]/air-interface-historical-performances/historical-performance-data-list/history-data-id", air_interface_pac_key);

    return get_list_from_xpath(evalPath, historical_performance_data_list_keys_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_set_runtime_element_value
*
* Set the value of the element received as a parameter with the value
* that we get from a callback specific to the element.
* If we do not have a callback implemented for the element,
* we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    const xmlChar* elementStringValue = read_value_from_file (*element);

    if (elementStringValue == NULL) //no callback implemented for this element, just use the default value
    {
        elementStringValue = obj_get_default((*element)->obj);
        need_free = FALSE; //we do not need to free the memory in this case
    }

    if (elementStringValue != NULL)
    {
        res = val_set_simval_obj(*element, (*element)->obj, elementStringValue);
        YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "val_set_simval_obj %s failed!", (*element)->name);

        if (need_free)
        {
            free(elementStringValue); //free the element that was allocated by the user in its callback function
        }
    }

    return NO_ERR;
}

/********************************************************************
* FUNCTION cb_get_all_pure_eth_structure_current_problem_list_keys
*
* Get an array representing the keys of currentProblemList list
*
* INPUTS:
* xmlChar *pure_ethernet_structure_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_pure_eth_structure_current_problem_list_keys(xmlChar *pure_ethernet_structure_pac_key, xmlChar** keys_list, int* num_of_keys)
{
    *num_of_keys = 0;
    return NO_ERR;
}

/********************************************************************
* FUNCTION key_get_all_segment_status_list_keys
*
* Get an array representing the keys of currentProblemList list
*
* INPUTS:
* xmlChar *layer_protocol_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_entries - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t key_get_all_segment_status_list_keys(xmlChar *layer_protocol_key, xmlChar** keys_list, int* num_of_entries)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-hybrid-mw-structure-pac[layer-protocol=\"%s\"]/hybrid-mw-structure-status/segment-status-list/segment-status-type-id", layer_protocol_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_entries);
}

/********************************************************************
* FUNCTION key_get_all_hybrid_structure_current_problem_list_keys
*
* Get an array representing the keys of currentProblemList list
*
* INPUTS:
* xmlChar *layer_protocol_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_entries - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t key_get_all_hybrid_structure_current_problem_list_keys(xmlChar *layer_protocol_key, xmlChar** keys_list, int* num_of_entries)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-hybrid-mw-structure-pac[layer-protocol=\"%s\"]/hybrid-mw-structure-current-problems/current-problem-list/sequence-number", layer_protocol_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_entries);
}

/********************************************************************
* FUNCTION key_get_all_hybrid_structure_current_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* xmlChar *hybrid_mw_structure_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t key_get_all_hybrid_structure_current_performance_list_keys(xmlChar *hybrid_mw_structure_pac_key, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-hybrid-mw-structure-pac[layer-protocol=\"%s\"]/hybrid-mw-structure-current-performance/current-performance-data-list/scanner-id", hybrid_mw_structure_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION key_get_all_hybrid_structure_historical_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* xmlChar *hybrid_mw_structure_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t key_get_all_hybrid_structure_historical_performance_list_keys(xmlChar *hybrid_mw_structure_pac_key, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-hybrid-mw-structure-pac[layer-protocol=\"%s\"]/hybrid-mw-structure-historical-performances/historical-performance-data-list/history-data-id", hybrid_mw_structure_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_ethernet_container_current_problem_list_keys
*
* Get an array representing the keys of currentProblemList list
*
* INPUTS:
* xmlChar *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ethernet_container_current_problem_list_keys(xmlChar *ethernet_container_pac_key, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-ethernet-container-pac[layer-protocol=\"%s\"]/ethernet-container-current-problems/current-problem-list/sequence-number", ethernet_container_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_ethernet_container_current_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* xmlChar *ethernet_container_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ethernet_container_current_performance_list_keys(xmlChar *ethernet_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-ethernet-container-pac[layer-protocol=\"%s\"]/ethernet-container-current-performance/current-performance-data-list/scanner-id", ethernet_container_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_ethernet_container_historical_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* xmlChar *ethernet_container_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ethernet_container_historical_performance_list_keys(xmlChar *ethernet_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-ethernet-container-pac[layer-protocol=\"%s\"]/ethernet-container-historical-performances/historical-performance-data-list/history-data-id", ethernet_container_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/*
 * MODULE: microwave tdm-container
 *         Keys of the instances
 */
status_t key_get_tdm_container_current_problem_list(const xmlChar *tdm_container_pac_key, xmlChar** keys_list, int* num_of_keys)
{
	xmlChar evalPath[1000];
	sprintf((xmlChar*)evalPath, "/data/mw-tdm-container-pac[layer-protocol=\"%s\"]/tdm-container-current-problems/current-problem-list/sequence-number", tdm_container_pac_key);

	return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_tdm_container_current_performance_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
	xmlChar evalPath[1000];
	sprintf((xmlChar*)evalPath, "/data/mw-tdm-container-pac[layer-protocol=\"%s\"]/tdm-container-current-performance/current-performance-data-list/scanner-id", tdm_container_pac_key);

	return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_tdm_container_historical_performance_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
	xmlChar evalPath[1000];
	sprintf((xmlChar*)evalPath, "/data/mw-tdm-container-pac[layer-protocol=\"%s\"]/tdm-container-historical-performances/historical-performance-data-list/history-data-id", tdm_container_pac_key);

	return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

