/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnConfig/mwtnConfig.module'],function(mwtnConfigApp) {


  mwtnConfigApp.register.factory('$mwtnConfig', function($mwtnCommons, $mwtnLog) {
    
    var COMPONENT = '$mwtnConfig';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnConfig started!'});

    var service = {};
    
    service.separator = $mwtnCommons.separator;

    service.getData = function(neId, revision, key, callback) {
      
      // console.log(key, 'opened');
      var info = key.split(service.separator);
      console.log(info);
      
      switch (info[0]) {
      case 'ne':
        $mwtnCommons.getActualNetworkElement(neId, revision, function(data){
          return callback(data);
        });
        break;
      case 'ltp':
        // /_ltpRefList/LTP-MWS-TTP-ifIndex1
        var odlRequest = {
          method: 'GET',
          url: [$mwtnCommons.url.actualNetworkElement(neId, revision), '_ltpRefList', info[1]].join('/')
        };
        $mwtnCommons.genericRequest(odlRequest, function(data){
          return callback(data);
        });
        break;
      case 'airinterface':
      case 'structure':
      case 'container':
        if (info[2]) {
          $mwtnCommons.getConditionalPackagePart(neId, revision, info[0], info[1], info[2], function(data){
            return callback(data);
          }); 
        } else {
          return callback();
        }
        break;
      default:
        $mwtnLog.error({component: COMPONENT, message: 'Requesting ' + info[0] + ' not supported!'});
        return callback();
      }
      
    };
    return service;
  });

});
