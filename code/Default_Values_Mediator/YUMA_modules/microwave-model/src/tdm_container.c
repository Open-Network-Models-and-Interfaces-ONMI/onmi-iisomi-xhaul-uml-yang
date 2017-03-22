
/* 
 * FILE: tdm_container.c
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
#include "boot_time_callbacks.h"
#include "configuration_callbacks.h"


/* put your static variables here */

static status_t attach_supported_tdm_container_types_list_entry(val_value_t* parentval, const char* key)
{
	status_t res = NO_ERR;

	/*
	 * Creating supported_tdm_container_types_list list entry
	 */
        val_value_t  *entry = NULL;

        res = create_and_init_child_element(y_microwave_model_M_microwave_model,
                y_microwave_model_N_supported_tdm_container_types_list,
                parentval,
                &entry,
                NULL,
                y_microwave_model_M_microwave_model,
                false);
        YUMA_ASSERT(NULL == entry, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_supported_tdm_container_types_list);

	/*
	 * Creating tdmContainerName leaf
	 */
	val_value_t  *leaf1 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_name,
			entry,
			&leaf1,
			(const xmlChar *)key,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf1, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s [key=%s]", y_microwave_model_N_tdm_container_name, key);

	/*
	 * Create tdmContainerSize leaf
	 */
	val_value_t  *leaf2 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_size,
			entry,
			&leaf2,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf2, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_tdm_container_size);

	return res;
}

static status_t attach_supported_tdm_container_types_list(val_value_t *parentval)
{
    status_t res = NO_ERR;

    xmlChar* key_list[MAX_NUMBER_OF_TDM_CONTAINER_TYPES_LIST];
    int key_nb=0;

    val_value_t *lastkey = NULL;
    const xmlChar *layer_protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

    res = key_get_supported_tdm_container_types_list(layer_protocol_key, (xmlChar**)key_list, &key_nb);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_supported_tdm_container_types_list failed!");

    for (int i=0; i<key_nb; ++i)
    {
        res = attach_supported_tdm_container_types_list_entry(parentval, (const char *)key_list[i]);        
        YUMA_ASSERT(NO_ERR != res, return ERR_INTERNAL_VAL, "attach_supported_tdm_container_types_list_entry for failed for layer_protocol=%s and key=%s!", layer_protocol_key, key_list[i]);
        free (key_list[i]);
    }

    return res;
}

static status_t attach_tdm_container_capability_container(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating supported_tdm_container_types_list
	 */
	res = attach_supported_tdm_container_types_list(parentval);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_supported_tdm_container_types_list failed");

	/*
	 * Creating supportedAlarms leaf
	 */
	val_value_t  *supportedAlarms_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_supported_alarms,
			parentval,
			&supportedAlarms_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == supportedAlarms_val, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_supported_alarms);

	return res;

}

static status_t attach_tdm_container_configuration_container_type(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating container_type list entry
	 */
        val_value_t  *entry = NULL;

        res = create_and_init_child_element(y_microwave_model_M_microwave_model,
                y_microwave_model_N_container_type,
                parentval,
                &entry,
                NULL,
                y_microwave_model_M_microwave_model,
                false);
        YUMA_ASSERT(NULL == entry, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for failed for%s!", y_microwave_model_N_container_type);

	/*
	 * Creating tdm_container_name leaf
	 */
	val_value_t  *leaf1 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_name,
			entry,
			&leaf1,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf1, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_tdm_container_name);

	/*
	 * Create tdmContainerSize leaf
	 */
	val_value_t  *leaf2 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_size,
			entry,
			&leaf2,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf2, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_tdm_container_size);

	return res;
}

static status_t attach_tdm_container_configuration_segment_id(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating structure-id-ref list entry
	 */
        val_value_t  *entry = NULL;

        res = create_and_init_child_element(y_microwave_model_M_microwave_model,
                y_microwave_model_N_segment_id,
                parentval,
                &entry,
                NULL,
                y_microwave_model_M_microwave_model,
                false);
        YUMA_ASSERT(NULL == entry, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for failed for %s!", y_microwave_model_N_structure_id);

	/*
	 * Creating structure_id_ref leaf
	 */
	val_value_t  *leaf1 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_structure_id_ref,
			entry,
			&leaf1,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf1, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_structure_id_ref);

	/*
	 * Create segment_id_ref leaf
	 */
	val_value_t  *leaf2 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_segment_id_ref,
			entry,
			&leaf2,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf2, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_segment_id_ref);

	return res;
}

