/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\yang\leaf.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/
var Type = require('./type.js');
var Util = require('./util.js');

function leaf(name, id, config, value, descrip, type, feature, status, fileName) {
    this.name = Util.yangifyName(name);
    this.id = id;
    this.config = config;
    this.status = status;
    this.defaultValue = value;
    this.description = descrip;
    this["if-feature"] = feature;
    this.type = type;
    this.units = this.type.units;
    this.fileName = fileName;
}

leaf.prototype.writeNode = function (layer) {
    var PRE = '';
    var k = layer;
    while (k-- > 0) {
        PRE += '\t';
    }
    
    var name = "leaf " + this.name;
    var config = this.config === false ? PRE + "\tconfig false;\r\n" : "";

   

    var descript;
    if(!this.description){
        this.description = "none";
    }
    if (typeof this.description == 'string') {
        this.description = this.description.replace(/\r+\n\s*/g, '\r\n' + PRE + '\t\t');
        this.description = this.description.replace(/\"/g, "\'");
    }
    
    descript = this.description ? PRE + "\tdescription \"" + this.description + "\";\r\n" : "";

    var feature="";
    if(this["if-feature"]){
        feature = PRE + "\tif-feature " + this["if-feature"] + ";\r\n";
    }
    var status = this.status ? PRE + "\tstatus " + this.status + ";\r\n" : "";
    

    /*
    RFC7950:
    [...]
    7.3.4.  The typedef's "default" Statement
onfig false;
    The "default" statement takes as an argument a string that contains a
    default value for the new type.
    [...]
    >> even number are presented as string (e.g.: default "-1";)
    */
    var defvalue = "";
    defvalue = this.defaultValue ? PRE + "\tdefault \"" + this.defaultValue + "\";\r\n" : "";
    
    var type = "";
    

    if (this.type instanceof Type) {
        type = this.type.writeNode(layer + 1);
        
    } else if (typeof this.type == "string") {
        if (this.type.split("+")[0] == "leafref") {
            
            type = PRE + "\ttype leafref {\r\n require-instance false;\r\n" + PRE + "\t\t" + this.type.split("+")[1] + ";\r\n" + PRE + "\t}\r\n";
        } else {
            type = PRE + "\ttype " + Util.typeifyName(this.type) + ";\r\n";
        }
    } else {
        type = PRE + "\ttype " + "string" + ";\r\n";
    }
    //need delete later
    if(!this.type){
        type = "";
    }
    var units;
    if(this.units && this.units !== ""){
        units = PRE + "\tunits \"" + this.units + "\";\r\n";
    }else{
        units = "";
    }
    // if the type contains leafref and config is not falst. then construct the must attribute. - by Waseem
    if(type.indexOf('leafref') > -1 && (config==null || config=='') ){
        console.info("leaf.js - type "+type);
        var regx2 = /\'.*\'/g;
        var subtype = "";
        var lastoccurance = "";
        subtype = String(type.match(regx2));
        
        if(subtype!=""){
            //get the last occurance of attribute in the string 
            var regxlastoccurance = /\/[^\/]+$/g;
            var prestring = "";
            //lastoccurance = type.match(regxlastoccurance);
            lastoccurance = String(type.match(regxlastoccurance)).substr();
            var lastoccurancesubstring = lastoccurance.substr(lastoccurance.indexOf('\:'), lastoccurance.length );
            
            //if the string not containg uuid
            if(lastoccurancesubstring.indexOf('uuid')==-1){ 
                lastoccurancesubstring=lastoccurancesubstring.replace(/\:/, ' ');
                //console.info("leaf.js - "+lastoccurancesubstring);
                prestring = "["+lastoccurancesubstring.replace(/\';+\s+\}/g, ' ').trim()+"=current()]\'"; 
            
                subtype = String(subtype.replace(/\/[^\/]+$/g,prestring));
                
            
                //get path from the type attribute and use with "must" attribute
                type += "\r\n\t\t\tmust \r\n \t\t\t'boolean\("+ subtype+ ");\r\n";
            }
        }
       
    }
   
    var s = PRE + name + " {\r\n" +
        feature +
        type +
        units +
        defvalue +
        config +
        status +
        descript + PRE + "}\r\n";
        return s;
};
module.exports = leaf;
