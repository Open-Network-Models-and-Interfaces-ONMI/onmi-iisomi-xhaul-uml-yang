/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\yang\util.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/

module.exports = {
    log : function(message, tool, level) {
      var date = new Date().toISOString();
      if (!tool) tool = ' UML2YANG';
      if (!level) level = ' INFO';
      console.info([date, tool, level, message].join(' | '));
    },
    yangifyName : function(str) {
        var translate = function(s) {
          return s
              .replace(/type /g, '')
              .replace(/uses /g, '')
              .replace(/ /g, '')
              .replace(/\*/g, '')
              .replace(/\//g, '')
              .replace(/\n/g, '')
              .replace(/\r/g, '')
              .replace(/\t/g, '')
        };
        var yang = str
            .replace( /([a-z])([A-Z])/g, '$1-$2' ) // insert dashes
            .toLowerCase()                         // lowercase everything
            .replace( /^_/, '')                    // remove leading underscore
            .replace( /:_/g, ':')                  // and leading underscores in path segments
            .replace( /_/g, '-');                  // convert underscore to dash
        if (str !== yang)
            this.log([translate(str), translate(yang)].join(' >> '), '  yangify');
        return yang;
    }
};
