/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module'],function(mwtnCommonsApp) {


  mwtnCommonsApp.register.factory('$mwtnCommons', function($http, ENV) {
    var service = {
      base: ENV.getBaseURL("MD_SAL") + "/restconf/"
    };
    
    service.getData = function(callback) {
      return callback('Hallo World! I\'m here');
    }

    // grid settings
    service.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
      if( col.filters[0].term ){
        return 'header-filtered';
      } else {
        return '';
      }
    };
    service.gridOptions = {
        data: [],
        enableColumnResizing: true,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        showGridFooter: true,
        //showColumnFooter: true,
        fastWatch: true,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        multiSelect: false
    };
    service.gridOptions.gridMenuCustomItems = [ {
      title : 'Rotate Grid',
      action : function($event) {
        this.grid.element.toggleClass('rotated');
      },
      order : 210
    } ];

    service.url = {
      actualNetworkElements : function() {
        return 'operational/network-topology:network-topology/topology/topology-netconf';
      },
      actualNetworkElement : function(neId) {
        return [
            'operational/network-topology:network-topology/topology/topology-netconf/node/',
            neId,
            '/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/',
            neId ].join('');
      }
    };
    
    service.getMountedNetConfServers = function(callback) {
      var url = service.base + service.url.actualNetworkElements();
      var request = {
        method : 'GET',
        url : url
      };
      $http(request).then(function successCallback(response) {
        callback(response.data);
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        callback();
      });
    };
    return service;
  });
  
  
  // Service log
  mwtnCommonsApp.register.factory('$mwtnLog', function($http, ENV, $mwtnDatabase) {
    
    var writeLogToDB = function(data, callback) {
      var url = [$mwtnDatabase.base, $mwtnDatabase.index, 'log'].join('/');
      var request = {
          method: 'POST',
          url: url,
          data: {
            timestamp: new Date().toISOString(),
            type: data.type ? data.type : 'info',
            component: data.component ? data.component : 'unkonwn',
            message: data.message
          }
      };
      $http(request).then(function successCallback(response) {
        return callback(true);
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        return callback(false);
      });
    };
    
    var createIndex = function(index, callback) {
      var url = [$mwtnDatabase.base, index, 'log'].join('/');
      var request = {
          method: 'POST',
          url: url,
          data: {
            timestamp: new Date().toISOString(),
            type: 'info',
            component: '$mwtnLog',
            message: 'init log'
          }
      };
      $http(request).then(function successCallback(response) {
        return callback(true);
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        return callback(false);
      });
    };
    
    var checkIndex = function(index, callback) {
      var url = [$mwtnDatabase.base, index].join('/');
      var request = {
          method : 'HEAD',
          url : url
      };
      $http(request).then(function successCallback(response) {
        return callback(true);
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        createIndex(index, function(created){
          return callback(created);
        });
      });
    };

    var checkDatabase = function(callback) {
      var url = $mwtnDatabase.base;
      var request = {
          method : 'GET',
          url : url
      };
      $http(request).then(function successCallback(response) {
        checkIndex($mwtnDatabase.index, function(exists){
          return callback(exists);
        });
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        return callback(false);
      });
    };
    
    var getData = function(type, log) {
      var data = {};
      data.type = 'info';
      switch(typeof log) {
        case 'string':
            data.component = 'unknown';
            data.message = log;
            break;
        case 'object':
            data = log;
            break;
        default:
          data.type = 'error';
          data.component = '$mwtnLog';
          data.message = 'MWTN log service is called with wrong parameters.';
      }
      return data;
    }
    
    var service = {
      base: $mwtnDatabase.base
    };
    
    service.debug = function(log) {
      var data = getData('debug', log);
      checkDatabase(function(isRunning){
        if (isRunning) {
          writeLogToDB(data, function(){
            // console.log('log stored');
          });
        } else {
          console.error(new Date().toISOString(), service.base, 'Database (ElasticSerach) not reachable!?')
        }
      });
      console.log(new Date().toISOString(), JSON.stringify(log));
    };

    service.error = function(log) {
      var data = getData('error', log);
      checkDatabase(function(isRunning){
        if (isRunning) {
          writeLogToDB(data, function(){
            // console.log('log stored');
          });
        } else {
          console.error(new Date().toISOString(), service.base, 'Database (ElasticSerach) not reachable!?')
        }
      });
      console.error(new Date().toISOString(), JSON.stringify(log));
    };

    service.info = function(log) {
      var data = getData('info', log);
      checkDatabase(function(isRunning){
        if (isRunning) {
          writeLogToDB(data, function(){
            // console.log('log stored');
          });
        } else {
          console.error(new Date().toISOString(), service.base, 'Database (ElasticSerach) not reachable!?')
        }
      });
      console.info(new Date().toISOString(), JSON.stringify(log));
    };
    
    service.warning = function(log) {
      var data = getData('warning', log);
      checkDatabase(function(isRunning){
        if (isRunning) {
          writeLogToDB(data, function(){
            // console.log('log stored');
          });
        } else {
          console.error(new Date().toISOString(), service.base, 'Database (ElasticSerach) not reachable!?')
        }
      });
      console.warn(new Date().toISOString(), JSON.stringify(log));
    };

    return service;
  });

  // Service Database (ElasticSerach)
  mwtnCommonsApp.register.factory('$mwtnDatabase', function($http, ENV) {

    var service = {
         base:   ENV.getBaseURL("MD_SAL").replace(':8181', ':9200'),
         index: 'mwtn',
         command: '_search'
      };

      service.getAllData = function(docType, callback) {
        var url = [service.base, service.index, docType, service.command ].join('/');
        var request = {
            method: 'GET',
            url: url,
            data: { query: { match_all: {} } }
        };
        $http(request).then(function successCallback(response) {
          callback(response);
        }, function errorCallback(response) {
          console.error(JSON.stringify(response));
          callback();
        });
      };
      return service;
  });
  

  // Class NetConfServer
  mwtnCommonsApp.register.factory('NetConfServer', function() {
    // Classes
    // Class NetConfServer
    var NetConfServer = function(data) {
      this.data = data;
      this.getData = function() {
       return this.data;
      };
      this.getRadioSignalId = function() {
        return this.data.airInterfaceConfiguration.radioSignalId;
      };
      this.isLinkUp = function() {
        return this.data.airInterfaceStatus.linkIsUp;
      };
      this.isPowerOn = function() {
        return this.data.airInterfaceConfiguration.powerIsOn;
      };
      this.isActive = function() {
        return this.isPowerOn() && this.isLinkUp();
      };
    };
    return NetConfServer;
  });
  
});
