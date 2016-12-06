/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\yang\module.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/
var defaultOrganization = 'ONF (Open Networking Foundation) Open Transport Working Group - Wireless Transport Project';

function Module(name, namespace, imp, pref, org, contact, revis, descrp) {
    this.name = name;
    this.namespace = namespace;
    this.import = [];
    this.prefix = pref;
    this.organization = org;
    this.contact = contact;
    this.revision = revis;
    if (descrp) this.description = descrp.toYangDescription();
    this.children = [];
}
Module.prototype.writeNode = function (layer) {
    var PRE = '';
    var k = layer;
    while (k-- > 0) {
        PRE += '\t';
    }
    var name = "module " + this.name;
    var namespace;
    this.namespace == "" || this.namespace == undefined ? namespace = PRE + "\tnamespace ;\r\n" : namespace = PRE + "\tnamespace " + this.namespace + ";\r\n";
    var imp = "";
    if (this.import == [] || this.import == undefined) {
        imp = ""
    } else {
        for (var i = 0; i < this.import.length; i++) {
            imp += PRE + "\timport " + this.import[i] + " {\r\n" + PRE + "\t\tprefix " + this.import[i] + ";\r\n" + PRE + "\t}\r\n";
        }
    }
    
    var pref;
    this.prefix == "" || this.prefix == undefined ? pref = PRE + "\tprefix ;\r\n" : pref = PRE + "\tprefix " + this.prefix + ";\r\n\r\n";
    
    var org;
    if (this.organization === '' || this.organization === undefined) {
      this.organization = defaultOrganization;
    }
    org = '\r\n    organization \r\n        \'' + this.organization + '\';\r\n\r\n';
    // this.organization == "" || this.organization == undefined ? org = "" : org = PRE + "\torganization " + this.organization + ";\r\n";

    var contact;
    this.contact == "" || this.contact == undefined ? contact = "" : contact = PRE + "\tcontact \r\n        '" + this.contact + "';\r\n\r\n";


    var revis = new Date().toISOString().split('T')[0];
    //revis=date.toLocaleDateString();
    if (this.revision === '' || this.revision === undefined) {
      revis = PRE + "\trevision " + revis + " {}\r\n\r\n" ;
    } else {
      revis = '';
      this.revision.map(function(rev){
        revis += '    revision ' + rev.date + ' {\r\n\        description \r\n            "' + rev.description + '"; \r\n        reference \r\n            "' + rev.reference + '"; \r\n    }\r\n\r\n';
      });
    }
    
    var descrp;
    if (typeof this.description == 'string') {
        this.description = this.description.replace(/\r\r\n\s*/g, '\r\n' + PRE + '\t\t');
    }
    this.description == "" || this.description == undefined ? descrp = "" : descrp = "    description \r\n        \'" + this.description + "\';\r\n\r\n";
    
    var st = "";
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            st += this.children[i].writeNode(layer + 1);
        }
    }
    st = PRE + name + " {\r\n" +
    namespace +
    pref +
    imp +
    org +
    contact +
    descrp +
    revis +
    st + "}\r\n";
    return st;
};
module.exports = Module;
