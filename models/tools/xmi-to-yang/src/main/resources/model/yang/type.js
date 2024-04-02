/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\yang\type.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/

var Util = require('./util.js');

function type(name, id, path, range, length, descrip, fileName, unsigned, units) {
    this.name = name;
    this.id = id;
    this.description = descrip;
    this.path = path;
    this.range = range;
    this.length = length;
    this.children = [];
    this.units = units;
    this.fileName = fileName;
    this.unsigned = unsigned;
}
type.prototype.getTypeName = function() {
    if (this.name !== 'integer') {
        return this.name;
    }
    var result = 'int';
    if (this.length) {
      result = result + this.length;
    } else {
      result = result + '64';
    }
    if (this.unsigned === true) {
        result = 'u' + result;
    }
    return result;
};
type.prototype.writeNode = function (layer) {
    var PRE = '';
    var k = layer;
    while (k-- > 0) {
        PRE += '\t';
    }
    if(parseInt(this.name[0]) != -1 && parseInt(this.name[0]) >= 0){
        var first = this.name[0];
        switch (first){
            case '0' :
                this.name = this.name.replace(/^0/g, "Zero");
                break;
            case '1' :
                this.name = this.name.replace(/^1/g, "One");
                break;
            case '2' :
                this.name = this.name.replace(/^2/g, "Two");
                break;
            case '3' :
                this.name = this.name.replace(/^3/g, "Three");
                break;
            case '4' :
                this.name = this.name.replace(/^4/g, "Four");
                break;
            case '5' :
                this.name = this.name.replace(/^5/g, "Five");
                break;
            case '6' :
                this.name = this.name.replace(/^6/g, "Six");
                break;
            case '7' :
                this.name = this.name.replace(/^7/g, "Seven");
                break;
            case '8' :
                this.name = this.name.replace(/^8/g, "Eight");
                break;
            case '9' :
                this.name = this.name.replace(/^9/g, "Nine");
                break;
        }
    }

    var p = /int[0-9]/;
    var name = "type " + this.name;
    if (p.test(this.name)){
        name = "type " + this.name;
    } else if (this.name === "real" || this.name === "decimal64") {
        name = "type decimal64";
    } else {
        name = "type " + Util.typeifyName(this.name);
    }
        
   /* if (this.name !== "enumeration") {
        name += ";";
    }*/
    var s = "";
    if (this.name === "real" || this.name === "decimal64") {
        s = "{ fraction-digits 3; }";
    } else if (this.path || this.range || this.length || this.children.length){
        s = " {\r\n";
        var tmpmust="";
        if(this.path){
           tmpmust= this.path.split("path ");
            s += PRE + "\t";
            s += Util.yangifyName(this.path) + ";\r\n";
        }
        if(this.name == "leafref"){
            if(this.isRequireInstance == false || !this.isRequireInstance){
                s += "\t\t\t\t\trequire-instance false;\r\n";
            }else{
                console.log("do nothing for" + this)
            }     
        }     
        var regex  = /[^0-9/./*]/;
        if(this.range){
            s += PRE + "\trange ";
            s += "\"" + this.range + "\"" + ";\r\n";
        }

        if(this.description){
            this.description = this.description.replace(/\r+\n\s*/g, '\r\n' + PRE + '\t\t');
            s += PRE + "description\t\n\t\t\t\t  \""  + this.description + "\";\r\n";
        }
        if (this.children.length) {
            if(typeof this.children[0] === 'object'){                //enum
                this.children.map(function(child){
                    s += child.writeNode(layer + 1);
                });
            }else{
                this.children.map(function(child){
                    s += PRE + '\t';
                    s += child + ';\r\n';
                });
            }
        }
        
        

        s = s + PRE + "}";
    }
    else{
        s=";";
    }
    
    if(name.includes('int')){
        s = "\t\t\t\t"+name + ";" + "\r\n";   
    }else{
         s = PRE + name + s + "\r\n";
    }
    
    return s;

};
module.exports = type;