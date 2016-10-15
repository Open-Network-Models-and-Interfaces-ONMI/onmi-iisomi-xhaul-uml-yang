/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnConfig/mwtnConfig.module'],function(mwtnConfigApp) {


  mwtnConfigApp.register.factory('$mwtnConfig', function($mwtnCommons, $mwtnDatabase, $mwtnLog) {
    
    var COMPONENT = '$mwtnConfig';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnConfig started!'});

    var service = {};
    
    service.separator = $mwtnCommons.separator;
    service.parts = $mwtnCommons.parts;
    service.getActualNetworkElements = $mwtnCommons.getActualNetworkElements;
    service.getLayer = $mwtnCommons.getLayer;
    service.getType = $mwtnCommons.getType;
    service.getPacParts = $mwtnCommons.getPacParts;
    service.setPacParts = $mwtnCommons.setPacParts;
    service.setPacPartLists = $mwtnCommons.setPacPartLists;
    service.getSchema = $mwtnDatabase.getSchema;
    service.checkModules = $mwtnCommons.checkModules;
    
    service.getAttributes = function(object, schema){
      var keys = Object.keys(object);
      console.log(JSON.stringify(object));
      var index = keys.indexOf('$$hashKey');
      if (index > -1) {
        keys.splice(index, 1);
      }
      return keys.map(function(parameter) {
        if (schema[parameter]) {
          return {
            name: parameter,
            value: object[parameter],
            order: schema[parameter]['order-number'],
            unit:  schema[parameter].unit,
          }
        } else {
          return {
            name: parameter,
            value: object[parameter],
            order: 0,
            unit:  '',
          }
        }
      });
    };

    return service;
  });

});