static status_t attach_problem_kind_severity_list_entry(val_value_t* parentval, const char* problem_kind_severity_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Creating problemKindSeverityList list entry
	 */
	val_value_t  *entry = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_kind_severity_list,
			parentval,
			&entry,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == entry, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_kind_severity_list);

	/*
	 * Creating problemKindName leaf
	 */
	val_value_t  *leaf1 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_kind_name,
			entry,
			&leaf1,
			(const xmlChar *)problem_kind_severity_list_key_entry,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf1, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_kind_name);

	/*
	 * Creating problemKindSeverity leaf
	 */
	val_value_t  *leaf2 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_kind_severity,
			entry,
			&leaf2,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == leaf2, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_kind_severity);

	return res;
}

static status_t attach_problem_kind_severity_list(val_value_t* parentval)
{
	status_t res = NO_ERR;
	char* key_list[MAX_NUMBER_OF_PROBLEM_KIND_SEVERITY_ENTRIES];
	int key_nb=0;

	val_value_t *lastkey = NULL;
	const xmlChar *protocol_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

	res = key_get_tdm_container_problem_kind_severity_list(protocol_key, (xmlChar**)key_list, &key_nb);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_problem_kind_severity_list_keys failed!");

	for (int i=0; i<key_nb; ++i)
	{
		res = attach_problem_kind_severity_list_entry(parentval, key_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL,
				"attach_problem_kind_severity_list_entry failed for layer_protocol=%s and key=%s!", protocol_key, key_list[i]);

		free(key_list[i]);
	}

	return NO_ERR;
}

static status_t attach_tdm_container_configuration_container(val_value_t *parentval)
{
	status_t res = NO_ERR;

	/*
	 * Creating container-id
	 */
	val_value_t  *containerId_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_container_id,
			parentval,
			&containerId_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == containerId_val, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_container_id);

#if 0
	/*
	 * Create all other leafs after containerId
	 */
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(parentval->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_container_id));

	res = create_and_init_siblings(next_obj,
			parentval,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed res=!");
#endif

	/* Create container type */
	res = attach_tdm_container_configuration_container_type(parentval);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_configuration_container_type failed!");

	/* Create segment id */
	res = attach_tdm_container_configuration_segment_id(parentval);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_configuration_segment_id!");

	/* Problema kinfd severity list */
	res = attach_problem_kind_severity_list(parentval);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_problem_kind_severity_list!");

	return NO_ERR;
}

static status_t attach_tdm_container_current_problem_list_entry(val_value_t* parentval, const char* tdm_container_current_problem_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Create currentProblemList list entry
	 */

	val_value_t  *entry = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_current_problem_list,
			parentval,
			&entry,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == entry, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_current_problem_list);

	/*
	 * Create sequenceNumber leaf
	 */
	val_value_t  *leaf_key1 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_sequence_number,
			entry,
			&leaf_key1,
			(const xmlChar *)tdm_container_current_problem_list_key_entry,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf_key1, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_sequence_number);

    /*
     * Create timeStamp virtual leaf with callback attached
     */
	val_value_t  *leaf2 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_time_stamp,
			entry,
			&leaf2,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf2, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_time_stamp);

    /*
     * Create problemName virtual leaf with callback attached
     */
	val_value_t  *leaf3 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_name,
			entry,
			&leaf3,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf3, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_name);

    /*
     * Create problemSeverity virtual leaf with callback attached
     */
	val_value_t  *leaf4 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_problem_severity,
			entry,
			&leaf4,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf4, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_problem_severity);

	return res;
}

