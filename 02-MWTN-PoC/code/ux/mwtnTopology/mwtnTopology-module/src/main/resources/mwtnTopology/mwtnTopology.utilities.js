/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

define(
    [ 'app/mwtnTopology/mwtnTopology.module' ],
    function(mwtnTopologyApp) {

      mwtnTopologyApp.register.factory('$mwtnUtilities', function($http, ENV) {
                var service = {
                  base : ENV.getBaseURL("MD_SAL") + "/restconf/"
                };

                service.getReferenceValues = function(callback) {
                  var url = 'src/app/mwtnTopology/data/reference-values.json';
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

                service.getRequiredNetworkElements = function(callback) {
                  var url = 'src/app/mwtnTopology/data/requiredNetworkElements.json';
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
                service.getActualNetworkElements = function(callback) {
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

                service.getActualNetworkElement = function(neId, callback) {

                  var url = [service.base,
                      service.url.actualNetworkElement(neId)].join('');
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

                service.getActualMW_AirInterface_Pac = function(neId, lpId, callback) {
// console.log('234', neId, lpId);
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

      mwtnTopologyApp.register.factory('ActualNetworkElement', function($http, ENV) {

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
      
      mwtnTopologyApp.register.factory('OnfNetworkElement', function() {
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

      mwtnTopologyApp.register.factory('MicrowavePhysicalSection', function() {
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

      mwtnTopologyApp.register.factory('MicrowaveSection', function() {
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
