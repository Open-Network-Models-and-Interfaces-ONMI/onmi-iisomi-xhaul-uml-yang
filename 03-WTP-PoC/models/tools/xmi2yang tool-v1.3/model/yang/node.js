/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\yang\node.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/
var leaf = require('./leaf.js');
var leaf_list = require('./leaf-list.js');
var Type = require('./type.js');

function Node(name, descrip, type, maxEle, minEle, id, config,isOrdered,feature,status) {
    this.id = id;
    this.name = name;
    this.nodeType = type;
    this.key;
    // if (this.name.indexOf('MW_') !== -1) console.info('[sko]', 'Node', this.name, this.nodeType, this.key);
    if (descrip) this.description = descrip.toYangDescription();
    this.uses = [];
    this.status=status;
    this["max-elements"] = maxEle;
    this["min-elements"] = minEle;
    this.defaultValue;
    this["ordered-by"]=isOrdered;
    this["if-feature"]=feature;
    this.config = config;
    this.isAbstract=false;
    this.isGrouping=false;
    this.children = [];
}

Node.prototype.buildChild = function (att, type) {
    if(type=="leaf"||type=="leaf-list"){
        //translate the "integer" to "uint32"
       var t;
        if(typeof att.type=="object"){
            t=att.type.name;
        }else if(typeof type=="string"){
            t=att.type;
        }
        switch(t){
            case "integer":att.type="int64";
                break;
            default:break;
        }
    }
    var obj;
    //create a subnode by "type"
    // if (att.support) console.info('[sko]', att.support);
    switch (type) {
        case "leaf":
            // if (att.units) console.info('sko', att.name, att.units);
            obj = new leaf(att.name, att.id, att.config, att.defaultValue, att.description, att.type,att.support,att.status,att.units);
            break;
        case "enumeration":
            obj = new leaf(this.name, att.id, att.config, att.defaultValue, att.description, att,att.support,att.status);
            obj = att;
            break;
        case "leaf-list":
            obj = new leaf_list(att.name, att.id, att.config, att.description, att['max-elements'], att['min-elements'], att.type,att.isOrdered,att.support,att.status);
            break;
        case "list":
            obj = new Node(att.name, att.description, att.nodeType, att['max-elements'], att['min-elements'], att.id, att.config,att.isOrdered,att.support,att.status);
            if (att.isUses) {
                obj.buildUses(att);
                // [sko] if (att.config) {
                    if (att.key) {
                        obj.key = att.key;
                    } else {
                        //obj.key="localId";
                    }
                //}
            }
            obj.isGrouping=att.isGrouping;
            break;
        case "container":
            obj = new Node(att.name, att.description, att.nodeType, att['max-elements'], att['min-elements'], att.id, att.config,att.support,att.status);
            if (att.isUses) {
                obj.buildUses(att);
            }
            break;
        case "typedef":
//            obj = new Type(att.type, att.id, att.description);
            // console.info('[sko]', 'typedef', att.type, att.id);
            obj = new Type(att.type, att.id);

        default :
            break;
    }
    this.children.push(obj);
};
Node.prototype.buildUses = function (att) {
    this.uses = att.isUses;

};
//create yang element string
Node.prototype.writeNode = function (layer) {
    var PRE = '';
    var k = layer;
    while (k-- > 0) {
        PRE += '\t';
    }
    var status="";
    var descript = "";

    switch (this.status){
        case "Experimental":
        case "Preliminary":
        case "Example":
        case "LikelyToChange":
        case "Faulty":
            if((this.description===undefined)){
                this.description = "lifecycle:"+this.status;
            }
            else{
                this.description += "\r\n"+"lifecycle:"+this.status;
            }
            break;
        case "current":
        case "obsolete":
        case "deprecated":
            this.status ? status = PRE + "\tstatus " + this.status + ";\r\n" : status = "";
            break;
        default:
            break;
    }
    //if the nodetype of child node of list is list,then the nodetype of father node change to container
    if(this.nodeType=="list"){
        var temp;
        for(temp=0;temp<this.children.length;temp++){
            if(this.children[temp].nodeType=="list")
                break;
        }
        if(temp<this.children.length) {
            this.nodeType="container";
            // [sko] Sorry, I do not agree ;)
            var flag = this.nodeType;
            var checkByName = this.name;
            var forceList = ['MW_AirInterface_Pac', 'MW_AirInterfaceDiversity_Pac', 
                             'MW_Structure_Pac', 'MW_PureEthernetStructure_Pac', 'MW_HybridMwStructure_Pac', 
                             'MW_Container_Pac', 'MW_EthernetContainer_Pac', 'MW_TdmContainer_Pac'];
            forceList.map(function(item){
              if (checkByName === item) {
                flag="list";
              }
            });
            this.nodeType = flag;
            // console.info('[sko]', 'container', this.name, this.nodeType );
        }
    }
    
    var name = this.nodeType + " " + this.name;

    if (typeof this.description == 'string') {
        this.description = this.description.replace(/\r+\n\s*/g, '\r\n' + PRE + '\t\t');
    }
    this.description ? descript = PRE + "\tdescription \"" + this.description + "\";\r\n" : descript = "";
    var order="";
    if(this["ordered-by"]!==undefined&&this.nodeType=="list"){
        if(this["ordered-by"]==true){
            order=PRE+"\tordered-by user"+";\r\n";
        }else{
            order=PRE+"\tordered-by system"+";\r\n";
        }
    }
    var maxele;
    var minele;
    var defvalue;
    var conf;
    var Key = "";
    this.defaultValue ? defvalue = PRE + "\tdefault " + this.defaultValue + ";\r\n" : defvalue = "";
    // [sko] hack: Why only if config is true? Aren't there cases where the parent node is true and the child is false?
    if (this.nodeType == "container" && this.config || this.nodeType == "list" && this.config) {
        conf = PRE + "\tconfig " + this.config + ";\r\n";
    } else {
        conf = "";
    }
    // [sko] hack start
    var checkName = this.name;
    var forceConfigFalse = ['airInterfaceCapability', 'airInterfaceStatus', 'airInterfaceCurrentProblems', 'airInterfaceCurrentPerformance', 'airInterfaceHistoricalPerformances',
                            'airInterfaceDiversityCapability', 'airInterfaceDiversityStatus', 'airInterfaceDiversityCurrentProblems', 'airInterfaceDiversityCurrentPerformance', 'airInterfaceDiversityHistoricalPerformances',

                            'structureCapability', 'structureStatus', 'structureCurrentProblems', 'structureCurrentPerformance', 'structureHistoricalPerformanceList',
                            'pureEthernetStructureCapability', 'pureEthernetStructureStatus', 'pureEthernetStructureCurrentProblems', 'pureEthernetStructureCurrentPerformance', 'pureEthernetStructureHistoricalPerformances',
                            'hybridMwStructureCapability', 'hybridMwStructureStatus', 'hybridMwStructureCurrentProblems', 'hybridMwStructureCurrentPerformance', 'hybridMwStructureHistoricalPerformances',
                            
                            'containerCapability', 'containerStatus', 'containerCurrentProblems', 'containerCurrentPerformance', 'containerHistoricalPerformances',
                            'ethernetContainerCapability', 'ethernetContainerStatus', 'ethernetContainerCurrentProblems', 'ethernetContainerCurrentPerformance', 'ethernetContainerHistoricalPerformances',
                            'tdmContainerCapability', 'tdmContainerStatus', 'tdmContainerCurrentProblems', 'tdmContainerCurrentPerformance', 'tdmContainerHistoricalPerformances',
                            
                            'problemSeverityList'];
    forceConfigFalse.map(function(item){
      if (checkName === item) {
        conf = PRE + "\tconfig false;\r\n";
      }
    });
    // if (this.name.indexOf('MW_') !== -1) console.info('[sko]', 'Node', this.name, this.nodeType, this.key);
    // [sko] hack end
    
    if (this.nodeType == "list") {
        this["max-elements"] ? maxele = PRE + "\tmax-elements " + this["max-elements"] + ";\r\n" : maxele = "";
        this["min-elements"] ? minele = PRE + "\tmin-elements " + this["min-elements"] + ";\r\n" : minele = "";
        if (this["max-elements"] == "*") {
            maxele = "";
        }
        // [sko] TODO hack, situation needs to be analysed... ;(
        // console.log('###', this.name);
        if (this.name === 'Q_822_CurrentData') {
          this.key = 'scannerId';
        // } else if (this.name === 'timeSlotIDList') {
        //  this.key = 'structureId timeSlotId';
        // } else if (this.name === 'segmentsIDList') {
        //   this.key = 'structureIdRef segmentIdRef';
        } else if (this.name === 'historicalPerformanceDataList') {
          this.key = 'historyDataId'
        }
        if (typeof this.key=="string") {
            Key = PRE + "\tkey '" + this.key + "';\r\n";
        }
        //else{
        //    Key = PRE + "\tkey '" + "undefined';\r\n";
        //}
    } else {
        maxele = "";
        minele = "";
    }
    var uses = "";
    if (this.uses instanceof Array) {
        for (var i = 0; i < this.uses.length; i++) {
            if(typeof this.uses[i]=="object"){
                this.uses[i].writeNode(layer+1);
            }else{
                uses += PRE + "\tuses " + this.uses[i] + ";\r\n";
            }
        }
    } else if (typeof this.uses == "string") {
        uses = PRE + "\tuses " + this.uses + ";\r\n";
    }else if(typeof this.uses[i]=="object"){
        this.uses[i].writeNode(layer+1);
    }
    var feature="";
    if(this["if-feature"]&&this.nodeType!=="grouping"){
        // console.info('[sko]', this);
        feature = PRE + "\tif-feature " + this["if-feature"] + ";\r\n";
    }
    var child = "";
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            child += this.children[i].writeNode(layer + 1);
        }
    }
    
    // [sko] hack - top-level objects must not be mandatory
    var presence = '';
    if (name === 'container NetworkElement'){
      presence = PRE + PRE + 'presence "Enables ONF CoreModel support";\r\n';
    }
    var s = PRE + name + " {\r\n" +
        presence +
        descript +
        Key +
        status+
        conf +
        order+
        uses +
        feature+
        child +
        maxele +
        minele +
        defvalue + PRE + "}\r\n";
    return s;
};

module.exports = Node;
