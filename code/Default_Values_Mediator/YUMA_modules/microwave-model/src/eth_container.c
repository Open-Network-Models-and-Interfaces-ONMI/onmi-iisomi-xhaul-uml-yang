
/* 
 * FILE: eth_container.c
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
#include "runtime_callbacks.h"
#include "configuration_callbacks.h"


/* put your static variables here */

static status_t build_attributes_tree_and_attach_to_running_cfg(cfg_template_t* runningcfg);
static status_t attach_ethernet_container_pac_element_to_running_config(cfg_template_t* runningcfg, const char* ethernet_container_pac_key);
static status_t attach_ethernet_container_capability_container(val_value_t *parentval);
static status_t attach_ethernet_container_configuration_container(val_value_t *parentval);
static status_t attach_segment_id_list(val_value_t* parentval);
static status_t attach_segment_id_list_entry(val_value_t* parentval, const char* segment_id_list_key_entry, const char* structure_id_list_key_entry);
static status_t attach_problem_kind_severity_list(val_value_t* parentval);
static status_t attach_problem_kind_severity_list_entry(val_value_t* parentval, const char* problem_kind_severity_list_key_entry);
static status_t get_ethernet_container_current_problem_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val);
static status_t attach_ethernet_container_current_problem_list_entry(val_value_t* parentval, const char* ethernet_container_current_problem_list_key_entry);
static status_t get_ethernet_container_current_performance_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val);
static status_t attach_ethernet_container_current_performance_list_entry(val_value_t *parentval, const char *ethernet_container_current_performance_list_key_entry);
static status_t get_ethernet_container_historical_performance_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val);
static status_t attach_ethernet_container_historical_performance_list_entry(val_value_t *parentval, const char *ethernet_container_historical_performance_list_key_entry);

