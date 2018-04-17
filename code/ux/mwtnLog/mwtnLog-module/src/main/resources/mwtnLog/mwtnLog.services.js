/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnLog/mwtnLog.module','app/mwtnCommons/mwtnCommons.services'],function(mwtnLogApp) {

  mwtnLogApp.register.factory('$mwtnLogView', function($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {
    
    var service = {};

    service.checkModules = $mwtnCommons.checkModules;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    service.gridOptions = $mwtnCommons.gridOptions;
    service.formatTimeStamp = $mwtnCommons.formatTimeStamp;
    service.deleteDocType = $mwtnDatabase.deleteDocType;
    
    
    service.getAllLogEntries = function(from, size) {
      var sort = [ {
        timestamp : {
          order : 'desc'
        }
      }];
      var deferred = $q.defer();
      $mwtnDatabase.getAllData('mwtn', 'log', from, size, sort).then(function(success){
        deferred.resolve(success);
      }, function(error){
        $mwtnLog.error({component: '$mwtnLogView.getAllLogEntries', message: JSON.stringify(error.data)});
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return service;
  });
});
