
/* 
 * FILE: core_model.c
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
#include "u_core-model.h"
#include "y_core-model.h"

#include "string.h"
#include "utils.h"
#include "ses.h"
#include "rpc.h"
#include "runtime_callbacks.h"
#include "configuration_callbacks.h"
#include "boot_time_callbacks.h"

static void key_free (xmlChar** key_list, int num_of_entries)
{
    while(num_of_entries--)
    {
        free(key_list[num_of_entries]);
    }
}

static status_t attach_name_and_value_entry(val_value_t *parentval, const xmlChar* value, const xmlChar* valueName)
{
    status_t res = NO_ERR;

    /*
     * Creating valueName leaf (it is the key)
     */
    val_value_t  *valueName_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_value_name,
            parentval,
            &valueName_val,
            valueName,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == valueName_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_value_name);

    /*
     * Creating value leaf
     */
    val_value_t  *value_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_value,
            parentval,
            &value_val,
            value,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == value_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_value);

    return res;
}

static status_t attach_local_id_list_elements(const xmlChar* prefix, val_value_t *parentval, xmlChar** keys, int num_of_entries)
{
    status_t res = NO_ERR;

    for (int i=0; i<num_of_entries; ++i)
    {
        /* Creating localIdList list entry */
        val_value_t  *localIdList_val = NULL;
        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_local_id,
                parentval,
                &localIdList_val,
                NULL,
                y_core_model_M_core_model,
                false);

        YUMA_ASSERT(NULL == localIdList_val, return ERR_INTERNAL_VAL ,
                    "create_and_init_child_element failed for element=%s", y_core_model_N_local_id);

        res = attach_name_and_value_entry(localIdList_val, NULL, keys[i]);
        YUMA_ASSERT(res != NO_ERR, key_free(keys, num_of_entries); return ERR_INTERNAL_VAL , "attach_name_and_value_entry failed");
    }

    key_free(keys, num_of_entries);

    return NO_ERR;
}

static status_t attach_name_list_elements(const xmlChar* prefix, val_value_t *parentval, xmlChar** keys, int num_of_entries)
{
    status_t res = NO_ERR;

    for (int i=0; i<num_of_entries; ++i)
    {
        /* Creating name list entry */
        val_value_t  *nameList_val = NULL;
        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_name,
                parentval,
                &nameList_val,
                NULL,
                y_core_model_M_core_model,
                false);

        YUMA_ASSERT(NULL == nameList_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_name);

        res = attach_name_and_value_entry(nameList_val, NULL, keys[i]);
        YUMA_ASSERT(res != NO_ERR, key_free(keys, num_of_entries); return ERR_INTERNAL_VAL , "attach_name_and_value_entry failed");
    }

    key_free(keys, num_of_entries);

    return NO_ERR;
}

static status_t attach_label_list_elements(const xmlChar* prefix, val_value_t *parentval, xmlChar** keys, int num_of_entries)
{
    status_t res = NO_ERR;

    for (int i=0; i<num_of_entries; ++i)
    {
        /* Creating label list entry */
        val_value_t  *labelList_val = NULL;
        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_label,
                parentval,
                &labelList_val,
                NULL,
                y_core_model_M_core_model,
                false);
        YUMA_ASSERT(NULL == labelList_val, return ERR_INTERNAL_VAL ,
                    "create_and_init_child_element failed for element=%s", y_core_model_N_label);

        res = attach_name_and_value_entry(labelList_val, NULL, keys[i]);
        YUMA_ASSERT(res != NO_ERR, key_free(keys, num_of_entries); return ERR_INTERNAL_VAL , "attach_name_and_value_entry failed");
    }

    key_free(keys, num_of_entries);

    return NO_ERR;
}

static status_t attach_extension_list_elements(const xmlChar* prefix, val_value_t *parentval, xmlChar** keys, int num_of_entries)
{
    status_t res = NO_ERR;

    for (int i=0; i<num_of_entries; ++i)
    {
        /*Creating extension list entry */
        val_value_t  *extensionList_val = NULL;
        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_extension,
                parentval,
                &extensionList_val,
                NULL,
                y_core_model_M_core_model,
                false);
        YUMA_ASSERT(NULL == extensionList_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_extension);

        res = attach_name_and_value_entry(extensionList_val, NULL, keys[i]);
        YUMA_ASSERT(res != NO_ERR, key_free(keys, num_of_entries); return ERR_INTERNAL_VAL , "attach_name_and_value_entry failed");
    }

    key_free(keys, num_of_entries);

    return NO_ERR;
}

