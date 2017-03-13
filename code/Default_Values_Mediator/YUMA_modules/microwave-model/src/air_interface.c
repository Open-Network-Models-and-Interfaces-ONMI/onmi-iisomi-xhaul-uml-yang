/* 
 * FILE: air_interface.c
 */

#include <xmlstring.h>

#include "procdefs.h"
#include "agt.h"
#include "agt_cb.h"
#include "agt_timer.h"
#include "agt_util.h"
#include "dlq.h"
#include "ncx.h"
#include "ncx_feature.h"
#include "ncxmod.h"
#include "ncxtypes.h"
#include "status.h"
#include "u_microwave-model.h"
#include "y_microwave-model.h"

#include "utils.h"
#include "ses.h"
#include "rpc.h"
#include "boot_time_callbacks.h"
#include "runtime_callbacks.h"
#include "configuration_callbacks.h"

/* put your static variables here */
static status_t build_attributes_tree_and_attach_to_running_cfg(cfg_template_t *runningcfg);
static status_t attach_air_interface_pac_element_to_running_config(cfg_template_t *runningcfg, const char *air_interface_pac_key);

static status_t attach_air_interface_capability_container(val_value_t *parentval);

static status_t attach_air_interface_configuration_container(val_value_t *parentval);
static status_t attach_problem_kind_severity_list(val_value_t* parentval);
static status_t attach_problem_kind_severity_list_entry(val_value_t* parentval, const char* problem_kind_severity_list_key_entry);

static status_t attach_supported_loop_back_kind_list(val_value_t *parentval);
static status_t attach_supported_channel_plan_list(val_value_t *parentval);
static status_t attach_supported_channel_plan_list_entry(val_value_t *parentval, const char *channel_plan_type_key_entry);

static status_t attach_transmission_mode_list(val_value_t *parentval);
static status_t attach_transmission_mode_list_entry(val_value_t *parentval, const char *transmission_mode_key_entry);

static status_t get_air_interface_current_problem_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val);
static status_t attach_air_interface_current_problem_list_entry(val_value_t *parentval, const char *air_interface_current_problem_list_key_entry);

static status_t get_air_interface_current_performance_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val);
static status_t attach_air_interface_current_performance_list_entry(val_value_t *parentval, const char *air_interface_current_performance_list_key_entry);

static status_t get_air_interface_historical_performance_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val);
static status_t attach_air_interface_historical_performance_list_entry(val_value_t *parentval, const char *air_interface_historical_performance_list_key_entry);

static status_t attach_co_channel_group_list(cfg_template_t* runningcfg);
static status_t attach_co_channel_group_list_entry(val_value_t *parentval, const char *co_channel_group_list_key_entry);

