/*
 * dvm_runtime_callbacks.c
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#include "dvm_runtime_callbacks.h"

/*
 * module: MicrowaveModel-ObjectClasses-AirInterface
 */
char* dvm_cb_get_runtime_airInterfaceStatus_txFrequencyCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/txFrequencyCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_rxFrequencyCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/rxFrequencyCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_txLevelCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/txLevelCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_rxLevelCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/rxLevelCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_modulationCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/modulationCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_informationRateCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/informationRateCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_snirCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/snirCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_xpdCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/xpdCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_rfTempCur(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/rfTempCur", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_lastStatusChange(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/lastStatusChange", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_radioPowerIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/radioPowerIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_linkIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/linkIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_xpicIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/xpicIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_mimoIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/mimoIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_alicIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/alicIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_atpcIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/atpcIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_autoFreqSelectIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/autoFreqSelectIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_loopBackIsUp(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/loopBackIsUp", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_localEndPointId(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/localEndPointId", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceStatus_remoteEndPointId(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceStatus/remoteEndPointId", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_air_interface_current_problem_list_keys(char *air_interface_pac_key, char** current_problem_list_key_entries, int* num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentProblems/currentProblemList/sequenceNumber", air_interface_pac_key);

	return get_list_from_xpath(evalPath, current_problem_list_key_entries, num_of_keys);
}

char* dvm_cb_get_runtime_airInterfaceCurrentProblemList_problem_timeStamp(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentProblems/currentProblemList[sequenceNumber=%d]/timeStamp",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentProblemList_problem_problemName(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentProblems/currentProblemList[sequenceNumber=%d]/problemName",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentProblemList_problem_problemSeverity(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentProblems/currentProblemList[sequenceNumber=%d]/problemSeverity",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_air_interface_current_performance_list_keys(char *air_interface_pac_key, char **current_performance_data_list_keys_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList/scannerId", air_interface_pac_key);

	return get_list_from_xpath(evalPath, current_performance_data_list_keys_entries, num_of_keys);
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_granularityPeriod(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/granularityPeriod",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_suspectIntervalFlag(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/suspectIntervalFlag",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_elapsedTime(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/elapsedTime",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_timestamp(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/timestamp",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_es(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/es",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_ses(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/ses",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_cses(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/cses",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_unavailability(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/unavailability",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMin(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/txLevelMin",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelMax(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/txLevelMax",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_txLevelAvg(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/txLevelAvg",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMin(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/rxLevelMin",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelMax(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/rxLevelMax",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rxLevelAvg(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/rxLevelAvg",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time2Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4SymbolsS(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time4SymbolsS",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time4Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time8Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16SymbolsS(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time16SymbolsS",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time16Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time16Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time32Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time32Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time64Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time64Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time128Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time128Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time256Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time256Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time512Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time512SymbolsL(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time512SymbolsL",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time1024Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time1024SymbolsL(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time1024SymbolsL",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time2048Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time2048SymbolsL(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time2048SymbolsL",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time4096Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time4096SymbolsL(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time4096SymbolsL",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192Symbols(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time8192Symbols",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_time8192SymbolsL(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/time8192SymbolsL",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMin(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/snirMin",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirMax(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/snirMax",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_snirAvg(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/snirAvg",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMin(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/xpdMin",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdMax(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/xpdMax",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_xpdAvg(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/xpdAvg",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMin(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/rfTempMin",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempMax(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/rfTempMax",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_rfTempAvg(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/rfTempAvg",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_defectBlocksSum(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/defectBlocksSum",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceCurrentPerformance_currentPerformanceDataList_timePeriod(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/timePeriod",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_air_interface_historical_performance_list_keys(char *air_interface_pac_key, char **historical_performance_data_list_keys_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList/historyDataId", air_interface_pac_key);

	return get_list_from_xpath(evalPath, historical_performance_data_list_keys_entries, num_of_keys);
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_periodEndTime(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/periodEndTime",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_granularityPeriod(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/granularityPeriod",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_suspectIntervalFlag(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/suspectIntervalFlag",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_es(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/es",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_ses(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/ses",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_cses(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/cses",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_unavailability(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/unavailability",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMin(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/txLevelMin",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelMax(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/txLevelMax",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_txLevelAvg(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/txLevelAvg",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMin(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/rxLevelMin",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelMax(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/rxLevelMax",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rxLevelAvg(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/rxLevelAvg",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time2Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4SymbolsS(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time4SymbolsS",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time4Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time8Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16SymbolsS(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time16SymbolsS",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time16Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time16Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time32Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time32Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time64Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time64Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time128Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time128Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time256Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time256Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time512Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time512SymbolsL(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time512SymbolsL",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time1024Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time1024SymbolsL(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time1024SymbolsL",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time2048Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time2048SymbolsL(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time2048SymbolsL",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time4096Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time4096SymbolsL(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time4096SymbolsL",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192Symbols(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time8192Symbols",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_time8192SymbolsL(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/time8192SymbolsL",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMin(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/snirMin",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirMax(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/snirMax",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_snirAvg(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/snirAvg",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMin(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/xpdMin",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdMax(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/xpdMax",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_xpdAvg(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/xpdAvg",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMin(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/rfTempMin",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempMax(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/rfTempMax",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_rfTempAvg(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/rfTempAvg",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_defectBlocksSum(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/defectBlocksSum",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_airInterfaceHistoricalPerformances_historicalPerformanceDataList_performanceData_timePeriod(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_AirInterface_Pac[layerProtocol=\"%s\"]/airInterfaceHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/timePeriod",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

/*
 * module: MicrowaveModel-ObjectClasses-PureEthernetStructure
 */
char* dvm_cb_get_runtime_pureEthernetStructureStatus_segmentStatusTypeId(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureStatus/segmentStatusList/segmentStatusTypeId",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_pureEthernetStructureStatus_segmentIsReservedForTdm(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureStatus/segmentStatusList/segmentIsReservedForTdm",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_pureEthernetStructureStatus_operationalStatus(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureStatus/segmentStatusList/operationalStatus",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_pureEthernetStructureStatus_lastStatusChange(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureStatus/lastStatusChange",
			layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_pure_eth_structure_current_problem_list_keys(char *pure_eth_structure_pac_key, char** current_problem_list_key_entries, int* num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureCurrentProblems/currentProblemList/sequenceNumber", pure_eth_structure_pac_key);

	return get_list_from_xpath(evalPath, current_problem_list_key_entries, num_of_keys);
}

char* dvm_cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_timeStamp(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureCurrentProblems/currentProblemList[sequenceNumber=%d]/timeStamp",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemName(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureCurrentProblems/currentProblemList[sequenceNumber=%d]/problemName",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_pureEthernetStructureCurrentProblemList_problem_problemSeverity(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_PureEthernetStructure_Pac[layerProtocol=\"%s\"]/pureEthernetStructureCurrentProblems/currentProblemList[sequenceNumber=%d]/problemSeverity",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

/*
 * module: MicrowaveModel-ObjectClasses-EthernetContainer
 */
char* dvm_cb_get_runtime_ethernetContainerStatus_lastStatusChange(char* layerProtocolKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerStatus/lastStatusChange", layerProtocolKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_ethernet_container_current_problem_list_keys(char *ethernet_container_pac_key, char** current_problem_list_key_entries, int* num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentProblems/currentProblemList/sequenceNumber", ethernet_container_pac_key);

	return get_list_from_xpath(evalPath, current_problem_list_key_entries, num_of_keys);
}

char* dvm_cb_get_runtime_ethernetContainerCurrentProblem_timeStamp(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentProblems/currentProblemList[sequenceNumber=%d]/timeStamp",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentProblem_problemName(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentProblems/currentProblemList[sequenceNumber=%d]/problemName",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentProblem_problemSeverity(char* layerProtocolKeyString, int sequenceNumberKey)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentProblems/currentProblemList[sequenceNumber=%d]/problemSeverity",
			layerProtocolKeyString, sequenceNumberKey);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_ethernet_container_current_performance_list_keys(char *ethernet_container_pac_key, char **current_performance_data_list_keys_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList/scannerId", ethernet_container_pac_key);

	return get_list_from_xpath(evalPath, current_performance_data_list_keys_entries, num_of_keys);
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_granularityPeriod(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/granularityPeriod",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_administrativeState(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/administrativeState",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_suspectIntervalFlag(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/suspectIntervalFlag",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_elapsedTime(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/elapsedTime",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_timestamp(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/timestamp",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxS(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/txEthernetBytesMaxS",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesMaxM(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/txEthernetBytesMaxM",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_txEthernetBytesSum(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/txEthernetBytesSum",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerCurrentPerformance_timePeriod(char* layerProtocolKeyString, char* scannerIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerCurrentPerformance/currentPerformanceDataList[scannerId=\"%s\"]/performanceData/timePeriod",
			layerProtocolKeyString, scannerIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

status_t dvm_cb_get_all_ethernet_container_historical_performance_list_keys(char *ethernet_container_pac_key, char **historical_performance_data_list_keys_entries, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList/historyDataId", ethernet_container_pac_key);

	return get_list_from_xpath(evalPath, historical_performance_data_list_keys_entries, num_of_keys);
}

char* dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_periodEndTime(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/periodEndTime",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_granularityPeriod(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/granularityPeriod",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_suspectIntervalFlag(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/suspectIntervalFlag",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxS(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/txEthernetBytesMaxS",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesMaxM(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/txEthernetBytesMaxM",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_txEthernetBytesSum(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/txEthernetBytesSum",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}

char* dvm_cb_get_runtime_ethernetContainerHistoricalPerformances_timePeriod(char* layerProtocolKeyString, char* historyDataIdKeyString)
{
	char* resultString = NULL;

	const xmlChar evalPath[1000];
	sprintf(evalPath, "/data/MW_EthernetContainer_Pac[layerProtocol=\"%s\"]/ethernetContainerHistoricalPerformances/historicalPerformanceDataList[historyDataId=\"%s\"]/performanceData/timePeriod",
			layerProtocolKeyString, historyDataIdKeyString);

	resultString = get_value_from_xpath(evalPath);

	return resultString;
}