static status_t build_attributes_tree_and_attach_to_running_cfg(cfg_template_t* runningcfg)
{
	status_t res = NO_ERR;
	char* ethernet_container_pac_keys_list[MAX_NUMBER_OF_ETHERNET_CONTAINER_PAC];
	int num_of_ethernet_container_pac_keys;

	/*
	 * Getting all the interfaces of the system
	 */
	res = cb_get_all_ethernet_container_pac_keys(ethernet_container_pac_keys_list, &num_of_ethernet_container_pac_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_ethernet_container_pac_keys failed!");

	for (int i=0; i<num_of_ethernet_container_pac_keys; ++i)
	{
		/*
		 * Attaching a mw_ethernet_container_pac list entry
		 */
		res = attach_ethernet_container_pac_element_to_running_config(runningcfg, ethernet_container_pac_keys_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_ethernet_container_pac_element_to_running_config failed!");

		free(ethernet_container_pac_keys_list[i]);
	}

	return NO_ERR;
}

static status_t attach_ethernet_container_pac_element_to_running_config(cfg_template_t* runningcfg, const char* ethernet_container_pac_key)
{
	status_t res = NO_ERR;

	/*
	 * Creating the root element for the module: mw_ethernet_container_pac
	 */
	val_value_t *mw_ethernet_container_pac_val = NULL;

	res = create_root_element_for_module(y_microwave_model_M_microwave_model,
			y_microwave_model_R_microwave_model,
			y_microwave_model_N_mw_ethernet_container_pac,
			&mw_ethernet_container_pac_val);
	YUMA_ASSERT(NULL == mw_ethernet_container_pac_val, return ERR_INTERNAL_VAL ,
			"create_root_element_for_module failed for element=%s", y_microwave_model_N_mw_ethernet_container_pac);

	val_add_child(mw_ethernet_container_pac_val, runningcfg->root);

	/*
	 * Creating the layer_protocol element
	 */
	val_value_t  *layer_protocol_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_layer_protocol,
			mw_ethernet_container_pac_val,
			&layer_protocol_val,
			ethernet_container_pac_key,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == layer_protocol_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_layer_protocol);

	/*
	 * Creating ethernetContainerCapability container
	 */
	val_value_t  *ethernetContainerCapability_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_ethernet_container_capability,
			mw_ethernet_container_pac_val,
			&ethernetContainerCapability_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == ethernetContainerCapability_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_ethernet_container_capability);

	/*
	 * Creating all the leaf elements of the ethernetContainerCapability container
	 */
	res = attach_ethernet_container_capability_container(ethernetContainerCapability_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"attach_ethernet_container_capability_container failed for layer_protocol=%s", ethernet_container_pac_key);

	/*
	 * Creating ethernetContainerConfiguration container
	 */
	val_value_t  *ethernetContainerConfiguration_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_ethernet_container_configuration,
			mw_ethernet_container_pac_val,
			&ethernetContainerConfiguration_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == ethernetContainerConfiguration_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_ethernet_container_configuration);

	res = attach_ethernet_container_configuration_container(ethernetContainerConfiguration_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"attach_ethernet_container_configuration_container failed for layer_protocol=%s", ethernet_container_pac_key);
	/*
	 * Creating ethernetContainerStatus container
	 */
	val_value_t  *ethernetContainerStatus_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_ethernet_container_status,
			mw_ethernet_container_pac_val,
			&ethernetContainerStatus_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == ethernetContainerStatus_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_ethernet_container_status);


	res = microwave_model_mw_ethernet_container_pac_ethernet_container_status_mro(ethernetContainerStatus_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"microwave_model_mw_ethernet_container_pac_ethernet_container_status_mro failed");

	/*
	 * Creating ethernetContainerCurrentProblems container
	 */
	val_value_t *ethernetContainerCurrentProblems_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_ethernet_container_current_problems,
			mw_ethernet_container_pac_val,
			&ethernetContainerCurrentProblems_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_ethernet_container_current_problems);

	val_init_virtual(ethernetContainerCurrentProblems_val,
					get_ethernet_container_current_problem_list,
					ethernetContainerCurrentProblems_val->obj);

	/*
	 * Creating ethernetContainerCurrentPerformance container
	 */
	val_value_t  *ethernetContainerCurrentPerformance_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_ethernet_container_current_performance,
			mw_ethernet_container_pac_val,
			&ethernetContainerCurrentPerformance_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_ethernet_container_current_performance);

	val_init_virtual(ethernetContainerCurrentPerformance_val,
					get_ethernet_container_current_performance_list,
					ethernetContainerCurrentPerformance_val->obj);

	/*
	 * Creating ethernetContainerHistoricalPerformances_val container
	 */
	val_value_t *ethernetContainerHistoricalPerformances_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_ethernet_container_historical_performances,
			mw_ethernet_container_pac_val,
			&ethernetContainerHistoricalPerformances_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_ethernet_container_historical_performances);

	val_init_virtual(ethernetContainerHistoricalPerformances_val,
					get_ethernet_container_historical_performance_list,
					ethernetContainerHistoricalPerformances_val->obj);

	return NO_ERR;
}

static status_t attach_ethernet_container_capability_container(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating bundlingIsAvail leaf
	 */
	val_value_t  *bundlingIsAvail_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_bundling_is_avail,
			parentval,
			&bundlingIsAvail_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == bundlingIsAvail_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_bundling_is_avail);

	/*
	 * Create all other leafs after typeOfEquipment
	 */
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(parentval->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_bundling_is_avail));

	res = create_and_init_siblings(next_obj,
			parentval,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");


	return NO_ERR;

}

static status_t attach_ethernet_container_configuration_container(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating containerId leaf
	 */
	val_value_t  *containerId_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_container_id,
			parentval,
			&containerId_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == containerId_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_container_id);

	/*
	 * Create all other leafs after containerId
	 */
	res = attach_segment_id_list(parentval);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_problem_kind_severity_list failed!");

	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(parentval->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_container_id));

	res = create_and_init_siblings(next_obj,
			parentval,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");

	res = attach_problem_kind_severity_list(parentval);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_problem_kind_severity_list failed!");

	return NO_ERR;
}

