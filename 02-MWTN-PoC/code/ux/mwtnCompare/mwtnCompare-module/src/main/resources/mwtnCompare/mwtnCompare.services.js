/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

define(
    [ 'app/mwtnCompare/mwtnCompare.module' ],
    function(mwtnCompareApp) {

      mwtnCompareApp.register
          .factory(
              '$mwtnCompare',
              function($http, ENV) {
                var service = {
                  base : ENV.getBaseURL("MD_SAL") + '/restconf/'
                };

                var xml = '<module xmlns="urn:opendaylight:params:xml:ns:yang:controller:config"><type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">prefix:sal-netconf-connector</type><name>{0}</name><address xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{1}</address><port xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{2}</port><username xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{3}</username><password xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{4}</password><tcp-only xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">false</tcp-only><event-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf"><type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:netty">prefix:netty-event-executor</type><name>global-event-executor</name></event-executor><binding-registry xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf"><type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:binding">prefix:binding-broker-osgi-registry</type><name>binding-osgi-broker</name></binding-registry><dom-registry xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf"><type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:dom">prefix:dom-broker-osgi-registry</type><name>dom-broker</name></dom-registry><client-dispatcher xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf"><type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:config:netconf">prefix:netconf-client-dispatcher</type><name>global-netconf-dispatcher</name></client-dispatcher><processing-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf"><type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:threadpool">prefix:threadpool</type><name>global-netconf-processing-executor</name></processing-executor><keepalive-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf"><type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:threadpool">prefix:scheduled-threadpool</type><name>global-netconf-ssh-scheduled-executor</name></keepalive-executor></module>';

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

                service.getReferenceValues = function(callback) {
                  var url = 'src/app/mwtnCompare/data/reference-values.json';
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
                  var url = 'src/app/mwtnCompare/data/requiredNetworkElements.json';
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
                    return ['operational/network-topology:network-topology/topology/topology-netconf/node/',
                        neId,
                        '/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/',
                        neId].join('');
                  }

                };

                service.connect = function(ne, callback) {
                  console.info('Connect', ne.name, ne.ip, ne.port);
                  var url = [service.base,
                      'config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules'].join('');
                  var request = {
                    method : 'POST',
                    url : url,
                    data : xml.format(ne.name, ne.ip, ne.port, ne.userName,
                        ne.password),
                    headers : {
                      "Content-Type" : 'application/xml'
                    }
                  };
                  $http(request).then(function successCallback(response) {
                    console.log(neName, 'Mounting Point added');
                    callback('ok', response.data);
                  }, function errorCallback(response) {
                    console.error(JSON.stringify(response));
                    callback('nok');
                  });
                };

                service.disconnect = function(neName, callback) {
                  var url = [service.base,
                      'config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/',
                      neName].join('');
                  var request = {
                    method : 'DELETE',
                    url : url
                  };
                  $http(request).then(function successCallback(response) {
                    console.log(neName, 'Mounting Point deleted');
                    callback(response.data);
                  }, function errorCallback(response) {
                    console.error(JSON.stringify(response));
                    callback();
                  });
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
                  $http(request).then(function successCallback(response) {
                    console.log(neId, 'MW_Container_Pac');
                    callback(response.data);
                  }, function errorCallback(response) {
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
                  $http(request).then(function successCallback(response) {
                    console.log(neId, lpId, 'MW_AirInterface_Pac');
                    callback(response.data);
                  }, function errorCallback(response) {
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
                  $http(request).then(function successCallback(response) {
                    console.log(neId, lpId, 'MW_Structure_Pac');
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
                  $http(request).then(function successCallback(response) {
                    console.log(neId, lpId, 'MW_Container_Pac');
                    callback(response.data);
                  }, function errorCallback(response) {
                    console.error(JSON.stringify(response));
                    callback();
                  });
                };

                service.getDescriptions = function(callback) {
                  var url = 'src/app/mwtnCompare/data/descriptions.json';
                  var request = {
                    method : 'GET',
                    url : url
                  };
                  $http(request).then(function successCallback(response) {
                    callback(response.data.descriptions.description);
                  }, function errorCallback(response) {
                    console.error(JSON.stringify(response));
                    callback();
                  });
                };

                return service;
              });

    });
