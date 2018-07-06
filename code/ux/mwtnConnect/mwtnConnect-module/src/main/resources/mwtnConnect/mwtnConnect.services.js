/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnConnect/mwtnConnect.module','app/mwtnCommons/mwtnCommons.services'],function(mwtnConnectApp) {


  mwtnConnectApp.register.factory('$mwtnConnect', function($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {

    var COMPONENT = '$mwtnConnect';
    $mwtnLog.info({component: COMPONENT, message: '$mwtnConnect started!'});

    var service = {};
    
    service.addRequiredNetworkElement = $mwtnCommons.addRequiredNetworkElement;
    service.createSingleDocument = $mwtnDatabase.createSingleDocument;
    service.deleteSingleDocument = $mwtnDatabase.deleteSingleDocument;
    service.formatData = $mwtnCommons.formatData;
    service.formatTimeStamp = $mwtnCommons.formatTimeStamp;
    service.getAllData = $mwtnDatabase.getAllData;
    service.getFilteredSortedData = $mwtnDatabase.getFilteredSortedData;
    service.getMountPoint = $mwtnCommons.getMountPoint;
    service.getMountPoints = $mwtnCommons.getMountPoints;
    service.getActualNetworkElement = $mwtnCommons.getActualNetworkElement;
    service.getRequiredNetworkElements = $mwtnCommons.getRequiredNetworkElements;
    service.getMwtnWebSocketUrl = $mwtnCommons.getMwtnWebSocketUrl;
    service.getSingleDocument = $mwtnDatabase.getSingleDocument;
    service.gridOptions = $mwtnCommons.gridOptions;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    
    service.registerForOdlEvents = $mwtnCommons.registerForOdlEvents;
    service.separator = $mwtnCommons.separator;
    
    service.mount = $mwtnCommons.mount;
    service.unmount = $mwtnCommons.unmount;
    service.yangifyObject = $mwtnCommons.yangifyObject;

 
    service.getData = function(from, size, sort, query){
      if (!sort) { //default sort value
        sort = [ { 'event.timeStamp' : {order : 'desc'}}];
      }
      if (!query) { //default filter value
        query= {prefix: {'event.nodeName': 'SDN-Controller'}};
      }
      return getFilteredSortedData(from, size, sort, query);
    };
    
    var getFilteredSortedData = function(from, size, sort, query){
      var deferred = $q.defer();
      $mwtnDatabase.getFilteredSortedData('sdnevents', 'eventlog', from, size, sort, query).then(function(success){
        deferred.resolve(success);
      }, function(error){
        $mwtnLog.error({component: 'private getFilteredSortedData', message: JSON.stringify(error.data)});
        deferred.reject(error);
      });
      return deferred.promise;
    };

    service.TimeStampToONFFormat = function(timestamp) {
      timestamp=timestamp.split('-').join('');
      timestamp=timestamp.split(':').join('');
      timestamp=timestamp.split(' ').join('');
      timestamp=timestamp.replace('UTC','Z');
      return timestamp;
    };

    return service;
  });

});
