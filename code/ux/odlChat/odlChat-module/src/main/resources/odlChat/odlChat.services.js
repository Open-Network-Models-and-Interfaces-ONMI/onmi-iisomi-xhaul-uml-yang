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
    };
    

    service.getData = function(event, callback) {

      var request = {
        method : 'GET',
        url : [ service.base,
            'config/opendaylight-inventory:nodes/node/odlChat/' ].join('')
      };
      $http(request).then(function successCallback(response) {
        tweet = {
          nickname : response.data.node[0]['flow-node-inventory:manufacturer'],
          message : response.data.node[0]['flow-node-inventory:description'],
          time : JSON.stringify(new Date()).split('T')[1].substring(0, 5)
        };
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
            createStream(response.data.output['stream-name'], function(
                socketLocation) {
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
            'config/opendaylight-inventory:nodes/node/odlChat' ].join(''),
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
        callback('send successfully');
      }, function errorCallback(response) {
        console.error(JSON.stringify(response));
        callback('ERROR while sending ;(');
      });
    };
    return service;
  });
});