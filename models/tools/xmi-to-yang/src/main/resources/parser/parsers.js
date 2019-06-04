/*******************************************************************************
 * Copyright 2019 Open Networking Foundation (ONF). All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _            = require('lodash'),
    transformers = require('./transformers');


var Util      = require('../model/yang/util');

var models = {
    Clazz           : require('../model/ObjectClass.js'),
    OpenModelObject : require('../model/OpenModelObject.js'),
    Association     : require('../model/Association.js'),
    Specify         : require('../model/specify.js'),
    RootElement     : require('../model/RootElement.js')
};

var yangModels = {
    Module      : require('../model/yang/module.js'),
    Package     : require('../model/yang/package.js'),
    Node        : require('../model/yang/node.js'),
    Abstraction : require('../model/yang/abstraction.js'),
    Feature     : require('../model/yang/feature.js'),
    RPC         : require('../model/yang/rpc.js'),
    Uses        : require('../model/yang/uses.js'),
    Type        : require('../model/yang/type.js'),
    Augment     : require('../model/yang/augment.js')
};

var config = {};
function setConfig(cfg){
    config = cfg;
}

var currentFilename = "";
function setCurrentFilename(filename){
    currentFilename = filename;
}

var parsers = {
    parseOpenModelatt:function(xmi,store){
        var props = {
            flag:0,
            id:undefined,
            condition:undefined,
            support:undefined,
            valueRange:undefined,
            units:undefined,
            key:undefined,
            isInvariant:false,
            attributeValueChangeNotification:undefined,
            passBR:xmi.psBR,
            unsigned:undefined,
            writeAllowed:undefined,
            bitLength:undefined,
            encoding: undefined
        };

        if(props.passBR){
            props.flag = 1;
        }

        ["base_StructuralFeature","base_Parameter","base_Property"]
        .forEach(function(attr){
            if(xmi.attributes()[attr]){
                props.id = xmi.attributes()[attr];
                return false;
            }
        });

        if(!props.id){
            return;
        }

        if(xmi.attributes()["condition"] && xmi.attributes()["condition"] != "none"){
            props.condition = xmi.attributes()["condition"].replace(/[ =]/g, '-').replace(/\./g, '').toLowerCase();
            if(xmi.attributes()["support"]){
                props.support = xmi.attributes()["support"];
            }
            props.flag = 1;
        }

        if(xmi.attributes()["valueRange"] && xmi.attributes()["valueRange"] !== "null" && xmi.attributes()["valueRange"] !== "NA" && xmi.attributes()["valueRange"] !== "See data type" && xmi.attributes()["valueRange"] !== "See data type."){
            props.valueRange = xmi.attributes()["valueRange"];
            props.flag = 1;
        }

        if(xmi.attributes()["unit"]){
            props.units = xmi.attributes()["unit"];
            props.flag = 1;
        }

        if(xmi.attributes()["unsigned"]){
            props.unsigned = xmi.attributes()["unsigned"] === "true" || xmi.attributes()["unsigned"] === true;
            props.flag = 1;
        }

        if(xmi.attributes()["partOfObjectKey"] && xmi.attributes()["partOfObjectKey"] != "0"){
            props.key = xmi.attributes()["partOfObjectKey"];
            props.flag = 1;
        }

        ["key", "isInvariant", "attributeValueChangeNotification", "writeAllowed", "bitLength", "encoding" ]
        .forEach(function(field) {
            if(xmi.attributes()[field]){
                props[field] = xmi.attributes()[field];
                props.flag = 1;
            }
        });

        if(props.flag){
            transformers.transOpenModelAtt(store.openModelAtt, props, store);
        }
        return true;
    },
    parseOpenModelclass:function(xmi,store){
        var props = {
            flag:0,
            id:undefined,
            condition:undefined,
            support:undefined,
            operationExceptions:undefined,
            isOperationIdempotent:undefined,
            isAtomic:undefined,
            objectCreationNotification:undefined,
            objectDeletionNotification:undefined
        };

        if(xmi.attributes().base_Class) {
            props.id = xmi.attributes().base_Class;
        } else if(xmi.attributes().base_Operation) {
            props.id = xmi.attributes().base_Operation;
        } else {
            return;
        }

        if(xmi.attributes()["operation exceptions"]){
            props.operationExceptions = true;
            props.flag = 1;
        }
        if(xmi.attributes()["isOperationIdempotent"]){
            props.isOperationIdempotent = true;
            props.flag = 1;
        }
        if(xmi.attributes()["isAtomic"]){
            props.isAtomic = true;
            props.flag = 1;
        }

        if(xmi.attributes()["condition"] && xmi.attributes()["condition"] !== "none"){
            props.condition = xmi.attributes()["condition"].replace(/[ =]/g, '-').replace(/\./g, '').toLowerCase();;
            if(xmi.attributes()["support"]){
                props.support = xmi.attributes()["support"];
            }
            props.flag = 1;
        }
        if(xmi.attributes()["objectCreationNotification"]){
            props.objectCreationNotification = xmi.attributes()["objectCreationNotification"];
            props.flag = 1;
        }

        if(xmi.attributes()["objectDeletionNotification"]){
            props.objectDeletionNotification = xmi.attributes()["objectDeletionNotification"];
            props.flag = 1;
        }
        if(props.flag){
            transformers.transOpenModelClass(xmi,props, store);
        }
        return true;
    },
    parseOpenModelnotification:function(xmi,store){
        var id;
        if(xmi.attributes()["base_Signal"]){
            id = xmi.attributes()["base_Signal"];
        }
        store.openModelnotification.push(id);
    },
    /**
     * parseOpenModelStatement:
     * A function to merge from uml (OpenModelStatement) and config 
     * the model header information and adding them to the "store".
     * Please note that config will overwrite OpenModelStatement.
     * 
     * @param {*} modelHeaderInformation: 
     *            An xml element converted into json by xmlReader 
     *            containing the OpenModelStatement which defines
     *            header infromation of the model .
     * @param {*} config: 
     *            An object with the current configuration.
     * @param {*} store: In memory object with pre-converted xmi information.
     */
    parseOpenModelStatement:function(modelHeaderInformation, config, store){
        
        // create store for current file
        store.openModelStatement[currentFilename] = {};

        // Helpers
        var openModelStatementChildrenParser = {
            /**
             * Converting the uml open model statement contact in a string list
             * @param {*} jsonObject as given from UML 
             * @returns An json object representing a yang revision
             */
            contact: function(jsonObject) {
                return [
                        "WG Web : " + jsonObject.projectWeb,
                        "WG List: " + jsonObject.projectEmail,
                        "Editor : " + jsonObject.editorName,
                        "         " + jsonObject.editorEmail,
                ];
            },
            /**
             * Converting the uml open model statement revsion in a yang revision
             * @param {*} jsonObject as given from UML 
             * @returns An json object representing a yang revision
             */
            revision: function(jsonObject) {
                var PRE = "\t\t\t"; // [sko] Formating must not happen here, but ...
                return {
                    date: jsonObject.date,
                    description: ["",
                        PRE + jsonObject.description,
                        PRE + ["Please view", jsonObject.changeLog, "for changes."].join(" "),
                        PRE + ["Additional information:", jsonObject.additionalChanges].join(" ")
                    ].join("\n"),
                    reference: jsonObject.reference
                }
            }
        }
        // add all values from UML OpenModelStatement
        Object.keys(modelHeaderInformation.attributes()).forEach(function(key) {
            store.openModelStatement[currentFilename][key] = modelHeaderInformation.attributes()[key];
        });

        var excludeXmlReaderKeys = ['attributes', 'parent', 'count', 'at', 'each', 'text'];
        Object.keys(modelHeaderInformation).filter(function(key){
            return excludeXmlReaderKeys.indexOf(key) === -1;
        }).forEach(function(key){
            var array = [];
            modelHeaderInformation[key].each(function (index, item){
                if (openModelStatementChildrenParser[key]) {
                    array.push(openModelStatementChildrenParser[key](item.attributes()));
                } else {
                    console.warn("[WARN]", "Implement a parser for", key);
                }
            });
            store.openModelStatement[currentFilename][key] = array;
            if (key === "contact") {
                store.openModelStatement[currentFilename][key] = array[0];
            }
        });

        // merge configuration into it
        Object.keys(config).forEach(function(key) {
            if (store.openModelStatement[currentFilename][key] !== undefined) {
                console.warn("[WARN]", key, "will be overwritten by tool configuration");
                console.warn("[WARN-info]", "Previous value", JSON.stringify(store.openModelStatement[key]));
                console.warn("[WARN-info]", "     New value", JSON.stringify(config[key]));
            }
            store.openModelStatement[currentFilename][key] = config[key];
        });
    },
    parseSpecify:function(xmi,store){
        var props = {
            id:undefined,
            target:undefined
        };

        if(xmi.attributes()["base_Abstraction"]){
            props.id = xmi.attributes()["base_Abstraction"];
        }

        if(xmi.attributes()["target"]){
            props.target = xmi.attributes()["target"];
        }else if(xmi["target"] && xmi["target"].text){ //添加判断条件xmi["target"].text
            props.target=xmi["target"].text();
        }
        var tempspec = new models.Specify(props.id,props.target,currentFilename);
        store.specify.push(tempspec);
    },
    parseComment:function(xmi,store){
        var comment = "";
        if(xmi['ownedComment'].array){
            for(var j = 0; j < xmi['ownedComment'].array.length; j++){
                if(xmi['ownedComment'].array[j].hasOwnProperty("body") && xmi['ownedComment'].array[j].body.hasOwnProperty("text")){
                    comment += xmi['ownedComment'].array[j].body.text() + "\r\n";
                }
            }
            comment = comment.replace(/\r\n$/g, "");
        }else if(xmi['ownedComment'].hasOwnProperty("body") && xmi['ownedComment'].body.hasOwnProperty("text")){
            comment = xmi['ownedComment'].body.text();
        }else{
            console.log("[Parser] The comment of xmi:id=\"" + xmi.attributes()["xmi:id"] + "\" is undefined!");
        }
        return comment;
    },
    parseRootElement:function(xmi,store){
        var props = {
            id:undefined,
            name:undefined,
            multiplicity:undefined,
            description:undefined
        };

        if(xmi.attributes()["base_Class"]){
            props.id = xmi.attributes()["base_Class"];
        }

        if(xmi.attributes()["name"]){
            props.name = xmi.attributes()["name"];
        }

        if(xmi.attributes()["multiplicity"]){
            props.multiplicity = xmi.attributes()["multiplicity"];
        }

        if(xmi.attributes()["description"]){
            props.description = xmi.attributes()["description"];
        }

        var tempRE = new models.RootElement(props.id,props.name,props.multiplicity,props.description,currentFilename);
        store.rootElement.push(tempRE);
    },
    parseStrictCom:function(xmi,store){
        var id;
        if(xmi.attributes()["base_Association"]){
            id = xmi.attributes()["base_Association"];
        }
        store.strictComposite.push(id);
    },
    parseExtendedCom:function(xmi,store){
        var id;
        if(xmi.attributes()["base_Association"]){
            id = xmi.attributes()["base_Association"];
        }
        store.extendedComposite.push(id);
    },
    parsePackage:function(xmi, filename,store){
        var props = {
            len:undefined,
            newxmi:undefined,
            mainmod:undefined,
            id:xmi.attributes()["xmi:id"],
            comment:''
        };

        if(xmi.attributes()["xmi:type"] == "uml:Package" || xmi.attributes()["xmi:type"] == "uml:Interface") {
            if(xmi.attributes().name) {
                props.mainmod = xmi.attributes().name;
                props.mainmod = props.mainmod.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9\d]+$/g, "");   //remove the special character in the end
                props.mainmod = props.mainmod.replace(/[^\w\.-]+/g, '_');                     //not "A-Za-z0-9"->"_"
            } else {
                console.error("ERROR:The attribute 'name' of tag 'xmi:id=" + xmi.attributes()["xmi:id"] + "' in " + filename + " is empty!");
            }

            if (xmi.ownedComment) {
                props.comment = parsers.parseComment(xmi,store);
            }

            var temp = new yangModels.Package(props.mainmod, props.id, store.modName.join("-"), props.comment, currentFilename);
            store.packages.push(temp);
            store.modName.push(props.mainmod);

            if(xmi.packagedElement){
                xmi.packagedElement.array ? props.len = xmi.packagedElement.array.length : props.len = 1;
            }

            for(var i = 0; i < props.len; i++){
                props.len == 1 ? props.newxmi = xmi.packagedElement : props.newxmi = xmi.packagedElement.array[i];
                parsers.parsePackage(props.newxmi,undefined,store);
            }
            store.modName.pop();

            if(xmi.attributes()["xmi:type"] == "uml:Interface"){
                if(xmi.ownedOperation){
                    xmi.ownedOperation.array ? props.len = xmi.ownedOperation.array.length : props.len = 1;
                    for(var i = 0; i < props.len; i++){
                        props.len == 1 ? props.newxmi = xmi.ownedOperation : props.newxmi = xmi.ownedOperation.array[i];
                        creators     = require('./creators');
                        creators.createClass(props.newxmi, "rpc",store);
                    }
                }
            }

        }else{
            creators     = require('./creators');
            creators.createElement(xmi,undefined,store);
        }

    },
    parseUmlModel:function(xmi, filename, store){
        var props = {
            mainmod:undefined,
            comment:"\n",
            namespace:"",
            prefix:"",
            pre:[],
            // pre0:"" [sko] commented, due to never used.
        };

        if(xmi.attributes().name){
            props.mainmod = xmi.attributes().name
        } else {
            console.error("ERROR:The attribute 'name' of tag 'xmi:id=" + xmi.attributes()["xmi:id"] + "' in " + filename + " is empty!");
        }

        props.mainmod = props.mainmod.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9\d]+$/g, "");   //remove the special character in the end
        props.mainmod = props.mainmod.replace(/[^\w\.-]+/g, '_');                              //not "A-Za-z0-9"->"_"
        store.modName.push(props.mainmod);
        console.info("[sko] parseUmlModel, modName", store.modName);
        if (xmi.ownedComment) {
            props.comment += parsers.parseComment(xmi, store);
        }
        props.comment = [props.comment, 
            store.openModelStatement[currentFilename].copyright, 
            store.openModelStatement[currentFilename].license
        ].join('\n\n');
        props.comment = props.comment.split("\n").join('\n\t\t');

        props.namespace = _.clone(config.namespace) + store.modName.join("-");

        props.pre = store.modName.join("-");
        // props.pre0 = Util.yangifyName(props.pre);

        // if (props.prefix === ""){ // [sko] Q: this is always the case - why if?
        //     // props.prefix = Util.yangifyName(props.pre); // [sko] dont get the logic behind
        // }
        props.prefix = Util.yangifyName(props.pre); // [sko] dont get the logic behind;
        if (store.openModelStatement[currentFilename].prefix && store.openModelStatement[currentFilename].prefix[props.mainmod] !== undefined) {
            props.prefix = store.openModelStatement[currentFilename].prefix[props.mainmod];
        } 

        var yangModule = new yangModels.Module(
            store.modName.join("-"), 
            props.namespace, 
            "", 
            props.prefix, 
            store.openModelStatement[currentFilename].organization, 
            [""].concat(store.openModelStatement[currentFilename].contact).join("\n\t\t"), 
            store.openModelStatement[currentFilename].revision, 
            props.comment, 
            currentFilename
        );
        console.info("[sko] #oms#prefix", props.mainmod, store.modName,  props.prefix, JSON.stringify(
            store.openModelStatement[currentFilename].prefix));
        store.modName.pop();

        var element = {
            newxmi:undefined,
            len:0,
            impLen:0,
            impObj:{},
            imp:undefined
        };

        if(xmi.packagedElement){
            xmi.packagedElement.array ? element.len = xmi.packagedElement.array.length : element.len = 1;
        }

        for(var i = 0; i < element.len; i++){
            element.len == 1 ? element.newxmi = xmi.packagedElement : element.newxmi = xmi.packagedElement.array[i];
            if(element.newxmi.attributes().name == "Imports"){
                element.newxmi.packageImport.array ? element.impLen = element.newxmi.packageImport.array.length : element.impLen = 1;
                for(var j = 0; j < element.impLen; j++){
                    element.impLen == 1 ? element.impObj = element.newxmi.packageImport : element.impObj = element.newxmi.packageImport.array[j];
                    element.imp = element.impObj.importedPackage.attributes().href.split('/').pop().split('.')[0];
                    yangModule.import.push(element.imp);
                }
            }
            parsers.parsePackage(element.newxmi,undefined,store);
        }
        store.yangModule.push(yangModule);
        store.modName.pop();
    },
    createLifecycle:function(xmi,str,store){
        creators = require('./creators');
        return creators.createLifecycle(xmi,str,store);
    }
};

module.exports = {
    parseOpenModelatt:parsers.parseOpenModelatt,
    parseOpenModelclass:parsers.parseOpenModelclass,
    parseOpenModelnotification:parsers.parseOpenModelnotification,
    parseOpenModelStatement:parsers.parseOpenModelStatement,
    parseSpecify:parsers.parseSpecify,
    parseComment:parsers.parseComment,
    parseRootElement:parsers.parseRootElement,
    parseStrictCom:parsers.parseStrictCom,
    parseExtendedCom:parsers.parseExtendedCom,
    parsePackage:parsers.parsePackage,
    parseUmlModel:parsers.parseUmlModel,
    createLifecycle:parsers.createLifecycle,
    setConfig:setConfig,
    setCurrentFilename:setCurrentFilename
};