static status_t attach_state_pac_elements(val_value_t *parentval)
{
    status_t res = NO_ERR;

    /*
     * Creating operational-state leaf
     */
    val_value_t  *operationalState_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_operational_state,
            parentval,
            &operationalState_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == operationalState_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_operational_state);

    /*
     * Creating administrative-control leaf
     */
    val_value_t  *administrativeControl_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_administrative_control,
            parentval,
            &administrativeControl_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == administrativeControl_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_administrative_control);

    /*
     * Creating administratives-state leaf
     */
    val_value_t  *administrativeState_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_administrative_state,
            parentval,
            &administrativeState_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == administrativeState_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_administrative_state);

    /*
     * Creating lifecycle-state leaf
     */
    val_value_t  *lifecycleState_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_lifecycle_state,
            parentval,
            &lifecycleState_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == administrativeState_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_lifecycle_state);

    return res;
}

static status_t attach_class_elements(xmlChar** nested_key, int num_of_nested_key, val_value_t *parentval, const xmlChar* uuid, const xmlChar* prefix)
{
    status_t res = NO_ERR;
    xmlChar *entry_list[MAX_NUMBER_OF_CORE_MODEL_VALUES];
    int num_of_entries = 0;

    val_value_t  *uuid_val = NULL;
    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_uuid,
            parentval,
            &uuid_val,
            uuid,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == uuid_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_uuid);

    res = key_get_all_localid_list_by_uuid(nested_key, num_of_nested_key, uuid, entry_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_all_localid_list_by_uuid failed!");
    res = attach_local_id_list_elements(prefix, parentval, entry_list, num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_local_id_list_elements failed ");

    res = key_get_all_name_list_by_uuid(nested_key, num_of_nested_key, uuid, entry_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_all_name_by_uuid failed!");
    res = attach_name_list_elements(prefix, parentval, entry_list, num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_name_list_elements failed ");

    res = key_get_all_label_list_by_uuid(nested_key, num_of_nested_key, uuid, entry_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_all_label_by_uuid failed!");
    res = attach_label_list_elements(prefix, parentval, entry_list, num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_label_list_elements failed ");

    res = key_get_all_extension_list_by_uuid(nested_key, num_of_nested_key, uuid, entry_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_all_extension_by_uuid failed!");
    res = attach_extension_list_elements(prefix, parentval, entry_list, num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_extension_list_elements failed ");

    res = attach_state_pac_elements(parentval);   /* FIXME: callbacks */
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_state_pac_elements failed ");

    return NO_ERR;
}

static status_t attach_server_and_client_list_elements(xmlChar** nested_key, int num_of_nested_key, val_value_t *parentval)
{
    status_t res = NO_ERR;

    xmlChar* server_ltp_leaf_list[MAX_NUMBER_OF_SERVER_CLIENT_REF_ENTRIES];
    xmlChar* client_ltp_leaf_list[MAX_NUMBER_OF_SERVER_CLIENT_REF_ENTRIES];
    int num_of_entries;

    val_value_t *lastkey = NULL;
    const xmlChar *k_ltpRefList_uuid_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

    num_of_entries = 0;  /* take care */
    res = key_get_server_by_uuid(nested_key, num_of_nested_key, k_ltpRefList_uuid_key, server_ltp_leaf_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_server_by_uuid failed!");

    for (int i=0; i<num_of_entries; ++i)
    {
        /*
         * Creating _serverLtpRefList leaf-list
         */
        val_value_t  *_serverLtpRefList_val = NULL;

        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_server_ltp,
                parentval,
                &_serverLtpRefList_val,
                server_ltp_leaf_list[i],
                y_core_model_M_core_model,
                false);
        YUMA_ASSERT(NULL == _serverLtpRefList_val, key_free(server_ltp_leaf_list, num_of_entries); return ERR_INTERNAL_VAL ,
                    "create_and_init_child_element failed for element=%s", y_core_model_N_server_ltp);
    }
    key_free(server_ltp_leaf_list, num_of_entries);

    num_of_entries = 0;  /* take care */
    res = key_get_client_by_uuid(nested_key, num_of_nested_key, k_ltpRefList_uuid_key, client_ltp_leaf_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_client_by_uuid failed!");

    for (int i=0; i<num_of_entries; ++i)
    {
        /*
         * Creating _clientLtpRefList leaf-list
         */
        val_value_t  *_clientLtpRefList_val = NULL;

        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_client_ltp,
                parentval,
                &_clientLtpRefList_val,
                client_ltp_leaf_list[i],
                y_core_model_M_core_model,
                false);
        YUMA_ASSERT(NULL == _clientLtpRefList_val, key_free(client_ltp_leaf_list, num_of_entries); return ERR_INTERNAL_VAL ,
                    "create_and_init_child_element failed for element=%s", y_core_model_N_client_ltp);
    }
    key_free(client_ltp_leaf_list, num_of_entries);

    return NO_ERR;
}

static status_t attach_lp_list_elements(xmlChar** nested_key, int num_of_nested_key, val_value_t *parentval, xmlChar* lpUuid)
{
    status_t res = NO_ERR;

    /*
     * Creating lp list entry
     */
    val_value_t  *lp_list_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_lp,
            parentval,
            &lp_list_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == lp_list_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_lp);

    nested_key[num_of_nested_key++] = lpUuid;

    /* local-class: it contains the key hence it must be create before of all other objects */
    res = attach_class_elements(nested_key, num_of_nested_key, lp_list_val, lpUuid, (const xmlChar*)"lp");
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_class_elements failed");

    /*
     * Creating layer-protocol-name leaf
     */
    val_value_t  *layer_protocol_name_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_layer_protocol_name,
            lp_list_val,
            &layer_protocol_name_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == layer_protocol_name_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_layer_protocol_name);

    /*
     * Creating configured-client-capacity leaf
     */
    val_value_t  *configured_client_capacity_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_configured_client_capacity,
            lp_list_val,
            &configured_client_capacity_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == configured_client_capacity_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_configured_client_capacity);

    /*
     * Creating lp-direction leaf
     */
    val_value_t  *lp_direction_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_lp_direction,
            lp_list_val,
            &lp_direction_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == lp_direction_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_lp_direction);

    /*
     * Creating termination-state leaf
     */
    val_value_t  *termination_state_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_termination_state,
            lp_list_val,
            &termination_state_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == termination_state_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_termination_state);

    /*
     * Creating config-and-switch-controller leaf
     */

    /* FIXME: it is a structured type!!! */
#if 0
    val_value_t  *config_and_switch_controller_val = NULL;

    res = create_and_init_child_element(y_core_model_N_config_and_switch_controller,
            lp_list_val,
            &config_and_switch_controller_val,
            NULL,
            core_model_network_element_ltp_lp_termination_state_get);
    YUMA_ASSERT(NULL == config_and_switch_controller_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_config_and_switch_controller);
#endif

    /*
     * Creating is-protection-lock-out leaf
      */

    val_value_t  *is_protection_lock_out_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_is_protection_lock_out,
            lp_list_val,
            &is_protection_lock_out_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == termination_state_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_termination_state);
    YUMA_ASSERT(NULL == is_protection_lock_out_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_is_protection_lock_out);

    /*
     * Creating fc-blocks-signal-to-lp leaf
     */
    val_value_t  *fc_blocks_signal_to_lp = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_fc_blocks_signal_to_lp,
            lp_list_val,
            &fc_blocks_signal_to_lp,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == fc_blocks_signal_to_lp, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_fc_blocks_signal_to_lp);

    return NO_ERR;
}