static status_t attach_air_interface_pac_element_to_running_config(cfg_template_t* runningcfg, const char* air_interface_pac_key)
{
	status_t res = NO_ERR;

	/*
	 * Creating the root element for the module: mw_air_interface_pac
	 */
	val_value_t *mw_air_interface_pac_val = NULL;

	res = create_root_element_for_module(y_microwave_model_M_microwave_model,
			y_microwave_model_R_microwave_model,
			y_microwave_model_N_mw_air_interface_pac,
			&mw_air_interface_pac_val);
	YUMA_ASSERT(NULL == mw_air_interface_pac_val, return ERR_INTERNAL_VAL ,
			"create_root_element_for_module failed for element=%s", y_microwave_model_N_mw_air_interface_pac);

	val_add_child(mw_air_interface_pac_val, runningcfg->root);

	/*
	 * Creating the layer_protocol element
	 */
	val_value_t  *layer_protocol_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_layer_protocol,
			mw_air_interface_pac_val,
			&layer_protocol_val,
			air_interface_pac_key,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == layer_protocol_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_layer_protocol);

	/*
	 * Creating airInterfaceCapability container
	 */
	val_value_t  *airInterfaceCapability_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_capability,
			mw_air_interface_pac_val,
			&airInterfaceCapability_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == airInterfaceCapability_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_air_interface_capability);

	/*
	 * Creating all the leaf elements of the airInterfaceCapability container
	 */
	res = attach_air_interface_capability_container(airInterfaceCapability_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"attach_air_interface_capability_container failed for layer_protocol=%s", air_interface_pac_key);

    res = attach_supported_loop_back_kind_list(airInterfaceCapability_val);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
                    "attach_supported_loop_back_kind_list failed for layer_protocol=%s", air_interface_pac_key);

	/*
	 * Creating the supportedChannelPlanList list
	 */
	res = attach_supported_channel_plan_list(airInterfaceCapability_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"attach_supported_channel_plan_list failed for layer_protocol=%s", air_interface_pac_key);

	/*
	 * Creating airInterfaceConfiguration container
	 */
	val_value_t  *airInterfaceConfiguration_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_configuration,
			mw_air_interface_pac_val,
			&airInterfaceConfiguration_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == airInterfaceConfiguration_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_air_interface_configuration);

	res = attach_air_interface_configuration_container(airInterfaceConfiguration_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"attach_air_interface_configuration_container failed for layer_protocol=%s", air_interface_pac_key);

	/*
	 * Creating airInterfaceStatus container
	 */
	val_value_t  *airInterfaceStatus_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_status,
			mw_air_interface_pac_val,
			&airInterfaceStatus_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == airInterfaceStatus_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_air_interface_status);


	res = microwave_model_mw_air_interface_pac_air_interface_status_mro(airInterfaceStatus_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"microwave_model_mw_air_interface_pac_air_interface_status_mro failed");


	/*
	 * Creating airInterfaceCurrentProblems container
	 */
	val_value_t *airInterfaceCurrentProblems_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_current_problems,
			mw_air_interface_pac_val,
			&airInterfaceCurrentProblems_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_air_interface_current_problems);

	val_init_virtual(airInterfaceCurrentProblems_val,
					get_air_interface_current_problem_list,
					airInterfaceCurrentProblems_val->obj);

	/*
	 * Creating airInterfaceCurrentPerformance container
	 */
	val_value_t  *airInterfaceCurrentPerformance_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_current_performance,
			mw_air_interface_pac_val,
			&airInterfaceCurrentPerformance_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_air_interface_current_performance);

	val_init_virtual(airInterfaceCurrentPerformance_val,
					get_air_interface_current_performance_list,
					airInterfaceCurrentPerformance_val->obj);
	/*
	 * Creating airInterfaceHistoricalPerformances_val container
	 */
	val_value_t *airInterfaceHistoricalPerformances_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_historical_performances,
			mw_air_interface_pac_val,
			&airInterfaceHistoricalPerformances_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_air_interface_historical_performances);

	val_init_virtual(airInterfaceHistoricalPerformances_val,
					get_air_interface_historical_performance_list,
					airInterfaceHistoricalPerformances_val->obj);

	return NO_ERR;
}

static status_t attach_air_interface_capability_container(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating typeOfEquipment leaf
	 */
	val_value_t  *typeOfEquipment_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_type_of_equipment,
			parentval,
			&typeOfEquipment_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == typeOfEquipment_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_type_of_equipment);

	/*
	 * Create all other leafs after typeOfEquipment
	 */
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(parentval->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_type_of_equipment));

	res = create_and_init_siblings(next_obj,
			parentval,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");


	return NO_ERR;

}

static status_t attach_air_interface_configuration_container(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating airInterfaceName leaf
	 */
	val_value_t  *airInterfaceName_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_name,
			parentval,
			&airInterfaceName_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == airInterfaceName_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_air_interface_name);

	/*
	 * Create all other leafs after airInterfaceName
	 */
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(parentval->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_air_interface_name));

	res = create_and_init_siblings(next_obj,
			parentval,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");

	res = attach_problem_kind_severity_list(parentval);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_problem_kind_severity_list failed!");

	return NO_ERR;
}

