/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnConnect/mwtnConnect.module','app/mwtnConnect/mwtnConnect.services','app/mwtnCommons/mwtnCommons.services', 'app/mwtnCommons/bower_components/angular-ui-grid/ui-grid.min'], function(mwtnConnectApp) {

  mwtnConnectApp.register.controller('mwtnConnectCtrl', ['$scope', '$rootScope', '$http', '$mwtnConnect', '$mwtnCommons', '$mwtnLog', 'uiGridConstants', 'NetConfServer', function($scope, $rootScope, $http, $mwtnConnect, $mwtnCommons, $mwtnLog, uiGridConstants, NetConfServer) {

    $mwtnLog.info('mwtnConnectCtrl started!');
    $rootScope['section_logo'] = 'src/app/mwtnConnect/images/mwtnConnect.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
      if( col.filters[0].term ){
        return 'header-filtered';
      } else {
        return '';
      }
    };
   
    var actionCellTemplate = [
      '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >',
      '<button class="btn btn-primary" ng-click="grid.appScope.connect(row.entity)">Connect</button>',
      '<button class="btn btn-default" ng-click="grid.appScope.disconnect(row.entity)">Disconnect</button>',
      '<button class="btn btn-primary" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button>',
      '<button class="btn btn-default" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-times mwtnError"></i></button>',
      '</a>' ].join('<span>&nbsp;</span>');
    $scope.gridOptions = $mwtnCommons.gridOptions;
    $scope.gridOptions.rowHeight  = 44;
    $scope.gridOptions.columnDefs = [
       { field: 'id', type: 'number', displayName: 'Id',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
       { field: 'name', type: 'string', displayName: 'Name',  headerCellClass: $scope.highlightFilteredHeader, width : 150 },
       { field: 'ipAddress',  type: 'number', displayName: 'IP address',  headerCellClass: $scope.highlightFilteredHeader, width : 100, cellClass: 'number' },
       { field: 'netconfPort',  type: 'number', displayName: 'NetConf port',  headerCellClass: $scope.highlightFilteredHeader, width : 120, cellClass: 'number' },
       { field: 'username', type: 'string', displayName: 'User name',  headerCellClass: $scope.highlightFilteredHeader, width : 100 },
       { field: 'password', type: 'string', displayName: 'Password',  headerCellClass: $scope.highlightFilteredHeader, width : 100 },
       { field: 'radioSignalIds', type: 'string', displayName: 'Radio signal ids',  headerCellClass: $scope.highlightFilteredHeader, width : 150 },
       { field: 'connectionStatus', type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width : 160 },
       {
         name : 'actions',
         enableSorting : false,
         enableFiltering: false,
         cellTemplate: actionCellTemplate,
         width : 300,
         pinnedRight : true
       }
     ];
    
    $scope.addNetconfServer = function() {
      var n = $scope.gridOptions.data.length + 1;
      $scope.gridOptions.data.push({
                  'id': n,
                  'name': 'newNE-' + n,
                  'ipAddress': '127.0.0.1',
                  'netconfPort': 830,
                  'username': 'compila',
                  'password': 'compila+',
                  'radioSignalIds': ['12', '13'],
                  'connectionStatus': 'disconnected'
                });
    };
    
    $scope.connect = function(row) {
      console.info(JSON.stringify(row));
    };
    $scope.disconnect = function(row) {
      console.info(JSON.stringify(row));
    };
    $scope.edit = function(row) {
      console.info(JSON.stringify(row));
    };
    $scope.delete = function(row) {
      console.info(JSON.stringify(row));
    };

    // functions
    $mwtnCommons.getMountedNetConfServers(function(netConfServers) {
      netConfServers.topology.map(function(topology) {
        if (topology['topology-id'] === 'topology-netconf') {
          var aneHash = topology.node.map(function(ne) {
            return ne['node-id'];
          });
          
          console.log(aneHash);

          $scope.actualNetworkElements = topology.node;
        }
      });
    });
    
    
  }]);
});