static status_t attach_ltp_physical_port_reference_list_elements(xmlChar** nested_key, int num_of_nested_key, val_value_t *parentval)
{
    status_t res = NO_ERR;

    xmlChar* physical_port_reference_leaf_list[MAX_NUMBER_OF_SERVER_CLIENT_REF_ENTRIES];
    int num_of_entries;

    val_value_t *lastkey = NULL;
    xmlChar *key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

    res = key_get_all_physical_port_reference(nested_key, num_of_nested_key, key, physical_port_reference_leaf_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_all_ltp_ref_leaf_list_elements_for_ltp failed!");

    for (int i=0; i<num_of_entries; ++i)
    {
        /*
         * Creating _ltpRefList leaf-list
         */
        val_value_t  *physical_port_reference_val = NULL;

        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_physical_port_reference,
                parentval,
                &physical_port_reference_val,
                physical_port_reference_leaf_list[i],
                y_core_model_M_core_model,
                false);
        YUMA_ASSERT(NULL == physical_port_reference_val, key_free(physical_port_reference_leaf_list, num_of_entries); return ERR_INTERNAL_VAL ,
                    "create_and_init_child_element failed for element=%s", y_core_model_N_physical_port_reference);
    }
    key_free(physical_port_reference_leaf_list, num_of_entries);
    return NO_ERR;
}

