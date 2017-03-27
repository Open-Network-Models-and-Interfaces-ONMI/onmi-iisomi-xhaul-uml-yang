/*
 * boot_time_callbacks.c
 *
 *  Created on: Aug 19, 2016
 *      Author: compila
 */

#include "boot_time_callbacks.h"
#include "utils.h"
#include "y_microwave-model.h"
#include "y_microwave-model.h"
#include "y_microwave-model.h"
#include "y_core-model.h"

/********************************************************************
* FUNCTION cb_get_all_air_interface_pac_keys
*
* Get an array representing the keys of mw_air_interface_pac list
*
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of interfaces found)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_air_interface_pac_keys(xmlChar** keys_list, int* num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac/layer-protocol");

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_supported_loop_back_kind_list_keys
*
* Get an array representing the keys of supported-loop-back-kind-list list
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
status_t cb_get_all_supported_loop_back_kind_list_keys(const xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac[layer-protocol=\"%s\"]/air-interface-capability/supported-loop-back-kind-list", air_interface_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_supported_channel_plan_list_keys
*
* Get an array representing the keys of supportedChannelPlanList list
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
status_t cb_get_all_supported_channel_plan_list_keys(const xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac[layer-protocol=\"%s\"]/air-interface-capability/supported-channel-plan-list/supported-channel-plan", air_interface_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_transmission_mode_id_list_keys
*
* Get an array representing the keys of transmissionModeList list
*
* INPUTS:
* const xmlChar *air_interface_pac_key - the key of the current interface
* const xmlChar *supported_channel_plan_key - the key of the current supportedChannelPlanList entry
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_transmission_mode_id_list_keys(const xmlChar *air_interface_pac_key, const xmlChar *supported_channel_plan_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac[layer-protocol=\"%s\"]/air-interface-capability/supported-channel-plan-list[supported-channel-plan=\"%s\"]/transmission-mode-list/transmission-mode-id",
            air_interface_pac_key, supported_channel_plan_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_problem_kind_severity_list_keys
*
* Get an array representing the keys of problemKindSeverityList list
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
status_t cb_get_all_problem_kind_severity_list_keys(const xmlChar *air_interface_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-air-interface-pac[layer-protocol=\"%s\"]/air-interface-configuration/problem-kind-severity-list/problem-kind-name", air_interface_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_ethernet_container_problem_kind_severity_list_keys
*
* Get an array representing the keys of problemKindSeverityList list
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
status_t cb_get_all_ethernet_container_problem_kind_severity_list_keys(const xmlChar *ethernet_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-ethernet-container-pac[layer-protocol=\"%s\"]/ethernet-container-configuration/problem-kind-severity-list/problem-kind-name",
                ethernet_container_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_co_channel_group_id_keys
*
* Get an array representing the keys of co-channel-group list
*
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of co-channel groups found)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_co_channel_group_id_keys(xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/co-channel-group/co-channel-group-id");

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_co_channel_group_air_interface_list_keys
*
* Get an array representing the leaf-list entries of airInterfaceList leaf-list
*
* INPUTS:
* xmlChar *co_channel_key - the key of the current structure
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of interfaces found in the group)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_co_channel_group_air_interface_list_keys(const xmlChar *co_channel_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/co-channel-group[co-channel-group-id=\"%s\"]/air-interface-list", co_channel_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_co_channel_group_logical_termination_point_keys
*
* Get an array representing the leaf-list entries of airInterfaceList leaf-list
*
* INPUTS:
* xmlChar *co_channel_key - the key of the current structure
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of interfaces found in the group)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_co_channel_group_logical_termination_point_keys(const xmlChar *co_channel_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/co-channel-group[co-channel-group-id=\"%s\"]/logical-termination-point", co_channel_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_ethernet_container_pac_keys
*
* Get an array representing the keys of mw_ethernet_container_pac list
*
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of interfaces found)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_ethernet_container_pac_keys(xmlChar** keys_list, int* num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-ethernet-container-pac/layer-protocol");

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_structure_id_list_keys
*
* Get an array representing the keys of segment-id-list list
*
* INPUTS:
* xmlChar *eth_container_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_structure_id_list_keys(const xmlChar *eth_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-ethernet-container-pac[layer-protocol=\"%s\"]/ethernet-container-configuration/segments-id-list/structure-id-ref", eth_container_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_segment_id_list_keys
*
* Get an array representing the keys of segment-id-list list list
*
* INPUTS:
* xmlChar *eth_container_pac_key - the key of the current interface
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_segment_id_list_keys(const xmlChar *eth_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-ethernet-container-pac[layer-protocol=\"%s\"]/ethernet-container-configuration/segments-id-list/segment-id-ref", eth_container_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_pure_eth_structure_pac_keys
*
* Get an array representing the keys of mw_pure_ethernet_structure_pac list
*
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found (actually the number of interfaces found)
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_pure_eth_structure_pac_keys(xmlChar** keys_list, int* num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-pure-ethernet-structure-pac/layer-protocol");

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/********************************************************************
* FUNCTION cb_get_all_pure_ethernet_structure_problem_kind_severity_list_keys
*
* Get an array representing the keys of problemKindSeverityList list
*
* INPUTS:
* xmlChar *layer_protocolKeyString - the key of the current structure
* OUTPUTS:
* xmlChar** keys_list - an array of strings containing the list of keys
* int* num_of_keys - the number of keys found on the interface
*
* RETURNS:
*     error status
********************************************************************/
status_t cb_get_all_pure_ethernet_structure_problem_kind_severity_list_keys(const xmlChar *layer_protocolKeyString, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-pure-ethernet-structure-pac[layer-protocol=\"%s\"]/pure-ethernet-structure-configuration/problem-kind-severity-list/problem-kind-name",
                layer_protocolKeyString);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/*
 * hybrid-mw-structure
 */
status_t key_get_all_hybrid_structure_pac_keys(xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/mw-hybrid-mw-structure-pac/layer-protocol");
    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_all_tdm_structure_name_list_keys(const xmlChar *layer_protocol_key, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data//mw-hybrid-mw-structure-pac[layer-protocol=\"%s\"]/hybrid-mw-structure-capability/supported-tdm-structure-types-list/tdm-structure-name", layer_protocol_key);
    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_all_hybrid_structure_problem_kind_severity_list_keys(const xmlChar *layer_protocol_key, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data//mw-hybrid-mw-structure-pac[layer-protocol=\"%s\"]/hybrid-mw-structure-configuration/problem-kind-severity-list/problem-kind-name", layer_protocol_key);
    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/*
 * MODULE: core-model
 *         Keys of the instances
 */

status_t key_get_all_network_elements(xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element/uuid");
    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}
status_t key_get_all_ltps(xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element/ltp/uuid");
    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}
status_t key_get_lp_list_by_ltp(xmlChar** nested_key, int num_of_nested_key, const xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    (void)nested_key;
    (void)num_of_nested_key;
    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element/ltp[uuid=\"%s\"]/lp/uuid", ltp_uuid);
    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}
status_t key_get_all_name_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    int len=0;
    int tot_len = 0;

    (void)uuid;

    for (int i=0 ; i< num_of_nested_key; i++)
        YUMA_DEBUG ("NESTED-KEYS: %s", nested_key[i]);

    len = snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element");

    tot_len += len;

    if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/ltp[uuid=\"%s\"]", nested_key[0]);
        tot_len += len;
    }
    else
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/name/value");
        return get_list_from_xpath(evalPath, keys_list, num_of_keys);
    }

    if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/lp[uuid=\"%s\"]/name/value", nested_key[1]);
        tot_len += len;
    }
    else
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/name/value");
        return get_list_from_xpath(evalPath, keys_list, num_of_keys);
    }

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_all_label_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    int len=0;
    int tot_len = 0;

    (void)uuid;

    for (int i=0 ; i< num_of_nested_key; i++)
        YUMA_DEBUG ("NESTED-KEYS: %s", nested_key[i]);

    len = snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element");

    tot_len += len;

    if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/ltp[uuid=\"%s\"]", nested_key[0]);
        tot_len += len;
    }
    else
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/label/value");
        return get_list_from_xpath(evalPath, keys_list, num_of_keys);
    }

    if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/lp[uuid=\"%s\"]/label/value", nested_key[1]);
        tot_len += len;
    }
    else
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/label/value");
        return get_list_from_xpath(evalPath, keys_list, num_of_keys);
    }

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_all_extension_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    int len=0;
    int tot_len = 0;

    (void)uuid;

    for (int i=0 ; i< num_of_nested_key; i++)
        YUMA_DEBUG ("NESTED-KEYS: %s", nested_key[i]);

    len = snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element");

    tot_len += len;

    if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/ltp[uuid=\"%s\"]", nested_key[0]);
        tot_len += len;
    }
    else
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/extension/value");
        return get_list_from_xpath(evalPath, keys_list, num_of_keys);
    }

    if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/lp[uuid=\"%s\"]/extension/value", nested_key[1]);
        tot_len += len;
    }
    else
    {
        len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/extension/value");
        return get_list_from_xpath(evalPath, keys_list, num_of_keys);
    }

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_all_localid_list_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
     int len=0;
     int tot_len = 0;

     (void)uuid;

     for (int i=0 ; i< num_of_nested_key; i++)
         YUMA_DEBUG ("NESTED-KEYS: %s", nested_key[i]);

     len = snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element");

     tot_len += len;

     if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
     {
         len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/ltp[uuid=\"%s\"]", nested_key[0]);
         tot_len += len;
     }
     else
     {
         len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/local-id/value");
         return get_list_from_xpath(evalPath, keys_list, num_of_keys);
     }

     if (num_of_nested_key-- && (tot_len<MAX_XPATH_LEN))
     {
         len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/lp[uuid=\"%s\"]/local-id/value", nested_key[1]);
         tot_len += len;
     }
     else
     {
         len = snprintf((char*)evalPath+tot_len, MAX_XPATH_LEN-tot_len, "/local-id/value");
         return get_list_from_xpath(evalPath, keys_list, num_of_keys);
     }

     return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_client_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];

    if (!num_of_nested_key)
        return ERR_NCX_MISSING_KEY;

    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element/ltp[uuid=\"%s\"]/client-ltp", ltp_uuid, nested_key[0]);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_server_by_uuid(xmlChar** nested_key, int num_of_nested_key, const xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];

    (void)nested_key;

    if (!num_of_nested_key)
        return ERR_NCX_MISSING_KEY;

    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element/ltp[uuid=\"%s\"]/server-ltp", ltp_uuid);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_all_physical_port_reference(xmlChar** nested_key, int num_of_nested_key, xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];

    (void)nested_key;

    if (!num_of_nested_key)
        return ERR_NCX_MISSING_KEY;

    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element/ltp[uuid=\"%s\"]/physical-port-reference", ltp_uuid);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_all_ltp_in_other_view(xmlChar** nested_key, int num_of_nested_key, xmlChar* ltp_uuid, xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];

    (void)nested_key;

    if (!num_of_nested_key)
        return ERR_NCX_MISSING_KEY;

    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/network-element/ltp[uuid=\"%s\"]/ltp-in-other-view", ltp_uuid);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

/*
 * MODULE: microwave tdm-container
 *         Keys of the instances
 */

status_t key_get_all_tdm_container(xmlChar** keys_list, int* num_of_keys)
{
    xmlChar evalPath[MAX_XPATH_LEN];
    snprintf((char*)evalPath, MAX_XPATH_LEN, "/data/mw-tdm-container-pac/layer-protocol");
    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_supported_tdm_container_types_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
    const xmlChar evalPath[1000];
    sprintf((xmlChar*)evalPath, "/data/mw-tdm-container-pac[layer-protocol=\"%s\"]/tdm-container-capability/supported-tdm-container-types-list/tdm-container-name", tdm_container_pac_key);

    return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

status_t key_get_tdm_container_problem_kind_severity_list(const xmlChar *tdm_container_pac_key, xmlChar **keys_list, int *num_of_keys)
{
	const xmlChar evalPath[1000];
	sprintf((xmlChar*)evalPath, "/data/mw-tdm-container-pac[layer-protocol=\"%s\"]/tdm-container-configuration/problem-kind-severity-list/problem-kind-name",
				tdm_container_pac_key);

	return get_list_from_xpath(evalPath, keys_list, num_of_keys);
}