static status_t get_tdm_container_current_problem_list(ses_cb_t *scb, getcb_mode_t cbmode, val_value_t *vir_val, val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* key_list[MAX_NUMBER_OF_TDM_CONTAINER_PROBLEM_LIST_ENTRIES];
	int keys_nb;

	val_value_t *lastkey = NULL;
	const xmlChar *layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	res = key_get_tdm_container_current_problem_list(layer_protocol_key, (xmlChar **)key_list, &keys_nb);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_tdm_container_current_problem_list failed!");

	for (int i=0; i<keys_nb; ++i)
	{
		res = attach_tdm_container_current_problem_list_entry(dst_val, key_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_current_problem_list_entry failed for key=%s!", key_list[i]);

		free(key_list[i]);
	}

	return NO_ERR;
}

static status_t attach_tdm_container_current_performance_list_entry(val_value_t *parentval, const char *tdm_container_current_performance_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Create currentPerformanceDataList list entry
	 */
	val_value_t  *entry = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_current_performance_data_list,
			parentval,
			&entry,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == entry, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_current_performance_data_list);
	/*
	 * Create scannerId leaf
	 */
	val_value_t  *leaf_key1 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_scanner_id,
			entry,
			&leaf_key1,
			(const xmlChar *)tdm_container_current_performance_list_key_entry,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf_key1, return ERR_INTERNAL_VAL ,
				"create_and_init_child_element failed for element=%s", y_microwave_model_N_scanner_id);

    /*
     * Create timestamp virtual leaf with callback attached
     */
    val_value_t  *leaf2 = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_timestamp,
            entry,
            &leaf2,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == leaf2, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_microwave_model_N_timestamp);

    /*
     * Create suspectIntervalFlag virtual leaf with callback attached
     */
    val_value_t  *leaf3 = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_suspect_interval_flag,
            entry,
            &leaf3,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == leaf3, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_suspect_interval_flag);

    /*
     * Create elapsedTime virtual leaf with callback attached
     */
    val_value_t  *leaf4 = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_elapsed_time,
            entry,
            &leaf4,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == leaf4, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_elapsed_time);

   /*
     * Create granularityPeriod virtual leaf with callback attached
     */
	val_value_t  *leaf5 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_granularity_period,
			entry,
			&leaf5,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf5, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_granularity_period);

    /*
     * Create administrativeState virtual leaf with callback attached
     */
    val_value_t  *leaf6 = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_administrative_state,
            entry,
            &leaf6,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == leaf6, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_administrative_state);

	/*
	 * Create object-class virtual leaf with callback attached
	 */

	val_value_t  *leaf7 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
	        y_microwave_model_N_object_class,
	        entry,
	        &leaf7,
	        NULL,
	        y_microwave_model_M_microwave_model,
	        true);
	YUMA_ASSERT(NULL == leaf7, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_object_class);

	/*
	 * Create name-binding virtual leaf with callback attached
	 */

	val_value_t  *leaf8 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
	        y_microwave_model_N_name_binding,
	        entry,
	        &leaf8,
	        NULL,
	        y_microwave_model_M_microwave_model,
	        true);
	YUMA_ASSERT(NULL == leaf8, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_name_binding);

	/*
	 * Create performanceData container
	 */
	val_value_t  *pmDataContainer = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_performance_data,
			entry,
			&pmDataContainer,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == pmDataContainer, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_performance_data);

	/*
	 * Create txTdmBytesMaxS leaf
	 */
	val_value_t  *txTdmBytesMaxS_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tx_ethernet_bytes_max_s,
			pmDataContainer,
			&txTdmBytesMaxS_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == txTdmBytesMaxS_val, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_tx_ethernet_bytes_max_s);

	/*create all other elements after txEthernetBytesMaxS*/
	obj_template_t *next_obj = NULL;
	next_obj = obj_next_child(obj_find_child(pmDataContainer->obj,
			y_microwave_model_M_microwave_model,
			y_microwave_model_N_tx_ethernet_bytes_max_s));

	res = create_and_init_siblings(next_obj,
			pmDataContainer,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "create_and_init_siblings failed!");

	return NO_ERR;
}