static status_t attach_ltp_in_other_view_list_elements(xmlChar** nested_key, int num_of_nested_key, val_value_t *parentval)
{
    status_t res = NO_ERR;

    xmlChar* ltp_ref_leaf_list[MAX_NUMBER_OF_SERVER_CLIENT_REF_ENTRIES];
    int num_of_entries;

    val_value_t *lastkey = NULL;
    xmlChar *k_ltpRefList_uuid_key = VAL_STRING(agt_get_key_value(parentval, &lastkey));

    res = key_get_all_ltp_in_other_view(nested_key, num_of_nested_key, k_ltpRefList_uuid_key, ltp_ref_leaf_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_all_ltp_ref_leaf_list_elements_for_ltp failed!");

    for (int i=0; i<num_of_entries; ++i)
    {
        /*
         * Creating _ltpRefList leaf-list
         */
        val_value_t  *ltp_in_other_view_val = NULL;

        res = create_and_init_child_element(y_core_model_M_core_model,
                y_core_model_N_ltp_in_other_view,
                parentval,
                &ltp_in_other_view_val,
                ltp_ref_leaf_list[i],
                y_core_model_M_core_model,
                false);
        YUMA_ASSERT(NULL == ltp_in_other_view_val, key_free(ltp_ref_leaf_list, num_of_entries); return ERR_INTERNAL_VAL ,
                    "create_and_init_child_element failed for element=%s", y_core_model_N_ltp_in_other_view);
    }
    key_free(ltp_ref_leaf_list, num_of_entries);
    return NO_ERR;
}

static status_t attach_ltp_list_elements(xmlChar** nested_key, int num_of_nested_key, val_value_t *parentval, xmlChar* ltpUuid)
{
    status_t res = NO_ERR;

    /*
     * Creating ltpRefList list entry
     */
    val_value_t  *ltp_list_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_ltp,
            parentval,
            &ltp_list_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == ltp_list_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_ltp);

    nested_key[num_of_nested_key++] = ltpUuid;
    /* global-class: it contains the key hence it must be create before of all other objects */
    res = attach_class_elements(nested_key, num_of_nested_key, ltp_list_val, ltpUuid, (const xmlChar*)"ltp");
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_class_elements failed");

    /*
     * Creating server-ltp and client-ltp lists
     */
    res = attach_server_and_client_list_elements(nested_key, num_of_nested_key, ltp_list_val);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_server_and_client_list_elements failed");

    /*
     * Creating Lp list
     */
     xmlChar* lp_ref_uuid_list[MAX_NUMBER_OF_LTP_REF_ENTRIES];
     int num_of_entries;

     res = key_get_lp_list_by_ltp(nested_key, num_of_nested_key, ltpUuid, lp_ref_uuid_list, &num_of_entries);
     YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_lp_list_by_ltp failed!");

     for (int i=0; i<num_of_entries; ++i)
     {
         res = attach_lp_list_elements(nested_key, num_of_nested_key, ltp_list_val, lp_ref_uuid_list[i]);
         YUMA_ASSERT(res != NO_ERR, key_free(lp_ref_uuid_list, num_of_entries); return ERR_INTERNAL_VAL ,
                     "attach_lp_list_elements failed ");
     }
     key_free(lp_ref_uuid_list, num_of_entries);


#ifdef EMPTY_CONNECTED_LTP_DOES_NOT_RESULT_IN_A_VALIDATE_ERROR
    /*
     * Creating connected-Ltp leaf
     */
    val_value_t  *connected_ltp_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_connected_ltp,
            ltp_list_val,
            &connected_ltp_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == connected_ltp_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_connected_ltp);
#endif

#ifdef EMPTY_PEER_LTP_DOES_NOT_RESULT_IN_A_VALIDATE_ERROR
    /*
     * Creating peer-ltp leaf
     */
    val_value_t  *peer_ltp_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_peer_ltp,
            ltp_list_val,
            &peer_ltp_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == peer_ltp_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_peer_ltp);
