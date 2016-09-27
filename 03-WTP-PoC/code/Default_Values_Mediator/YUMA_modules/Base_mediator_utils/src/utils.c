/*
 * utils.c
 *
 *  Created on: Aug 12, 2016
 *      Author: compila
 */

#include "utils.h"
#include "boot_time_callbacks.h"
#include "runtime_callbacks.h"

static status_t create_and_init_child_object(obj_template_t *curr_obj,	val_value_t *parent_val, const char *valuestr, const char* moduleName);
static status_t init_element_with_value(obj_template_t *curr_obj,	val_value_t **curr_val, const char *valuestr, const char* moduleName);

status_t create_root_element_for_module(const char *module_name, const char *revision,
		const char *element_name, val_value_t** created_element_val)
{
	ncx_module_t *module = NULL;

	module = ncx_find_module(module_name, revision);
	YUMA_ASSERT(NULL == module, return SET_ERROR(ERR_NCX_MOD_NOT_FOUND),
			"Could not find module having the name=%s and revision=%s", module_name, revision);

	obj_template_t* created_element_obj = NULL;

	created_element_obj = ncx_find_object(module, element_name);
	YUMA_ASSERT(NULL == created_element_obj, return SET_ERROR(ERR_NCX_UNKNOWN_OBJECT),
				"Could not find object having the name %s in the module %s", element_name, module->name);

	*created_element_val = val_new_value();
	YUMA_ASSERT(*created_element_val == NULL, return ERR_INTERNAL_VAL,
			"Could not create object %s!", element_name);

	val_init_from_template(*created_element_val, created_element_obj);

	return NO_ERR;
}

status_t create_and_init_child_element(const char *module_name, const char *element_name,
		val_value_t *parent_val, val_value_t **child_val, const char *valuestr, const char* moduleName)
{
	status_t 		res = NO_ERR;
	obj_template_t* child_obj;

	YUMA_ASSERT(child_val == NULL, return ERR_INTERNAL_VAL, "**child_val for %s is NULL!", element_name);

	child_obj = obj_find_child(parent_val->obj, module_name, element_name);
	YUMA_ASSERT(child_obj == NULL, return ERR_INTERNAL_VAL, "Could not find object %s!", element_name);

	*child_val = val_new_value();
	YUMA_ASSERT(*child_val == NULL, return ERR_INTERNAL_VAL, "Could not create object %s!", element_name);

	val_init_from_template(*child_val, child_obj);

	val_add_child(*child_val, parent_val);

	res = init_element_with_value(child_obj, child_val, valuestr, moduleName);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not assign value to element %s", element_name);

//	if (obj_is_key(child_obj))
//	{
//		res = val_gen_key_entry(*child_val);
//		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "val_gen_key_entry failed for %s!", element_name);
//	}

	return NO_ERR;
}

static status_t create_and_init_child_object(obj_template_t *curr_obj,	val_value_t *parent_val, const char *valuestr, const char* moduleName)
{
	YUMA_ASSERT(curr_obj->objtype == OBJ_TYP_LIST || curr_obj->objtype == OBJ_TYP_CONTAINER, return NO_ERR, "Nothing to do for list/container object");
	YUMA_ASSERT(curr_obj == NULL, return NO_ERR, "Nothing to do for NULL object");

	status_t res = NO_ERR;
	val_value_t *curr_val = val_new_value();
	YUMA_ASSERT(curr_val == NULL, return ERR_INTERNAL_VAL, "Could not create object!");

	val_init_from_template(curr_val, curr_obj);

	val_add_child(curr_val, parent_val);

	res = init_element_with_value(curr_obj, &curr_val, valuestr, moduleName);
	YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "Could not assign value to element %s", curr_val->name);

	return NO_ERR;
}

status_t create_and_init_siblings(obj_template_t *curr_obj,	val_value_t *parent_val, const char* moduleName)
{
	status_t res = NO_ERR;

	do
	{
		res = create_and_init_child_object(curr_obj, parent_val, NULL, moduleName);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL ,
					"create_and_init_child_object failed!");

		curr_obj = obj_next_child(curr_obj);
	}
	while (curr_obj != NULL);

	return NO_ERR;
}

static status_t init_element_with_value(obj_template_t *curr_obj,	val_value_t **curr_val, const char *valuestr, const char* moduleName)
{
	status_t res = NO_ERR;
	int need_free = TRUE;

	YUMA_ASSERT(*curr_val == NULL || curr_obj == NULL, return ERR_INTERNAL_VAL, "NULL pointer received!");

	if (valuestr != NULL)
	{
		res = val_set_simval_obj(*curr_val, curr_obj, valuestr);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "val_set_simval_obj %s failed!", (*curr_val)->name);
	}
	else
	{
		char* elementStringValue = cb_get_boot_time_element_value(*curr_val, moduleName);

		if (elementStringValue == NULL) //no callback implemented for this element, just use the default value
		{
			elementStringValue = obj_get_default(curr_obj);
			need_free = FALSE; //no need to free this value, it is not dynamically allocated
		}

		if (elementStringValue != NULL)
		{
			res = val_set_simval_obj(*curr_val, curr_obj, elementStringValue);
			YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "val_set_simval_obj %s failed!", (*curr_val)->name);

			if (need_free)
			{
			    free (elementStringValue); //need to free this value that was allocated in the specific callback implemented by the user
			}
		}
	}

	if (obj_is_key(curr_obj))
	{
		res = val_gen_key_entry(*curr_val);
		YUMA_ASSERT(res != NO_ERR, return ERR_INTERNAL_VAL, "val_gen_key_entry failed for %s!", (*curr_val)->name);
	}

	return NO_ERR;
}

