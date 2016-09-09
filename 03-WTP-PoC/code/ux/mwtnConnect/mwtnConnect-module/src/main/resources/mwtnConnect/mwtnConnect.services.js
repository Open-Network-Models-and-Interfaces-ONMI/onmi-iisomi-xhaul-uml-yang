/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnConnect/mwtnConnect.module','app/mwtnCommons/mwtnCommons.services'],function(mwtnConnectApp) {


  mwtnConnectApp.register.factory('$mwtnConnect', function($http, $mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$mwtnConnect';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnConnect started!'});

    var service = {};

    service.mount = function(mountingPoint, callback) {
      console.log(21, JSON.stringify(mountingPoint));
      $mwtnCommons.mount(mountingPoint, function(data){
        console.log(22, JSON.stringify(data));
        return callback(data);
      });
    };
    
    service.getActualNetworkElements = function(callback) {
      var url = $mwtnCommons.base + $mwtnCommons.url.actualNetworkElements();
      var request = {
        method : 'GET',
        url : url
      };
      $http(request).then(function successCallback(response) {
        callback(response.data);
      }, function errorCallback(response) {
        $mwtnLog.error({component: COMPONENT, message: JSON.stringify(response)});
        callback();
      });
    };

    service.unmount = function(neName, callback) {
      var url = [$mwtnCommons.base,
          'config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/',
          neName].join('');
      var request = {
        method : 'DELETE',
        url : url
      };
      $http(request).then(function successCallback(response) {
        $mwtnLog.info({component: COMPONENT, message: 'Mounting Point deleted: ' + neName});
        callback(response.data);
      }, function errorCallback(response) {
        $mwtnLog.error({component: COMPONENT, message: JSON.stringify(response)});
        callback();
      });
    };
    
    return service;
  });

});
