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
      console.log(docType, JSON.stringify(request));

      var deferred = $q.defer();
      $mwtnDatabase.genericRequest(request).then(function(success) {
        deferred.resolve(success);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    return service;
  });

});
