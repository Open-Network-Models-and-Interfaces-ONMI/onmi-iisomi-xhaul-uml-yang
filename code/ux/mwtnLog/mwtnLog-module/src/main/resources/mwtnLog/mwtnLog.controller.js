/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnLog/mwtnLog.module',
        'app/mwtnLog/mwtnLog.services',
        'app/mwtnCommons/mwtnCommons.module'], 
        function(mwtnLogApp) {
    
  mwtnLogApp.register.controller('mwtnLogCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$mwtnCommons', '$mwtnLogView', '$mwtnLog' ,
                                                 function(uiGridConstants, $uibModal, $scope, $rootScope,  $mwtnCommons, $mwtnLogView,  $mwtnLog) {

    var COMPONENT = 'mwtnLogCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnLogCtrl started!'});
    // $mwtnLog.error({component: COMPONENT, message: 'Just a test of logging an error.'});
    // $mwtnLog.warning({component: COMPONENT, message: 'Just a test of logging a warning.'});
    // $mwtnLog.debug({component: COMPONENT, message: 'Just a test of logging debug information.'});
    
    $rootScope.section_logo = 'src/app/mwtnLog/images/mwtnLog.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.highlightFilteredHeader = $mwtnLogView.highlightFilteredHeader;
 
    var rowTemplate = '<div ng-click="grid.appScope.fnOne(row)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" ng-class="[\'ui-grid-cell\', row.entity.type]" ui-grid-cell></div>';
    var iconCell = '<div class="ui-grid-cell-contents tooltip-uigrid" title="TOOLTIP"><i ng-class="{\'fa\':true, \'{{COL_FIELD}}\':true}" aria-hidden="true"></i></div>';
      
    $scope.gridOptions = JSON.parse(JSON.stringify($mwtnLogView.gridOptions));
    $scope.gridOptions.rowTemplate = rowTemplate;
    $scope.gridOptions.columnDefs = [
       // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
       { field: 'icon',  type: 'string', displayName: '',  headerCellClass: $scope.highlightFilteredHeader, width: 25, enableSorting: false, enableFiltering:false, cellTemplate: iconCell },
       { field: 'timestamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200,sort: {
         direction: uiGridConstants.DESC,
         priority: 1
       } },
       { field: 'type',  type: 'string', displayName: 'Type',  headerCellClass: $scope.highlightFilteredHeader, width: 70 },
       { field: 'component',  type: 'string', displayName: 'Component',  headerCellClass: $scope.highlightFilteredHeader, width : 200 },
       { field: 'message',  type: 'string', displayName: 'Message',  headerCellClass: $scope.highlightFilteredHeader, width : 500 }
     ];
    
    $scope.progress = {
        show: true,
        max: 200,
        value: 160
    };
    
    $scope.clearLog = function () {

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'src/app/mwtnLog/templates/clearLogConfirmation.tpl.html',
        controller: 'ClearLogCtrl',
        size: 'lg',
        resolve: {
          now: function () {
            return new Date().toISOString();
          }
        }
      });

      modalInstance.result.then(function () {
        var spec = {
            functionId : 'mwtn',
            docType : 'log',
            query: {
              match_all: {}
            }
          };
          $mwtnLogView.deleteDocType(spec).then(function(deleted){
            $scope.gridOptions.data = [];
            $mwtnLog.info({component: COMPONENT, message: 'Log cleared!'});
          }, function(error){
            $mwtnLog.error({component: COMPONENT, message:JSON.stringify(error)});
          });
      }, function () {
        $mwtnLog.info({component: COMPONENT, message: 'Mount dismissed!'});
      });
    };    

    var getIconFromType = function(type) {
      var mapping = {
        debug : '',
        info : 'fa-info-circle',
        warning : 'fa-exclamation-triangle',
        error : 'fa-times-circle'
      };
      return mapping[type];
    };
    
    var processLogEntries = function(logEntries) {
      if (logEntries.data.hits.hits) {
        logEntries.data.hits.hits.map(function(entry){
          var log = {
              id: entry._id,
              icon: getIconFromType(entry._source.type),
              timestamp: entry._source.timestamp,
              type: entry._source.type,
              component: entry._source.component,
              message: entry._source.message,
          };
          $scope.gridOptions.data.push(log);
        });
        $scope.progress.max = logEntries.data.hits.total;         
        $scope.progress.value = $scope.gridOptions.data.length;         
        $scope.progress.show = $scope.gridOptions.data.length < logEntries.data.hits.total;
      }
    };
    
    $scope.refreshLog = function() {
      $scope.gridOptions.data = [];
      var from = 0;
      var size = 100;
      $scope.processing = true;
      $mwtnLogView.getAllLogEntries(from, size).then(function(logEntries){
        $scope.processing = false;
        processLogEntries(logEntries);
        from = from + size;
        while (from < $scope.progress.max) {
          $mwtnLogView.getAllLogEntries(from, size).then(function(logEntries){
            processLogEntries(logEntries);
          }, function(error){
            console.error(JSON.stringify(error));
          });
          from = from + size;
        }
      }, function(error){
        console.error(JSON.stringify(error));
      });      
    };
    $scope.refreshLog();

  }]);

  mwtnLogApp.register.controller('ClearLogCtrl', ['$scope', '$uibModalInstance',
                                                  function ($scope, $uibModalInstance) {

    $scope.ok = function () {
      $uibModalInstance.close('ok');
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
    
});
