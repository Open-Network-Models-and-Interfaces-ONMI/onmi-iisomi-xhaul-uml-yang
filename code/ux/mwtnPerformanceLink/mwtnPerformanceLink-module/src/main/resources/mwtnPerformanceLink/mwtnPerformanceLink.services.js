/*
 * Copyright (c) 2016 HCL Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/mwtnPerformanceLink/mwtnPerformanceLink.module'], function (mwtnPerformanceLinkApp) {

  mwtnPerformanceLinkApp.register.factory('$mwtnPerformanceLink', function ($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$mwtnPerformanceLink';
    $mwtnLog.info({ component: COMPONENT, message: '$mwtnPerformanceLink started!' });

    var service = {};
    service.formatTimeStamp = $mwtnCommons.formatTimeStamp;
    service.getMountPoints = $mwtnCommons.getMountPoints;
    service.getAggregations = $mwtnDatabase.getAggregations;
    

    service.TimeStampToONFFormat = function (timestamp) {
      timestamp = timestamp.split('-').join('');
      timestamp = timestamp.split(':').join('');
      timestamp = timestamp.split(' ').join('');
      timestamp = timestamp.replace('UTC', 'Z');
      return timestamp;
    };

    service.getFilteredSortedData = function (from, size, sort, query, selected15minPeriod) {

      var functionId = 'sdnperformance';
      var docType = 'historicalperformance15min';
      if (selected15minPeriod === false) {
        docType = 'historicalperformance24h';
      }

      var deferred = $q.defer();
      $mwtnDatabase.getFilteredSortedData(functionId, docType, from, size, sort, query).then(function (success) {
        deferred.resolve(success);
      }, function (error) {
        $mwtnLog.error({ component: '$mwtnPerformanceLink.getFilteredSortedData', message: JSON.stringify(error.data) });
        deferred.reject(error)
      });
      return deferred.promise;
    };

    service.getInterfaces = function (aggregation, selected15minPeriod) {

      var functionId = 'sdnperformance';
      var docType = 'historicalperformance15min';
      if (selected15minPeriod === false) {
        docType = 'historicalperformance24h';
      }

      var deferred = $q.defer();
      $mwtnDatabase.getAggregatedData(functionId, docType, aggregation).then(function (success) {
        deferred.resolve(success);
      }, function (error) {
        $mwtnLog.error({ component: '$mwtnPerformanceLink.getFilteredSortedData', message: JSON.stringify(error.data) });
        deferred.reject(error)
      });
      return deferred.promise;
    };

    return service;
  });
});