static status_t attach_problem_kind_severity_list(val_value_t* parentval)
{
	status_t res = NO_ERR;
	char* problem_kind_name[MAX_NUMBER_OF_PROBLEM_KIND_SEVERITY_ENTRIES];
	int num_of_problem_kind_name_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_air_interface_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

	res = cb_get_all_problem_kind_severity_list_keys(k_mw_air_interface_pac_layer_protocol_key, problem_kind_name, &num_of_problem_kind_name_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_problem_kind_severity_list_keys failed!");

	for (int i=0; i<num_of_problem_kind_name_keys; ++i)
	{
		res = attach_problem_kind_severity_list_entry(parentval, problem_kind_name[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_problem_kind_severity_list_entry failed for layer_protocol=%s and key=%s!", k_mw_air_interface_pac_layer_protocol_key, problem_kind_name[i]);

		free(problem_kind_name[i]);
	}

	return NO_ERR;
}

static status_t attach_problem_kind_severity_list_entry(val_value_t* parentval, const char* problem_kind_severity_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Creating problemKindSeverityList list entry
	 */
	val_value_t  *problemKindSeverityList_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_kind_severity_list,
			parentval,
			&problemKindSeverityList_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == problemKindSeverityList_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_kind_severity_list);

	/*
	 * Creating problemKindName leaf
	 */
	val_value_t  *problemKindName_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_kind_name,
			problemKindSeverityList_val,
			&problemKindName_val,
			problem_kind_severity_list_key_entry,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == problemKindName_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_kind_name);

	/*
	 * Creating problemKindSeverity leaf
	 */
	val_value_t  *problemKindSeverity_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_kind_severity,
			problemKindSeverityList_val,
			&problemKindSeverity_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == problemKindSeverity_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_kind_severity);

	return NO_ERR;
}

