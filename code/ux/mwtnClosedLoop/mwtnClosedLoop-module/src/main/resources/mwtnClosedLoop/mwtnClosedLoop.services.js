/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnClosedLoop/mwtnClosedLoop.module'],function(mwtnClosedLoopApp) {


  mwtnClosedLoopApp.register.factory('$mwtnClosedLoop', function($q, $mwtnCommons, $mwtnLog) {
    var service = {};

    service.gridOptions = $mwtnCommons.gridOptions;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    service.getActualNetworkElement = $mwtnCommons.getActualNetworkElement;
    service.getPacParts = $mwtnCommons.getPacParts;
    

    service.refresh = function() {
      var deferred = $q.defer();
      $mwtnCommons.getRequiredNetworkElements(true).then(function(pNes){
        var neIds = pNes.map(function(pNe){
          pNe._source.connectionStatus = 'disconnected';
          return pNe._id;
        });
        $mwtnCommons.getMountPoints(). then(function(mountpoints){
          var actualNodes = mountpoints.map(function(mountpoint){
            var pIndex = neIds.indexOf(mountpoint['node-id']);
            if (pIndex > -1) {
              pNes[pIndex]._source.connectionStatus = mountpoint['netconf-node-topology:connection-status']; 
            }
            return {
              id: mountpoint['node-id'],
              connectionStatus: mountpoint['netconf-node-topology:connection-status']
            };
          });
          var airInterfaces = [];
          pNes.map(function(hit){
            hit._source.MW_AirInterface_Pac.map(function(airinterface){
              return airinterface.airInterfaceConfiguration;
            }).map(function(airinterface){
              airInterfaces.push({
                id: $mwtnCommons.getNodeIntIdFromNodeId(hit._source.nodeId),
                name: hit._source.nodeId,
                connectionStatus: hit._source.connectionStatus,
                radioSignalID: airinterface.airInterfaceConfiguration.radioSignalID,
                plannedAirInterfaceName: airinterface.airInterfaceConfiguration.airInterfaceName,
                actualAirInterfaceName: '?'
              });
            });
          });
          
          airInterfaces.sort(function(a, b){
            if(a.radioSignalID < b.radioSignalID) return -1;
            if(a.radioSignalID > b.radioSignalID) return 1;
            return 0;
          });
          deferred.resolve({airInterfaces: airInterfaces, actualNodes: actualNodes});
        }, function(error){
          deferred.reject([]);
        });
        
      }, function(error){
        deferred.reject([]);
      });
      return deferred.promise;
    };
    
    return service;
  });

});
