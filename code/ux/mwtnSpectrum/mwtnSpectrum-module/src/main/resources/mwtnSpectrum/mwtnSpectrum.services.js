/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnSpectrum/mwtnSpectrum.module'],function(mwtnSpectrumApp) {


  mwtnSpectrumApp.register.factory('$mwtnSpectrum', function($q, $mwtnCommons, $mwtnLog) {
    var service = {};

    service.gridOptions = $mwtnCommons.gridOptions;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    service.getActualNetworkElement = $mwtnCommons.getActualNetworkElement;
    service.getPacParts = $mwtnCommons.getPacParts;
    
    
    service.execute = function() {
      var request = {
          method: 'POST',
          url: 'operations/scheduler:next'
      };
      var deferred = $q.defer();
      $mwtnCommons.genericRequest(request).then(function(success) {
        deferred.resolve(success);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    
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
            hit._source.MW_AirInterface_Pac.filter(function(airinterface){
              return airinterface.airInterfaceConfiguration;
            }).map(function(airinterface){
              airInterfaces.push({
                id: $mwtnCommons.getNodeIntIdFromNodeId(hit._source.nodeId),
                name: hit._source.nodeId,
                connectionStatus: hit._source.connectionStatus,
                airInterfaceName: airinterface.airInterfaceConfiguration.airInterfaceName,
                radioSignalID: airinterface.airInterfaceConfiguration.radioSignalID,
                plannedTxFrequency: airinterface.airInterfaceConfiguration.txFrequency,
                actualTxFrequency: '?',
                plannedRxFrequency: airinterface.airInterfaceConfiguration.rxFrequency,
                actualRxFrequency: '?'
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
