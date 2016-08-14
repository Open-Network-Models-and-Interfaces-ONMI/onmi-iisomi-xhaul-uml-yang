/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnLog/mwtnLog.module',
        'app/mwtnLog/mwtnLog.services',
        'app/mwtnCommons/mwtnCommons.services',
        'app/mwtnCommons/bower_components/angular-ui-grid/ui-grid.min', 
        'app/mwtnCommons/bower_components/angular-bootstrap/ui-bootstrap-tpls.min'], function(mwtnLogApp) {

  mwtnLogApp.register.controller('mwtnLogCtrl', ['$scope', '$rootScope', '$mwtnLogView', '$mwtnCommons', '$mwtnLog', function($scope, $rootScope, $mwtnLogView, $mwtnCommons, $mwtnLog) {

    var COMPONENT = 'mwtnLogCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnLogCtrl started!'});
    $mwtnLog.error({component: COMPONENT, message: 'Just a test of logging an error.'});
    $mwtnLog.warning({component: COMPONENT, message: 'Just a test of logging a warning.'});
    $mwtnLog.debug({component: COMPONENT, message: 'Just a test of logging debug information.'});
    
    $rootScope['section_logo'] = 'src/app/mwtnLog/images/mwtnLog.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
   
    $scope.gridOptions = $mwtnCommons.gridOptions;
    $scope.gridOptions.columnDefs = [
       // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
       { field: 'timestamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200 },
       { field: 'type',  type: 'string', displayName: 'Type',  headerCellClass: $scope.highlightFilteredHeader, width : 100 },
       { field: 'component',  type: 'string', displayName: 'Component',  headerCellClass: $scope.highlightFilteredHeader, width : 100 },
       { field: 'message',  type: 'string', displayName: 'Message',  headerCellClass: $scope.highlightFilteredHeader, width : 300 }
     ];
    
    $scope.progress = {
        show: true,
        max: 200,
        value: 160
    };
    
    $scope.refreshLog = function() {
      $mwtnLogView.getAllLogEntries(function(logEnties){
        if (logEnties.data.hits.hits) {
          logEnties.data.hits.hits.map(function(entry){
            var log = {
                timestamp: entry._source.timestamp,
                type: entry._source.type,
                component: entry._source.component,
                message: entry._source.message,
            };
            $scope.gridOptions.data.push(log);
          });
        }
      });
    }

  }]);


});
