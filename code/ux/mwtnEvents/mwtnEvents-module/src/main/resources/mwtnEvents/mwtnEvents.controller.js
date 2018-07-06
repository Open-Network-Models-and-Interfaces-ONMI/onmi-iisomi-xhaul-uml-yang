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
                  'uiGridConstants',
                  function($scope, $rootScope, $mwtnEvents, uiGridConstants) {

                    $rootScope.section_logo = 'src/app/mwtnEvents/images/mwtnEvents.png';

                    $scope.status = {alarms:true};
                    $scope.oneATime = true;
                    
                    $scope.gridOptionsAlarms = JSON.parse(JSON.stringify($mwtnEvents.gridOptions));
                    $scope.gridOptionsAlarms.columnDefs = [
                      // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
                      // { field: 'icon',  type: 'string', displayName: '',  headerCellClass: $scope.highlightFilteredHeader, width: 25, enableSorting: false, enableFiltering:false, cellTemplate: iconCell },
                      { field: 'timeStamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200,sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                      } },
                      { field: 'counter',  type: 'number', displayName: 'Counter',  headerCellClass: $scope.highlightFilteredHeader, width: 90 },
                      { field: 'nodeName',  type: 'string', displayName: 'NetworkElement',  headerCellClass: $scope.highlightFilteredHeader, width: 170 },
                      { field: 'objectId',  type: 'string', displayName: 'Object',  headerCellClass: $scope.highlightFilteredHeader, width: 400 },

                      { field: 'problem',  type: 'string', displayName: 'Alarm',  headerCellClass: $scope.highlightFilteredHeader, width : 140 },
                      { field: 'severity',  type: 'string', displayName: 'Severity',  headerCellClass: $scope.highlightFilteredHeader, width : 100 }
                    ];

                    $scope.gridOptionsAVC = JSON.parse(JSON.stringify($mwtnEvents.gridOptions));
                    $scope.gridOptionsAVC.columnDefs = [
                      // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
                      // { field: 'icon',  type: 'string', displayName: '',  headerCellClass: $scope.highlightFilteredHeader, width: 25, enableSorting: false, enableFiltering:false, cellTemplate: iconCell },
                      { field: 'timeStamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200,sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                      } },
                      { field: 'counter',  type: 'number', displayName: 'Counter',  headerCellClass: $scope.highlightFilteredHeader, width: 90 },
                      { field: 'nodeName',  type: 'string', displayName: 'NetworkElement',  headerCellClass: $scope.highlightFilteredHeader, width: 170 },
                      { field: 'objectId',  type: 'string', displayName: 'Object',  headerCellClass: $scope.highlightFilteredHeader, width: 400 },
                      { field: 'attributeName',  type: 'string', displayName: 'Attribute',  headerCellClass: $scope.highlightFilteredHeader, width : 140 },
                      { field: 'newValue',  type: 'string', displayName: 'New value',  headerCellClass: $scope.highlightFilteredHeader, width : 140 }
                    ];

                    $scope.gridOptionsObject = JSON.parse(JSON.stringify($mwtnEvents.gridOptions));
                    $scope.gridOptionsObject.columnDefs = [
                      // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
                      // { field: 'icon',  type: 'string', displayName: '',  headerCellClass: $scope.highlightFilteredHeader, width: 25, enableSorting: false, enableFiltering:false, cellTemplate: iconCell },
                      { field: 'timeStamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200,sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                      } },
                      { field: 'counter',  type: 'number', displayName: 'Counter',  headerCellClass: $scope.highlightFilteredHeader, width: 90 },
                      { field: 'nodeName',  type: 'string', displayName: 'NetworkElement',  headerCellClass: $scope.highlightFilteredHeader, width: 170 },
                      { field: 'objectId',  type: 'string', displayName: 'Object',  headerCellClass: $scope.highlightFilteredHeader, width: 400 },
                      { field: 'objectType',  type: 'string', displayName: 'Type',  headerCellClass: $scope.highlightFilteredHeader, width: 400 },
                      { field: 'action',  type: 'string', displayName: 'Action',  headerCellClass: $scope.highlightFilteredHeader, width: 100 }
                      
                    ];

                    var listenToNotifications = function() {
                      $mwtnEvents.getMwtnWebSocketUrl().then(function(success){
                        
                        try {
                          var notificationSocket = new WebSocket(success);

                          notificationSocket.onmessage = function(event) {
                            // we process our received event here
                            if (typeof event.data === 'string') {
                              // console.log("Client Received:\n" + event.data);
                              // console.log("---------------------------");
                              $mwtnEvents.formatData(event).then(function(formated) {
                                switch (formated.notifType) {
                                case 'ProblemNotification':
                                  $scope.gridOptionsAlarms.data.push(formated);
                                  break;
                                case 'AttributeValueChangedNotification':
                                  $scope.gridOptionsAVC.data.push(formated);
                                  break;                                
                                case 'ObjectCreationNotification':
                                  formated.action = 'created';
                                  if (formated.nodeName.contains('SDN-Controller')) {
                                    formated.objectType = 'NETCONF session';
                                  }
                                  $scope.gridOptionsObject.data.push(formated);
                                  break;
                                case 'ObjectDeletionNotification':
                                  formated.action = 'deleted';
                                  if (formated.nodeName.contains('SDN-Controller')) {
                                    formated.objectType = 'NETCONF session';
                                  }
                                  $scope.gridOptionsObject.data.push(formated);
                                  break;
                                default:
                                  console.error('Missing implementation for', formated.notifType);
                                }
                              }, function(error) {
                                // do nothing
                              });
                            }
                          };

                          notificationSocket.onerror = function(error) {
                            console.log("Socket error: " + error);
                          };

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
                          };

                          notificationSocket.onclose = function(event) {
                            console.log("Socket connection closed.");
                          };
                        } catch (e) {
                          console.error("Error when creating WebSocket.\n" + e);
                        }
                      }, function(error){
                        console.error("Error when creating WebSocket.\n" + error);
                      });
                    };
                    listenToNotifications();
                  } ]);

    });
