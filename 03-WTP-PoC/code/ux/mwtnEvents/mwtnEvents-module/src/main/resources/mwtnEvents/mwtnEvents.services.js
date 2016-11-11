/*
 * Copyright (c) 2016 Tech Mahindra Ltd. and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(
    [ 'app/mwtnEvents/mwtnEvents.module' ],
    function(mwtnEventsApp) {

      mwtnEventsApp.register
          .factory(
              '$mwtnEvents',
              function($http, ENV, $q, $mwtnCommons) {

                var createStream = function(streamName, callback) {
                  var request = {
                    method : 'GET',
                    url : [ service.base, 'streams/stream/', streamName ]
                        .join('')
                  };
                  $http(request).then(function successCallback(response) {
                    console.log(response.headers('Location'));
                    callback(response.headers('Location'))
                  }, function errorCallback(response) {
                    console.error(JSON.stringify(response));
                    callback();
                  });
                };

                var service = {
                  base : ENV.getBaseURL("MD_SAL") + "/restconf/",
                };

                service.gridOptions = $mwtnCommons.gridOptions;

                service.getMmwtnWebSocketUrl = function() {
                  var user = 'admin'; // TODO avoid hardcoded user/pw
                  var pw = 'admin';
                  var url = ENV.getBaseURL('MD_SAL'); // http://192.168.2.114:8181/
                  url = url.replace('http://', 'ws://' + user + ':' + pw + '@');
                  url = url.replace(':8181', ':8085/websocket'); // 'ws://admin:admin@localhost:8085/websocket'
                  console.info(url);
                  return url;
                };

                var formatTimeStamp = function(t) {
                  // t: time in ONF format, e.g. 20161020081633.7Z, 20161025235946.0+0000
                  if (t.length !== '20161020081633.7Z'.length || t.length !== '20161025221822.0+0000') {
                    if (t.endsWith('Z') || t.endsWith('+0000')) {
                      if (!t.contains('-')) {
                        return [[t.slice(0,4), t.slice(4,6), t.slice(6, 8)].join('-'), 
                                [t.slice(8, 10), t.slice(10, 12), t.slice(12, 16)].join(':')].join(' ') + ' UTC';
                      }
                    }
                  }
                  console.info('check', t);
                  return new Date().toISOString().slice(0,21).replace('T', ' ') + ' UTC';
                  // return t;
                };
                
                service.formatData = function(event) {
                  var deferred = $q.defer();
                  
                  var x2js = new X2JS();
                  var jsonObj = x2js.xml_str2json(event.data);
                  // console.log('a', $mwtnCommons.getType(jsonObj), JSON.stringify(jsonObj));
                  if (jsonObj === null || $mwtnCommons.getType(jsonObj) !== 'object') {
                    deferred.reject('ignore');
                  } else {
                    notifType = Object.keys(jsonObj)[0];
                    var formated = jsonObj[notifType];
                    formated.timeStamp = formatTimeStamp(formated.timeStamp);
                    formated.notifType = notifType;
                    formated.myMessage = 'someMessage';
                    formated.time = new Date().toISOString();
                    deferred.resolve(formated);
                  }
                  
                  return deferred.promise;
                };
                
                service.register = function(path, callback) {
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
                        createStream(response.data.output['stream-name'],
                            function(socketLocation) {
                              callback(socketLocation);
                            });
                      }, function errorCallback(response) {
                        console.error(JSON.stringify(response));
                      });
                };

                service.send = function(chat, callback) {
                  var request = {
                    method : 'PUT',
                    url : [ service.base,
                        'config/opendaylight-inventory:nodes/node/odlChat' ]
                        .join(''),
                    data : {
                      "node" : [ {
                        "id" : "odlChat",
                        "flow-node-inventory:manufacturer" : chat.nickname,
                        "flow-node-inventory:software" : "",
                        "flow-node-inventory:serial-number" : "",
                        "flow-node-inventory:hardware" : "",
                        "flow-node-inventory:description" : chat.message
                      } ]
                    }
                  };
                  $http(request).then(function successCallback(response) {
                    callback('');

                  }, function errorCallback(response) {
                    console.error(response);
                    callback('ERROR while sending ;(');
                  });
                };
                return service;
              });
    });
