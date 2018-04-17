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

        $rootScope.section_logo = 'src/app/odlChat/odlChat.png';
     
        $scope.collection = [];
        $scope.chat = {
          nickname : 'anonymous',
          message : "Hey, what's up?!"
        };

        var listenToNotifications = function(socketLocation) {
          try {
            var notificatinSocket = new WebSocket(socketLocation);

            notificatinSocket.onmessage = function(event) {
              // we process our received event here
              $odlChat.getData(event, function(info, tweet) {
                $scope.collection.push(tweet);
                if ($scope.collection.length > 20) {
                  $scope.collection.shift();
                }
                
                $scope.chat.message = info;
              });
            };
            notificatinSocket.onerror = function(error) {
              console.log("Socket error: " + JSON.stringify(error));
            };
            notificatinSocket.onopen = function(event) {
              console.log("Socket connection opened.");
            };
            notificatinSocket.onclose = function(event) {
              console.log("Socket connection closed.");
            };
            // if there is a problem on socket creation we get
            // exception (i.e. when socket address is incorrect)
          } catch (e) {
            alert("Error when creating WebSocket" + e);
          }
        };

        $scope.send = function(chat) {
          $odlChat.send(chat, function(info) {
            console.log(info);
          });
        };

        var path = "/opendaylight-inventory:nodes/opendaylight-inventory:node[opendaylight-inventory:id='odlChat']";
        $odlChat.register(path, function(socketLocation) {
          listenToNotifications(socketLocation);
        });
      };

      odlChatApp.register.controller('odlChatCtrl', [ '$scope', '$rootScope',
          '$odlChat', main ]);

    });