/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

if (!String.prototype.contains) { 
  String.prototype.contains = function(it) { 
    return this.indexOf(it) != -1; 
  }; 
}

define(
    [ 'app/mwtnCommons/mwtnCommons.module' ],
    function(mwtnCommonsApp) {

      mwtnCommonsApp.register.factory('$mwtnCommons', function($http, ENV) {
        var service = {
          base : ENV.getBaseURL("MD_SAL") + "/restconf/"
        };

        service.getData = function(callback) {
          return callback('$mwtnCommons registered to this application.');
        }
        service.separator = '&nbsp;';

        // grid settings
        service.highlightFilteredHeader = function(row, rowRenderIndex,
            col, colRenderIndex) {
          if (col.filters[0].term) {
            return 'header-filtered';
          } else {
            return '';
          }
        };
        service.gridOptions = {
          data : [],
          enableColumnResizing : true,
          enableSorting : true,
          enableFiltering : true,
          enableGridMenu : true,
          exporterMenuPdf: false,
          showGridFooter : true,
          // showColumnFooter: true,
          fastWatch : true,
          enableRowSelection : true,
          enableRowHeaderSelection : true,
          multiSelect : false
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
          actualNetworkElement : function(neId, revision) {
            switch (revision) {
            case "2016-03-23":
              return [
                      'operational/network-topology:network-topology/topology/topology-netconf/node/',
                      neId,
                      '/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/',
                      neId ].join('');
              break;
            default:
              return [
                      'operational/network-topology:network-topology/topology/topology-netconf/node/',
                      neId,
                      '/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/',
                      neId ].join('');
            }
          }
        };

        service.genericRequest = function(odlRequest, callback) {
          var url = [ service.base, odlRequest.url].join('');
          var request = {
            method : odlRequest.method,
            url : url,
            data : odlRequest.data
          };
          console.info(JSON.stringify(request));

          $http(request).then(function successCallback(response) {
            callback(response);
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            callback();
          });
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

        service.getActualNetworkElement = function(neId, revision, callback) {

          var url = [service.base,
              service.url.actualNetworkElement(neId, revision)].join('');
          var request = {
            method : 'GET',
            url : url
          };
          console.time([neId, 'ONF:CoreModel:NetworkElement data received'].join(' '));
          $http(request).then(function successCallback(response) {
            console.timeEnd([neId, 'ONF:CoreModel:NetworkElement data received'].join(' '));
            callback(response.data);
          }, function errorCallback(response) {
            console.timeEnd([neId, 'ONF:CoreModel:NetworkElement data received'].join(' '));
            console.info('Could not get data from', neId);
            // console.error(JSON.stringify(response));
            callback();
          });
        };

        service.getConditionalPackagePart = function(neId, revision, pacId, lpId, partId, callback) {

          switch (pacId) {
          case 'MWPS':
          case 'AirInterface':
          case 'airinterface':
          case 'airInterface':
            pacId = 'MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac';
            partId = 'airInterface' + partId
          }
          
          var url = [service.base,
              'operational/network-topology:network-topology/topology/topology-netconf/node/',
              neId,
              '/yang-ext:mount/',pacId,'/',
              lpId, '/', partId].join('');
          var request = {
            method : 'GET',
            url : url
          };
          console.log(url);
          console.time([neId, lpId, 'MW_AirInterface_Pac data received'].join(' '));
          $http(request).then(function successCallback(response) {
            console.timeEnd([neId, lpId, 'MW_AirInterface_Pac data received'].join(' '));
            callback(response.data);
          }, function errorCallback(response) {
            console.timeEnd([neId, lpId, 'MW_AirInterface_Pac data received'].join(' '));
            console.error('getActualMW_AirInterface_Pac');
            //console.error(JSON.stringify(response));
            callback();
          });
        };

        service.getActualMW_AirInterface_Pac = function(neId, lpId, callback) {
//console.log('234', neId, lpId);
          var url = [service.base,
              'operational/network-topology:network-topology/topology/topology-netconf/node/',
              neId,
              '/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac/',
              lpId].join('');
          var request = {
            method : 'GET',
            url : url
          };
          console.time([neId, lpId, 'MW_AirInterface_Pac data received'].join(' '));
          $http(request).then(function successCallback(response) {
            console.timeEnd([neId, lpId, 'MW_AirInterface_Pac data received'].join(' '));
            callback(response.data);
          }, function errorCallback(response) {
            console.timeEnd([neId, lpId, 'MW_AirInterface_Pac data received'].join(' '));
            console.error('getActualMW_AirInterface_Pac');
            //console.error(JSON.stringify(response));
            callback();
          });
        };

        service.getActualMW_Structure_Pac = function(neId, lpId, callback) {

          var url = [service.base,
              'operational/network-topology:network-topology/topology/topology-netconf/node/',
              neId,
              '/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Structure_Pac/',
              lpId].join('');
          var request = {
            method : 'GET',
            url : url
          };
          console.time([neId, lpId, 'MW_Structure_Pac data received'].join(' '));
          $http(request).then(function successCallback(response) {
            console.timeEnd([neId, lpId, 'MW_Structure_Pac data received'].join(' '));
            callback(response.data);
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            callback();
          });
        };

        service.getActualMW_Container_Pac = function(neId, lpId, callback) {

          var url = [service.base,
              'operational/network-topology:network-topology/topology/topology-netconf/node/',
              neId,
              '/yang-ext:mount/MicrowaveModel-ObjectClasses-MwConnection:MW_Container_Pac/',
              lpId].join('');
          var request = {
            method : 'GET',
            url : url
          }; 
          console.time([neId, lpId, 'MW_Container_Pac data received'].join(' '));
          $http(request).then(function successCallback(response) {
            console.timeEnd([neId, lpId, 'MW_Container_Pac data received'].join(' '));
            callback(response.data);
          }, function errorCallback(response) {
            console.timeEnd([neId, lpId, 'MW_Container_Pac data received'].join(' '));
            console.error(JSON.stringify(response));
            callback();
          });
        };
        
        var createStream = function(streamName, callback) {
          var request = {
            method : 'GET',
            url : [ service.base, 'streams/stream/', streamName ]
                .join('')
          };
          $http(request).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            // console.log(JSON.stringify(response));
            console.log(response.headers('Location'));
            callback(response.headers('Location'));
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.error(JSON.stringify(response));
            callback();
          });
        };

        service.registerForOdlEvents = function(path, callback) {
          var request = {
            method : 'POST',
            url : [ service.base,
                'operations/sal-remote:create-data-change-event-subscription' ]
                .join(''),
            data : {
              "input" : {
                "path" : path,
                "sal-remote-augment:datastore" : "CONFIGURATION",
                "sal-remote-augment:scope" : "SUBTREE"
              }
            }
          };
          $http(request).then(
              function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                // console.log(JSON.stringify(response));
                createStream(response.data.output['stream-name'],
                    function(socketLocation) {
                      callback(socketLocation);
                    });
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.error(JSON.stringify(response));
              });
        };
        return service;
      });

      // Service log
      mwtnCommonsApp.register.factory('$mwtnLog', function($http, ENV,
          $mwtnDatabase) {

        var writeLogToDB = function(data, callback) {
          var url = [ $mwtnDatabase.base, $mwtnDatabase.index, 'log' ].join('/');
          var request = {
            method : 'POST',
            url : url,
            data : {
              timestamp : data.timestamp ? data.timestamp : new Date().toISOString(),
              type : data.type ? data.type : 'info',
              component : data.component ? data.component : 'unkonwn',
              message : data.message
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
          var url = [ $mwtnDatabase.base, index, 'log' ].join('/');
          var request = {
            method : 'POST',
            url : url,
            data : {
              timestamp : new Date().toISOString(),
              type : 'info',
              component : '$mwtnLog',
              message : 'init log'
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
          var url = [ $mwtnDatabase.base, index ].join('/');
          var request = {
            method : 'HEAD',
            url : url
          };
          $http(request).then(function successCallback(response) {
            return callback(true);
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            createIndex(index, function(created) {
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
            checkIndex($mwtnDatabase.index, function(exists) {
              return callback(exists);
            });
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            return callback(false);
          });
        };

        var getData = function(type, log) {
          var data = {};
          data.timestamp = new Date().toISOString();
          switch (typeof log) {
          case 'string':
            data.type = type;
            data.component = 'unknown';
            data.message = log;
            break;
          case 'object':
            data.type = type;
            data.component = log.component;
            data.message = log.message;
            break;
          default:
            data.type = 'error';
            data.component = '$mwtnLog';
            data.message = 'MWTN log service is called with wrong parameters.';
          }
          // console.log(JSON.stringify(data));
          return data;
        }

        var service = {
          base : $mwtnDatabase.base
        };

        service.debug = function(log) {
          var data = getData('debug', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base,
                  'Database (ElasticSerach) not reachable!?')
            }
          });
          console.log(data.timestamp, JSON.stringify(log));
        };

        service.error = function(log) {
          var data = getData('error', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base,
                  'Database (ElasticSerach) not reachable!?')
            }
          });
          console.error(data.timestamp, JSON.stringify(log));
        };

        service.info = function(log) {
          var data = getData('info', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base,
                  'Database (ElasticSerach) not reachable!?')
            }
          });
          console.info(data.timestamp, JSON.stringify(log));
        };

        service.warning = function(log) {
          var data = getData('warning', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base,
                  'Database (ElasticSerach) not reachable!?')
            }
          });
          console.warn(data.timestamp, JSON.stringify(log));
        };

        return service;
      });

      // Service Database (ElasticSerach)
      mwtnCommonsApp.register.factory('$mwtnDatabase', function($http, ENV) {

        var service = {
          base : ENV.getBaseURL("MD_SAL").replace(':8181', ':9200'),
          index : 'mwtn',
          command : '_search'
        };

        service.genericRequest = function(databaseRequest, callback) {
          var url = [ service.base, service.index, databaseRequest.docType,
                      databaseRequest.command ].join('/');
          var request = {
            method : databaseRequest.method,
            url : url,
            data : {
              from : databaseRequest.from,
              size : databaseRequest.size,
              sort : databaseRequest.sort,
              filter : databaseRequest.filter,
              query : databaseRequest.query
            }
          };
          // console.info(JSON.stringify(request));

          $http(request).then(function successCallback(response) {
            callback(response);
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            callback();
          });
        };

        service.getAllData = function(docType, from, size, sort, callback) {
          var databaseRequest = {
            method : 'POST',
            command: '_search',
            docType: docType,
            from : from,
            size : size,
            sort : sort,
            query : {
              match_all : {}
            }
          };
          service.genericRequest(databaseRequest, function(response){
            callback(response);
          });
        };

        service.getData = function(docType, from, size, sort, filter, query, callback) {
          var databaseRequest = {
            method : 'POST',
            docType: docType,
            from : from,
            size : size,
            sort : sort,
            filter : filter,
            query : query
          };
          service.genericRequest(databaseRequest, function(response){
            callback(response);
          });
        };
        
        service.deleteDoc = function(docType, id, callback) {
          var databaseRequest = {
            method : 'DELETE',
            docType: docType,
            command: id,
          };
          service.genericRequest(databaseRequest, function(response){
            // console.log(JSON.stringify(response));
            callback({status: response.status, logId: response.data._id});
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

      
      mwtnCommonsApp.register.factory('ActualNetworkElement', function($http, ENV) {

        // Classes
        // Class ActualNetworkElement
        var ActualNetworkElement = function(data) {
          this.data = data;
          this.data.layerProtocols = {};
          this.setOnfNetworkElement = function(onfNe) {
            this.data.onfNetworkElement = onfNe;
          };          
          this.getLpByRadioSignalId = function(radioSignalId) {
            //console.log('getLP', JSON.stringify(this.data.ltp));
            var layerProtocol;
            for (var layerProtocolKey in this.data.layerProtocols){
              if (this.data.layerProtocols[layerProtocolKey].getRadioSignalId && 
                  radioSignalId === parseInt(this.data.layerProtocols[layerProtocolKey].getRadioSignalId())) {
                layerProtocol = this.data.layerProtocols[layerProtocolKey];
              }
            }
            return layerProtocol;
          };
          this.getLpByRadioSignalIds = function(radioSignalIds) {
            //console.log('getLP', JSON.stringify(this.data.ltp));
            var layerProtocol;
            if (radioSignalIds !== undefined) {
            for (var layerProtocolKey in this.data.layerProtocols){
              if (this.data.layerProtocols[layerProtocolKey].getRadioSignalIds && 
                  radioSignalIds.toString() === this.data.layerProtocols[layerProtocolKey].getRadioSignalIds(this).toString()) {
                layerProtocol = this.data.layerProtocols[layerProtocolKey];
              }
            }}
            return layerProtocol;
          };
          this.setLP = function(onfPac) {
            this.data.layerProtocols[onfPac.data.layerProtocol] = onfPac;
          };
          this.getLpPac = function(lpRef) {
            return this.data.layerProtocols[lpRef];
          };
          this.getName = function() {
            return this.data.name;
          };
          this.getConnectionStatus = function() {
            return this.data.connectionStatus;
          };
          this.isConnected = function() {
            return this.data.name !== 'controller-config' && this.data.connectionStatus == 'connected';
          };
          this.setConnectionStatus = function(status) {
            this.data.connectionStatus = status;
          };
        };
        return ActualNetworkElement;
      });
      
      mwtnCommonsApp.register.factory('OnfNetworkElement', function() {
        // Classes
        // Class OnfNetworkElement
        var OnfNetworkElement = function(data) {
          this.data = data;
          this.getData = function() {
           return this.data;
          };
          this.getServerLtps = function(layerProtocolRef) {
            var result = [];
            var ltpList = this.data._ltpRefList.map(function(ltp){
              if (ltp._lpList[0].uuid === layerProtocolRef) {
                result =  ltp._serverLtpRefList;
              }
            });
            return result;
          };
          this.getLpByLtpRef = function(ltpRef) {
            var result;
            var ltpList = this.data._ltpRefList.map(function(ltp){
              if (ltp.uuid === ltpRef) {
                result =  ltp._lpList[0];
              }
            });
            return result;
          };
          this.getLtpsByLayer = function(layerProtocolName) {
            var ltpList = this.data._ltpRefList.map(function(ltp){
              if (ltp._lpList[0].layerProtocolName === layerProtocolName) {
                return ltp;
              }
            });
            return ltpList;
          };
          this.getLTPMwpsList = function() {
            return this.getLtpsByLayer('MWPS');
          };
          this.getLTPMwsList = function() {
            return this.getLtpsByLayer('MWS');
          };
        };
        return OnfNetworkElement;
      });

      mwtnCommonsApp.register.factory('MicrowavePhysicalSection', function() {
        // Classes
        // Class OnfNetworkElement
        var MicrowavePhysicalSection = function(data) {
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
        return MicrowavePhysicalSection;
      });

      mwtnCommonsApp.register.factory('MicrowaveSection', function() {
        // Classes
        // Class OnfNetworkElement
        var MicrowaveSection = function(data) {
          this.data = data;
          this.getData = function() {
            return this.data;
          };
          this.getId = function() {
             return this.data.layerProtocol;
          };
          this.getRadioSignalIds = function(actualNe) {
            this.data.parent = actualNe;
            var result = [];
            var onfNe = actualNe.data.onfNetworkElement;
            var lpId = this.getId();
            onfNe.getServerLtps(lpId).map(function(mwpsLtpRef){
              var lpRef = onfNe.getLpByLtpRef(mwpsLtpRef).uuid;
              var mwps = actualNe.getLpPac(lpRef);
              result.push(mwps.getRadioSignalId());
            });
            return result;
          };
          this.getTimeSlotCapacity = function() {
            return this.data.structureCapability.timeSlotCapacity;
          };
          this.getTotalNumberOfTimeSlots = function() {
            return this.data.structureCapability.totalNumberOfTimeSlots;
          };
          this.getNumberOfEffectiveTimeSlots = function() {
            var count = 0;
            this.data.structureStatus.timeSlotStatusList.map(function(ts){
              if (ts.operationalStatus === 'ENABLED') {
                count = count + 1;
              }
            });
            return count;
          };
          this.getConfiguredCapacity = function() {
            return this.getTotalNumberOfTimeSlots() * this.getTimeSlotCapacity();
          };
          this.getEffectiveCapacity = function() {
            return this.getNumberOfEffectiveTimeSlots() * this.getTimeSlotCapacity();
          };
          this.isActive = function() {
            if (this.data.parent === undefined) {
              return false;
            }
            var actualNe = this.data.parent;
            var result = true;
            var onfNe = actualNe.data.onfNetworkElement;
            var lpId = this.getId();
            onfNe.getServerLtps(lpId).map(function(mwpsLtpRef){
              var lpRef = onfNe.getLpByLtpRef(mwpsLtpRef).uuid;
              var mwps = actualNe.getLpPac(lpRef);
              result = result && mwps.isActive();
            });
            return result;
          };
        };
        return MicrowaveSection;
      });     
    });
