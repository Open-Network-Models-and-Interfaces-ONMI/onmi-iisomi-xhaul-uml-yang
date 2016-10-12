/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnSpectrum/mwtnSpectrum.module',
        'app/mwtnSpectrum/mwtnSpectrum.services',
        'app/mwtnCommons/mwtnCommons.services'], function(mwtnSpectrumApp) {

  mwtnSpectrumApp.register.controller('mwtnSpectrumCtrl', ['$scope', '$rootScope', 'uiGridConstants','$mwtnSpectrum', '$mwtnLog', 
                                                           function($scope, $rootScope, uiGridConstants, $mwtnSpectrum, $mwtnLog) {

    var COMPONENT = 'mwtnSpectrumCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnSpectrumCtrl started!'});

    $rootScope['section_logo'] = 'src/app/mwtnSpectrum/images/mwtnSpectrum.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.interference = {
        alarmStatus: 'cleared'
    };

    $scope.execute = function() {
      console.log("Interference alarm!!!");
      $scope.interference.alarmStatus = 'raised';
    };
    $scope.clear = function() {
      console.log("Cleared");
      $scope.interference.alarmStatus = 'cleared';
    };
    $scope.refresh = function() {
      $scope.processing = true;
      console.log("refresh");
      setTimeout(function() {
        $scope.processing = true;
      }, 2000);
    };

    $scope.highlightFilteredHeader = $mwtnSpectrum.highlightFilteredHeader;

    var requiredNesConnectionStatusCellTemplate = [
     '<div class="ui-grid-cell-contents" ng-class="{ \'green\': grid.getCellValue(row, col) === \'connected\'}"}>',
     '  <i ng-show="grid.getCellValue(row, col) === \'connected\'" class="fa fa-signal" aria-hidden="true"></i>',
     '  <span>{{grid.getCellValue(row, col)}}</span>',
     '</div>'].join('');

    $scope.gridOptions = JSON.parse(JSON.stringify($mwtnSpectrum.gridOptions));
    $scope.gridOptions.columnDefs = [
     { field: 'id', type: 'number', displayName: 'Id',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true , sort: {
       direction: uiGridConstants.ASC,
       ignoreSort: false,
       priority: 0
      }},
     { field: 'name', type: 'string', displayName: 'Name',  headerCellClass: $scope.highlightFilteredHeader, width : 150 },
     { field: 'connectionStatus', type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width : 160, cellTemplate: requiredNesConnectionStatusCellTemplate },
     { field: 'radioSignalId', type: 'string', displayName: 'Radio signal id',  headerCellClass: $scope.highlightFilteredHeader, width : 150 },
     { field: 'plannedTxFrequency',  type: 'number', displayName: 'TX (plan)',  headerCellClass: $scope.highlightFilteredHeader, width : 120, cellClass: 'number' },
     { field: 'actualTxFrequency',  type: 'number', displayName: 'TX (actual)',  headerCellClass: $scope.highlightFilteredHeader, width : 120, cellClass: 'number' },
     { field: 'plannedRxFrequency',  type: 'number', displayName: 'RX (plan)',  headerCellClass: $scope.highlightFilteredHeader, width : 120, cellClass: 'number' },
     { field: 'actualRxFrequency',  type: 'number', displayName: 'RX (actual)',  headerCellClass: $scope.highlightFilteredHeader, width : 120, cellClass: 'number' }
     ];

    $scope.gridOptions.data = [{
      id: '11',
      name: 'Ceragon-11',
      connectionStatus: 'connected',
      radioSignalId: '11',
      plannedTxFrequency: '72150000',
      actualTxFrequency: '72150000',
      plannedRxFrequency: '72150000',
      actualRxFrequency: '72150000'
      
    },
    {
      id: '21',
      name: 'Ericsson-21',
      connectionStatus: 'connected',
      radioSignalId: '21',
      plannedTxFrequency: '72150000',
      actualTxFrequency: '72150000',
      plannedRxFrequency: '72150000',
      actualRxFrequency: '72150000'
      
    }, 
    {
      id: '21',
      name: 'Ericsson-21',
      connectionStatus: 'connected',
      radioSignalId: '22',
      plannedTxFrequency: '72150000',
      actualTxFrequency: '72150000',
      plannedRxFrequency: '72150000',
      actualRxFrequency: '72150000'
      
    }];
  }]);


});