status_t add_virtual_leaf(val_value_t *parentVal, const char *elementName, getcb_fn_t callbackFunction)
{
    status_t res = NO_ERR;
    val_value_t *child_val = NULL;

    child_val = agt_make_virtual_leaf(
            parentVal->obj,
            elementName,
            callbackFunction,
           &res);
   YUMA_ASSERT(NULL == child_val || res != NO_ERR, return ERR_INTERNAL_VAL ,
                   "agt_make_virtual_leaf failed for element=%s", elementName);
   val_add_child(child_val, parentVal);

   return NO_ERR;
}

/*
 * UTILS
 */
static xmlDocPtr get_xml_doc_ptr();

xmlDocPtr xmlDefaultValues = NULL;

static xmlDocPtr get_xml_doc_ptr()
{
	if (xmlDefaultValues != NULL)
	{
		return xmlDefaultValues;
	}

	const char *filename =  "/home/compila/app/CENTENNIAL/03-WTP-PoC/code/Default_Values_Mediator/YUMA_modules/Base_mediator_utils/src/DVM_MicrowaveModel-ObjectClasses-AirInterface.xml";

	xmlInitParser();

	xmlDefaultValues = xmlParseFile(filename);
	YUMA_ASSERT(xmlDefaultValues == NULL, return NULL, "Could not load XML file from path=%s", filename);

	YUMA_ASSERT(TRUE, NOP, "get_xml_doc_ptr was called successfully");
	return xmlDefaultValues;
}

char* get_value_from_xpath(const xmlChar* xPathExpression)
{
	xmlDocPtr doc = get_xml_doc_ptr();
	char* resultString = NULL;

	xmlXPathContextPtr xpathCtx;
	xmlXPathObjectPtr xpathObj;

	xpathCtx = xmlXPathNewContext(doc);
	YUMA_ASSERT(xpathCtx == NULL, return NULL, "xmlXPathNewContext failed!");

	xpathObj = xmlXPathEvalExpression(xPathExpression, xpathCtx);
	YUMA_ASSERT(xpathObj == NULL, return NULL, "xmlXPathEvalExpression failed!");

	YUMA_ASSERT(TRUE, NOP, "Getting value from path=%s", xPathExpression);

	int size = (xpathObj->nodesetval) ? xpathObj->nodesetval->nodeNr : 0;

	for (int i = 0; i<size; ++i)
	{
		resultString = strdup(xmlNodeGetContent(xpathObj->nodesetval->nodeTab[i]));
		YUMA_ASSERT(TRUE, NOP, "Got back xmlString=%s", xmlNodeGetContent(xpathObj->nodesetval->nodeTab[i]));
	}

    xmlXPathFreeObject(xpathObj);
    xmlXPathFreeContext(xpathCtx);

    return resultString;
}

status_t get_list_from_xpath(const xmlChar* xPathExpression, char **list_elements, int *num_of_elements)
{
	xmlDocPtr doc = get_xml_doc_ptr();

	xmlXPathContextPtr xpathCtx;
	xmlXPathObjectPtr xpathObj;

	xpathCtx = xmlXPathNewContext(doc);
	YUMA_ASSERT(xpathCtx == NULL, return ERR_INTERNAL_VAL, "xmlXPathNewContext failed!");

	xpathObj = xmlXPathEvalExpression(xPathExpression, xpathCtx);
	YUMA_ASSERT(xpathObj == NULL, return ERR_INTERNAL_VAL, "xmlXPathEvalExpression failed!");

	YUMA_ASSERT(TRUE, NOP, "Getting value from path=%s", xPathExpression);

	*num_of_elements = (xpathObj->nodesetval) ? xpathObj->nodesetval->nodeNr : 0;

	for (int i = 0; i<*num_of_elements; ++i)
	{
		list_elements[i] = strdup(xmlNodeGetContent(xpathObj->nodesetval->nodeTab[i]));
		YUMA_ASSERT(list_elements[i] == NULL, return ERR_INTERNAL_MEM, "Could not allocate memory!");

		YUMA_ASSERT(TRUE, NOP, "Got back xmlString=%s", xmlNodeGetContent(xpathObj->nodesetval->nodeTab[i]));
	}

    xmlXPathFreeObject(xpathObj);
    xmlXPathFreeContext(xpathCtx);

    return NO_ERR;
}