static status_t attach_supported_loop_back_kind_list(val_value_t *parentval)
{
    status_t res = NO_ERR;

    xmlChar* supported_loop_back_kind_list[MAX_NUMBER_OF_LOOP_BACK_KIND_ENTRIES];
    int num_of_entries;

    val_value_t *lastkey = NULL;
    const xmlChar *k_mw_air_interface_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

    num_of_entries = 0;
    res = cb_get_all_supported_loop_back_kind_list_keys(k_mw_air_interface_pac_layer_protocol_key, supported_loop_back_kind_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_loop_back_kind_list_keys failed!");

    for (int i=0; i<num_of_entries; ++i)
    {
        val_value_t  *supported_loop_back_kind_list_val = NULL;

        res = create_and_init_child_element(y_microwave_model_M_microwave_model,
                y_microwave_model_N_supported_loop_back_kind_list,
                parentval,
                &supported_loop_back_kind_list_val,
                supported_loop_back_kind_list[i],
                y_microwave_model_M_microwave_model,
                false);
        YUMA_ASSERT(NULL == supported_loop_back_kind_list_val, return ERR_INTERNAL_VAL ,
                    "create_and_init_child_element failed for failed for layer_protocol=%s and key=%s!", k_mw_air_interface_pac_layer_protocol_key, supported_loop_back_kind_list[i]);
        free (supported_loop_back_kind_list[i]);
    }

    return NO_ERR;
}

static status_t attach_supported_channel_plan_list(val_value_t* parentval)
{
	status_t res = NO_ERR;
	char* supported_channel_plan_list[MAX_NUMBER_OF_CHANNEL_PLAN_TYPE_ID_ENTRIES];
	int num_of_supported_channel_plan_list_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_air_interface_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

	res = cb_get_all_supported_channel_plan_list_keys(k_mw_air_interface_pac_layer_protocol_key, supported_channel_plan_list, &num_of_supported_channel_plan_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_channel_plan_type_id_list_keys failed!");

	for (int i=0; i<num_of_supported_channel_plan_list_keys; ++i)
	{
		res = attach_supported_channel_plan_list_entry(parentval, supported_channel_plan_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_supported_channel_plan_list_entry failed for layer_protocol=%s and key=%s!", k_mw_air_interface_pac_layer_protocol_key, supported_channel_plan_list[i]);

		free(supported_channel_plan_list[i]);
	}

	return NO_ERR;
}

static status_t attach_supported_channel_plan_list_entry(val_value_t* parentval, const char* supported_channel_plan_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Creating supportedChannelPlanList list entry
	 */
	val_value_t  *supportedChannelPlanList_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_supported_channel_plan_list,
			parentval,
			&supportedChannelPlanList_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == supportedChannelPlanList_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_supported_channel_plan_list);

	/*
	 * Creating supportedChannelPlan leaf
	 */
	val_value_t  *supportedChannelPlan_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_supported_channel_plan,
			supportedChannelPlanList_val,
			&supportedChannelPlan_val,
			supported_channel_plan_key_entry,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == supportedChannelPlan_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_supported_channel_plan);

	/*
	 * Create all other leafs after channelPlanTypeId
	 */
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(supportedChannelPlanList_val->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_supported_channel_plan));

	res = create_and_init_siblings(next_obj,
			supportedChannelPlanList_val,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");

	/*
	 * Create transmissionModeList
	 */
	res = attach_transmission_mode_list(supportedChannelPlanList_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
					"attach_supported_channel_plan_list failed for key=%s!", supported_channel_plan_key_entry);

	return NO_ERR;
}

static status_t attach_transmission_mode_list(val_value_t *parentval)
{
	status_t res = NO_ERR;
	char* transmission_mode_id_list[MAX_NUMBER_OF_TRANSMISSION_MODE_ID_ENTRIES];
	int num_of_transmission_mode_id_list_keys;
	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_air_interface_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));
	const xmlChar *k_mw_air_interface_pac_layer_protocol_supportedChannelPlan_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));


	res = cb_get_all_transmission_mode_id_list_keys(k_mw_air_interface_pac_layer_protocol_key, k_mw_air_interface_pac_layer_protocol_supportedChannelPlan_key, transmission_mode_id_list, &num_of_transmission_mode_id_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_transmission_mode_id_list_keys failed!");

	for (int i=0; i<num_of_transmission_mode_id_list_keys; ++i)
	{
		res = attach_transmission_mode_list_entry(parentval, transmission_mode_id_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_supported_channel_plan_list_entry failed for layer_protocol=%s and supportedChannelPlan=%s and transmissionModeId=%s!",
				k_mw_air_interface_pac_layer_protocol_key, k_mw_air_interface_pac_layer_protocol_supportedChannelPlan_key, transmission_mode_id_list[i]);

		free(transmission_mode_id_list[i]);
	}

	return NO_ERR;
}

static status_t attach_transmission_mode_list_entry(val_value_t *parentval, const char *transmission_mode_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Creating transmissionModeList list entry
	 */
	val_value_t  *transmissionModeList_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_transmission_mode_list,
			parentval,
			&transmissionModeList_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == transmissionModeList_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_transmission_mode_list);

	/*
	 * Creating transmissionModeId leaf
	 */
	val_value_t  *transmissionModeId_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_transmission_mode_id,
			transmissionModeList_val,
			&transmissionModeId_val,
			transmission_mode_key_entry,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == transmissionModeId_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_transmission_mode_id);

	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(transmissionModeList_val->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_transmission_mode_id));

	/*
	 * Create all other leafs after transmissionModeId
	 */
	res = create_and_init_siblings(next_obj,
			transmissionModeList_val,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");

	return NO_ERR;
}

