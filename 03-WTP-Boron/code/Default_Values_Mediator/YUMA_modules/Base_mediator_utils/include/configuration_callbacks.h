/*
 * configuration_callbacks.h
 *
 *  Created on: Aug 30, 2016
 *      Author: compila
 */

#ifndef CONFIGURATION_CALLBACKS_H_
#define CONFIGURATION_CALLBACKS_H_

#include "status.h"
#include "val.h"
#include "utils.h"

status_t cb_send_to_device_airInterfaceConfiguration_element_value(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
status_t cb_send_to_device_airInterfaceConfiguration_problemKindSeverityList_element_value(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol, const char* k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
status_t cb_send_to_device_pureEthernetStructureConfiguration_problemKindSeverityList_element_value(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol, const char* k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);


#endif /* CONFIGURATION_CALLBACKS_H_ */
