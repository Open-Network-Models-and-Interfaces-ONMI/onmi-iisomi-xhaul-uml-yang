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
var SpellChecker = require('spellchecker');
var dictionary = require('./dictionary.json');

dictionary.map(function(word){
    SpellChecker.add(word);
});

var translate = function(s) {
  // clean up s for nice logging
  return s
      .replace(/type /g, '')
      .replace(/uses /g, '')
      .replace(/path /g, '')
      .replace(/package /g, '')
      .replace(/ /g, '')
      .replace(/\*/g, '')
      .replace(/\//g, '')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .replace(/\t/g, '')
      .replace(/\'/g, '')
};

module.exports = {
    log : function(message, tool, level) {
      var date = new Date().toISOString();
      if (!tool) tool = ' UML2YANG';
      if (!level) level = 'INFO ';
      console.info([date, tool, level, message].join(' | '));
    },
    spellCheck : function(s) {
        translate(s)
            .replace(/[0-9]/g, '-')
            .replace(/core/g, '')
            .replace(/ /g, '-')
            .replace(/,/g, '-')
            .replace(/;/g, '-')
            .replace(/:/g, '-')
            .split('-').map(function(word){
                if (SpellChecker.isMisspelled(word)) {
                    var correction = SpellChecker.getCorrectionsForMisspelling(word);
                    module.exports.log([word, correction].join(' better? '), '  spelling', 'WARN ');
             }
        });
    },
    yangifyName : function(str, isSpellcheckerOn) {
        if (isSpellcheckerOn === undefined) {
          isSpellcheckerOn = true;
        }
        
        // yangify rules
        var yang = str
            .replace( /([a-z])([A-Z])/g, '$1-$2' ) // insert dashes
            .toLowerCase()                         // lowercase everything
            .replace( /^_/, '')                    // remove leading underscore
            .replace( /:_/g, ':')                  // and leading underscores in path segments
            .replace( /_/g, '-');                  // convert underscore to dash
        
        // logging
        if (str !== yang)
            module.exports.log([translate(str), translate(yang)].join(' >> '), '   yangify', 'INFO ');
        
        // spell checker
        if (isSpellcheckerOn) {
          module.exports.spellCheck(yang);
        }
        return yang;
    }
};
