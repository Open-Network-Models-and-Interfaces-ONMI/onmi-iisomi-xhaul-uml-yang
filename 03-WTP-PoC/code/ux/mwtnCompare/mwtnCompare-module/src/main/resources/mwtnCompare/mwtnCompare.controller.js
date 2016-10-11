/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCompare/mwtnCompare.module','app/mwtnCompare/mwtnCompare.services','app/mwtnCommons/mwtnCommons.services',
        'app/mwtnCommons/bower_components/angular-ui-grid/ui-grid.min'], function(mwtnCompareApp) {

  mwtnCompareApp.register.controller('mwtnCompareCtrl', ['$scope', '$rootScope', '$mwtnCompare', '$mwtnLog', 
                                                         function($scope, $rootScope, $mwtnCompare, $mwtnLog) {

    $rootScope['section_logo'] = 'src/app/mwtnCompare/images/mwtnCompare.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.status = {ne:false};
    $scope.spinner = {ne:false};
    $scope.separator = $mwtnCompare.separator; //'&nbsp;'
    $scope.connectionStatus = 'disconnected';
    
    var initNodeList = function(nodes){
      $scope.neSelection = [];
      if (nodes.length > 0) {
        nodes.map(function(ne) {
          if (ne._source.onfAirIinterfaceRevision) {
            $scope.neSelection.push({id:ne._id, revision:ne._source.onfAirIinterfaceRevision});
            
          }
        });
        $scope.neSelection.sort(function(a, b){
          if(a.id < b.id) return -1;
          if(a.id > b.id) return 1;
          return 0;
        });
        
        // select one of the nodes
        var select = parseInt(Math.random()*$scope.neSelection.length);
        $scope.selection = $scope.neSelection[select].id;
      }
    };
    $scope.requiredNetworkElements = [];
    $mwtnCompare.getRequiredNetworkElements(true).then(function(nodes){
      $scope.requiredNetworkElements = nodes;
      initNodeList(nodes);
    }, function(error){
      $scope.neSelection = [];
      $scope.requiredNetworkElements = [];
    });

    $scope.collapseAll = function() {
      // close all groups
      Object.keys($scope.status).map(function(group){
        $scope.status[group] = false;
      });
      Object.keys($scope.spinner).map(function(group){
        $scope.spinner[group] = false;
      });
    };


  // events
    $scope.$watch('selection', function(neId, oldValue) {
      if (neId && neId !== '' && neId !== oldValue) {
        $scope.connectionStatus = 'disconnected';
        $mwtnCompare.getConnectionStatus(neId).then(function(connectionStatus){
          $scope.connectionStatus = connectionStatus;
        },function(error){
          $scope.connectionStatus = 'disconnected';
        });
        $scope.requiredNetworkElements.map(function(rne){
          if (rne._id === neId) {
            $scope.requiredNetworkElement = rne._source;
          }
        });
      }
    });

    $scope.$watch('status', function(status, oldValue) {
      Object.keys(status).map(function(key){
        if ($scope.selection && status[key] && status[key] !== oldValue[key]) {
          
          $scope.spinner[key] = true;
          
          var info = key.split($scope.separator);
          var spec = {
            nodeId: $scope.selection,
            revision: $scope.requiredNetworkElement.onfAirIinterfaceRevision,
            pacId: info[0],
            layerProtocolId: info[1],
            partId: info[2]
          };
          $mwtnCompare.getPacParts(spec).then(function(success){
            updatePart(spec, success);
            $scope.spinner[key] = false;
          }, function(error){
            updatePart(spec, error);
            $scope.spinner[key] = false;
          });
        }
      });   
    }, true);

  
  }]);


});
