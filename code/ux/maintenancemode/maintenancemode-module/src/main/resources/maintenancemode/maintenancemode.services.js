/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/maintenancemode/maintenancemode.module', 'app/mwtnCommons/mwtnCommons.services'], function (maintenancemodeApp) {


  maintenancemodeApp.register.factory('$maintenancemode', function ($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$maintenancemode';

    var service = {};

    service.formatData = $mwtnCommons.formatData;
    service.getNetworkElements = $mwtnCommons.getRequiredNetworkElements;
    service.getMaintenanceNetworkElements = $mwtnCommons.getMaintenanceNetworkElements;
    service.gridOptions = $mwtnCommons.gridOptions;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    service.yangifyObject = $mwtnCommons.yangifyObject;
    service.getSingleDocument = $mwtnDatabase.getSingleDocument;
    service.deleteSingleDocument = $mwtnDatabase.deleteSingleDocument;
    service.createSingleDocument = $mwtnDatabase.createSingleDocument;

    service.getData = function (from, size, sort, query) {
      if (!sort) { //default sort value
        sort = [{ 'event.timeStamp': { order: 'desc' } }];
      }
      if (!query) { //default filter value
        query = { prefix: { 'event.nodeName': 'SDN-Controller' } };
      }
      return getFilteredSortedData(from, size, sort, query);
    };

    var getFilteredSortedData = function (from, size, sort, query) {
      var deferred = $q.defer();
      $mwtnDatabase.getFilteredSortedData('sdnevents', 'eventlog', from, size, sort, query).then(function (success) {
        deferred.resolve(success);
      }, function (error) {
        $mwtnLog.error({ component: 'private getFilteredSortedData', message: JSON.stringify(error.data) });
        deferred.reject(error);
      });
      return deferred.promise;
    };

    service.TimeStampToONFFormat = function (timestamp) {
      timestamp = timestamp.split('-').join('');
      timestamp = timestamp.split(':').join('');
      timestamp = timestamp.split(' ').join('');
      timestamp = timestamp.replace('UTC', 'Z');
      return timestamp;
    };

    return service;
  });

});
