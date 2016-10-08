/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnConnect/mwtnConnect.module',
        'app/mwtnConnect/mwtnConnect.services',
        'app/mwtnCommons/mwtnCommons.module'], 
        function(mwtnConnectApp) {

  mwtnConnectApp.register.controller('mwtnConnectCtrl', ['$scope', '$rootScope', '$q', 'uiGridConstants', '$uibModal', '$mwtnConnect', '$mwtnCommons', '$mwtnLog', 'NetConfServer', 
                                                         function($scope, $rootScope, $q, uiGridConstants, $uibModal, $mwtnConnect, $mwtnCommons, $mwtnLog, NetConfServer) {

    var COMPONENT = 'mwtnConnectCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnConnectCtrl started!'});

    $rootScope['section_logo'] = 'src/app/mwtnConnect/images/mwtnConnect.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
      if( col.filters[0].term ){
        return 'header-filtered';
      } else {
        return '';
      }
    };
    
    $scope.oneAtATime = true;
    $scope.status = {requiredNes: true};
        
    var requiredNesActionCellTemplate = [
      '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >',
      '<button class="btn btn-primary" ng-click="grid.appScope.connect(row.entity)">Connect</button>',
      '<button class="btn btn-default" ng-click="grid.appScope.disconnect(row.entity)">Disconnect</button>',
      '<button class="btn btn-primary" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button>',
      '<button class="btn btn-default" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-times mwtnError"></i></button>',
      '</a>' ].join('<span>&nbsp;</span>');
    $scope.requiredNesGridOptions = JSON.parse(JSON.stringify($mwtnCommons.gridOptions));
    $scope.requiredNesGridOptions.rowHeight  = 44;
    $scope.requiredNesGridOptions.columnDefs = [
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
         cellTemplate: requiredNesActionCellTemplate,
         width : 300,
         pinnedRight : true
       }
     ];
    
    var unknownNesActionCellTemplate = [
     '<a class="vCenter" ng-class="{attention: grid.appScope.hover, hidden: onfAirIinterfaceRevision}" >',
     '<button class="btn btn-default" ng-show="row.entity[\'node-id\'] !== \'controller-config\'" ng-click="grid.appScope.unmount(row.entity)">Unmount</button>',
     '<button class="btn btn-primary" ng-show="row.entity[\'node-id\'] !== \'controller-config\' && row.entity.onfAirIinterfaceRevision" ng-click="grid.appScope.addToRequiredNetworkElements(row.entity)">Make known ...</button>',
     '</a>' ].join('<span>&nbsp;</span>');
    $scope.unknownNesGridOptions = JSON.parse(JSON.stringify($mwtnCommons.gridOptions));
    $scope.unknownNesGridOptions.rowHeight  = 44;
    $scope.unknownNesGridOptions.columnDefs = [
      { field: 'node-id', type: 'string', displayName: 'Name',  headerCellClass: $scope.highlightFilteredHeader, width : 150, sort: {
        direction: uiGridConstants.ASC,
        priority: 0
       }},
      { field: 'netconf-node-topology:host',  type: 'number', displayName: 'IP address',  headerCellClass: $scope.highlightFilteredHeader, width : 150, cellClass: 'number' },
      { field: 'netconf-node-topology:port',  type: 'number', displayName: 'NetConf port',  headerCellClass: $scope.highlightFilteredHeader, width : 120, cellClass: 'number' },
      { field: 'onfCoreModelRevision', type: 'string', displayName: 'CoreModel revision',  headerCellClass: $scope.highlightFilteredHeader, width : 160,  cellClass: 'number' },
      { field: 'onfAirIinterfaceRevision', type: 'string', displayName: 'AirInterface revision',  headerCellClass: $scope.highlightFilteredHeader, width : 160,  cellClass: 'number' },
      { field: 'netconf-node-topology:connection-status', type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width : 160 },
      {
        name : 'actions',
        enableSorting : false,
        enableFiltering: false,
        cellTemplate: unknownNesActionCellTemplate,
        width : 280,
        pinnedRight : true
      }
    ];
    
    var getActualNetworkElements = function() {
      // aneHash = [];
      if ($scope.requiredNesGridOptions.data) {
        $scope.requiredNesGridOptions.data.map(function(ne) {
          ne.connectionStatus = 'disconnected';
        });
      }
      $mwtnConnect.getActualNetworkElements().then(function(networkElements) {
        $scope.unknownNesGridOptions.data = [];
        networkElements.map(function(ne) {
            if (ne['netconf-node-topology:available-capabilities'] && ne['netconf-node-topology:available-capabilities']['available-capability']) {
              ne['netconf-node-topology:available-capabilities']['available-capability'].map(function(cap){
                if (cap.contains('CoreModel-CoreNetworkModule-ObjectClasses')) {
                  ne.onfCoreModelRevision = cap.split('?revision=')[1].substring(0,10);
                } else if (cap.contains('MicrowaveModel-ObjectClasses')) {
                  ne.onfAirIinterfaceRevision = cap.split('?revision=')[1].substring(0,10);
                }
              });
            }
        });
        $scope.unknownNesGridOptions.data = networkElements;
      }, function(error){
        $mwtnLog.info({component: COMPONENT, message: JSON.stringify(error)});
      });
    }; 
    
    $scope.netconfServer = {};
    $scope.addToRequiredNetworkElements = function (netconfServer) {
      
      // set default user/pw according to DVM
      netconfServer.username = 'compila';
      netconfServer.password = 'compila+';

      $scope.netconfServer = netconfServer;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'src/app/mwtnConnect/templates/addToRequired.tpl.html',
        controller: 'AddToRequiredMessageCtrl',
        size: 'lg',
        resolve: {
          netconfServer: function () {
            return $scope.netconfServer;
          }
        }
      });

      modalInstance.result.then(function (netconfServer) {
        $mwtnConnect.addRequiredNetworkElement(netconfServer).then(function(success){
          $mwtnLog.info({component: COMPONENT, message: 'Adding to database: ' + JSON.stringify(netconfServer)});
        }, function(error){
          $mwtnLog.error({component: COMPONENT, message: JSON.stringify(error)});
        });
      }, function () {
        $mwtnLog.info({component: COMPONENT, message: 'Creation of new planned NetworkElement dismissed!'});
      });
    };
    
    $scope.mount = function() {
      $scope.mountError = undefined;
      $scope.mountSuccess = undefined;
      var promise = $mwtnConnect.mount($scope.newMountingPoint);
      promise.then(function(success){
        $scope.mountSuccess = ['NETCONF server', $scope.newMountingPoint.name, 'successfully mounted.'].join(' ');
      }, function(error){
        $scope.mountError = ['NETCONF server', $scope.newMountingPoint.name, 'chould not be mounted.'].join(' ');
      });
    };
    
    $scope.connect = function(row) {
      console.info(JSON.stringify(row));
    };
    
    var removeFromNodeList = function(nodeId) {
      var index = $scope.unknownNesGridOptions.data.length;
      while (--index) {
        if ($scope.unknownNesGridOptions.data[index]['node-id'] === nodeId) {
          $scope.unknownNesGridOptions.data.splice(index, 1);
          break;
        } 
      }
    };
    
    $scope.unmount = function(netConfServer) {
      netConfServer['netconf-node-topology:connection-status'] = 'disconnecting...';
      $mwtnConnect.unmount(netConfServer['node-id']).then(function(response) {
        $mwtnLog.info({component: COMPONENT, message: 'Mounting point deleted: ' + netConfServer['node-id'] });
        removeFromNodeList(netConfServer['node-id']);
      }, function(error){
        $mwtnLog.info({component: COMPONENT, message: 'Unmounting of '+netConfServer['node-id']+' failed!'});
        removeFromNodeList(netConfServer['node-id']);
      });
    };
    
    $scope.edit = function(row) {
      console.info(JSON.stringify(row));
    };
    $scope.delete = function(row) {
      console.info(JSON.stringify(row));
    };
    
    // events
    $scope.status = {requiredNes : true};
    $scope.separator = $mwtnCommons.separator; //'&nbsp;'
    $scope.$watch('status', function(status, oldValue) {
      Object.keys(status).map(function(key){
        if (status[key] && status[key] !== oldValue[key]) {
          switch (key) {
          case 'requiredNes':
            getActualNetworkElements();
            break;
          case 'unkownNes':
            getActualNetworkElements();
            break;
          case 'mount':
            $scope.mountSuccess = undefined;
            $scope.mountError = undefined;
            break;
          }
        }
      });
    }, true);
  }]);

  mwtnConnectApp.register.controller('AddToRequiredMessageCtrl', ['$scope', '$uibModalInstance', '$mwtnConnect', 'netconfServer', 
                                                                  function ($scope, $uibModalInstance, $mwtnConnect, netconfServer) {

    $scope.netconfServer = netconfServer;
    $scope.sites = [];
    var sort = [ {
      id : {
        order : 'asc'
      }
    }];
    $mwtnConnect.getAllData('site', 0, 999, sort).then(function(sites){
      // console.log(JSON.stringify(sites));
      if (sites.data.hits.hits) {
        sites.data.hits.hits.map(function(site){
          $scope.sites.push({id:site._source.id, name:site._source.name});
        });
        // console.log($scope.sites);
      }
    }, function(error){
      $scope.sites = [];
    });
  
    $scope.ok = function () {
      $uibModalInstance.close($scope.netconfServer);
    };
  
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);

});