static status_t get_air_interface_current_problem_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* air_interface_current_problem_list_keys_entries[MAX_NUMBER_OF_AIR_INTERFACE_PAC_AIR_INTERFACE_CURRENT_PROBLEM_LIST_ENTRIES];
	int num_of_air_interface_current_problem_list_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_air_interface_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	res = cb_get_all_air_interface_current_problem_list_keys(k_mw_air_interface_pac_layer_protocol_key, air_interface_current_problem_list_keys_entries, &num_of_air_interface_current_problem_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_air_interface_current_problem_list_keys failed!");

	for (int i=0; i<num_of_air_interface_current_problem_list_keys; ++i)
	{
		res = attach_air_interface_current_problem_list_entry(dst_val, air_interface_current_problem_list_keys_entries[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_air_interface_current_problem_list_entry failed for key=%s!", air_interface_current_problem_list_keys_entries[i]);

		free(air_interface_current_problem_list_keys_entries[i]);
	}

	return NO_ERR;
}

static status_t attach_air_interface_current_problem_list_entry(val_value_t* parentval, const char* air_interface_current_problem_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Create currentProblemList list entry
	 */

	val_value_t  *currentProblemList_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_current_problem_list,
			parentval,
			&currentProblemList_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == currentProblemList_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_current_problem_list);

	/*
	 * Create sequenceNumber leaf
	 */

	val_value_t  *sequenceNumber_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_sequence_number,
			currentProblemList_val,
			&sequenceNumber_val,
			air_interface_current_problem_list_key_entry,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == sequenceNumber_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_sequence_number);

    /*
     * Create problemName virtual leaf with callback attached
     */
    val_value_t  *problemName_val = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_problem_name,
            currentProblemList_val,
            &problemName_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == problemName_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_name);

	/*
	 * Create timeStamp virtual leaf with callback attached
	 */
	val_value_t  *timeStamp_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_time_stamp,
			currentProblemList_val,
			&timeStamp_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == timeStamp_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_time_stamp);

    /*
     * Create problemSeverity virtual leaf with callback attached
     */
	val_value_t  *problemSeverity_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_severity,
			currentProblemList_val,
			&problemSeverity_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == problemSeverity_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_severity);

	return NO_ERR;
}

static status_t get_air_interface_current_performance_list(ses_cb_t *scb,
        getcb_mode_t cbmode,
        val_value_t *vir_val,
        val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* air_interface_current_performance_list_keys_entries[MAX_NUMBER_OF_AIR_INTERFACE_PAC_AIR_INTERFACE_CURRENT_PERFORMANCE_LIST_ENTRIES];
	int num_of_air_interface_current_performance_list_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_air_interface_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	YUMA_ASSERT(TRUE, NOP, "get_air_interface_current_performance_list was called!");

	res = cb_get_all_air_interface_current_performance_list_keys(k_mw_air_interface_pac_layer_protocol_key, air_interface_current_performance_list_keys_entries, &num_of_air_interface_current_performance_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_air_interface_current_performance_list_keys failed!");

	for (int i=0; i<num_of_air_interface_current_performance_list_keys; ++i)
	{
		res = attach_air_interface_current_performance_list_entry(dst_val, air_interface_current_performance_list_keys_entries[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_air_interface_current_performance_list_entry failed for key=%s!", air_interface_current_performance_list_keys_entries[i]);

		free(air_interface_current_performance_list_keys_entries[i]);
	}

	return NO_ERR;
}

static status_t attach_air_interface_current_performance_list_entry(val_value_t *parentval, const char *air_interface_current_performance_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Create currentPerformanceDataList list entry
	 */
	val_value_t  *currentPerformanceDataList_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_current_performance_data_list,
			parentval,
			&currentPerformanceDataList_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == currentPerformanceDataList_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_current_performance_data_list);

	/*
	 * Create scannerId leaf
	 */
	val_value_t  *scannerId_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_scanner_id,
			currentPerformanceDataList_val,
			&scannerId_val,
			air_interface_current_performance_list_key_entry,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == scannerId_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_scanner_id);

    /*
     * Create timestamp virtual leaf with callback attached
     */
    val_value_t  *timestamp_val = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_timestamp,
            currentPerformanceDataList_val,
            &timestamp_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == timestamp_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_microwave_model_N_timestamp);

    /*
     * Create suspectIntervalFlag virtual leaf with callback attached
     */
    val_value_t  *suspectIntervalFlag_val = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_suspect_interval_flag,
            currentPerformanceDataList_val,
            &suspectIntervalFlag_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == suspectIntervalFlag_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_microwave_model_N_suspect_interval_flag);

    /*
     * Create elapsedTime virtual leaf with callback attached
     */
    val_value_t  *elapsedTime_val = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_elapsed_time,
            currentPerformanceDataList_val,
            &elapsedTime_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == elapsedTime_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_microwave_model_N_elapsed_time);

    /*
     * Create granularityPeriod virtual leaf with callback attached
     */
	val_value_t  *granularityPeriod_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_granularity_period,
			currentPerformanceDataList_val,
			&granularityPeriod_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == granularityPeriod_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_granularity_period);

    /*
     * Create administrativeState virtual leaf with callback attached
     */
	val_value_t  *administrativeState_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_administrative_state,
			currentPerformanceDataList_val,
			&administrativeState_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == administrativeState_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_administrative_state);

    /*
     * Create object-class virtual leaf with callback attached
     */

    val_value_t  *object_class_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_object_class,
            currentPerformanceDataList_val,
            &object_class_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == object_class_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_microwave_model_N_object_class);

    /*
     * Create name-binding virtual leaf with callback attached
     */

    val_value_t  *name_binding_val = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_name_binding,
            currentPerformanceDataList_val,
            &name_binding_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == name_binding_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_microwave_model_N_name_binding);

	/*
	 * Create performanceData container
	 */
	val_value_t  *performanceData_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_performance_data,
			currentPerformanceDataList_val,
			&performanceData_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == performanceData_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_performance_data);

    /*
     * Create es leaf
     */
	val_value_t  *es_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_es,
			performanceData_val,
			&es_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == es_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_es);

	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(performanceData_val->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_es));

	res = create_and_init_siblings(next_obj,
			performanceData_val,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"create_and_init_siblings failed");

