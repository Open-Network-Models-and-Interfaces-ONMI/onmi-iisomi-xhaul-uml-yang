/*
 * Copyright (c) 2016 Tech Mahindra Ltd. and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(
    [ 'app/mwtnEvents/mwtnEvents.module', 'app/mwtnEvents/mwtnEvents.services', 'app/mwtnCommons/mwtnCommons.services'],
    function(mwtnEventsApp) {

      mwtnEventsApp.register
          .controller(
              'mwtnEventsCtrl',
              [
                  '$scope',
                  '$rootScope',
                  '$mwtnEvents',
                  '$mwtnCommons',
                  function($scope, $rootScope, $mwtnEvents, $mwtnCommons, $mwtnLog) {

                    $rootScope['section_logo'] = 'src/app/mwtnEvents/images/mwtnEvents.png';

                    $scope.collection = [];

                    var listenToNotifications = function(socketLocation) {
                      try {
                        var url = $mwtnEvents.getMmwtnWebSocketUrl();
                        var notificationSocket = new WebSocket(url);

                        notificationSocket.onmessage = function(event) {
                          // we process our received event here
                          if (typeof event.data === 'string') {
                            console.log("Client Received:\n" + event.data);
                            console.log("---------------------------");
                            $mwtnEvents.getData(event, function(info, tweet) {
                              $scope.collection.push(tweet);
                              if ($scope.collection.length > 20) {
                                $scope.collection.shift();
                              }
                              ;
                            });
                          }
                        }

                        notificationSocket.onerror = function(error) {
                          console.log("Socket error: " + error);
                        }

                        notificationSocket.onopen = function(event) {
                          console.log("Socket connection opened.");
                          console.log("---------------------------");

                          function subscribe() {
                            if (notificationSocket.readyState === notificationSocket.OPEN) {
                              var data = {
                                'data' : 'scopes',
                                'scopes' : [ "ObjectCreationNotification",
                                    "ObjectDeletionNotification",
                                    "AttributeValueChangedNotification",
                                    "ProblemNotification" ]
                              };
                              notificationSocket.send(JSON.stringify(data));
                            }
                          }
                          subscribe();
                        }

                        notificationSocket.onclose = function(event) {
                          console.log("Socket connection closed.");
                        }
                      } catch (e) {
                        $scope.error("Error when creating WebSocket.\n" + e);
                      }
                    };

                    var path = "/opendaylight-inventory:nodes/opendaylight-inventory:node[opendaylight-inventory:id='mwtnEvents']";
                    $mwtnEvents.register(path, function(socketLocation) {
                      listenToNotifications(socketLocation);
                    });
                  } ]);

    });
