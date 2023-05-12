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

function leaf(name, id, config, value, descrip, type, feature, status, fileName, store) {
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
    this.store=store;
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
    
    descript = this.description ? PRE + "\tdescription\t\n\t\t\t\t\t\"" + this.description + "\";\r\n" : "";

    var feature="";
    if(this["if-feature"]){
        feature = PRE + "\tif-feature " + this["if-feature"] + ";\r\n";
    }
    var status = this.status ? PRE + "\tstatus " + this.status + ";\r\n" : "";
    

    /*
    RFC7950:
    [...]
    7.3.4.  The typedef's "default" Statement
config false;
    The "default" statement takes as an argument a string that contains a
    default value for the new type.
    [...]
    >> even number are presented as string (e.g.: default "-1";)
    */
   
    var defvalue = "";
   
   //compare defaultValue with the literalID
   if(this.store){
    var regexunderscore = /^_/;
     
    if(regexunderscore.test(this.defaultValue)){
        var matchfound = false;

        for(j=0; j<this.store.literals.length;j++){
            
            valLiterals = this.store.literals[j];
            
            if(this.defaultValue==valLiterals.literalId.toString()){
                this.defaultValue = valLiterals.literalName;
                matchfound=true;
                break;
            }
        }
        if(!matchfound){
            if (typeof this.type == "string"){
                var localtype = this.type ? this.type : "string";
                localtype = Util.typeifyName(localtype);
                localtype=localtype.toString().replace(/-/g,"_");
                localtype=localtype.toUpperCase();
                this.defaultValue=localtype;
            }
        }
    }
}   

    if(typeof this.defaultValue == 'number'){
        defvalue = this.defaultValue ? PRE + "\tdefault " + this.defaultValue + ";\r\n" : "";
    }else{
        defvalue = this.defaultValue ? PRE + "\tdefault \"" + this.defaultValue + "\";\r\n" : "";
    }

    var mandatory = "";
    if(this.isMandatory){   
    if(!this.defaultValue)     
    mandatory = PRE + "\tmandatory true;\r\n";
    }
    
    var type = "";
    var simpletype="";
    if (this.type instanceof Type) {
        type = this.type.writeNode(layer + 1);
    } else if (typeof this.type == "string") {
        if (this.type.split("+")[0] == "leafref") {
            if(this.isRequireInstance){
                type = PRE + "\ttype leafref {\r\n" + PRE + "\t\t" + this.type.split("+")[1] + ";\r\n" + PRE + "\t}\r\n";
            }else{
                type = PRE + "\ttype leafref {\r\n require-instance false;\r\n" + PRE + "\t\t" + this.type.split("+")[1] + ";\r\n" + PRE + "\t}\r\n";
            }
        } else {
            type = PRE + "\ttype " + Util.typeifyName(this.type) + ";\r\n";
        }
    } else {
        type = PRE + "\ttype " + "string" + ";\r\n";
    }

    //need delete ldefvalue
    if(!this.type){
        type = "";
    }
    var units;
    if(this.units && this.units !== ""){
        units = PRE + "\tunits \"" + this.units + "\";\r\n";
    }else{
        units = "";
    }

   // if the type contains leafref and config is not false. then construct the must attribute. - by Waseem
   if(type.indexOf('leafref') > -1 && (config==null || config=='') ){
    
        var regx2 = /\".*\"/g;
        var subtype = "";
        var lastoccurance = "";
    
        subtype = String(type.match(regx2));
            
        if(subtype!=""){
            //get the last occurance of attribute in the string 
            var regxlastoccurance = /\/[^\/]+$/g;
            var prestring = "";
            //lastoccurance = type.match(regxlastoccurance);
            lastoccurance = String(type.match(regxlastoccurance)).substr();
            lastoccurance=lastoccurance.replace("require\-instance false;", "");
            var lastoccurancesubstring = lastoccurance.substr(lastoccurance.indexOf('\:'), lastoccurance.length );
            
            //if the string not containg uuid
            if(lastoccurancesubstring.indexOf("uuid")==-1 && lastoccurancesubstring.indexOf("local-id")==-1
	    && lastoccurancesubstring.indexOf("serial-number")==-1){ 
                lastoccurancesubstring=lastoccurancesubstring.replace(/\:/, ' ');
                prestring = "["+lastoccurancesubstring.replace(/\";+\s+\}/g, ' ').trim()+"=current()]"; 
            
                subtype = String(subtype.replace(/\/[^\/]+$/g,prestring));
                subtype = subtype.replace("\"", '');
                

                //get path from the type attribute and use with "must" attribute
		type += "\t\t\t\tmust  'deref(.) = current()';\r\n";
                type = type.replace("path","pathmust");
            }else if(lastoccurancesubstring.indexOf("uuid")==-1 && lastoccurancesubstring.indexOf("local-id")==-1)
        	{
		lastoccurancesubstring=lastoccurancesubstring.replace(/\:/, ' ');
                prestring = "["+lastoccurancesubstring.replace(/\";+\s+\}/g, ' ').trim()+"=current()]";

                subtype = String(subtype.replace(/\/[^\/]+$/g,prestring));
                subtype = subtype.replace("\"", '');


                //get path from the type attribute and use with "must" attribute
                type += "\t\t\t\tmust  'boolean\("+ subtype+ ")\';\r\n";
		}
        }
       
    }

    

    var s = PRE + name + " {\r\n" +
        feature +
        type +
        units +
        defvalue +
        config +
        mandatory +
        status +
        descript + PRE + "}\r\n";
        return s;
};
module.exports = leaf;