//	res = microwave_model_mw_air_interface_pac_air_interface_current_performance_current_performance_data_list_performance_data_mro(performanceData_val);
//	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "microwave_model_mw_air_interface_pac_air_interface_current_performance_current_performance_data_list_performance_data_mro failed!");

	return NO_ERR;
}

static status_t get_air_interface_historical_performance_list(ses_cb_t *scb,
        getcb_mode_t cbmode,
        val_value_t *vir_val,
        val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* air_interface_historical_performance_list_keys_entries[MAX_NUMBER_OF_AIR_INTERFACE_PAC_AIR_INTERFACE_HISTORICAL_PERFORMANCE_LIST_ENTRIES];
	int num_of_air_interface_historical_performance_list_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_air_interface_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	YUMA_ASSERT(TRUE, NOP, "get_air_interface_historical_performance_list was called!");

	res = cb_get_all_air_interface_historical_performance_list_keys(k_mw_air_interface_pac_layer_protocol_key, air_interface_historical_performance_list_keys_entries, &num_of_air_interface_historical_performance_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_air_interface_historical_performance_list_keys failed!");

	for (int i=0; i<num_of_air_interface_historical_performance_list_keys; ++i)
	{
		res = attach_air_interface_historical_performance_list_entry(dst_val, air_interface_historical_performance_list_keys_entries[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_air_interface_historical_performance_list_entry failed for key=%s!", air_interface_historical_performance_list_keys_entries[i]);

		free(air_interface_historical_performance_list_keys_entries[i]);
	}

	return NO_ERR;
}

static status_t attach_air_interface_historical_performance_list_entry(val_value_t *parentval, const char *air_interface_historical_performance_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Create historicalPerformanceDataList list entry
	 */
	val_value_t  *historicalPerformanceDataList_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_historical_performance_data_list,
			parentval,
			&historicalPerformanceDataList_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == historicalPerformanceDataList_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_historical_performance_data_list);

	/*
	 * Create historyDataId leaf
	 */
	val_value_t  *historyDataId_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_history_data_id,
			historicalPerformanceDataList_val,
			&historyDataId_val,
			air_interface_historical_performance_list_key_entry,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == historyDataId_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_history_data_id);
    /*
     * Create suspectIntervalFlag virtual leaf with callback attached
     */
    val_value_t  *suspectIntervalFlag_val = NULL;
    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_suspect_interval_flag,
            historicalPerformanceDataList_val,
            &suspectIntervalFlag_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);

    YUMA_ASSERT(NULL == suspectIntervalFlag_val, return ERR_INTERNAL_VAL,
            "create_and_init_child_element failed for element=%s", y_microwave_model_N_suspect_interval_flag);

    /*
     * Create periodEndTime virtual leaf with callback attached
     */
	val_value_t  *periodEndTime_val = NULL;
	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_period_end_time,
			historicalPerformanceDataList_val,
			&periodEndTime_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);

    YUMA_ASSERT(NULL == periodEndTime_val, return ERR_INTERNAL_VAL,
            "create_and_init_child_element failed for element=%s", y_microwave_model_N_period_end_time);

    /*
     * Create granularityPeriod virtual leaf with callback attached
     */
	val_value_t  *granularityPeriod_val = NULL;
	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_granularity_period,
			historicalPerformanceDataList_val,
			&granularityPeriod_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);

    YUMA_ASSERT(NULL == granularityPeriod_val, return ERR_INTERNAL_VAL,
            "create_and_init_child_element failed for element=%s", y_microwave_model_N_granularity_period);

    /*
     * Create object-class virtual leaf with callback attached
     */

    val_value_t  *object_class_val = NULL;
    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_object_class,
            historicalPerformanceDataList_val,
            &object_class_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == object_class_val, return ERR_INTERNAL_VAL ,
            "create_and_init_child_element failed for element=%s", y_microwave_model_N_object_class);

    /*
     * Create name-binding virtual leaf with callback attached
     */

    val_value_t  *name_binding_val = NULL;
    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_name_binding,
            historicalPerformanceDataList_val,
            &name_binding_val,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == name_binding_val, return ERR_INTERNAL_VAL ,
            "create_and_init_child_element failed for element=%s", y_microwave_model_N_name_binding);

	/*
	 * Create performanceData container
	 */
	val_value_t  *performanceData_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_performance_data,
			historicalPerformanceDataList_val,
			&performanceData_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == performanceData_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_performance_data);

	/*
	 * Create es leaf
	 */
	val_value_t  *es_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_es,
			performanceData_val,
			&es_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);

	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(performanceData_val->obj,
			y_microwave_model_M_microwave_model,
		y_microwave_model_N_es));

	res = create_and_init_siblings(next_obj,
			performanceData_val,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"create_and_init_siblings failed");

