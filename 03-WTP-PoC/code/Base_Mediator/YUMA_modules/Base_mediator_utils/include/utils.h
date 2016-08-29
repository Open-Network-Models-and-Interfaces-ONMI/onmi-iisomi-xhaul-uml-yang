/*
 * utils.h
 *
 *  Created on: Aug 12, 2016
 *      Author: compila
 */

#ifndef UTILS_H_
#define UTILS_H_

#include <stdio.h>
#include "status.h"
#include "val.h"
#include "obj.h"
#include "val_util.h"
#include "agt_util.h"
#include "procdefs.h"

#define NOP

#define YUMA_ASSERT(condition, action, fmt, ...) 	\
({													\
	if ((condition))								\
	{												\
		printf("\nWT_3.PoC: %s at %s line %d: "fmt, __FILE__,__FUNCTION__,__LINE__, ##__VA_ARGS__); \
		action;										\
	} 												\
})

#define LP_MWPS_PREFIX "LP-MWPS-TTP-"

#define MAX_NUMBER_OF_AIR_INTERFACE_PAC 50
#define MAX_NUMBER_OF_PROBLEM_KIND_SEVERITY_ENTRIES 1000
#define MAX_NUMBER_OF_CHANNEL_PLAN_TYPE_ID_ENTRIES 100
#define MAX_NUMBER_OF_TRANSMISSION_MODE_ID_ENTRIES 100
#define MAX_NUMBER_OF_AIR_INTERFACE_PAC_AIR_INTERFACE_CURRENT_PROBLEM_LIST_ENTRIES 1000
#define MAX_NUMBER_OF_AIR_INTERFACE_PAC_AIR_INTERFACE_HISTORICAL_PERFORMANCE_LIST_ENTRIES 1000
#define MAX_NUMBER_OF_CO_CHANNEL_GROUP_LIST_ENTRIES 50
#define MAX_NUMBER_OF_CO_CHANNEL_GROUP_AIR_INTERFACE_LIST_ENTRIES 50

status_t create_root_element_for_module(const char *module_name, const char *revision, const char *element_name, val_value_t** created_element_val);

status_t create_and_init_child_element(const char *modname, const char *objname, val_value_t *parent_val, val_value_t **child_val, const char *valuestr, bool isRuntime);

status_t create_and_init_child_object(obj_template_t *curr_obj,	val_value_t *parent_val, const char *valuestr, bool isRuntime);

status_t create_and_init_siblings(obj_template_t *curr_obj,	val_value_t *parent_val, bool isRuntime);

status_t init_element_with_value(obj_template_t *curr_obj,	val_value_t **curr_val, const char *valuestr, bool isRuntime);

#endif /* UTILS_H_ */
