/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnClosedLoop/mwtnClosedLoop.module','app/mwtnClosedLoop/mwtnClosedLoop.services','app/mwtnCommons/mwtnCommons.services'], function(mwtnClosedLoopApp) {

  mwtnClosedLoopApp.register.controller('mwtnClosedLoopCtrl', ['$scope', '$rootScope', 'uiGridConstants',  '$mwtnClosedLoop', '$mwtnCommons', '$mwtnLog', 'OnfNetworkElement', 'MicrowavePhysicalSection',
                                                               function($scope, $rootScope, uiGridConstants, $mwtnClosedLoop, $mwtnCommons, $mwtnLog, OnfNetworkElement, MicrowavePhysicalSection) {

    var COMPONENT = 'mwtnClosedLoopCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'Started!'});

    $rootScope.section_logo = 'src/app/mwtnClosedLoop/images/mwtnClosedLoop.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.timerOptionList = [
        {id : '5seconds', name : "5 seconds"},
        {id : '30seconds', name : "30 seconds"},
        {id : '1minute', name : "One minute"},
        {id : '2minutes', name : "Two minutes"},
        {id : '30minutes', name : "30 minutes"},
        {id : '1hour', name : "One hour"}];

    var clearMessages = function() {
      $scope.info = undefined;
      $scope.error = undefined;
    };
    
    $scope.executeNow = function() {
        clearMessages();
        $mwtnCommons.executeClosedLoopAutomation().then(function(message){
          $mwtnLog.info({component: 'mwtnClosedLoopCtrl', message: 'Closed loop automation was started'});
          $scope.info = 'Closed loop automation was executed: ' + new Date().toISOString().toHumanReadableTimeFormat();
          $scope.refresh();
        }, function(error){
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: 'Cannot execute Closed Loop Automation'});
          $scope.error = 'Cannot execute Closed Loop Automation';
          $scope.refresh();
        });
    };

    $scope.save = function() {
        clearMessages();
        $mwtnCommons.saveClosedLoopAutomation($scope.timerEnabled, $scope.timerOption).then(function(message){
          $mwtnLog.info({component: 'mwtnClosedLoopCtrl', message: 'Timer was changed'});
          $scope.info = 'Timer was changed';
          $scope.refresh();
        }, function(error){
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: 'Cannot save timer'});
          $scope.error = 'Cannot save timer';
          $scope.refresh();
        });
    };

    $scope.read = function() {
        clearMessages();
        $mwtnCommons.readClosedLoopAutomation().then(function(message){
           $scope.timerEnabled = message.data.output.enabled;
           $scope.timerOption = message.data.output.option;
           $scope.refresh();
        }, function(error){
          $mwtnLog.error({component: 'mwtnClosedLoopCtrl', message: 'Cannot read configuration data from the server'});
          $scope.error = 'Cannot read configuration data from the server';
          $scope.refresh();
        });
     };

     $scope.read();

     var updateAirInterface = function(spec, data) {
       if (data) {
         var radioSignalID = data.airInterfaceConfiguration.radioSignalID;      
         $scope.gridOptions.data.map(function(row){
           if (row.name === spec.nodeId && row.radioSignalID === radioSignalID) {
             row.actualAirInterfaceName = data.airInterfaceConfiguration.airInterfaceName;
           }
         });
       } else {
         $scope.gridOptions.data.map(function(row){
           if (row.nodeId === spec.nodeId) {
             row.actualAirInterfaceName = '?';
           }
         });
       }
     };

     $scope.processing = false;
     $scope.refresh = function() {
       $scope.processing = true;
       $mwtnClosedLoop.refresh().then(function(success){
         $scope.processing = false;
         $scope.gridOptions.data = success.airInterfaces;
         success.actualNodes.map(function(actualNode){
           if (actualNode.connectionStatus !== 'connected') {
             return;
           }
           var revision = '2016-09-01';
           $mwtnClosedLoop.getActualNetworkElement(actualNode.id, revision).then(function(onfNe){
             var aOnfNe = new OnfNetworkElement(onfNe.NetworkElement);
             aOnfNe.getLTPMwpsList().map(function(ltp){
               var spec = {
                 nodeId: actualNode.id,
                 revision: revision,
                 pacId: 'airinterface',
                 layerProtocolId: ltp._lpList[0].uuid,
                 partId: 'Configuration'
               };
               $mwtnClosedLoop.getPacParts(spec).then(function(success){
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

     $scope.highlightFilteredHeader = $mwtnClosedLoop.highlightFilteredHeader;

     var requiredNesConnectionStatusCellTemplate = [
        '<div class="ui-grid-cell-contents" ng-class="{ \'green\': grid.getCellValue(row, col) === \'connected\'}"}>',
        '  <i ng-show="grid.getCellValue(row, col) === \'connected\'" class="fa fa-link" aria-hidden="true"></i>',
        '  <span>{{grid.getCellValue(row, col)}}</span>',
        '</div>'].join('');

     // ng-class="{\'mismatch\': {{row.entity.plannedAirInterfaceName}}      !== grid.getCellValue(row, col) }"
     var actualAirinterfaceNameTemplate = [
      '<div class="ui-grid-cell-contents">',
      '  <span>{{grid.getCellValue(row, col)}}</span>',
      '</div>'].join('');
   
     $scope.gridOptions = JSON.parse(JSON.stringify($mwtnClosedLoop.gridOptions));
     $scope.gridOptions.columnDefs = [
      { field: 'id', type: 'number', displayName: 'Id',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true , sort: {
        direction: uiGridConstants.ASC,
        ignoreSort: false,
        priority: 0
       }},
      { field: 'name', type: 'string', displayName: 'Name',  headerCellClass: $scope.highlightFilteredHeader, width : 140 },
      { field: 'connectionStatus', type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width : 150, cellTemplate: requiredNesConnectionStatusCellTemplate },
      { field: 'radioSignalID', type: 'string', displayName: 'Radio signal id',  headerCellClass: $scope.highlightFilteredHeader, width : 130 },
      { field: 'plannedAirInterfaceName', type: 'string', displayName: 'Planned airinterface name',  headerCellClass: $scope.highlightFilteredHeader, width : 200 },
      { field: 'actualAirInterfaceName',  type: 'string', displayName: 'Actual airinterface name',  headerCellClass: $scope.highlightFilteredHeader, width : 250, cellTemplate: actualAirinterfaceNameTemplate},
      ];

     $scope.refresh();

  }]);


});
