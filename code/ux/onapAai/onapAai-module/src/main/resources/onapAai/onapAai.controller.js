/*
 * Copyright (c) 2017 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/onapAai/onapAai.module',
  'app/onapAai/onapAai.services'],
  function (onapAaiApp) {

    onapAaiApp.register.controller('onapAaiCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$window', '$timeout', '$onapAai', '$mwtnLog',
      function (uiGridConstants, $uibModal, $scope, $rootScope, $window, $timeout, $onapAai, $mwtnLog) {

        var COMPONENT = 'onapAaiCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'onapAaiCtrl started!' });

        $rootScope.section_logo = 'src/app/onapAai/images/onapAai.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

        $scope.highlightFilteredHeader = $onapAai.highlightFilteredHeader;

        // Grid
        $scope.gridOptions = JSON.parse(JSON.stringify($onapAai.gridOptions));
        $scope.gridOptions.columnDefs = [
          { field: 'pnf-id', type: 'string', displayName: 'ID', headerCellClass: $scope.highlightFilteredHeader, width: 170 },
          { field: 'pnf-name', type: 'string', displayName: 'Name', headerCellClass: $scope.highlightFilteredHeader, width: 200 },
          { field: 'equip-type', type: 'string', displayName: 'Type', headerCellClass: $scope.highlightFilteredHeader, width: 160 },
          { field: 'equip-vendor', type: 'string', displayName: 'Vendor', headerCellClass: $scope.highlightFilteredHeader, width: 100 },
          { field: 'equip-model', type: 'string', displayName: 'Model', headerCellClass: $scope.highlightFilteredHeader, width: 160 },
          { field: 'ipaddress-v4-oam', type: 'string', displayName: 'If OAM', headerCellClass: $scope.highlightFilteredHeader, width: 140 },
          { field: 'in-maint', type: 'string', displayName: 'Maintenance', headerCellClass: $scope.highlightFilteredHeader, width: 100 },
          { field: 'interfaces', type: 'string', displayName: '#p-interfaces', headerCellClass: $scope.highlightFilteredHeader, width: 100, visible: false },
          { field: 'resourceVersion', type: 'string', displayName: 'Resource version', headerCellClass: $scope.highlightFilteredHeader, width: 100, visible: false }
        ];

        $onapAai.getAaiPnfs().then(function(success){
          $scope.gridOptions.data = success.data.pnf;
          $scope.gridOptions.data.map(function(item){
            item.interfaces = 1;
          });
        }, function(error) {
          console.log('error');
          $scope.error = error;
        });

      }]);

  });