static status_t attach_segment_id_list(val_value_t* parentval)
{
	status_t res = NO_ERR;
	char* segment_id_list[MAX_NUMBER_OF_ETHERNET_CONTAINER_PAC_ETHERNET_CONTAINER_SEGMENT_LIST_ENTRIES];
    char* structure_id_list[MAX_NUMBER_OF_ETHERNET_CONTAINER_PAC_ETHERNET_CONTAINER_SEGMENT_LIST_ENTRIES];
	int num_of_segment_id_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_ethernet_container_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

	res = cb_get_all_segment_id_list_keys(k_mw_ethernet_container_pac_layer_protocol_key, segment_id_list, &num_of_segment_id_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_problem_kind_severity_list_keys failed!");

    res = cb_get_all_structure_id_list_keys(k_mw_ethernet_container_pac_layer_protocol_key, structure_id_list, &num_of_segment_id_keys);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_problem_kind_severity_list_keys failed!");

	for (int i=0; i<num_of_segment_id_keys; ++i)
	{
		res = attach_segment_id_list_entry(parentval, segment_id_list[i], structure_id_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_problem_kind_severity_list_entry failed for layer_protocol=%s and key=%s!", k_mw_ethernet_container_pac_layer_protocol_key, segment_id_list[i]);

		free(segment_id_list[i]);
        free(structure_id_list[i]);
	}

	return NO_ERR;
}

static status_t attach_segment_id_list_entry(val_value_t* parentval, const char* segment_id_list_key_entry, const char* structure_id_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Creating segments-id-list list entry
	 */
	val_value_t  *segmentIdList_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_segments_id_list,
			parentval,
			&segmentIdList_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == segmentIdList_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_segments_id_list);

	/*
	 * Creating structure-id-ref leaf
	 */
	val_value_t  *structureIdRef_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_structure_id_ref,
			segmentIdList_val,
			&structureIdRef_val,
			structure_id_list_key_entry,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == structureIdRef_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_structure_id_ref);

	/*
	 * Creating segment-id-ref leaf
	 */
	val_value_t  *segmentIdRef_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_segment_id_ref,
			segmentIdList_val,
			&segmentIdRef_val,
			segment_id_list_key_entry,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == segmentIdRef_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_segment_id_ref);

	return NO_ERR;
}