static status_t get_tdm_container_current_performance_list(ses_cb_t *scb,
        getcb_mode_t cbmode,
        val_value_t *vir_val,
        val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* key_list[MAX_NUMBER_OF_TDM_CONTAINER_CURRENT_PERFORMANCE_LIST_ENTRIES];
	int keys_nb;

	val_value_t *lastkey = NULL;
	const xmlChar *layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	YUMA_ASSERT(TRUE, NOP, "get_tdm_container_current_performance_list was called!");

	res = key_get_tdm_container_current_performance_list(layer_protocol_key, (xmlChar **)key_list, &keys_nb);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_tdm_container_current_performance_list failed!");

	for (int i=0; i<keys_nb; ++i)
	{
		res = attach_tdm_container_current_performance_list_entry(dst_val, key_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_current_performance_list_entry failed for key=%s!", key_list[i]);

		free(key_list[i]);
	}

	return NO_ERR;
}

static status_t attach_tdm_container_historical_performance_list_entry(val_value_t *parentval, const char *tdm_container_historical_performance_list_key_entry)
{
	status_t res = NO_ERR;

	/*
	 * Create historicalPerformanceDataList list entry
	 */
	val_value_t  *entry = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_historical_performance_data_list,
			parentval,
			&entry,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == entry, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_historical_performance_data_list);

	/*
	 * Create historyDataId leaf
	 */
	val_value_t  *leaf_key1 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_history_data_id,
			entry,
			&leaf_key1,
			(const xmlChar *)tdm_container_historical_performance_list_key_entry,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf_key1, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_history_data_id);

    /*
     * Create suspectIntervalFlag virtual leaf with callback attached
     */
    val_value_t  *leaf2 = NULL;

    res = create_and_init_child_element(y_microwave_model_M_microwave_model,
            y_microwave_model_N_suspect_interval_flag,
            entry,
            &leaf2,
            NULL,
            y_microwave_model_M_microwave_model,
            true);
    YUMA_ASSERT(NULL == leaf2, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_suspect_interval_flag);

    /*
     * Create periodEndTime virtual leaf with callback attached
     */
	val_value_t  *leaf3 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_period_end_time,
			entry,
			&leaf3,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf3, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_period_end_time);

    /*
     * Create granularityPeriod virtual leaf with callback attached
     */
	val_value_t  *leaf4 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_granularity_period,
			entry,
			&leaf4,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == leaf4, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_granularity_period);

	/*
	 * Create object-class virtual leaf with callback attached
	 */

	val_value_t  *leaf5 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
	        y_microwave_model_N_object_class,
	        entry,
	        &leaf5,
	        NULL,
	        y_microwave_model_M_microwave_model,
	        true);
	YUMA_ASSERT(NULL == leaf5, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_object_class);

	/*
	 * Create name-binding virtual leaf with callback attached
	 */

	val_value_t  *leaf6 = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
	        y_microwave_model_N_name_binding,
	        entry,
	        &leaf6,
	        NULL,
	        y_microwave_model_M_microwave_model,
	        true);
	YUMA_ASSERT(NULL == leaf6, return ERR_INTERNAL_VAL ,
	        "create_and_init_child_element failed for element=%s", y_microwave_model_N_name_binding);

	/*
	 * Create performanceData container
	 */
	val_value_t  *performanceData_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_performance_data,
			entry,
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


	return NO_ERR;
}

