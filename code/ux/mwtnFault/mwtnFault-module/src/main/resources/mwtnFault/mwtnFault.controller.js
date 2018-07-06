/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnFault/mwtnFault.module',
        'app/mwtnFault/mwtnFault.services',
        'app/mwtnFault/mwtnFault.directives'], 
        function(mwtnFaultApp) {
    
  mwtnFaultApp.register.controller('mwtnFaultCtrl', ['uiGridConstants', '$uibModal', '$scope', '$rootScope', '$window', '$timeout', '$mwtnFault', '$mwtnLog', '$http',
                                                 function(uiGridConstants, $uibModal, $scope, $rootScope, $window, $timeout, $mwtnFault,  $mwtnLog, $http) {

                                                    
    var COMPONENT = 'mwtnFaultCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnFaultCtrl started!'});
    
    $rootScope.section_logo = 'src/app/mwtnFault/images/mwtnFault.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.date = new Date().toISOString().toHumanReadableTimeFormat();
    $scope.highlightFilteredHeader = $mwtnFault.highlightFilteredHeader;
    $scope.oneATime = true;
    
    // var rowTemplate = '<div ng-click="grid.appScope.fnOne(row)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" ng-class="[\'ui-grid-cell\', row.entity.type]" ui-grid-cell></div>';
    var iconCell = '<div class="ui-grid-cell-contents tooltip-uigrid" title="TOOLTIP"><i class="fa {{COL_FIELD}}" aria-hidden="true"></i></div>';
    var getIconFromSeverity = function(severity) {
      var mapping = {
        Cleared : '',
        NonAlarmed : '',
        Critical : 'fa-exclamation-triangle',
        Major : 'fa-exclamation-triangle',
        Minor : 'fa-exclamation-triangle',
        Warning : 'fa-times-circle'
      };
      return mapping[severity];
    };
    
    // Current Problem List
    $scope.gridOptionsCurrentProblemList = JSON.parse(JSON.stringify($mwtnFault.gridOptions));
    $scope.gridOptionsCurrentProblemList.columnDefs = [
     // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
     { field: 'icon',  type: 'string', displayName: '',  headerCellClass: $scope.highlightFilteredHeader, width: 25, enableSorting: false, enableFiltering:false, cellTemplate: iconCell },
     { field: 'timestamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200, sort: {
       direction: uiGridConstants.DESC,
       priority: 1
     } },
     { field: 'node',  type: 'string', displayName: 'Node name',  headerCellClass: $scope.highlightFilteredHeader, width: 200 },
     { field: 'counter',  type: 'number', displayName: 'Counter',  headerCellClass: $scope.highlightFilteredHeader, width: 70, cellClass: 'number' },
     { field: 'object',  type: 'string', displayName: 'Object Id',  headerCellClass: $scope.highlightFilteredHeader, width: 300 },
     { field: 'problem',  type: 'string', displayName: 'Alarm type',  headerCellClass: $scope.highlightFilteredHeader, width : 200 },
     { field: 'severity',  type: 'string', displayName: 'Severity',  headerCellClass: $scope.highlightFilteredHeader, width : 150 }
     
   ];
    
    var processCurrentProblemEntries = function(logEntries) {
      if (logEntries.data.hits.hits) {
        $scope.gridOptionsCurrentProblemList.data = logEntries.data.hits.hits.map(function(entry){
          return {
              id: entry._id,
              icon: getIconFromSeverity(entry._source.faultCurrent.severity),
              timestamp: $mwtnFault.formatTimeStamp(entry._source.faultCurrent.timeStamp),
              node: entry._source.faultCurrent.nodeName,
              counter: entry._source.faultCurrent.counter,
              object: entry._source.faultCurrent.objectId,
              problem: entry._source.faultCurrent.problem,
              severity: entry._source.faultCurrent.severity,
          };
        });
        $scope.progress.max = logEntries.data.hits.total;         
        $scope.progress.value = $scope.gridOptionsCurrentProblemList.data.length;         
        $scope.progress.show = $scope.gridOptionsCurrentProblemList.data.length < logEntries.data.hits.total;
      }
    };
    
    $scope.refreshCurrentProblemList = function() {
      // $scope.gridOptionsCurrentProblemList.data = [];
      var from = 0;
      var size = 10000;
      $scope.processing = true;
      $mwtnFault.getAllCurrentProblemEntries(from, size).then(function(logEntries){
        $scope.processing = false;
        $scope.spinner.currentProblemList = false;
        processCurrentProblemEntries(logEntries);
        from = from + size;
        while (from < $scope.progress.max) {
          $mwtnFault.getAllCurrentProblemEntries(from, size).then(function(logEntries){
            processCurrentProblemEntries(logEntries);
          }, function(error){
            console.error(JSON.stringify(error));
          });
          from = from + size;
        }
      }, function(error){
        $scope.processing = false;
        $scope.spinner.currentProblemList = false;
        console.error(JSON.stringify(error));
      });      
    };

    // Alarm Notifications
    $scope.gridOptionsAlarmNotifications = JSON.parse(JSON.stringify($mwtnFault.gridOptions));
    $scope.gridOptionsAlarmNotifications.columnDefs = [
      // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
      { field: 'icon',  type: 'string', displayName: '',  headerCellClass: $scope.highlightFilteredHeader, width: 25, enableSorting: false, enableFiltering:false, cellTemplate: iconCell },
      { field: 'timeStamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200,sort: {
        direction: uiGridConstants.DESC,
        priority: 1
      } },
      { field: 'counter',  type: 'number', displayName: 'Counter',  headerCellClass: $scope.highlightFilteredHeader, width: 90 },
      { field: 'nodeName',  type: 'string', displayName: 'NetworkElement',  headerCellClass: $scope.highlightFilteredHeader, width: 170 },
      { field: 'objectId',  type: 'string', displayName: 'Object',  headerCellClass: $scope.highlightFilteredHeader, width: 400 },

      { field: 'problem',  type: 'string', displayName: 'Alarm',  headerCellClass: $scope.highlightFilteredHeader, width : 140 },
      { field: 'severity',  type: 'string', displayName: 'Severity',  headerCellClass: $scope.highlightFilteredHeader, width : 100 }
    ];
    var listenToNotifications = function() {
      $mwtnFault.getMwtnWebSocketUrl().then(function(success){
        try {
          var notificationSocket = new WebSocket(success);

          notificationSocket.onmessage = function(event) {
            // we process our received event here
            if (typeof event.data === 'string') {
              // console.log("Client Received:\n" + event.data);
              // console.log("---------------------------");
              $mwtnFault.formatData(event).then(function(formated) {
                switch (formated.notifType) {
                case 'ProblemNotification':
                  formated.icon = getIconFromSeverity(formated.severity);
                  $scope.gridOptionsAlarmNotifications.data.push(formated);
                  $timeout(function(){$scope.refreshCurrentProblemList();}, 500);
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
    
    // Alarm Log
   // $scope.gridOptionsAlarmLog = JSON.parse(JSON.stringify($mwtnFault.gridOptions));

  $scope.paginationOptions = {
    pageNumber: 1,
    pageSize: 25,
    sort: null
  };

  $scope.gridOptionsAlarmLog = {
    paginationPageSizes: [25, 100, 1000, 10000],
    paginationPageSize: 25,
    useExternalPagination: true,
    useExternalSorting: true,
    enablePaginationControls: false,
    enableFiltering: true,
    useExternalFiltering: true,
    columnDefs : [
       // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
       { field: 'icon',  type: 'string', displayName: '',  headerCellClass: $scope.highlightFilteredHeader, width: 25, enableSorting: false, enableFiltering:false, cellTemplate: iconCell },
       { field: 'timestamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200, sort: {
       direction: uiGridConstants.DESC,
       priority: 1
       } },
       { field: 'node',  type: 'string', displayName: 'Node name',  headerCellClass: $scope.highlightFilteredHeader, width: 200 },
       { field: 'counter',  type: 'number', displayName: 'Counter',  headerCellClass: $scope.highlightFilteredHeader, width: 70, cellClass: 'number' },
       { field: 'object',  type: 'string', displayName: 'Object Id',  headerCellClass: $scope.highlightFilteredHeader, width: 300 },
       { field: 'problem',  type: 'string', displayName: 'Alarm type',  headerCellClass: $scope.highlightFilteredHeader, width : 200 },
       { field: 'severity',  type: 'string', displayName: 'Severity',  headerCellClass: $scope.highlightFilteredHeader, width : 150 }
    ],
    data: 'data',
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      $scope.gridApi.core.on.filterChanged( $scope, $scope.filter);
      $scope.gridApi.core.on.sortChanged( $scope, $scope.sortChanged );
      $scope.sortChanged($scope.gridApi.grid, [ $scope.gridOptionsAlarmLog.columnDefs[1] ] );

      $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        $scope.paginationOptions.pageNumber = newPage;
        $scope.paginationOptions.pageSize = pageSize;
        getPage();
      });
    }
};

 //stateobject
 $scope.state={};
 $scope.state.filter=false;
 $scope.state.sort=false;
 $scope.state.lastfilter=null;
 $scope.state.lastSort=null;

 $scope.maxCount=0; //value shown on screen

 
 $scope.seekPage= function(page){
   if(!page){ //catch NaN values
     page=1;
     return;
   }
     $scope.gridApi.pagination.seek(parseInt(page));
 };

 $scope.paginationStatusMessage = function() {
   
   var startnum=($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize+1;
   var pagenednum=($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize+1+$scope.data.length;
   if(pagenednum>$scope.gridOptionsAlarmLog.totalItems) pagenednum=pagenednum-1; //reduce by initial added 1
   
   if($scope.state.filter){
     var filterTpl = 'Showing {0} to {1} of {2} items (filtered from {3} total items)';
     return filterTpl.format(startnum, pagenednum, $scope.gridOptionsAlarmLog.totalItems, $scope.maxCount);

   } else {
     var defaultTpl = 'Showing {0} to {1} of {2} total items';
     return defaultTpl.format( startnum, pagenednum, $scope.maxCount);
   }
 };

//list visible on screen
 $scope.data = [];

 var getPage = function() {
    //from, how many, sort, filter
    getData(($scope.gridOptionsAlarmLog.paginationCurrentPage-1)*$scope.paginationOptions.pageSize, $scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter)
    .then(function (data) {
      $scope.gridOptionsAlarmLog.totalItems = data.data.hits.total;
      processResponseRecreateList(data);
    });
  };

  //filter 
  $scope.filter = function()
  {
     var grid = this.grid;
     var columns=[];

     //get all columns where data was typed in
     angular.forEach(grid.columns, function(value, key) {
        if(value.filters[0].term) {
             var col=findColumn(value.displayName);
             if(col==="fault.timeStamp"){
                //convert timestamp to db format
                var timestamp= $mwtnFault.TimeStampToONFFormat(value.filters[0].term);
                columns.push({ column: col ,value: timestamp });
             }
             else
                columns.push({ column: col ,value: value.filters[0].term }); //create column object
          }
    });

  if(columns.length === 0){ //all filter data cleared away
      $scope.state.filter=false;
      $scope.state.lastfilter=null;

      //get unfiltered data
      getData(($scope.gridOptionsAlarmLog.paginationCurrentPage-1)*$scope.paginationOptions.pageSize,$scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter).then(function(response) {
        if (response.data.hits.hits) { 
               processResponseRecreateList(response);
              
            }
         });
     
  }else{
      //base filter string
      var filter={"query":{"bool":{"must":[]}}};

      //create filter objects
      var prefixs=[];
      for(var obj of columns){
           var prefixObj={};
           prefixObj[obj.column]=obj.value;//add  like: {column: "fault.counter", value: "1"} => {"fault.counter":1}
           prefixs.push({prefix:prefixObj}); // => {"prefix":{...}}
      }

     //add objects to must property
     filter.query.bool.must=prefixs;
    
    //save filter
    $scope.state.lastfilter=filter;
    $scope.state.filter=true;
     
    //send data to sdnevents/faultlog/_search
    getData(($scope.gridOptionsAlarmLog.paginationCurrentPage-1)*$scope.paginationOptions.pageSize,$scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter).then(function(response) {
        if (response.data.hits.total>0) { //only, when hits exist
                processResponseRecreateList(response);
                $scope.gridOptionsAlarmLog.totalItems = response.data.hits.total;
        }else{
               //clear data from list
                $scope.data=[];
                 $scope.gridOptionsAlarmLog.totalItems =0;
                $scope.state.filter=false;
                $scope.state.lastfilter=null;
        }
      });
  }
};

  //sort

  $scope.sortChanged=function(grid, sortColumns){    // sortColumns is an array containing just the column sorted in the grid


          if(sortColumns.length>0){
              if(sortColumns[0].sort){
                var name = sortColumns[0].displayName; // the name of the column sorted
                var direction = sortColumns[0].sort.direction; // the direction of the column sorted: "desc" or "asc"
                sort(direction,findColumn(name));
              }
          }else{
              $scope.state.sort=false;
              $scope.state.lastSort=null;

              //get unsorted data
              getData(($scope.gridOptionsAlarmLog.paginationCurrentPage-1)*$scope.paginationOptions.pageSize,$scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter).then(function(response) {
              if (response.data.hits.hits) { 
                    processResponseRecreateList(response);
                }
              });
          }
  };

  function sort(direction, columnName){

    var sortObj={};
    var sort = [ sortObj];
    switch(direction) {
        case uiGridConstants.ASC:
             
             //create sort object
             sortObj[columnName]={order : 'asc'};
             sort = [ sortObj];
             //save last sort
             $scope.state.lastSort=sort;

             getData(($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize,$scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter).then(function(response) {
                if (response.data.hits.hits) {
                    processResponseRecreateList(response);
                    $scope.state.sort=true;
                }
              });

          break;

        case uiGridConstants.DESC:
           
             sortObj[columnName]={order : 'desc'};
             sort = [ sortObj];
             $scope.state.lastSort=sort;

             getData(($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize,$scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter).then(function(response) {
                 if (response.data.hits.hits) {
                      processResponseRecreateList(response);
                       $scope.state.sort=true;
                   }
              });
          break;

        case undefined:
          
            $scope.state.sort=false;
            $scope.state.lastSort=null;

            getData(($scope.gridOptionsAlarmLog.paginationCurrentPage-1)*$scope.paginationOptions.pageSize,$scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter)
           .then(function(response) {
                if (response.data.hits.hits) {
                     processResponseRecreateList(response);
               }
            });

          break;
    }
  }

  var findColumn = function(name) {

    if(name==="Timestamp"){ return "fault.timeStamp"; }
    else if(name==="Node name"){ return "fault.nodeName"; }
    else if(name==="Counter"){ return "fault.counter"; }
    else if(name==="Object Id"){ return "fault.objectId"; }
    else if(name==="Alarm type"){return "fault.problem"; }
    else if(name==="Severity"){ return "fault.severity"; }

  };

  var getData = function(from, size, sort, query){
    if(sort === null){ //default sort value
      sort = [ { "fault.timeStamp" : {order : 'desc'}}];
    }
    if(query === null){ //default filter value
      query= {match_all: {}};
    }
    return $mwtnFault.getFilteredSortedData(from, size, sort, query);
  };

  var processResponseAddToList=function(response) {
        if (response.data.hits.hits) {
						response.data.hits.hits.map(function(entry){
            var log = {
              id: entry._id,
              icon: getIconFromSeverity(entry._source.fault.severity),
              timestamp: $mwtnFault.formatTimeStamp(entry._source.fault.timeStamp),
              node: entry._source.fault.nodeName,
              counter: entry._source.fault.counter,
              object: entry._source.fault.objectId,
              problem: entry._source.fault.problem,
              severity: entry._source.fault.severity,
          };

         $scope.data.push(log);
        });

          $scope.gridOptionsAlarmLog.totalItems = response.data.hits.total; // needed by ui-grid to calculate page number, always update!
          if($scope.maxCount<response.data.hits.total){
            $scope.maxCount=response.data.hits.total; //only if total is higher (can be lower due to eg filtering)
          }
   }};

 function processResponseRecreateList(response){
            var list=[];
						response.data.hits.hits.map(function(entry){
            var log = {
              id: entry._id,
              icon: getIconFromSeverity(entry._source.fault.severity),
              timestamp: $mwtnFault.formatTimeStamp(entry._source.fault.timeStamp),
              node: entry._source.fault.nodeName,
              counter: entry._source.fault.counter,
              object: entry._source.fault.objectId,
              problem: entry._source.fault.problem,
              severity: entry._source.fault.severity,
          };

         list.push(log);
        });
      $scope.data=list;
      $scope.gridOptionsAlarmLog.totalItems = response.data.hits.total; // needed by ui-grid to calculate page number, always update!
       if($scope.maxCount<response.data.hits.total){
            $scope.maxCount=response.data.hits.total; //only if total is higher (can be lower due to eg filtering)
          }
    }

    $scope.refreshLog = function() {
     
      var from =  ($scope.gridOptionsAlarmLog.paginationCurrentPage-1)*$scope.paginationOptions.pageSize;
      var size = $scope.paginationOptions.pageSize;
      $scope.processing = true;
      getData(from, size,$scope.state.lastSort,$scope.state.lastfilter).then(function(logEntries){
        $scope.processing = false;
        $scope.spinner.alarmLog = false;
        processResponseRecreateList(logEntries);
        
      }, function(error){
        $scope.processing = false;
        $scope.spinner.alarmLog = false;
        console.error(JSON.stringify(error));
      });      
    };

    // [sko] TODO check from here on 
    $scope.progress = {
        show: true
    };
    
    $scope.clearLog = function () {

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'src/app/mwtnFault/templates/clearLogConfirmation.tpl.html',
        controller: 'ClearFaultLogCtrl',
        size: 'lg',
        resolve: {
          now: function () {
            var onfDateAndTime = new Date().toISOString().replace(/-/g, '').replace(/T/g, '').replace(/:/g, '').substring(0,16) + 'Z';
            return {timestamp: onfDateAndTime};
          }
        }
      });

      modalInstance.result.then(function (now) {
        var spec = {
          functionId : 'sdnevents',
          docType : 'faultlog',
          query: {
            match_all: {}
          }
        };
        $mwtnFault.deleteDocType(spec).then(function(deleted){
          //set all to 'null' (empty)
          $scope.data = [];
          $scope.maxCount=0;
          $scope.gridOptionsAlarmLog.totalItems=0;

          $timeout( function() { $scope.refreshLog(); getPage(); }, 1000);

          $mwtnLog.info({component: COMPONENT, message: 'Fault log cleared!'});
        }, function(error){
          $mwtnLog.error({component: COMPONENT, message:JSON.stringify(error)});
        });
      }, function () {
        $mwtnLog.info({component: COMPONENT, message: 'Clear fault log dismissed!'});
      });
    };    

    
    // UI events 
    $scope.status = {currentProblemList: true};
    $scope.spinner = {currentProblemList: false};
    $scope.$watch('status', function(status, oldValue) {
      Object.keys(status).map(function(key){
        if (status[key] !== oldValue[key]) {
          $scope.spinner[key] = status[key];
          
          switch (key) {
          case 'currentProblemList':
            if (status[key]) {
              $scope.refreshCurrentProblemList();
            }
            break;
          case 'alarmNotifications':
            $scope.spinner[key] = false;
            break;
          case 'alarmLog':
            $scope.refreshLog();
            break;
          default:
            $mwtnLog.error({component: COMPONENT, message: key + ' is not implemented!'});
          }
        }
      });   
    }, true);

    // init
    $scope.refreshCurrentProblemList();

     getPage();

  }]);

  mwtnFaultApp.register.controller('ClearFaultLogCtrl', ['$scope', '$uibModalInstance', '$mwtnFault', 'now',
                                                    function ($scope, $uibModalInstance, $mwtnFault, now) {

    $scope.now = $mwtnFault.formatTimeStamp(now.timestamp);
    $scope.processing = false;

    $scope.ok = function () {
      $uibModalInstance.close(now);
      $scope.processing = true;
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  }]);
    
});
