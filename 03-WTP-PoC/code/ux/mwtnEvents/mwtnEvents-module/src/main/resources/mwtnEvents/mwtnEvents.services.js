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
              function($http, ENV) {

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

                service.getMmwtnWebSocketUrl = function() {
                  var user = 'admin'; // TODO avoid hardcoded user/pw
                  var pw = 'admin';
                  var url = ENV.getBaseURL('MD_SAL'); // http://192.168.2.114:8181/
                  url = url.replace('http://', 'ws://' + user + ':' + pw + '@');
                  url = url.replace(':8181', ':8085/websocket'); // 'ws://admin:admin@localhost:8085/websocket'
                  console.info(url);
                  return url;
                };

                service.getData = function(event, callback) {

                  var request = {
                    method : 'GET',
                    url : [ service.base,
                        'config/opendaylight-inventory:nodes/' ].join('')
                  };
                  $http(request)
                      .then(
                          function successCallback(response) {

                            // this callback will be called asynchronously
                            // when the response is available
                            if (event.data
                                .indexOf("AttributeValueChangedNotification") != -1) {
                              var x2js = new X2JS();
                              var jsonObj = x2js.xml_str2json(event.data);
                              var objId = jsonObj.AttributeValueChangedNotification.objectId;
                              var attrName = jsonObj.AttributeValueChangedNotification.attributeName;
                              var modValue = jsonObj.AttributeValueChangedNotification.newValue;
                              var notifMsg = "Object Modified: " + objId
                                  + " --- For Attribute: " + attrName
                                  + " --- With New Value As: " + modValue;

                              tweet = {
                                notifType : "AttributeValueChangedNotification",
                                nodeName : jsonObj.AttributeValueChangedNotification.nodeName,
                                message : event.data,
                                msgStr : notifMsg,
                                time : JSON.stringify(new Date()).split('T')[1]
                                    .substring(0, 5)
                              };
                            }
                            ;

                            if (event.data.indexOf("ProblemNotification") != -1) {
                              var x2js = new X2JS();
                              var jsonObj = x2js.xml_str2json(event.data);
                              var objId = jsonObj.ProblemNotification.objectId;
                              var problem = jsonObj.ProblemNotification.problem;
                              var severity = jsonObj.ProblemNotification.severity;
                              var notifMsg = "Object Affected: " + objId
                                  + " --- Having Problem: " + problem
                                  + " --- With Severity As: " + severity;

                              tweet = {
                                notifType : "ProblemNotification",
                                nodeName : jsonObj.ProblemNotification.nodeName,
                                message : event.data,
                                msgStr : notifMsg,
                                time : JSON.stringify(new Date()).split('T')[1]
                                    .substring(0, 5)
                              };
                            }
                            ;

                            if (event.data
                                .indexOf("ObjectCreationNotification") != -1) {
                              var x2js = new X2JS();
                              var jsonObj = x2js.xml_str2json(event.data);
                              var objId = jsonObj.ObjectCreationNotification.objectId;
                              var notifMsg = "Object Created: " + objId;

                              tweet = {
                                notifType : "ObjectCreationNotification",
                                nodeName : jsonObj.ObjectCreationNotification.nodeName,
                                message : event.data,
                                msgStr : notifMsg,
                                time : JSON.stringify(new Date()).split('T')[1]
                                    .substring(0, 5)
                              };
                            }
                            ;

                            if (event.data
                                .indexOf("ObjectDeletionNotification") != -1) {
                              var x2js = new X2JS();
                              var jsonObj = x2js.xml_str2json(event.data);
                              var objId = jsonObj.ObjectDeletionNotification.objectId;
                              var notifMsg = "Object Deletion: " + objId;

                              tweet = {
                                notifType : "ObjectDeletionNotification",
                                nodeName : jsonObj.ObjectDeletionNotification.nodeName,
                                message : event.data,
                                msgStr : notifMsg,
                                time : JSON.stringify(new Date()).split('T')[1]
                                    .substring(0, 5)
                              };
                            }
                            ;

                            callback('', tweet);
                          }, function errorCallback(response) {
                            console.error(JSON.stringify(response));
                            callback('ERROR while sending ;(');
                          });

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
