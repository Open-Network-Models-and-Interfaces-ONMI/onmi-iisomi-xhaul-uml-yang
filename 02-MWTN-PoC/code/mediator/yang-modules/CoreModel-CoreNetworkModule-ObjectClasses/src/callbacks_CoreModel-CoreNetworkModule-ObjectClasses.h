/*
 * callbacks_CoreModel-CoreNetworkModule-ObjectClasses.h
 *
 *  Created on: Mar 30, 2016
 *      Author: compila
 */

#ifndef YANG_MODULES_COREMODEL_CORENETWORKMODULE_OBJECTCLASSES_SRC_CALLBACKS_COREMODEL_CORENETWORKMODULE_OBJECTCLASSES_H_
#define YANG_MODULES_COREMODEL_CORENETWORKMODULE_OBJECTCLASSES_SRC_CALLBACKS_COREMODEL_CORENETWORKMODULE_OBJECTCLASSES_H_

#include "status.h"
#include <xmlstring.h>
#include "../utils/utils.h"
#include "procdefs.h"

status_t cb_get_network_element_value_name(xmlChar** value_name);
status_t cb_get_network_element_value(xmlChar** value);
status_t cb_get_network_element_uuid(xmlChar** uuid);


status_t cb_get_network_element_operational_state(xmlChar** operational_state);
status_t cb_get_network_element_administrative_control(xmlChar** administrative_control);
status_t cb_get_network_element_administrative_state(xmlChar** administrative_state);
status_t cb_get_network_element_lifecycle_state(xmlChar** lifecycle_state);
status_t cb_get_network_element_local_id_list_value_name(xmlChar** value_name);
status_t cb_get_network_element_local_id_list_value(xmlChar** value);

status_t cb_get_logical_termination_point_uuid(xmlChar** uuid, const xmlChar* k_LogicalTerminationPoint_uuid, ltp_type typeOfLtp);
status_t cb_get_logical_termination_point_value_name(xmlChar** value_name, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_point_value(xmlChar** value, const xmlChar* k_LogicalTerminationPoint_uuid, ltp_type typeOfLtp);
status_t cb_get_logical_termination_point_operational_state(xmlChar** operational_state, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_point_administrative_control(xmlChar** administrative_control, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_point_administrative_state(xmlChar** administrative_state, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_point_lifecycle_state(xmlChar** lifecycle_state, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_point_local_id_list_value_name(xmlChar** value_name, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_point_local_id_list_value(xmlChar** value, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_client_ltp_ref_list_entry(xmlChar** client_ltp_ref_list_entry, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_logical_termination_server_ltp_ref_list_entry(xmlChar** server_ltp_ref_list_entry, const xmlChar* k_LogicalTerminationPoint_uuid);

status_t cb_get_all_logical_termination_point_uuid( xmlChar** logical_termination_point_uuid_list, int* num_of_ltps);
status_t cb_get_all_logical_termination_point_multiradio_uuid( xmlChar** logical_termination_point_multiradio_uuid_list, int* num_of_multiradio_ltps);
status_t cb_get_all_layer_protocols_for_ltp_uuid(const xmlChar* logical_termination_point_uuid, xmlChar** layer_protocol_uuid_list, int* num_of_lps);

status_t cb_get_layer_protocol_uuid(xmlChar** uuid, const xmlChar* k_LayerProtocol_uuid, ltp_type typeOfLtp);
status_t cb_get_layer_protocol_value_name(xmlChar** value_name, const xmlChar* k_LayerProtocol_uuid);
status_t cb_get_layer_protocol_value(xmlChar** value, const xmlChar* k_LayerProtocol_uuid, ltp_type typeOfLtp);
status_t cb_get_layer_protocol_value_local_id_list_value_name(xmlChar** value_name, const xmlChar* k_LayerProtocol_uuid);
status_t cb_get_layer_protocol_value_local_id_list_value(xmlChar** value, const xmlChar* k_LayerProtocol_uuid);
status_t cb_get_layer_protocol_name(xmlChar** layer_protocol_name, const xmlChar* k_LayerProtocol_uuid, ltp_type typeOfLtp);
status_t cb_get_layer_protocol_configured_client_capacity(xmlChar** configured_client_capacity, const xmlChar* k_LayerProtocol_uuid);
status_t cb_get_layer_protocol_lp_direction(xmlChar** lp_direction, const xmlChar* k_LayerProtocol_uuid);
status_t cb_get_layer_protocol_termination_state(xmlChar** termination_state, const xmlChar* k_LayerProtocol_uuid);
status_t cb_get_all_physical_port_references(const xmlChar* logical_termination_point_uuid, xmlChar** physical_port_reference_list, int* num_of_physical_port_references);
status_t cb_get_all_ltp_ref_leaf_list(const xmlChar* logical_termination_point_uuid, xmlChar** ltp_ref_list, int* num_of_ltp_ref, ltp_type typeOfLtp);

status_t cb_get_logical_termination_point_ltp_direction(xmlChar** ltp_direction, const xmlChar* k_LogicalTerminationPoint_uuid);
status_t cb_get_all_client_ltp_ref_leaf_list(const xmlChar* logical_termination_point_uuid, xmlChar** client_ltp_ref_leaf_list, int* num_of_client_ltp_ref_leaf_list, ltp_type typeOfLtp);
status_t cb_get_all_server_ltp_ref_leaf_list(const xmlChar* logical_termination_point_uuid, xmlChar** server_ltp_ref_leaf_list, int* num_of_server_ltp_ref_leaf_list, ltp_type typeOfLtp);


#endif /* YANG_MODULES_COREMODEL_CORENETWORKMODULE_OBJECTCLASSES_SRC_CALLBACKS_COREMODEL_CORENETWORKMODULE_OBJECTCLASSES_H_ */
