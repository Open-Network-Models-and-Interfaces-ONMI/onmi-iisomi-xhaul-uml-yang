/*
 * runtime_callbacks.c
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#include "runtime_callbacks.h"
#include "y_MicrowaveModel-ObjectClasses-AirInterface.h"
#include "y_MicrowaveModel-ObjectClasses-PureEthernetStructure.h"
#include "y_MicrowaveModel-ObjectClasses-EthernetContainer.h"
#include "y_CoreModel-CoreNetworkModule-ObjectClasses.h"
#include "dvm_runtime_callbacks.h"

/*
 * module: MicrowaveModel-ObjectClasses-AirInterface
 */
static char* cb_get_runtime_airInterfaceStatus_value(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_txFrequencyCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_rxFrequencyCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_txLevelCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_rxLevelCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_modulationCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_informationRateCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_snirCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_xpdCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_rfTempCur(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_lastStatusChange(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_radioPowerIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_linkIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_xpicIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_mimoIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_alicIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_atpcIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_autoFreqSelectIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_loopBackIsUp(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_localEndPointId(val_value_t *element);
static char* cb_get_runtime_airInterfaceStatus_remoteEndPointId(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentProblems_value(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentProblemList_problem_timeStamp(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentProblemList_problem_problemName(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentProblemList_problem_problemSeverity(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_value(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_granularityPeriod(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_administrativeState(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_suspectIntervalFlag(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_elapsedTime(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_timestamp(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_es(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_ses(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_cses(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_unavailability(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4SymbolsS(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16SymbolsS(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time32Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time64Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time128Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time256Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192SymbolsL(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_defectBlocksSum(val_value_t *element);
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_timePeriod(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_value(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_periodEndTime(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_granularityPeriod(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_suspectIntervalFlag(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_es(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_ses(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_cses(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_unavailability(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4SymbolsS(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16SymbolsS(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time32Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time64Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time128Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time256Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096SymbolsL(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192Symbols(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192SymbolsL(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMin(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMax(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempAvg(val_value_t *element);

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_defectBlocksSum(val_value_t *element);
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_timePeriod(val_value_t *element);

/*
 * module: MicrowaveModel-ObjectClasses-PureEthernetStructure
 */
static char* cb_get_runtime_pureEthernetStructureStatus_value(val_value_t *element);
static char* cb_get_runtime_pureEthernetStructureStatus_segmentStatusTypeId(val_value_t *element);
static char* cb_get_runtime_pureEthernetStructureStatus_segmentIsReservedForTdm(val_value_t *element);
static char* cb_get_runtime_pureEthernetStructureStatus_operationalStatus(val_value_t *element);

static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_value(val_value_t *element);
static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timestamp(val_value_t *element);
static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName(val_value_t *element);
static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity(val_value_t *element);

/*
 * module: MicrowaveModel-ObjectClasses-EthernetContainer
 */
static char* cb_get_runtime_ethernetContainerStatus_value(val_value_t *element);
static char* cb_get_runtime_ethernetContainerStatus_lastStatusChange(val_value_t *element);

static char* cb_get_runtime_ethernetContainerCurrentProblem_value(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentProblem_timeStamp(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentProblem_problemName(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentProblem_problemSeverity(val_value_t *element);

static char* cb_get_runtime_ethernetContainerCurrentPerformance_value(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_granularityPeriod(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_administrativeState(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_suspectIntervalFlag(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_elapsedTime(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_timestamp(val_value_t *element);

static char* cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxS(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxM(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesSum(val_value_t *element);
static char* cb_get_runtime_ethernetContainerCurrentPerformance_timePeriod(val_value_t *element);

static char* cb_get_runtime_ethernetContainerHistoricalPerformances_value(val_value_t *element);
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_periodEndTime(val_value_t *element);
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_granularityPeriod(val_value_t *element);
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_suspectIntervalFlag(val_value_t *element);

static char* cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxS(val_value_t *element);
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxM(val_value_t *element);
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesSum(val_value_t *element);
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_timePeriod(val_value_t *element);

/********************************************************************
* FUNCTION cb_get_all_air_interface_current_problem_list_keys
*
* Get an array representing the keys of currentProblemList list
*
* INPUTS:
* char *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* char** air_interface_current_problem_list_key_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_current_problem_list_keys(char *air_interface_pac_key, char** current_problem_list_key_entries, int* num_of_keys)
{
	return dvm_cb_get_all_air_interface_current_problem_list_keys(air_interface_pac_key, current_problem_list_key_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_air_interface_current_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* char *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* char** air_interface_current_performance_list_keys_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_current_performance_list_keys(char *air_interface_pac_key, char **current_performance_data_list_keys_entries, int *num_of_keys)
{
	return dvm_cb_get_all_air_interface_current_performance_list_keys(air_interface_pac_key, current_performance_data_list_keys_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_air_interface_historical_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* char *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* char** air_interface_historical_performance_list_keys_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_historical_performance_list_keys(char *air_interface_pac_key, char **historical_performance_data_list_keys_entries, int *num_of_keys)
{
    return dvm_cb_get_all_air_interface_historical_performance_list_keys(air_interface_pac_key, historical_performance_data_list_keys_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_set_runtime_airInterfaceStatus_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_airInterfaceStatus_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_airInterfaceStatus_value(*element);

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
* FUNCTION cb_set_runtime_airInterfaceCurrentProblems_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_airInterfaceCurrentProblems_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_airInterfaceCurrentProblems_value(*element);

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
* FUNCTION cb_set_runtime_airInterfaceCurrentPerformance_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_airInterfaceCurrentPerformance_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_airInterfaceCurrentPerformance_value(*element);

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
* FUNCTION cb_set_runtime_airInterfaceHistoricalPerformance_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_airInterfaceHistoricalPerformance_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_value(*element);

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
* FUNCTION cb_set_runtime_pureEthernetStructureCurrentProblems_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_pureEthernetStructureCurrentProblems_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_value(*element);

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
* FUNCTION cb_set_runtime_ethernetContainerCurrentPerformance_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_ethernetContainerCurrentPerformance_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_ethernetContainerCurrentPerformance_value(*element);

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
* FUNCTION cb_get_runtime_airInterfaceCurrentProblemList_problem_timeStamp
*
* Callback function for getting the value of the timeStamp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentProblemList_problem_timeStamp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *sequenceNumberKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
    YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, and sequenceNumberKey as keys to find the information. E.g.:
     */

    return dvm_cb_get_runtime_airInterfaceCurrentProblemList_problem_timeStamp(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentProblemList_problem_problemName
*
* Callback function for getting the value of the problemName leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentProblemList_problem_problemName(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *sequenceNumberKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
    YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, and sequenceNumberKey as keys to find the information. E.g.:
     */

    return dvm_cb_get_runtime_airInterfaceCurrentProblemList_problem_problemName(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentProblemList_problem_problemSeverity
*
* Callback function for getting the value of the problemSeverity leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentProblemList_problem_problemSeverity(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *sequenceNumberKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
    YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, and sequenceNumberKey as keys to find the information. E.g.:
     */

    return dvm_cb_get_runtime_airInterfaceCurrentProblemList_problem_problemSeverity(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txFrequencyCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_txFrequencyCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxFrequencyCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_rxFrequencyCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_txLevelCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_rxLevelCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_modulationCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_informationRateCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_informationRateCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_snirCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_xpdCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempCur) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_rfTempCur(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_lastStatusChange) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_lastStatusChange(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_radioPowerIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_radioPowerIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_linkIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_linkIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpicIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_xpicIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_mimoIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_mimoIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_alicIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_alicIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_atpcIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_autoFreqSelectIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_autoFreqSelectIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_loopBackIsUp) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_loopBackIsUp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_localEndPointId) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_localEndPointId(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_remoteEndPointId) == 0)
    {
        return cb_get_runtime_airInterfaceStatus_remoteEndPointId(element);
    }

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_txFrequencyCur
*
* Callback function for getting the value of the txFrequencyCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_txFrequencyCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information. E.g.:
     */

    return dvm_cb_get_runtime_airInterfaceStatus_txFrequencyCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_rxFrequencyCur
*
* Callback function for getting the value of the rxFrequencyCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_rxFrequencyCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_rxFrequencyCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_txLevelCur
*
* Callback function for getting the value of the txLevelCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_txLevelCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_txLevelCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_rxLevelCur
*
* Callback function for getting the value of the rxLevelCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_rxLevelCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_rxLevelCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_modulationCur
*
* Callback function for getting the value of the modulationCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_modulationCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_modulationCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_informationRateCur
*
* Callback function for getting the value of the informationRateCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_informationRateCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_informationRateCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_snirCur
*
* Callback function for getting the value of the snirCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_snirCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_snirCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_xpdCur
*
* Callback function for getting the value of the xpdCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_xpdCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_xpdCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_rfTempCur
*
* Callback function for getting the value of the rfTempCur leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_rfTempCur(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_rfTempCur(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_lastStatusChange
*
* Callback function for getting the value of the lastStatusChange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_lastStatusChange(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_lastStatusChange(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_radioPowerIsUp
*
* Callback function for getting the value of the radioPowerIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_radioPowerIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_radioPowerIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_linkIsUp
*
* Callback function for getting the value of the linkIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_linkIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_linkIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_xpicIsUp
*
* Callback function for getting the value of the xpicIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_xpicIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_xpicIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_mimoIsUp
*
* Callback function for getting the value of the mimoIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_mimoIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_mimoIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_alicIsUp
*
* Callback function for getting the value of the alicIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_alicIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_alicIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_atpcIsUp
*
* Callback function for getting the value of the atpcIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_atpcIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_atpcIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_autoFreqSelectIsUp
*
* Callback function for getting the value of the autoFreqSelectIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_autoFreqSelectIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_autoFreqSelectIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_loopBackIsUp
*
* Callback function for getting the value of the loopBackIsUp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_loopBackIsUp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_loopBackIsUp(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_localEndPointId
*
* Callback function for getting the value of the localEndPointId leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_localEndPointId(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_localEndPointId(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceStatus_remoteEndPointId
*
* Callback function for getting the value of the remoteEndPointId leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceStatus_remoteEndPointId(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceStatus_remoteEndPointId(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentProblems_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentProblems_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timeStamp) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentProblemList_problem_timeStamp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemName) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentProblemList_problem_problemName(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemSeverity) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentProblemList_problem_problemSeverity(element);
    }

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_granularityPeriod) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_granularityPeriod(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_administrativeState) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_administrativeState(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_suspectIntervalFlag) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_suspectIntervalFlag(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_elapsedTime) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_elapsedTime(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timestamp) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_timestamp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_es) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_es(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_ses) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_ses(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_cses) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_cses(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_unavailability) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_unavailability(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMin) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMax) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelAvg) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMin) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMax) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelAvg) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4SymbolsS) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4SymbolsS(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16SymbolsS) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16SymbolsS(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time32Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time32Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time64Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time64Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time128Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time128Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time256Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time256Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMin) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMax) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirAvg) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMin) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMax) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdAvg) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMin) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMax) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempAvg) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_defectBlocksSum) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_defectBlocksSum(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timePeriod) == 0)
    {
        return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_timePeriod(element);
    }

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_granularityPeriod
*
* Callback function for getting the value of the granularityPeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_granularityPeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_granularityPeriod(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_administrativeState
*
* Callback function for getting the value of the administrativeState leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_administrativeState(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return strdup("UNLOCKED");
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_suspectIntervalFlag
*
* Callback function for getting the value of the suspectIntervalFlag leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_suspectIntervalFlag(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_suspectIntervalFlag(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_elapsedTime
*
* Callback function for getting the value of the elapsedTime leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_elapsedTime(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_elapsedTime(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_timestamp
*
* Callback function for getting the value of the timestamp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_timestamp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_timestamp(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_es
*
* Callback function for getting the value of the es leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/

static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_es(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_es(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_ses
*
* Callback function for getting the value of the ses leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_ses(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_ses(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_cses
*
* Callback function for getting the value of the cses leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_cses(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_cses(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_unavailability
*
* Callback function for getting the value of the unavailability leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_unavailability(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_unavailability(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMin
*
* Callback function for getting the value of the txLevelMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMin(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMax
*
* Callback function for getting the value of the txLevelMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMax(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelAvg
*
* Callback function for getting the value of the txLevelAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelAvg(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMin
*
* Callback function for getting the value of the rxLevelMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMin(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMax
*
* Callback function for getting the value of the rxLevelMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMax(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelAvg
*
* Callback function for getting the value of the rxLevelAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelAvg(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2Symbols
*
* Callback function for getting the value of the time2Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4SymbolsS
*
* Callback function for getting the value of the time4SymbolsS leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4SymbolsS(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4SymbolsS(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4Symbols
*
* Callback function for getting the value of the time4Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8Symbols
*
* Callback function for getting the value of the time8Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16SymbolsS
*
* Callback function for getting the value of the time16SymbolsS leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16SymbolsS(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16SymbolsS(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16Symbols
*
* Callback function for getting the value of the time16Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time32Symbols
*
* Callback function for getting the value of the time32Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time32Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time32Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time64Symbols
*
* Callback function for getting the value of the time64Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time64Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time64Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time128Symbols
*
* Callback function for getting the value of the time128Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time128Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time128Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time256Symbols
*
* Callback function for getting the value of the time256Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time256Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time256Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512Symbols
*
* Callback function for getting the value of the time512Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512SymbolsL
*
* Callback function for getting the value of the time512SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024Symbols
*
* Callback function for getting the value of the time1024Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024SymbolsL
*
* Callback function for getting the value of the time1024SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048Symbols
*
* Callback function for getting the value of the time2048Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048SymbolsL
*
* Callback function for getting the value of the time2048SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096Symbols
*
* Callback function for getting the value of the time4096Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096SymbolsL
*
* Callback function for getting the value of the time4096SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192Symbols
*
* Callback function for getting the value of the time8192Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192SymbolsL
*
* Callback function for getting the value of the time8192SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMin
*
* Callback function for getting the value of the snirMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMin(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMax
*
* Callback function for getting the value of the snirMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMax(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirAvg
*
* Callback function for getting the value of the snirAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirAvg(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMin
*
* Callback function for getting the value of the xpdMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMin(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMax
*
* Callback function for getting the value of the xpdMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMax(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdAvg
*
* Callback function for getting the value of the xpdAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdAvg(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMin
*
* Callback function for getting the value of the rfTempMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMin(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMax
*
* Callback function for getting the value of the rfTempMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMax(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempAvg
*
* Callback function for getting the value of the rfTempAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempAvg(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_defectBlocksSum
*
* Callback function for getting the value of the defectBlocksSum leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_defectBlocksSum(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_defectBlocksSum(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_timePeriod
*
* Callback function for getting the value of the timePeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_timePeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_timePeriod(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_objectClass
*
* Callback function for getting the value of the objectClass leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_objectClass(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_nameBinding
*
* Callback function for getting the value of the nameBinding leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_nameBinding(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return NULL;
}

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_periodEndTime) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_periodEndTime(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_granularityPeriod) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_granularityPeriod(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_suspectIntervalFlag) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_suspectIntervalFlag(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_es) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_es(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_ses) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_ses(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_cses) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_cses(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_unavailability) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_unavailability(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMin) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMax) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelAvg) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMin) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMax) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelAvg) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4SymbolsS) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4SymbolsS(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16SymbolsS) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16SymbolsS(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time32Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time32Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time64Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time64Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time128Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time128Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time256Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time256Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192Symbols) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192Symbols(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192SymbolsL) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192SymbolsL(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMin) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMax) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirAvg) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMin) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMax) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdAvg) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMin) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMin(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMax) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMax(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempAvg) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempAvg(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_defectBlocksSum) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_defectBlocksSum(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timePeriod) == 0)
    {
        return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_timePeriod(element);
    }

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_periodEndTime
*
* Callback function for getting the value of the periodEndTime leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_periodEndTime(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_periodEndTime(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_granularityPeriod
*
* Callback function for getting the value of the granularityPeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_granularityPeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_granularityPeriod(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_suspectIntervalFlag
*
* Callback function for getting the value of the suspectIntervalFlag leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_suspectIntervalFlag(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_suspectIntervalFlag(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_es
*
* Callback function for getting the value of the es leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/

static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_es(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_es(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_ses
*
* Callback function for getting the value of the ses leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_ses(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_ses(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_cses
*
* Callback function for getting the value of the cses leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_cses(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_cses(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_unavailability
*
* Callback function for getting the value of the unavailability leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_unavailability(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_unavailability(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMin
*
* Callback function for getting the value of the txLevelMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMin(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMax
*
* Callback function for getting the value of the txLevelMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMax(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelAvg
*
* Callback function for getting the value of the txLevelAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelAvg(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMin
*
* Callback function for getting the value of the rxLevelMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMin(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMax
*
* Callback function for getting the value of the rxLevelMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMax(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelAvg
*
* Callback function for getting the value of the rxLevelAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelAvg(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2Symbols
*
* Callback function for getting the value of the time2Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4SymbolsS
*
* Callback function for getting the value of the time4SymbolsS leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4SymbolsS(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4SymbolsS(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4Symbols
*
* Callback function for getting the value of the time4Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}
/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8Symbols
*
* Callback function for getting the value of the time8Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16SymbolsS
*
* Callback function for getting the value of the time16SymbolsS leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16SymbolsS(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16SymbolsS(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16Symbols
*
* Callback function for getting the value of the time16Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time32Symbols
*
* Callback function for getting the value of the time32Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time32Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time32Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time64Symbols
*
* Callback function for getting the value of the time64Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time64Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time64Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time128Symbols
*
* Callback function for getting the value of the time128Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time128Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time128Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time256Symbols
*
* Callback function for getting the value of the time256Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time256Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time256Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512Symbols
*
* Callback function for getting the value of the time512Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512SymbolsL
*
* Callback function for getting the value of the time512SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024Symbols
*
* Callback function for getting the value of the time1024Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024SymbolsL
*
* Callback function for getting the value of the time1024SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048Symbols
*
* Callback function for getting the value of the time2048Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048SymbolsL
*
* Callback function for getting the value of the time2048SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096Symbols
*
* Callback function for getting the value of the time4096Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096SymbolsL
*
* Callback function for getting the value of the time4096SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192Symbols
*
* Callback function for getting the value of the time8192Symbols leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192Symbols(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192Symbols(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192SymbolsL
*
* Callback function for getting the value of the time8192SymbolsL leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192SymbolsL(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192SymbolsL(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMin
*
* Callback function for getting the value of the snirMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMin(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMax
*
* Callback function for getting the value of the snirMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMax(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirAvg
*
* Callback function for getting the value of the snirAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirAvg(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMin
*
* Callback function for getting the value of the xpdMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMin(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMax
*
* Callback function for getting the value of the xpdMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMax(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdAvg
*
* Callback function for getting the value of the xpdAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdAvg(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMin
*
* Callback function for getting the value of the rfTempMin leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMin(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMin(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMax
*
* Callback function for getting the value of the rfTempMax leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMax(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMax(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempAvg
*
* Callback function for getting the value of the rfTempAvg leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempAvg(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempAvg(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_defectBlocksSum
*
* Callback function for getting the value of the defectBlocksSum leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_defectBlocksSum(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_defectBlocksSum(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_timePeriod
*
* Callback function for getting the value of the timePeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_timePeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_timePeriod(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_set_runtime_pureEthernetStructure_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_pureEthernetStructure_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_pureEthernetStructureStatus_value(*element);

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
* FUNCTION cb_set_runtime_ethernetContainerStatus_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_ethernetContainerStatus_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_ethernetContainerStatus_value(*element);

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
* FUNCTION cb_get_runtime_ethernetContainerStatus_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerStatus_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_lastStatusChange) == 0)
    {
        return cb_get_runtime_ethernetContainerStatus_lastStatusChange(element);
    }

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerStatus_lastStatusChange
*
* Callback function for getting the value of the lastStatusChange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerStatus_lastStatusChange(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */


    return dvm_cb_get_runtime_ethernetContainerStatus_lastStatusChange(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_pureEthernetStructureStatus_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureStatus_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_segmentStatusTypeId) == 0)
    {
        return cb_get_runtime_pureEthernetStructureStatus_segmentStatusTypeId(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_segmentIsReservedForTdm) == 0)
    {
        return cb_get_runtime_pureEthernetStructureStatus_segmentIsReservedForTdm(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_operationalStatus) == 0)
    {
        return cb_get_runtime_pureEthernetStructureStatus_operationalStatus(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_lastStatusChange) == 0)
	{
		return cb_get_runtime_airInterfaceStatus_lastStatusChange(element);
	}

	return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_pureEthernetStructureStatus_segmentStatusTypeId
*
* Callback function for getting the value of the lastStatusChange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureStatus_segmentStatusTypeId(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_pureEthernetStructureStatus_segmentStatusTypeId(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_pureEthernetStructureStatus_segmentIsReservedForTdm
*
* Callback function for getting the value of the lastStatusChange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureStatus_segmentIsReservedForTdm(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_pureEthernetStructureStatus_segmentIsReservedForTdm(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_pureEthernetStructureStatus_operationalStatus
*
* Callback function for getting the value of the lastStatusChange leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureStatus_operationalStatus(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;

    val_value_t* parentHavingKey = element->parent;

    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);

    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */
    return dvm_cb_get_runtime_pureEthernetStructureStatus_operationalStatus(VAL_STRING(layerProtocolKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timeStamp
*
* Callback function for getting the value of the timeStamp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timeStamp(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *sequenceNumberKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, and sequenceNumberKey as keys to find the information. E.g.:
	 */

	return dvm_cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timeStamp(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName
*
* Callback function for getting the value of the problemName leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *sequenceNumberKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, and sequenceNumberKey as keys to find the information. E.g.:
	 */

	return dvm_cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

/********************************************************************
* FUNCTIONcb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity
*
* Callback function for getting the value of the problemSeverity leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity(val_value_t *element)
{
	val_value_t *lastkey = NULL;
	val_value_t *layerProtocolKey = NULL;
	val_value_t *sequenceNumberKey = NULL;

	val_value_t* parentHavingKey = element->parent;

	YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);
	layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
	sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);

	YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find layerProtocolKey for element %s", element->name);
	YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

	/*
	 * return the actual value for the attribute here, represented as a string, using the layerProtocolKey, and sequenceNumberKey as keys to find the information. E.g.:
	 */

	return dvm_cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}


/********************************************************************
* FUNCTION cb_get_all_ethernet_container_current_problem_list_keys
*
* Get an array representing the keys of currentProblemList list
*
* INPUTS:
* char *air_interface_pac_key - the key of the current interface
* OUTPUTS:
* char** ethernet_container_current_problem_list_key_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ethernet_container_current_problem_list_keys(char *ethernet_container_pac_key, char** current_problem_list_key_entries, int* num_of_keys)
{
    return dvm_cb_get_all_ethernet_container_current_problem_list_keys(ethernet_container_pac_key, current_problem_list_key_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_ethernet_container_current_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* char *ethernet_container_pac_key - the key of the current interface
* OUTPUTS:
* char** ethernet_container_current_performance_list_keys_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ethernet_container_current_performance_list_keys(char *ethernet_container_pac_key, char **current_performance_data_list_keys_entries, int *num_of_keys)
{
    return dvm_cb_get_all_ethernet_container_current_performance_list_keys(ethernet_container_pac_key, current_performance_data_list_keys_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_ethernet_container_historical_performance_list_keys
*
* Get an array representing the keys of historicalPerformanceDataList list
*
* INPUTS:
* char *ethernet_container_pac_key - the key of the current interface
* OUTPUTS:
* char** ethernet_container_historical_performance_list_keys_entries - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ethernet_container_historical_performance_list_keys(char *ethernet_container_pac_key, char **historical_performance_data_list_keys_entries, int *num_of_keys)
{
    return dvm_cb_get_all_ethernet_container_historical_performance_list_keys(ethernet_container_pac_key, historical_performance_data_list_keys_entries, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_granularityPeriod) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_granularityPeriod(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_administrativeState) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_administrativeState(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_suspectIntervalFlag) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_suspectIntervalFlag(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_elapsedTime) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_elapsedTime(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_timestamp) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_timestamp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxS) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxS(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxM) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxM(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesSum) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesSum(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_timePeriod) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentPerformance_timePeriod(element);
    }
    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_objectClass
*
* Callback function for getting the value of the objectClass leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_objectClass(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey and historyDataId as keys to find the information
     */

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_nameBinding
*
* Callback function for getting the value of the nameBinding leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_nameBinding(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_scannerId
*
* Callback function for getting the value of the scannerId leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_scannerId(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_granularityPeriod
*
* Callback function for getting the value of the granularityPeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_granularityPeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_granularityPeriod(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_administrativeState
*
* Callback function for getting the value of the administrativeState leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_administrativeState(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_administrativeState(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_suspectIntervalFlag
*
* Callback function for getting the value of the suspectIntervalFlag leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_suspectIntervalFlag(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_suspectIntervalFlag(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_elapsedTime
*
* Callback function for getting the value of the elapsedTime leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_elapsedTime(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_elapsedTime(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_timestamp
*
* Callback function for getting the value of the timestamp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_timestamp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_timestamp(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxS
*
* Callback function for getting the value of the txEthernetBytesMaxS leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxS(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxS(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxM
*
* Callback function for getting the value of the txEthernetBytesMaxM leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxM(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxM(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesSum
*
* Callback function for getting the value of the txEthernetBytesSum leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesSum(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesSum(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentPerformance_timePeriod
*
* Callback function for getting the value of the timePeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentPerformance_timePeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *scannerId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    scannerId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == scannerId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(scannerId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentPerformance_timePeriod(VAL_STRING(layerProtocolKey), VAL_STRING(scannerId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_periodEndTime) == 0)
    {
        return cb_get_runtime_ethernetContainerHistoricalPerformances_periodEndTime(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_granularityPeriod) == 0)
    {
        return cb_get_runtime_ethernetContainerHistoricalPerformances_granularityPeriod(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_suspectIntervalFlag) == 0)
    {
        return cb_get_runtime_ethernetContainerHistoricalPerformances_suspectIntervalFlag(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxS) == 0)
    {
        return cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxS(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxM) == 0)
    {
        return cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxM(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesSum) == 0)
    {
        return cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesSum(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_timePeriod) == 0)
    {
        return cb_get_runtime_ethernetContainerHistoricalPerformances_timePeriod(element);
    }
    return NULL;
}

/********************************************************************
* FUNCTION cb_set_runtime_ethernetContainerHistoricalPerformance_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_ethernetContainerHistoricalPerformance_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_ethernetContainerHistoricalPerformances_value(*element);

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
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_periodEndTime
*
* Callback function for getting the value of the periodEndTime leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_periodEndTime(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_periodEndTime(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_granularityPeriod
*
* Callback function for getting the value of the granularityPeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_granularityPeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_granularityPeriod(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_suspectIntervalFlag
*
* Callback function for getting the value of the suspectIntervalFlag leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_suspectIntervalFlag(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_suspectIntervalFlag(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxS
*
* Callback function for getting the value of the txEthernetBytesMaxS leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxS(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxS(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxM
*
* Callback function for getting the value of the txEthernetBytesMaxM leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxM(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxM(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesSum
*
* Callback function for getting the value of the txEthernetBytesSum leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesSum(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesSum(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerHistoricalPerformances_timePeriod
*
* Callback function for getting the value of the timePeriod leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerHistoricalPerformances_timePeriod(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *historyDataId = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    historyDataId = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == historyDataId, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(historyDataId), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_timePeriod(VAL_STRING(layerProtocolKey), VAL_STRING(historyDataId));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentProblem_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentProblem_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_timeStamp) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentProblem_timeStamp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_problemName) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentProblem_problemName(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_problemSeverity) == 0)
    {
        return cb_get_runtime_ethernetContainerCurrentProblem_problemSeverity(element);
    }
    return NULL;
}

/********************************************************************
* FUNCTION cb_get_runtime_pureEthernetStructureCurrentProblem_value
*
* A general function that calls a specific callback for each attribute, depending on its name
*
* INPUTS:
* val_value_t *element - the element for which we need its value
*
* RETURNS:
*     the value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_value(val_value_t *element)
{
    if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_timeStamp) == 0)
    {
        return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timeStamp(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_problemName) == 0)
    {
        return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName(element);
    }
    else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_problemSeverity) == 0)
    {
        return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity(element);
    }
    return NULL;
}

/********************************************************************
* FUNCTION cb_set_runtime_ethernetContainerCurrentProblem_element_value
*
* Set the value of the element received as a parameter with the value that we get from a callback specific to the element.
* If we do not have a callback implemented for the element, we use the default value from the YANG file.
*
* OUTPUTS:
* val_value_t **element - the element that will have its value changed
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_set_runtime_ethernetContainerCurrentProblem_element_value(val_value_t **element)
{
    status_t res = NO_ERR;
    int need_free = TRUE;

    YUMA_ASSERT(NULL == (*element), return ERR_INTERNAL_VAL, "NULL element received");

    //get the element value through the callback
    char* elementStringValue = cb_get_runtime_ethernetContainerCurrentProblem_value(*element);

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
* FUNCTION cb_get_runtime_ethernetContainerCurrentProblem_timeStamp
*
* Callback function for getting the value of the timestamp leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentProblem_timeStamp(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *sequenceNumberKey = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find keys for element %s", element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentProblem_timeStamp(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentProblem_problemName
*
* Callback function for getting the value of the problemName leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentProblem_problemName(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *sequenceNumberKey = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find keys for element %s", element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentProblem_problemName(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

/********************************************************************
* FUNCTION cb_get_runtime_ethernetContainerCurrentProblem_problemSeverity
*
* Callback function for getting the value of the problemSeverity leaf
*
* INPUTS:
* val_value_t *element - the element for which we want the value
*
* RETURNS:
* The value of the element, represented as a string
********************************************************************/
static char* cb_get_runtime_ethernetContainerCurrentProblem_problemSeverity(val_value_t *element)
{
    val_value_t *lastkey = NULL;
    val_value_t *layerProtocolKey = NULL;
    val_value_t *sequenceNumberKey = NULL;

    val_value_t* parentHavingKey = element->parent;
    YUMA_ASSERT(NULL == parentHavingKey, return NULL, "Could not find parent of element %s", element->name);

    layerProtocolKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == layerProtocolKey, return NULL, "Could not find keys for element %s", element->name);
    YUMA_ASSERT(NULL == VAL_STRING(layerProtocolKey), return NULL, "Could not access value of the key %s for element %s", layerProtocolKey->name, element->name);

    sequenceNumberKey = agt_get_key_value(parentHavingKey, &lastkey);
    YUMA_ASSERT(NULL == sequenceNumberKey, return NULL, "Could not find keys for element %s", element->name);

    /*
     * return the actual value for the attribute here, represented as a string, using the layerProtocolKey as a key to find the information
     */

    return dvm_cb_get_runtime_ethernetContainerCurrentProblem_problemSeverity(VAL_STRING(layerProtocolKey), VAL_INT32(sequenceNumberKey));
}

char* cb_get_runtime_element_value(val_value_t *element, const char* moduleName)
{
	/* airInterface */
	if (strcmp(moduleName, y_MicrowaveModel_ObjectClasses_AirInterface_M_MicrowaveModel_ObjectClasses_AirInterface) == 0)
	{
		/*currentProblems*/
		if (element->parent && element->parent->parent && (strcmp(element->parent->parent->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_airInterfaceCurrentProblems) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timeStamp) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentProblemList_problem_timeStamp(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemName) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentProblemList_problem_problemName(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemSeverity) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentProblemList_problem_problemSeverity(element);
			}
		}

		/*currentPerformance*/
		else if (element->parent && (strcmp(element->parent->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_currentPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_granularityPeriod) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_granularityPeriod(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_administrativeState) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_administrativeState(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_suspectIntervalFlag) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_suspectIntervalFlag(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_elapsedTime) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_elapsedTime(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timestamp) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_timestamp(element);
			}
		}
		else if (element->parent && element->parent->parent && (strcmp(element->parent->parent->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_currentPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_es) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_es(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_ses) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_ses(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_cses) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_cses(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_unavailability) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_unavailability(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMin) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMax) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelAvg) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMin) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMax) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelAvg) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4SymbolsS) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4SymbolsS(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16SymbolsS) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16SymbolsS(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time32Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time32Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time64Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time64Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time128Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time128Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time256Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time256Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMin) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMax) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirAvg) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMin) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMax) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdAvg) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMin) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMax) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempAvg) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_defectBlocksSum) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_defectBlocksSum(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timePeriod) == 0)
			{
				return cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_timePeriod(element);
			}
		}

		/*historicalPerformance*/
		else if (element->parent && (strcmp(element->parent->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_historicalPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_periodEndTime) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_periodEndTime(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_granularityPeriod) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_granularityPeriod(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_suspectIntervalFlag) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_suspectIntervalFlag(element);
			}
		}
		else if (element->parent && element->parent->parent && (strcmp(element->parent->parent->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_historicalPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_es) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_es(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_ses) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_ses(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_cses) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_cses(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_unavailability) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_unavailability(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMin) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelMax) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txLevelAvg) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMin) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelMax) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxLevelAvg) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4SymbolsS) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4SymbolsS(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16SymbolsS) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16SymbolsS(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time16Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time32Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time32Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time64Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time64Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time128Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time128Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time256Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time256Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time512SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time1024SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time2048SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time4096SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192Symbols) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192Symbols(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_time8192SymbolsL) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192SymbolsL(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMin) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirMax) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_snirAvg) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMin) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdMax) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpdAvg) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMin) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMin(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempMax) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMax(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rfTempAvg) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempAvg(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_defectBlocksSum) == 0)
			{
				return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_defectBlocksSum(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timePeriod) == 0)
			{
			   return cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_timePeriod(element);
			}
		}
	}

	/* CoreModel-CoreNetworkModule-ObjectClasses*/
	else if (strcmp(moduleName, y_CoreModel_CoreNetworkModule_ObjectClasses_M_CoreModel_CoreNetworkModule_ObjectClasses) == 0)
	{
		/*no dynamic data here, yet*/
	}

	/* pureEthernetStructure */
	else if (strcmp(moduleName, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_M_MicrowaveModel_ObjectClasses_PureEthernetStructure) == 0)
	{
		/*currentProblems*/
		if (element->parent && element->parent->parent && (strcmp(element->parent->parent->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_pureEthernetStructureCurrentProblems) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_timeStamp) == 0)
			{
				return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timeStamp(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_problemName) == 0)
			{
				return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_PureEthernetStructure_N_problemSeverity) == 0)
			{
				return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity(element);
			}
		}
	}

	/* ethernetContainer */
	else if (strcmp(moduleName, y_MicrowaveModel_ObjectClasses_EthernetContainer_M_MicrowaveModel_ObjectClasses_EthernetContainer) == 0)
	{
		/*currentProblems*/
		if (element->parent && element->parent->parent && (strcmp(element->parent->parent->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_ethernetContainerCurrentProblems) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_timeStamp) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentProblem_timeStamp(element);
				//return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timeStamp(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemName) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentProblem_problemName(element);
				//return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemSeverity) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentProblem_problemSeverity(element);
				//return cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity(element);
			}
		}

		/*currentPerformance*/
		else if (element->parent && (strcmp(element->parent->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_currentPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_granularityPeriod) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_granularityPeriod(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_administrativeState) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_administrativeState(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_suspectIntervalFlag) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_suspectIntervalFlag(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_elapsedTime) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_elapsedTime(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_timeStamp) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_timestamp(element);
			}
		}
		else if (element->parent && element->parent->parent && (strcmp(element->parent->parent->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_currentPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxS) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxS(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxM) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxM(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesSum) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesSum(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_timePeriod) == 0)
			{
				return cb_get_runtime_ethernetContainerCurrentPerformance_timePeriod(element);
			}
		}

		/*historicalPerformance*/
		else if (element->parent && (strcmp(element->parent->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_historicalPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_periodEndTime) == 0)
			{
				return cb_get_runtime_ethernetContainerHistoricalPerformances_periodEndTime(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_granularityPeriod) == 0)
			{
				return cb_get_runtime_ethernetContainerHistoricalPerformances_granularityPeriod(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_suspectIntervalFlag) == 0)
			{
				return cb_get_runtime_ethernetContainerHistoricalPerformances_suspectIntervalFlag(element);
			}
		}
		else if (element->parent && element->parent->parent && (strcmp(element->parent->parent->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_historicalPerformanceDataList) == 0))
		{
			if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxS) == 0)
			{
				return cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxS(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesMaxM) == 0)
			{
				return cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxM(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_txEthernetBytesSum) == 0)
			{
				return cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesSum(element);
			}
			else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_EthernetContainer_N_timePeriod) == 0)
			{
				return cb_get_runtime_ethernetContainerHistoricalPerformances_timePeriod(element);
			}
		}
	}

	return NULL;
}