static status_t get_tdm_container_historical_performance_list(ses_cb_t *scb,
        getcb_mode_t cbmode,
        val_value_t *vir_val,
        val_value_t *dst_val)
{
	status_t res = NO_ERR;
	char* key_list[MAX_NUMBER_OF_TDM_CONTAINER_HISTORICAL_PERFORMANCE_LIST_ENTRIES];
	int keys_nb;

	val_value_t *lastkey = NULL;
	const xmlChar *layer_protocol_key = VAL_STRING(agt_get_key_value(dst_val, &lastkey));

	YUMA_ASSERT(TRUE, NOP, "get_tdm_container_historical_performance_list was called!");

	res = key_get_tdm_container_historical_performance_list(layer_protocol_key, (xmlChar **)key_list, &keys_nb);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_tdm_container_historical_performance_list failed!");

	for (int i=0; i<keys_nb; ++i)
	{
		res = attach_tdm_container_historical_performance_list_entry(dst_val, key_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_historical_performance_list_entry failed for key=%s!", key_list[i]);

		free(key_list[i]);
	}

	return NO_ERR;
}

static status_t attach_tdm_container_pac_element_to_running_config(cfg_template_t* runningcfg, const char* tdm_container_pac_key)
{
	status_t res = NO_ERR;

	/*
	 * Creating the root element for the module: mw_tdm_container_pac
	 */
	val_value_t *mw_tdm_container_pac_val = NULL;

	res = create_root_element_for_module(y_microwave_model_M_microwave_model,
			y_microwave_model_R_microwave_model,
			y_microwave_model_N_mw_tdm_container_pac,
			&mw_tdm_container_pac_val);
	YUMA_ASSERT(NULL == mw_tdm_container_pac_val, return ERR_INTERNAL_VAL, "create_root_element_for_module failed for element=%s", y_microwave_model_N_mw_tdm_container_pac);

	val_add_child(mw_tdm_container_pac_val, runningcfg->root);

	/*
	 * Creating the layer_protocol element
	 */
	val_value_t  *layer_protocol_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_layer_protocol,
			mw_tdm_container_pac_val,
			&layer_protocol_val,
			(const xmlChar *)tdm_container_pac_key,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == layer_protocol_val, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_layer_protocol);

	/*
	 * Creating tdmContainerCapability container
	 */
	val_value_t  *tdmContainerCapability_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_capability,
			mw_tdm_container_pac_val,
			&tdmContainerCapability_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == tdmContainerCapability_val, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_tdm_container_capability);

	/*
	 * Creating all the leaf elements of the tdmContainerCapability container
	 */
	res = attach_tdm_container_capability_container(tdmContainerCapability_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_capability_container failed for layer_protocol=%s", tdm_container_pac_key);

	/*
	 * Creating tdmContainerConfiguration container
	 */
	val_value_t  *tdmContainerConfiguration_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_configuration,
			mw_tdm_container_pac_val,
			&tdmContainerConfiguration_val,
			NULL,
			y_microwave_model_M_microwave_model,
			false);
	YUMA_ASSERT(NULL == tdmContainerConfiguration_val, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_tdm_container_configuration);

	res = attach_tdm_container_configuration_container(tdmContainerConfiguration_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_configuration_container failed for layer_protocol=%s", tdm_container_pac_key);
	/*
	 * Creating tdmContainerStatus container
	 */
	val_value_t  *tdmContainerStatus_val = NULL;

	res = create_and_init_child_element(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_status,
			mw_tdm_container_pac_val,
			&tdmContainerStatus_val,
			NULL,
			y_microwave_model_M_microwave_model,
			true);
	YUMA_ASSERT(NULL == tdmContainerStatus_val, return ERR_INTERNAL_VAL, "create_and_init_child_element failed for element=%s", y_microwave_model_N_tdm_container_status);

	res = microwave_model_mw_tdm_container_pac_tdm_container_status_mro(tdmContainerStatus_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "microwave_model_mw_tdm_container_pac_tdm_container_status_mro failed");

	/*
	 * Creating tdmContainerCurrentProblems container
	 */
	val_value_t *tdmContainerCurrentProblems_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_current_problems,
			mw_tdm_container_pac_val,
			&tdmContainerCurrentProblems_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "agt_make_container failed for obj=%s", y_microwave_model_N_tdm_container_current_problems);

	val_init_virtual(tdmContainerCurrentProblems_val,
					get_tdm_container_current_problem_list,
					tdmContainerCurrentProblems_val->obj);

	/*
	 * Creating tdmContainerCurrentPerformance container
	 */
	val_value_t  *tdmContainerCurrentPerformance_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_current_performance,
			mw_tdm_container_pac_val,
			&tdmContainerCurrentPerformance_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_tdm_container_current_performance);

	val_init_virtual(tdmContainerCurrentPerformance_val,
					get_tdm_container_current_performance_list,
					tdmContainerCurrentPerformance_val->obj);

	/*
	 * Creating tdmContainerHistoricalPerformances_val container
	 */
	val_value_t *tdmContainerHistoricalPerformances_val = NULL;

	res = agt_add_container(y_microwave_model_M_microwave_model,
			y_microwave_model_N_tdm_container_historical_performances,
			mw_tdm_container_pac_val,
			&tdmContainerHistoricalPerformances_val);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
						"agt_make_container failed for obj=%s", y_microwave_model_N_tdm_container_historical_performances);

	val_init_virtual(tdmContainerHistoricalPerformances_val,
					get_tdm_container_historical_performance_list,
					tdmContainerHistoricalPerformances_val->obj);

	return NO_ERR;
}

static status_t build_attributes_tree_and_attach_to_running_cfg(cfg_template_t* runningcfg)
{
	status_t res = NO_ERR;
	char* tdm_container_pac_keys_list[MAX_NUMBER_OF_TDM_CONTAINER_PAC];
	int num_of_tdm_container_pac_keys;

	/*
	 * Getting all the interfaces of the system
	 */
	res = key_get_all_tdm_container((xmlChar **)tdm_container_pac_keys_list, &num_of_tdm_container_pac_keys);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "cb_get_all_tdm_container_pac_keys failed!");

	for (int i=0; i<num_of_tdm_container_pac_keys; ++i)
	{
		/*
		 * Attaching a mw_tdm_container_pac list entry
		 */
		res = attach_tdm_container_pac_element_to_running_config(runningcfg, tdm_container_pac_keys_list[i]);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "attach_tdm_container_pac_element_to_running_config failed!");

		free(tdm_container_pac_keys_list[i]);
	}

	return NO_ERR;
}

status_t build_tdm_container_attributes_tree (void)
{
    status_t res = NO_ERR;

    /*
     * Creating the running datastore
     */
    cfg_template_t* runningcfg;
    runningcfg = cfg_get_config_id(NCX_CFGID_RUNNING);
    YUMA_ASSERT(!runningcfg || !runningcfg->root, return ERR_INTERNAL_VAL, "No running config available in u_microwave_model_init2!");

    /*
     * Creating the mw_tdm_container_pac list and attach it to the running config
     */
    res = build_attributes_tree_and_attach_to_running_cfg(runningcfg);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not build the tree for the running config");

    return res;
} 