//	res = microwave_model_mw_air_interface_pac_air_interface_historical_performances_historical_performance_data_list_performance_data_mro(performanceData_val);
//	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "microwave_model_mw_air_interface_pac_air_interface_historical_performances_historical_performance_data_list_performance_data_mro failed");

	return NO_ERR;
}

static status_t attach_co_channel_group_list(cfg_template_t* runningcfg)
{
	status_t res = NO_ERR;
	char* co_channel_group_id_keys_entries[MAX_NUMBER_OF_AIR_INTERFACE_PAC_AIR_INTERFACE_HISTORICAL_PERFORMANCE_LIST_ENTRIES];
	int number_of_co_channel_group_id_keys;

	res = cb_get_all_co_channel_group_id_keys(co_channel_group_id_keys_entries, &number_of_co_channel_group_id_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_co_channel_group_id_keys failed!");

	for (int i=0; i<number_of_co_channel_group_id_keys; ++i)
	{
		res = attach_co_channel_group_list_entry(runningcfg->root, co_channel_group_id_keys_entries[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_co_channel_group_list_entry failed for key=%s!", co_channel_group_id_keys_entries[i]);

		free(co_channel_group_id_keys_entries[i]);
	}

	return NO_ERR;
}

static status_t attach_co_channel_group_list_entry(val_value_t *parentval, const char *co_channel_group_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Creating the root element for the module: CoChannelGroup
	 */
	val_value_t *co_channel_group_val = NULL;

	res = create_root_element_for_module(y_microwave_model_M_microwave_model,
			y_microwave_model_R_microwave_model,
			y_microwave_model_N_co_channel_group,
			&co_channel_group_val);
	YUMA_ASSERT(NULL == co_channel_group_val, return ERR_INTERNAL_VAL ,
			"create_root_element_for_module failed for element=%s", y_microwave_model_N_co_channel_group);

	val_add_child(co_channel_group_val, parentval);

	/*
	 * Create coChannelGroupId leaf
	 */
	val_value_t  *coChannelGroupId_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_co_channel_group_id,
			co_channel_group_val,
			&coChannelGroupId_val,
			co_channel_group_list_key_entry,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == coChannelGroupId_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_co_channel_group_id);

	char* airInterfaceList_entries[MAX_NUMBER_OF_CO_CHANNEL_GROUP_AIR_INTERFACE_LIST_ENTRIES];
	int number_of_co_channel_group_airInterfaceList_entries_id_keys;

	res = cb_get_all_co_channel_group_air_interface_list_id_keys(co_channel_group_list_key_entry, airInterfaceList_entries, &number_of_co_channel_group_airInterfaceList_entries_id_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_co_channel_group_air_interface_list_id_keys failed!");

	for (int i=0; i<number_of_co_channel_group_airInterfaceList_entries_id_keys; ++i)
	{
		/*
		 * Create airInterfaceList leaf-list entry
		 */
		val_value_t  *airInterfaceList_val = NULL;

		res = create_and_init_child_element(y_microwave_model_M_microwave_model,
				y_microwave_model_N_air_interface_list,
				co_channel_group_val,
				&airInterfaceList_val,
				airInterfaceList_entries[i],
				y_microwave_model_M_microwave_model,
				false);
		YUMA_ASSERT(NULL == airInterfaceList_val, return ERR_INTERNAL_VAL ,
					"create_and_init_child_element failed for element=%s", y_microwave_model_N_air_interface_list);

		free(airInterfaceList_entries[i]);
	}

	/*
	 * Create sortOfCoChannelGroup leaf
	 */
	val_value_t  *sortOfCoChannelGroup_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_sort_of_co_channel_group,
			co_channel_group_val,
			&sortOfCoChannelGroup_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == sortOfCoChannelGroup_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_sort_of_co_channel_group);

	return NO_ERR;
}

static status_t build_attributes_tree_and_attach_to_running_cfg(cfg_template_t* runningcfg)
{
    status_t res = NO_ERR;
    char* air_interface_pac_keys_list[MAX_NUMBER_OF_AIR_INTERFACE_PAC];
    int num_of_air_interface_pac_keys;

    /*
     * Getting all the interfaces of the system
     */
    res = cb_get_all_air_interface_pac_keys(air_interface_pac_keys_list, &num_of_air_interface_pac_keys);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_air_interface_pac_keys failed!");

    for (int i=0; i<num_of_air_interface_pac_keys; ++i)
    {
        /*
         * Attaching a mw_air_interface_pac list entry
         */
        res = attach_air_interface_pac_element_to_running_config(runningcfg, air_interface_pac_keys_list[i]);
        YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_air_interface_pac_element_to_running_config failed!");

        free(air_interface_pac_keys_list[i]);
    }

    return NO_ERR;
}

status_t build_air_interface_attributes_tree (void)
{
    status_t res = NO_ERR;

    /*
     * Creating the running datastore
     */
    cfg_template_t* runningcfg;
    runningcfg = cfg_get_config_id(NCX_CFGID_RUNNING);
    YUMA_ASSERT(!runningcfg || !runningcfg->root, return ERR_INTERNAL_VAL, "No running config available in u_MicrowaveModel_ObjectClasses_MwConnection_init2!");

    /*
     * Creating the mw_air_interface_pac list and attach it to the running config
     */
    res = build_attributes_tree_and_attach_to_running_cfg(runningcfg);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not build the tree for the running config");

    res = attach_co_channel_group_list(runningcfg);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not attach the CoChannelGroup the running config");

    return res;
}

/* END u_microwave_model.c */
