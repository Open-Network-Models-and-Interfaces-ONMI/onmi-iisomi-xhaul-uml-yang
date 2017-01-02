/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnTopology/mwtnTopology.module'],function(mwtnTopologyApp) {


  mwtnTopologyApp.register.factory('$mwtnTopology', function($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {
    var service = {};

    service.getRequiredNetworkElements = $mwtnCommons.getRequiredNetworkElements;
    service.gridOptions = $mwtnCommons.gridOptions;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;

    service.getNodes = function(docType) {

      var request = {
          method: 'POST',
          docType: docType,
          command: '_search',
          from : 0,
          size : 999,
          sort : undefined,
          filter : undefined,
          query : {
            match_all : {}
          } 
      };
      // console.log(docType, JSON.stringify(request));

      var deferred = $q.defer();
      $mwtnDatabase.genericRequest(request).then(function(success) {
        deferred.resolve(success);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    
    service.getDistance = function(lat1, lon1, lat2, lon2) {
    	var R = 6371; // km
    	var φ1 = lat1.toRadians();
    	var φ2 = lat2.toRadians();
    	var Δφ = (lat2-lat1).toRadians();
    	var Δλ = (lon2-lon1).toRadians();

    	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    	        Math.cos(φ1) * Math.cos(φ2) *
    	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    	return (R * c).toFixed(3);
    };
    
    	
    	
    return service;
  });

});
