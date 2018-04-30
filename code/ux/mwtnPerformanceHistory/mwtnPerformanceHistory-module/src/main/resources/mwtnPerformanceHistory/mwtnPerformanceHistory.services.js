/*
 * Copyright (c) 2016 HCL Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnPerformanceHistory/mwtnPerformanceHistory.module'], function (mwtnPerformanceHistoryoryApp) {

  mwtnPerformanceHistoryoryApp.register.factory('$mwtnPerformanceHistory', function ($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$mwtnPerformanceHistory';
    $mwtnLog.info({ component: COMPONENT, message: '$mwtnPerformanceHistory started!' });

    var service = {};
    service.formatTimeStamp = $mwtnCommons.formatTimeStamp;
    service.getMountPoints = $mwtnCommons.getMountPoints;
    service.getPacParts = $mwtnCommons.getPacParts;
    service.layerProtocolNameOrder = $mwtnCommons.layerProtocolNameOrder;
    
    service.yangifyObject = $mwtnCommons.yangifyObject;

    service.TimeStampToONFFormat = function (timestamp) {
      timestamp = timestamp.split('-').join('');
      timestamp = timestamp.split(':').join('');
      timestamp = timestamp.split(' ').join('');
      timestamp = timestamp.replace('UTC', 'Z');
      return timestamp;
    };

    service.getFilteredSortedData = function (from, size, sort, query, selected15minPeriod) {
      var func = function () {
        if (selected15minPeriod) {
          return $mwtnDatabase.getFilteredSortedData('sdnperformance', 'historicalperformance15min', from, size, sort, query);
        } else {
          return $mwtnDatabase.getFilteredSortedData('sdnperformance', 'historicalperformance24h', from, size, sort, query);
        }
      };
      var deferred = $q.defer();
      func().then(function (success) {
        deferred.resolve(success);
      }, function (error) {
        $mwtnLog.error({ component: '$mwtnHistPerformance.getFilteredSortedData', message: JSON.stringify(error.data) });
        deferred.reject(error)
      });
      return deferred.promise;

    };

    return service;
  });

});
