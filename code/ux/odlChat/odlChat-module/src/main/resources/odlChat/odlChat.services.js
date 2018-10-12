/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCommons/mwtnCommons.module', 'app/odlChat/odlChat.module'],function(odlChatApp) {

  odlChatApp.register.factory('$odlChat', function($http, $mwtnCommons) {

    var createStream = function(streamName, callback) {
      var request = {
        method : 'GET',
        url : [ service.base, 'streams/stream/', streamName ].join('')
      };
      $http(request).then(function successCallback(response) {
        console.log(response.headers('Location'));
        callback(response.headers('Location'));
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        callback();
      });
    };

    var service = {
      base : window.location.origin + "/restconf/",
      nodeId: 'ODL-Chat-1a'
    };
    

    service.getData = function() {

      var request = {
        method : 'GET',
        url : [ service.base,
            'config/opendaylight-inventory:nodes/node/', service.nodeId, '/' ].join('')
      };
      return $http(request);

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
            createStream(response.data.output['stream-name'], function(
                socketLocation) {
              callback(socketLocation);
            });
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
          });
    };

    service.send = function(chat, callback) {

      var tweet = {
        nickname: chat.nickname,
        message: chat.message
      };
      var request = {      
        method : 'PUT',
        url : [ service.base,
            'config/opendaylight-inventory:nodes/node/', service.nodeId ].join(''),
        data : {
          "opendaylight-inventory:node": [
            {
              "opendaylight-inventory:netconf-node-inventory:connected": "true",
              "opendaylight-inventory:netconf-node-inventory:pass-through": {},
              "opendaylight-inventory:netconf-node-inventory:current-capability": [JSON.stringify(tweet)],
              "opendaylight-inventory:node-connector": [],
              "opendaylight-inventory:id": service.nodeId,
              "opendaylight-inventory:netconf-node-inventory:initial-capability": []
            }
          ]
        }
      };
      $http(request).then(function successCallback(response) {
        callback('send successfully');
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        callback('ERROR while sending ;(');
      });
    };
    return service;
  });
});