#endif

    /*
     * Creating physical-port-reference leaf-list
     */
    res = attach_ltp_physical_port_reference_list_elements(nested_key, num_of_nested_key, ltp_list_val);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_ltp_physical_port_reference_list_elements failed");

    /*
     * Creating ltp-in-other-view leaf-list
     */
    res = attach_ltp_in_other_view_list_elements(nested_key, num_of_nested_key, ltp_list_val);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL , "attach_ltp_in_other_view_list_elements failed");

    /*
     * Creating ltp-direction leaf
     */
    val_value_t  *ltp_direction_val = NULL;

    res = create_and_init_child_element(y_core_model_M_core_model,
            y_core_model_N_ltp_direction,
            ltp_list_val,
            &ltp_direction_val,
            NULL,
            y_core_model_M_core_model,
            false);
    YUMA_ASSERT(NULL == ltp_direction_val, return ERR_INTERNAL_VAL ,
                "create_and_init_child_element failed for element=%s", y_core_model_N_ltp_direction);

    return NO_ERR;
}

static status_t build_network_element_tree_and_attach_to_running_cfg(cfg_template_t *runningcfg)
{
    status_t res = NO_ERR;

    xmlChar* nested_key[10];
    int num_of_nested_key;

    memset (nested_key, 0 , sizeof(nested_key));
    num_of_nested_key = 0;

    /*
     * Creating the root element for the module: core-model
     */
    val_value_t *network_element_val = NULL;

    res = create_root_element_for_module(y_core_model_M_core_model,
            y_core_model_R_core_model,
            y_core_model_N_network_element,
            &network_element_val);
    YUMA_ASSERT(NULL == network_element_val, return ERR_INTERNAL_VAL ,
            "create_root_element_for_module failed for element=%s", y_core_model_N_network_element);

    val_add_child(network_element_val, runningcfg->root);

    /* uuid */
    xmlChar* ne_list[MAX_NUMBER_OF_NETWORK_ELEMENT_ENTRIES];
    int num_of_neentries;

    /* global class: it contains the key hence it must be create before of all other objects */

    res = key_get_all_network_elements(ne_list, &num_of_neentries);
    YUMA_ASSERT(res != NO_ERR, key_free(ne_list, num_of_neentries); return ERR_INTERNAL_VAL, "key_get_all_network_elements failed!");
    YUMA_ASSERT(num_of_neentries > 1, key_free(ne_list, num_of_neentries); return ERR_INTERNAL_VAL, "key_get_all_network_elements returned more than 1 element!");

    res = attach_class_elements(nested_key, num_of_nested_key, network_element_val, ne_list[0], (const xmlChar*)"ne");
    YUMA_ASSERT(res != NO_ERR, key_free(ne_list, num_of_neentries); return ERR_INTERNAL_VAL , "attach_class_elements failed ");

    key_free(ne_list, num_of_neentries);

    /* fd list */
    /* TODO */

    /* ltp list */
    xmlChar* ltp_uuid_list[MAX_NUMBER_OF_LTP_REF_ENTRIES];
    int num_of_entries;

    res = key_get_all_ltps(ltp_uuid_list, &num_of_entries);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "key_get_all_air_interface_pac_ltp failed!");

    for (int i=0; i<num_of_entries; ++i)
    {
        res = attach_ltp_list_elements(nested_key, num_of_nested_key, network_element_val, ltp_uuid_list[i]);
        YUMA_ASSERT(res != NO_ERR, key_free(ltp_uuid_list, num_of_entries); return ERR_INTERNAL_VAL , "attach_ltp_list_elements failed ");
    }

    key_free(ltp_uuid_list, num_of_entries);
    return NO_ERR;
}

status_t build_network_element_attributes_tree(void)
{
    status_t res = NO_ERR;

    /*
     * Creating the running datastore
     */
    cfg_template_t* runningcfg;
    runningcfg = cfg_get_config_id(NCX_CFGID_RUNNING);
    YUMA_ASSERT(!runningcfg || !runningcfg->root, return ERR_INTERNAL_VAL, "No running config available!");

    /*
     * Creating the mw_air_interface_pac list and attach it to the running config
     */
    res = build_network_element_tree_and_attach_to_running_cfg(runningcfg);
    YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not build the tree for the running config");

    return NO_ERR;
}

/* END core_model.c */
