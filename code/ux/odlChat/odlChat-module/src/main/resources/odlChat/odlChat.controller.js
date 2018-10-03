/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(
    [ 'app/odlChat/odlChat.module', 'app/odlChat/odlChat.services' ],
    function(odlChatApp) {

      var main = function($scope, $rootScope, $odlChat) {

        $rootScope.section_logo = 'src/app/odlChat/logo_chat.gif';
     
        $scope.collection = [];
        $scope.chat = {
          nickname : localStorage.odlUser,
          message : "Hey, what's up?!"
        };

        var listenToNotifications = function(socketLocation) {
          try {
            var notificatinSocket = new WebSocket(socketLocation);

            notificatinSocket.onmessage = function(event) {
              // we process our received event here
              $odlChat.getData().then(response => {
                tweet = JSON.parse(response.data.node[0]['netconf-node-inventory:current-capability'][0]) || {};
                tweet.time = JSON.stringify(new Date()).split('T')[1].substring(0, 5);
                $scope.collection.push(tweet);
                if ($scope.collection.length > 20) {
                  $scope.collection.shift();
                }
              }, response => {
                console.error(JSON.stringify(response));
                $scope.chat.message = "Error while reading message ;(";
              });
            };
            notificatinSocket.onerror = function(error) {
              console.info("Socket error: " + JSON.stringify(error));
            };
            notificatinSocket.onopen = function(event) {
              console.info("Socket connection opened.");
            };
            notificatinSocket.onclose = function(event) {
              console.info("Socket connection closed.");
            };
            // if there is a problem on socket creation we get
            // exception (i.e. when socket address is incorrect)
          } catch (e) {
            alert("Error when creating WebSocket" + e);
          }

          $odlChat.send({
            nickname : localStorage.odlUser,
            message : "... has entered the ODL chat."
          }, function(info) {
            console.info(info);
          });
        };

        $scope.send = function(chat) {
          $odlChat.send(chat, function(info) {
            console.info(info);
          });
        };

        var path = "/opendaylight-inventory:nodes/opendaylight-inventory:node[opendaylight-inventory:id='" + $odlChat.nodeId + "']";
        $odlChat.register(path, function(socketLocation) {
          listenToNotifications(socketLocation);
        });

      };

      odlChatApp.register.controller('odlChatCtrl', [ '$scope', '$rootScope',
          '$odlChat', main ]);

    });