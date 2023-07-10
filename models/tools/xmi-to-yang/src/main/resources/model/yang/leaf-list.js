/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\yang\leaf-list.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/
var Type = require('./type.js');
var Util = require('./util.js');

function leaf_list(name, id, config,value,descrip, maxele, minele, type, isOrdered, feature, status, fileName, store) {
    this.name = Util.yangifyName(name);
    this.id = id;
    this.config = config;
    this.defaultValue = value;
    this.description = descrip;
    this.status = status;
    this["ordered-by"] = isOrdered;
    this["max-elements"] = maxele;
    this["min-elements"] = minele;
    this["if-feature"] = feature;
    this.type = type;
    this.units = this.type.units;
    this.fileName=fileName;
    this.store=store;
}


leaf_list.prototype.writeNode = function (layer) {
    var PRE = '';
    var k = layer;
    while (k-- > 0) {
        PRE += '\t';
    }

    //compare defaultValue with the literalID
    var defvalue = "";
    
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
    }else {
        defvalue = this.defaultValue ? PRE + "\tdefault \"" + this.defaultValue + "\";\r\n" : "";
    }

    

    var name = "leaf-list " + this.name;
    var config = this.config === false ? PRE + "\tconfig false;\r\n" : "";
    var descript;
    if(!this.description){
        this.description = "none";
    }
    if (typeof this.description == 'string') {
        
        this.description = this.description.replace(/\r+\n\s*/g, '\r\n' + PRE + '\t\t');
        this.description = this.description.replace(/\"/g, "\'");


    }
    descript = this.description ? PRE + "\tdescription \t\n\t\t\t\t \"" + this.description + "\";\r\n" : "";
    
    
    var feature = "";
    if(this["if-feature"]){
        feature = PRE + "\tif-feature " + this["if-feature"] + ";\r\n";
    }
    var status = this.status ? PRE + "\tstatus " + this.status + ";\r\n" : "";
    var order = "";
    /*if(this["ordered-by"]){
        if(this["ordered-by"] == true){
            order = PRE + "\tordered-by user" + ";\r\n";
        }else{
            order = PRE + "\tordered-by system" + ";\r\n";
        }
    }*/
    if(this["ordered-by"] === true && this.nodeType === "list"){
        order = PRE + "\tordered-by user" + ";\r\n";
    }
    
    var maxele = this["max-elements"] ? PRE + "\tmax-elements " + this["max-elements"] + ";\r\n" : "";
    var minele = this["min-elements"] ? PRE + "\tmin-elements " + this["min-elements"] + ";\r\n" : "";
    if (this["max-elements"] == "*") {
        maxele = "";
    }
    var type = this.type ? this.type : "string";
    
    
    if (this.type instanceof Type) {
        type = this.type.writeNode(layer + 1);
        
    } else if (typeof this.type == "string"){
        if (type.split("+")[0] == "leafref") {
            type = PRE + "\ttype leafref {\r\n " + PRE + "\t\t" + Util.yangifyName(type.split("+")[1]) + ";\r\n" + PRE + "\t}\r\n";
        }
        else if(!this.type){
            type="";
        }
        else {
            type = PRE + '\ttype ' + Util.typeifyName(type) + ';\r\n';
        }
    }
    var units;
    if(this.units && this.units !== ""){
        units = PRE + "\tunits \"" + this.units + "\";\r\n";
    }else{
        units = "";
    }
     // if the type contains leafref and config is not false. then construct the must attribute. - by Waseem
   if(type.indexOf('leafref') > -1 && (config===null || config==='') ){
   
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
	    console.log("Prahtiba " + name);
	    if(name.includes("encompassed-clock") ||  name.includes("phase-aligned-clock")){
	     type = type.replace("/g:synch-ltp-spec/g:","/core-model:control-construct/core-model:logical-termination-point/synchronization:embedded-clock");   
	    }else if(name.includes("embedded-clock")){
		    console.log("prathiba inside logic" + type);
	     type = type.replace("/core-model:logical-termination-point/core-model:peer-ltp/core-model:embedded-clock/core-model:local-id,name","/core-model:control-construct/synchronization:clock-collection/synchronization:clock/synchronization:local-id");
	    }
	    else if(lastoccurancesubstring.indexOf("uuid")==-1 && lastoccurancesubstring.indexOf("serial-number")==-1){ 
                lastoccurancesubstring=lastoccurancesubstring.replace(/\:/, ' ');
                
                prestring = "["+lastoccurancesubstring.replace(/\";+\s+\}/g, ' ').trim()+"=current()]"; 
            
                subtype = String(subtype.replace(/\/[^\/]+$/g,prestring));
                subtype = subtype.replace("\"", '');
                

                //get path from the type attribute and use with "must" attribute
		//type += "\t\t\t\tmust  'deref(.) = current()';\r\n";
                type = type.replace("path","pathmust");
            }else if(lastoccurancesubstring.indexOf("uuid")==-1 && lastoccurancesubstring.indexOf("serial-number")==-1)
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
        minele +
        maxele +
        order +
        status +
        descript + PRE + "}\r\n";
        console.info("leaf-list.js defaultValue "+defvalue);
    return s;
};
module.exports = leaf_list;
