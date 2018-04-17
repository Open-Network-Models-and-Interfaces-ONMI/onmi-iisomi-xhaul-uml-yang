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

  mwtnSpectrumApp.register.controller('mwtnSpectrumCtrl', ['$scope', '$rootScope', 'uiGridConstants','$mwtnSpectrum', '$mwtnLog', 'OnfNetworkElement', 'MicrowavePhysicalSection',
                                                           function($scope, $rootScope, uiGridConstants, $mwtnSpectrum, $mwtnLog, OnfNetworkElement, MicrowavePhysicalSection) {

    var COMPONENT = 'mwtnSpectrumCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnSpectrumCtrl started!'});

    $rootScope.section_logo = 'src/app/mwtnSpectrum/images/mwtnSpectrum.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
   
    $scope.interference = {
        alarmStatus: 'cleared'
    };

    $scope.execute = function() {
      $scope.interference.alarmStatus = 'raised';
      $mwtnSpectrum.execute().then(function(success) {
        $scope.interference.alarmStatus = 'cleared';
      }, function(error) {
        $scope.interference.alarmStatus = 'cleared';
      });
    };
    $scope.clear = function() {
      console.log("Cleared");
      $scope.interference.alarmStatus = 'cleared';
    };

    var updateAirInterface = function(spec, data) {
      if (data) {
        var radioSignalID = data.airInterfaceConfiguration.radioSignalID;      
        $scope.gridOptions.data.map(function(row){
          if (row.name === spec.nodeId && row.radioSignalID === radioSignalID) {
            row.actualTxFrequency = data.airInterfaceConfiguration.txFrequency;
            row.actualRxFrequency = data.airInterfaceConfiguration.rxFrequency;
          }
        });
      } else {
        $scope.gridOptions.data.map(function(row){
          if (row.nodeId === spec.nodeId) {
            row.actualTxFrequency = '?';
            row.actualRxFrequency = '?';
          }
        });
      }
    };
    
    $scope.processing = false;
    $scope.refresh = function() {
      $scope.processing = true;
      $scope.interference.alarmStatus = 'cleared';
      $mwtnSpectrum.refresh().then(function(success){
        $scope.processing = false;
        $scope.gridOptions.data = success.airInterfaces;
        success.actualNodes.map(function(actualNode){
          if (actualNode.connectionStatus !== 'connected') {
            return;
          }
          var revision = '2016-09-01';
          $mwtnSpectrum.getActualNetworkElement(actualNode.id, revision).then(function(onfNe){
            var aOnfNe = new OnfNetworkElement(onfNe.NetworkElement);
            aOnfNe.getLTPMwpsList().map(function(ltp){
              var spec = {
                nodeId: actualNode.id,
                revision: revision,
                pacId: 'airinterface',
                layerProtocolId: ltp._lpList[0].uuid,
                partId: 'Configuration'
              };
              $mwtnSpectrum.getPacParts(spec).then(function(success){
                updateAirInterface(spec, success);
              }, function(error){
                updateAirInterface(spec, error);
              });
            });
          }, function(error){
            // do nothing
          });
        });
      }, function(error){
        $scope.processing = false;
        $scope.gridOptions.data = [];
      });
    };

    $scope.highlightFilteredHeader = $mwtnSpectrum.highlightFilteredHeader;

    var requiredNesConnectionStatusCellTemplate = [
       '<div class="ui-grid-cell-contents" ng-class="{ \'green\': grid.getCellValue(row, col) === \'connected\'}"}>',
       '  <i ng-show="grid.getCellValue(row, col) === \'connected\'" class="fa fa-link" aria-hidden="true"></i>',
       '  <span>{{grid.getCellValue(row, col)}}</span>',
       '</div>'].join('');

    var actualTxFrequencyCellTemplate = [
     '<div class="ui-grid-cell-contents" ng-class="{ \'green\': grid.getCellValue(row, col) === \'connected\'}"}>',
     '  <span ng-class="{\'mismatch\': {{row.entity.plannedTxFrequency}} !== grid.getCellValue(row, col) }">{{grid.getCellValue(row, col)}}</span>',
     '</div>'].join('');

    var actualRxFrequencyCellTemplate = [
     '<div class="ui-grid-cell-contents" ng-class="{ \'green\': grid.getCellValue(row, col) === \'connected\'}"}>',
     '  <span ng-class="{\'mismatch\': {{row.entity.plannedRxFrequency}} !== grid.getCellValue(row, col) }">{{grid.getCellValue(row, col)}}</span>',
     '</div>'].join('');
  
    $scope.gridOptions = JSON.parse(JSON.stringify($mwtnSpectrum.gridOptions));
    $scope.gridOptions.columnDefs = [
     { field: 'id', type: 'number', displayName: 'Id',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true , sort: {
       direction: uiGridConstants.ASC,
       ignoreSort: false,
       priority: 0
      }},
     { field: 'name', type: 'string', displayName: 'Name',  headerCellClass: $scope.highlightFilteredHeader, width : 140 },
     { field: 'connectionStatus', type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width : 150, cellTemplate: requiredNesConnectionStatusCellTemplate },
     { field: 'airInterfaceName', type: 'string', displayName: 'Airinterface name',  headerCellClass: $scope.highlightFilteredHeader, width : 140 },
     { field: 'radioSignalID', type: 'string', displayName: 'Radio signal id',  headerCellClass: $scope.highlightFilteredHeader, width : 130 },
     { field: 'plannedTxFrequency',  type: 'number', displayName: 'TX (plan)',  headerCellClass: $scope.highlightFilteredHeader, width : 110, cellClass: 'number' },
     { field: 'actualTxFrequency',  type: 'number', displayName: 'TX (actual)',  headerCellClass: $scope.highlightFilteredHeader, width : 110, cellClass: 'number', cellTemplate: actualTxFrequencyCellTemplate},
     { field: 'plannedRxFrequency',  type: 'number', displayName: 'RX (plan)',  headerCellClass: $scope.highlightFilteredHeader, width : 110, cellClass: 'number' },
     { field: 'actualRxFrequency',  type: 'number', displayName: 'RX (actual)',  headerCellClass: $scope.highlightFilteredHeader, width : 110, cellClass: 'number', cellTemplate: actualRxFrequencyCellTemplate}
     ];

    $scope.refresh();

  }]);


});
