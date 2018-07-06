/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([ 'app/mwtnCommons/mwtnCommons.module'], function(mwtnCommonsApp) {
  mwtnCommonsApp.register.directive('alarmStatus', function() {
    return {
      restrict : 'E',
      templateUrl : 'src/app/mwtnFault/templates/alarmStatus.tpl.html',
      controller :  ['$scope', '$mwtnCommons', '$mwtnDatabase', '$timeout', function($scope, $mwtnCommons, $mwtnDatabase, $timeout){
        
        $scope.link = '#/pnfFault/';
          
        $scope.nodeCount = 0;
          
        $scope.alarmStatus = {
            Critical:0,
            Major:0,
            Minor:0,
            Warning:0,
        };
        
        $scope.getAlarmStatusSum = function(){
          var sum = 0;
          Object.keys($scope.alarmStatus).map(function(severity) {
            sum = sum + $scope.alarmStatus[severity];
          });
          return sum;
        };

        // Update: request the number of alarms in current alarm list per severity
        var update = function() {
          $mwtnCommons.getMountPoints().then(function(mountpoints) {
            $scope.nodeCount = mountpoints.filter(function(mountpoint) {
              return mountpoint['netconf-node-topology:connection-status'] === 'connected';
            }).length;
          });
          var functionId = 'sdnevents';
          var docType = 'faultcurrent';
          var aggregations = {
            "size":0,
            "aggregations": {
              "severity": {
                "terms": {
                  "field": "faultCurrent.severity"
                }
              }
            }
          };
          $mwtnDatabase.getAggregations(functionId, docType, aggregations).then(function (success) {
            var found = success.data.aggregations['severity'].buckets.map(function(bucket){
              $scope.alarmStatus[bucket.key] = bucket.doc_count;
              return bucket.key;
            });
            Object.keys($scope.alarmStatus).map(function(key){
              if (!found.contains(key)) {
                $scope.alarmStatus[key] = 0;
              }
            });
          }, function (error) {
            console.error(error);
            $scope.alarmStatus = {
                Critical:0,
                Major:0,
                Minor:0,
                Warning:0,
            };
          });


          // Object.keys($scope.alarmStatus).map(function(severity) {
          //   // usage of the ElasticSearch Count API
          //   $mwtnDatabase.getBase('sdnevents').then(function(success) {
          //     var databaseRequest = {
          //       base : success.base,
          //       method : 'POST',
          //       command: '_count',
          //       index: success.index,
          //       docType: 'faultcurrent',
          //       query: {
          //         match: {
          //           'faultCurrent.severity': severity
          //         }
          //       }
          //     };
          //     $mwtnDatabase.genericRequest(databaseRequest).then(function(success){
          //       $scope.alarmStatus[severity] = success.data.count;
          //     }, function(error){
          //       console.error('severity', severity, error);
          //     });
          //   }, function(error) {
          //     console.error('severity', severity, error);
          //   });
          // });
        };
        update();
        
        var listenToNotifications = function() {
          $mwtnCommons.getMwtnWebSocketUrl().then(function(success){
            try {
              var notificationSocket = new WebSocket(success);

              notificationSocket.onmessage = function(event) {
                // we process our received event here
                if (typeof event.data === 'string') {
                  // console.log('Client Received:\n', event.data);
                  $mwtnCommons.formatData(event).then(function(formated) {
                    switch (formated.notifType) {
                    case 'ProblemNotification':
                      $timeout(function(){update();}, 500);
                      break;
                    case 'AttributeValueChangedNotification':
                    case 'ObjectCreationNotification':
                    case 'ObjectDeletionNotification':
                      // ignore
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
                function subscribe() {
                  if (notificationSocket.readyState === notificationSocket.OPEN) {
                    var data = {
                      'data' : 'scopes',
                      'scopes' : [ "ProblemNotification" ]
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
      }]
    };
  });

});