static status_t attach_problem_kind_severity_list(val_value_t* parentval)
{
	status_t res = NO_ERR;
	char* problem_kind_name[MAX_NUMBER_OF_PROBLEM_KIND_SEVERITY_ENTRIES];
	int num_of_problem_kind_name_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_ethernet_container_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

	res = cb_get_all_ethernet_container_problem_kind_severity_list_keys(k_mw_ethernet_container_pac_layer_protocol_key, problem_kind_name, &num_of_problem_kind_name_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_problem_kind_severity_list_keys failed!");

	for (int i=0; i<num_of_problem_kind_name_keys; ++i)
	{
		res = attach_problem_kind_severity_list_entry(parentval, problem_kind_name[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_problem_kind_severity_list_entry failed for layer_protocol=%s and key=%s!", k_mw_ethernet_container_pac_layer_protocol_key, problem_kind_name[i]);

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

static status_t get_ethernet_container_current_problem_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* ethernet_container_current_problem_list_keys_entries[MAX_NUMBER_OF_ETHERNET_CONTAINER_PAC_ETHERNET_CONTAINER_CURRENT_PROBLEM_LIST_ENTRIES];
	int num_of_ethernet_container_current_problem_list_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_ethernet_container_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	res = cb_get_all_ethernet_container_current_problem_list_keys(k_mw_ethernet_container_pac_layer_protocol_key, ethernet_container_current_problem_list_keys_entries, &num_of_ethernet_container_current_problem_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_ethernet_container_current_problem_list_keys failed!");

	for (int i=0; i<num_of_ethernet_container_current_problem_list_keys; ++i)
	{
		res = attach_ethernet_container_current_problem_list_entry(dst_val, ethernet_container_current_problem_list_keys_entries[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_ethernet_container_current_problem_list_entry failed for key=%s!", ethernet_container_current_problem_list_keys_entries[i]);

		free(ethernet_container_current_problem_list_keys_entries[i]);
	}

	return NO_ERR;
}

static status_t attach_ethernet_container_current_problem_list_entry(val_value_t* parentval, const char* ethernet_container_current_problem_list_key_entry)
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
			ethernet_container_current_problem_list_key_entry,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == sequenceNumber_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_sequence_number);

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

//    res = add_virtual_leaf(currentProblemList_val,
//                            y_microwave_model_N_time_stamp,
//                            microwave_model_mw_ethernet_container_pac_ethernet_container_current_problems_current_problem_list_time_stamp_get);
//    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not add virtual leaf=%s", y_microwave_model_N_time_stamp);

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

//    res = add_virtual_leaf(currentProblemList_val,
//                            y_microwave_model_N_problem_name,
//                            microwave_model_mw_ethernet_container_pac_ethernet_container_current_problems_current_problem_list_problem_name_get);
//    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not add virtual leaf=%s", y_microwave_model_N_problem_name);

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

//    res = add_virtual_leaf(currentProblemList_val,
//                            y_microwave_model_N_problem_severity,
//                            microwave_model_mw_ethernet_container_pac_ethernet_container_current_problems_current_problem_list_problem_severity_get);
//    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not add virtual leaf=%s", y_microwave_model_N_problem_severity);

	return NO_ERR;
}

static status_t get_ethernet_container_current_performance_list(ses_cb_t *scb,
        getcb_mode_t cbmode,
        val_value_t *vir_val,
        val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* ethernet_container_current_performance_list_keys_entries[MAX_NUMBER_OF_ETHERNET_CONTAINER_PAC_ETHERNET_CONTAINER_CURRENT_PERFORMANCE_LIST_ENTRIES];
	int num_of_ethernet_container_current_performance_list_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_ethernet_container_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	YUMA_ASSERT(TRUE, NOP, "get_ethernet_container_current_performance_list was called!");

	res = cb_get_all_ethernet_container_current_performance_list_keys(k_mw_ethernet_container_pac_layer_protocol_key, ethernet_container_current_performance_list_keys_entries, &num_of_ethernet_container_current_performance_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_ethernet_container_current_performance_list_keys failed!");

	for (int i=0; i<num_of_ethernet_container_current_performance_list_keys; ++i)
	{
		res = attach_ethernet_container_current_performance_list_entry(dst_val, ethernet_container_current_performance_list_keys_entries[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_ethernet_container_current_performance_list_entry failed for key=%s!", ethernet_container_current_performance_list_keys_entries[i]);

		free(ethernet_container_current_performance_list_keys_entries[i]);
	}

	return NO_ERR;
}

static status_t attach_ethernet_container_current_performance_list_entry(val_value_t *parentval, const char *ethernet_container_current_performance_list_key_entry)
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
			ethernet_container_current_performance_list_key_entry,
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
	 * Create txEthernetBytesMaxS leaf
	 */
	val_value_t  *txEthernetBytesMaxS_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tx_ethernet_bytes_max_s,
			performanceData_val,
			&txEthernetBytesMaxS_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == txEthernetBytesMaxS_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_tx_ethernet_bytes_max_s);

	/*create all other elements after txEthernetBytesMaxS*/
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(performanceData_val->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_tx_ethernet_bytes_max_s));

	res = create_and_init_siblings(next_obj,
			performanceData_val,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");

//	res = microwave_model_mw_ethernet_container_pac_ethernet_container_current_performance_current_performance_data_list_performance_data_mro(performanceData_val);
//	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "microwave_model_mw_ethernet_container_pac_ethernet_container_current_performance_current_performance_data_list_performance_data_mro failed!");

	return NO_ERR;
}

static status_t get_ethernet_container_historical_performance_list(ses_cb_t *scb,
        getcb_mode_t cbmode,
        val_value_t *vir_val,
        val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* ethernet_container_historical_performance_list_keys_entries[MAX_NUMBER_OF_ETHERNET_CONTAINER_PAC_ETHERNET_CONTAINER_HISTORICAL_PERFORMANCE_LIST_ENTRIES];
	int num_of_ethernet_container_historical_performance_list_keys;

	val_value_t *lastkey = NULL;
	const xmlChar *k_mw_ethernet_container_pac_layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	YUMA_ASSERT(TRUE, NOP, "get_ethernet_container_historical_performance_list was called!");

	res = cb_get_all_ethernet_container_historical_performance_list_keys(k_mw_ethernet_container_pac_layer_protocol_key, ethernet_container_historical_performance_list_keys_entries, &num_of_ethernet_container_historical_performance_list_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_ethernet_container_historical_performance_list_keys failed!");

	for (int i=0; i<num_of_ethernet_container_historical_performance_list_keys; ++i)
	{
		res = attach_ethernet_container_historical_performance_list_entry(dst_val, ethernet_container_historical_performance_list_keys_entries[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_ethernet_container_historical_performance_list_entry failed for key=%s!", ethernet_container_historical_performance_list_keys_entries[i]);

		free(ethernet_container_historical_performance_list_keys_entries[i]);
	}

	return NO_ERR;
}

static status_t attach_ethernet_container_historical_performance_list_entry(val_value_t *parentval, const char *ethernet_container_historical_performance_list_key_entry)
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
			ethernet_container_historical_performance_list_key_entry,
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
    YUMA_ASSERT(NULL == suspectIntervalFlag_val, return ERR_INTERNAL_VAL ,
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
	YUMA_ASSERT(NULL == periodEndTime_val, return ERR_INTERNAL_VAL ,
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
	YUMA_ASSERT(NULL == granularityPeriod_val, return ERR_INTERNAL_VAL ,
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
     * Create txEthernetBytesMaxS virtual leaf with callback attached
     */
	val_value_t  *txEthernetBytesMaxS_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tx_ethernet_bytes_max_s,
			performanceData_val,
			&txEthernetBytesMaxS_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == txEthernetBytesMaxS_val, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_tx_ethernet_bytes_max_s);

	/*create all other elements after txEthernetBytesMaxS*/
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(performanceData_val->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_tx_ethernet_bytes_max_s));

	res = create_and_init_siblings(next_obj,
			performanceData_val,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");


//	res = microwave_model_mw_ethernet_container_pac_ethernet_container_historical_performances_historical_performance_data_list_performance_data_mro(performanceData_val);
//	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "microwave_model_mw_ethernet_container_pac_ethernet_container_historical_performances_historical_performance_data_list_performance_data_mro failed!");

	return NO_ERR;
}

status_t build_ethernet_container_attributes_tree (void)
{
    status_t res = NO_ERR;

    /*
     * Creating the running datastore
     */
    cfg_template_t* runningcfg;
    runningcfg = cfg_get_config_id(NCX_CFGID_RUNNING);
    YUMA_ASSERT(!runningcfg || !runningcfg->root, return ERR_INTERNAL_VAL, "No running config available in u_microwave_model_init2!");

    /*
     * Creating the mw_ethernet_container_pac list and attach it to the running config
     */
    res = build_attributes_tree_and_attach_to_running_cfg(runningcfg);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not build the tree for the running config");

    return res;
} /* u_microwave_model_init2 */


/* END u_microwave_model.c */
