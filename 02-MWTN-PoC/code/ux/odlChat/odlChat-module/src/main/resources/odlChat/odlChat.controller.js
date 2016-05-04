/*
 * Copyright (c) 2016 higshtreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(
    [ 'app/odlChat/odlChat.module', 'app/odlChat/odlChat.services' ],
    function(odlChatApp) {

      odlChatApp.register
          .controller(
              'odlChatCtrl',
              [
                  '$scope',
                  '$rootScope',
                  '$odlChat',
                  function($scope, $rootScope, $odlChat) {

                    $rootScope['section_logo'] = 'src/app/odlChat/mwEvent.png'; 

                    $scope.collection = [];
                    $scope.chat = {
                      nickname : 'anonymous',
                      message : "Hey, what's up?!"
                    };

                    var listenToNotifications = function(socketLocation) {
                      try {
                        var url = $odlChat.getMwtnWebSocketUrl();
                        var notificationSocket  = new WebSocket(url);

                        notificationSocket.onmessage = function(event) {
                          // we process our received event here
						 if (typeof event.data === 'string') {
						  console.log("Client Received:\n" + event.data);
						  console.log("---------------------------");
			                          $odlChat.getData(event, function(info, tweet) {
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
						'scopes' : [
						    "ObjectCreationNotification",
						    "ObjectDeletionNotification",
						    "AttributeValueChangedNotification",
						    "ProblemNotification"
						]
					  };
				      notificationSocket.send(JSON.stringify(data));
				      }
			        }

	    			  subscribe();

                    }
                        
                    notificationSocket.onclose = function(event) {
                          console.log("Socket connection closed.");
                        }
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
                    }

                    var path = "/opendaylight-inventory:nodes/opendaylight-inventory:node[opendaylight-inventory:id='odlChat']";
                    $odlChat.register(path, function(socketLocation) {
                      listenToNotifications(socketLocation);
                    });
                  } ]);

    });
