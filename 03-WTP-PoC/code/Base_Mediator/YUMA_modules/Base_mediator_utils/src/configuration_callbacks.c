/*
 * configuration_callbacks.c
 *
 *  Created on: Aug 30, 2016
 *      Author: compila
 */

#include "configuration_callbacks.h"
#include "y_MicrowaveModel-ObjectClasses-AirInterface.h"

static status_t cb_send_to_device_airInterfaceConfiguration_airInterfaceName(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_radioSignalID(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_txFrequency(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_rxFrequency(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_txChannelBandwidth(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_rxChannelBandwidth(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_polarization(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_powerIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_transmitterIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_receiverIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_txPower(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_adaptiveModulationIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_modulationMin(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_modulationMax(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_xpicIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_mimoIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_alicIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_atpcIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_atpcThreshUpper(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_atpcThreshLower(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_autoFreqSelectIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_autoFreqSelectRange(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_modulationIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_encryptionIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_cryptographicKey(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_loopBackIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);
static status_t cb_send_to_device_airInterfaceConfiguration_maintenanceTimer(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol);

static status_t cb_send_to_device_airInterfaceConfiguration_problemKindName(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol, const char* k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
static status_t cb_send_to_device_airInterfaceConfiguration_problemKindSeverity(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol, const char* k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_element_value
*
* Callback function for setting the value of the specific element on the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
status_t cb_send_to_device_airInterfaceConfiguration_element_value(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_airInterfaceName) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_airInterfaceName(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_radioSignalID) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_radioSignalID(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txFrequency) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_txFrequency(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxFrequency) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_rxFrequency(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txChannelBandwidth) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_txChannelBandwidth(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_rxChannelBandwidth) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_rxChannelBandwidth(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_polarization) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_polarization(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_powerIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_powerIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_transmitterIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_transmitterIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_receiverIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_receiverIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_txPower) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_txPower(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_adaptiveModulationIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_adaptiveModulationIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationMin) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_modulationMin(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationMax) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_modulationMax(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_xpicIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_xpicIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_mimoIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_mimoIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_alicIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_alicIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_atpcIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcThreshUpper) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_atpcThreshUpper(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_atpcThreshLower) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_atpcThreshLower(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_autoFreqSelectIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_autoFreqSelectIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_autoFreqSelectRange) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_autoFreqSelectRange(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_modulationIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_modulationIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_encryptionIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_encryptionIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_cryptographicKey) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_cryptographicKey(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_loopBackIsOn) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_loopBackIsOn(element, k_MW_AirInterface_Pac_layerProtocol);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_maintenanceTimer) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_maintenanceTimer(element, k_MW_AirInterface_Pac_layerProtocol);
	}

	return NO_ERR;
}

status_t cb_send_to_device_airInterfaceConfiguration_problemKindSeverityList_element_value(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol, const char* k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
	if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemKindName) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_problemKindName(element, k_MW_AirInterface_Pac_layerProtocol, k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
	}
	else if (strcmp(element->name, y_MicrowaveModel_ObjectClasses_AirInterface_N_problemKindSeverity) == 0)
	{
		return cb_send_to_device_airInterfaceConfiguration_problemKindSeverity(element, k_MW_AirInterface_Pac_layerProtocol, k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName);
	}

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_airInterfaceName
*
* Callback function for setting the value of airInterfaceName leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_airInterfaceName(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_radioSignalID
*
* Callback function for setting the value of radioSignalID leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_radioSignalID(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_txFrequency
*
* Callback function for setting the value of txFrequency leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_txFrequency(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_rxFrequency
*
* Callback function for setting the value of rxFrequency leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_rxFrequency(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_txChannelBandwidth
*
* Callback function for setting the value of txChannelBandwidth leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_txChannelBandwidth(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_rxChannelBandwidth
*
* Callback function for setting the value of rxChannelBandwidth leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_rxChannelBandwidth(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_polarization
*
* Callback function for setting the value of polarization leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_polarization(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_powerIsOn
*
* Callback function for setting the value of powerIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_powerIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_transmitterIsOn
*
* Callback function for setting the value of transmitterIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_transmitterIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_receiverIsOn
*
* Callback function for setting the value of receiverIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_receiverIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_txPower
*
* Callback function for setting the value of txPower leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_txPower(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_adaptiveModulationIsOn
*
* Callback function for setting the value of adaptiveModulationIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_adaptiveModulationIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_modulationMin
*
* Callback function for setting the value of modulationMin leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_modulationMin(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_modulationMax
*
* Callback function for setting the value of modulationMax leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_modulationMax(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_xpicIsOn
*
* Callback function for setting the value of xpicIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_xpicIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_mimoIsOn
*
* Callback function for setting the value of mimoIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_mimoIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_alicIsOn
*
* Callback function for setting the value of alicIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_alicIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_atpcIsOn
*
* Callback function for setting the value of atpcIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_atpcIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_atpcThreshUpper
*
* Callback function for setting the value of atpcThreshUpper leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_atpcThreshUpper(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_atpcThreshLower
*
* Callback function for setting the value of atpcThreshLower leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_atpcThreshLower(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_autoFreqSelectIsOn
*
* Callback function for setting the value of autoFreqSelectIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_autoFreqSelectIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_autoFreqSelectRange
*
* Callback function for setting the value of autoFreqSelectRange leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_autoFreqSelectRange(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_modulationIsOn
*
* Callback function for setting the value of modulationIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_modulationIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_encryptionIsOn
*
* Callback function for setting the value of encryptionIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_encryptionIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_cryptographicKey
*
* Callback function for setting the value of cryptographicKey leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_cryptographicKey(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_loopBackIsOn
*
* Callback function for setting the value of loopBackIsOn leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_loopBackIsOn(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_maintenanceTimer
*
* Callback function for setting the value of maintenanceTimer leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_maintenanceTimer(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_problemKindName
*
* Callback function for setting the value of problemKindName leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_problemKindName(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol, const char* k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}

/********************************************************************
* FUNCTION cb_send_to_device_airInterfaceConfiguration_problemKindSeverity
*
* Callback function for setting the value of problemKindSeverity leaf to the device
*
* INPUTS:
* val_value_t *element - the element for which we want to set the value
*
* RETURNS:
* error status
********************************************************************/
static status_t cb_send_to_device_airInterfaceConfiguration_problemKindSeverity(val_value_t *element, const char* k_MW_AirInterface_Pac_layerProtocol, const char* k_MW_AirInterface_Pac_airInterfaceConfiguration_problemKindSeverityList_problemKindName)
{
	YUMA_ASSERT(NULL == element, return ERR_INTERNAL_VAL, "NULL element received!");
	/*
	 * Send the new configured value to the device
	 * using: VAL_ULONG, VAL_STRING, etc., depending on the parameter type
	 */

	return NO_ERR;
}
