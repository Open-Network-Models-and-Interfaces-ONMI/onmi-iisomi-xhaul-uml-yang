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

  mwtnConnectApp.register.controller('mwtnConnectCtrl', ['$scope', '$rootScope', '$timeout', '$window', '$q', 'uiGridConstants', '$uibModal', '$mwtnConnect', '$mwtnLog', 'NetConfServer',  
                                                         function($scope, $rootScope, $timeout, $window, $q, uiGridConstants, $uibModal, $mwtnConnect, $mwtnLog, NetConfServer) {

    var COMPONENT = 'mwtnConnectCtrl';
    $mwtnLog.info({component: COMPONENT, message: 'mwtnConnectCtrl started!'});

    $rootScope.section_logo = 'src/app/mwtnConnect/images/sdncConnect.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

    $scope.highlightFilteredHeader = $mwtnConnect.highlightFilteredHeader;
    
    $scope.oneAtATime = true;
    $scope.status = {requiredNes: true};
    $scope.spinner = {};
    $scope.spinner.TEST = true;
    
    var requiredNesConnectionStatusCellTemplate = [
      '<div class="ui-grid-cell-contents" ng-class="{ \'green\': grid.getCellValue(row, col) === \'connected\'}">',
      '  <i ng-class="{\'fa fa-link\': grid.getCellValue(row, col) === \'connected\', \'fa fa-chain-broken\': grid.getCellValue(row, col) !== \'connected\'}" aria-hidden="true"></i>',
      '  <span>{{grid.getCellValue(row, col)}}</span>',
      '</div>'].join('');
    
    var nameCellTemplate = [
      '<div class="ui-grid-cell-contents">',
      '  <a href="{{row.entity.webUri}}" target="_blank" title="Access NE web application" ng-show="row.entity.webUri">',
      '    <i class="fa fa-external-link" aria-hidden="true"></i>',
      '    <span>{{grid.getCellValue(row, col)}}</span>',
      '  </a>',
      '  <span ng-show="!row.entity.webUri">{{grid.getCellValue(row, col)}}</span>',
      '</div>'].join('');

   //    '<button class="btn btn-primary" ng-click="grid.appScope.edit(row.entity)"><i class="fa fa-pencil"></i></button>',
   //    '<button class="btn btn-default" ng-click="grid.appScope.delete(row.entity)"><i class="fa fa-times mwtnError"></i></button>',
    var requiredNesActionCellTemplate = [
      '<span>&nbsp;&nbsp;</span>',
      '<div class="btn-group">',
      '  <button class="btn btn-primary" ng-click="grid.appScope.connect(row.entity)" title="Mount"><i class="fa fa-link" aria-hidden="true"></i></button>',
      '  <button class="btn btn-warning" ng-click="grid.appScope.disconnect(row.entity)" title="Unmount"><i class="fa fa-chain-broken" aria-hidden="true"></i></button>',
      '  <button class="btn btn-success" ng-click="grid.appScope.showDetails(row.entity)" title="Information"><i class="fa fa-info-circle" aria-hidden="true"></i></button>',
      '<div class="btn-group">',
      '<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>',
      '</div>',
      '  <a class="btn btn-primary" ng-href="#/pnfFault/{{row.entity.name}}" title="Fault Management" target="fm">F</a>',
      '  <a class="btn btn-primary" ng-href="#/pnfBrowser/{{row.entity.name}}" title="Configuration Management" target="cm">C</a>',
      '  <a class="btn btn-default" title="Accounting Management" target="am">A</a>',
      '  <a class="btn btn-primary" ng-href="#/pnfPerformanceHistory/{{row.entity.name}}" title="Performance Management" target="pm">P</a>',
      '  <a class="btn btn-default" title="Security Management" target="sm">S</a>',      
      '</div>',
      '<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>',
      '<div class="btn-group">',
      '  <a class="btn btn-primary" ng-href="#/pnfInventory/{{row.entity.name}}" title="Inventory Management" target="im">I</a>',
      '</div>',
      '<span>&nbsp;</span>'].join('');


    $scope.requiredNesGridOptions = JSON.parse(JSON.stringify($mwtnConnect.gridOptions));
    $scope.requiredNesGridOptions.rowHeight  = 44;
    $scope.requiredNesGridOptions.columnDefs = [
       { field: 'connectionStatus', type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width : 160, cellTemplate: requiredNesConnectionStatusCellTemplate },
      //  { field: 'id', type: 'number', displayName: 'Id',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true , sort: {
      //    direction: uiGridConstants.ASC,
      //    ignoreSort: false,
      //    priority: 0
      //   }},
       { field: 'name', type: 'string', displayName: 'Name',  headerCellClass: $scope.highlightFilteredHeader, width : 230, cellTemplate: nameCellTemplate, pinnedLeft : true , sort: {
         direction: uiGridConstants.ASC,
         ignoreSort: false,
         priority: 0
        }},
       { field: 'ipaddress',  type: 'number', displayName: 'IP address',  headerCellClass: $scope.highlightFilteredHeader, width : 140, cellClass: 'number' },
       { field: 'port',  type: 'number', displayName: 'Port',  headerCellClass: $scope.highlightFilteredHeader, width : 80, cellClass: 'number' },
       { field: 'client',  type: 'number', displayName: 'Client',  headerCellClass: $scope.highlightFilteredHeader, width : 140 },
       { field: 'username', type: 'string', displayName: 'User name',  headerCellClass: $scope.highlightFilteredHeader, width : 100, visible: false },
       { field: 'password', type: 'string', displayName: 'Password',  headerCellClass: $scope.highlightFilteredHeader, width : 100, visible: false },
       { field: 'radioSignalIds', type: 'string', displayName: 'Radio signal ids',  headerCellClass: $scope.highlightFilteredHeader, width : 150, visible: false},
       {
         name : 'actions',
         enableSorting : false,
         enableFiltering: false,
         cellTemplate: requiredNesActionCellTemplate,
         width : 400,
         pinnedRight : true
       }
     ];
    
    var unknownNesActionCellTemplate = [
     '<a class="vCenter" ng-class="{attention: grid.appScope.hover, hidden: onfAirInterfaceRevision}" >',
     '<button class="btn btn-default" ng-show="row.entity[\'node-id\'] !== \'controller-config\'" ng-click="grid.appScope.unmount(row.entity)">Unmount</button>',
     '<button class="btn btn-primary" ng-show="row.entity[\'node-id\'] !== \'controller-config\' && row.entity.onfCoreModelRevision" ng-click="grid.appScope.addToRequiredNetworkElements(row.entity)">',
     '<i class="pull-left fa fa-spinner fa-pulse" ng-show="row.entity.spinner"></i>',
     '<span class="white">{{ "MWTN_MAKE_KNOWN" | translate }}<span>',
     '</button>',
     '<button class="btn btn-default" ng-click="grid.appScope.showDetails(row.entity, false)"><i class="fa fa-info-circle" aria-hidden="true"></i></button>',
     '</a>' ].join('<span>&nbsp;</span>');
    $scope.unknownNesGridOptions = JSON.parse(JSON.stringify($mwtnConnect.gridOptions));
    $scope.unknownNesGridOptions.rowHeight  = 44;
    $scope.unknownNesGridOptions.columnDefs = [
      { field: 'node-id', type: 'string', displayName: 'Name',  headerCellClass: $scope.highlightFilteredHeader, width : 200, sort: {
        direction: uiGridConstants.ASC,
        priority: 0
       }},
      { field: 'netconf-node-topology:host',  type: 'number', displayName: 'IP address',  headerCellClass: $scope.highlightFilteredHeader, width : 150, cellClass: 'number' },
      { field: 'netconf-node-topology:port',  type: 'number', displayName: 'NetConf port',  headerCellClass: $scope.highlightFilteredHeader, width : 120, cellClass: 'number' },
      { field: 'onfCoreModelRevision', type: 'string', displayName: 'CoreModel revision',  headerCellClass: $scope.highlightFilteredHeader, width : 160,  cellClass: 'number' },
      { field: 'onfAirInterfaceRevision', type: 'string', displayName: 'AirInterface revision',  headerCellClass: $scope.highlightFilteredHeader, width : 160,  cellClass: 'number' },
      { field: 'netconf-node-topology:connection-status', type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width : 160 },
      {
        name : 'actions',
        enableSorting : false,
        enableFiltering: false,
        cellTemplate: unknownNesActionCellTemplate,
        width : 330,
        pinnedRight : true
      }
    ];
    
    /**
     * Request all defined (required) network elements from database and
     * update the corresponding table in the ui.
     */
    var getRequiredNetworkElements = function() {
      $mwtnConnect.getRequiredNetworkElements().then(function(networkElements) {
        $scope.requiredNesGridOptions.data = networkElements;
        getActualNetworkElements();
      }, function(error){
        $scope.requiredNesGridOptions.data = [];
      });
    };
    getRequiredNetworkElements();
    
    /**
     * A function, which returns a boolean, which indicates, whether a network
     * element is required or not.
     * @param {string} neId - A mount point identifier.
     * @return {boolean} True, if network element is required in the network, otherwise false.
     */
    var isRequired = function(neId) {
      if ($scope.requiredNesGridOptions.data) {
        var result = false;
        $scope.requiredNesGridOptions.data.map(function(rne) {
          if (rne.name === neId) result = true;
        });
        return result;
      } else {
        return false;
      }
    };

    var setConnectionStatus = function(neId, connectionStatus) {
      if ($scope.requiredNesGridOptions.data) {
        $scope.requiredNesGridOptions.data.map(function(rne) {
          if (rne.name === neId) rne.connectionStatus = connectionStatus;
        });
      }
    };

    var setValues = function(ane) {
      if ($scope.requiredNesGridOptions.data) {

        var getExtension = function(extensions, name) {
          if (extensions === undefined) {
            return undefined;
          }
          var result = extensions.filter(function(ex){
            return ex['value-name'] === name;
          }).map(function(ex){
            return ex.value;
          });
          if (result.length > 0) {
            result = result[0];
          } else {
            result = undefined;
          }
          return result;
        }; 

        $scope.requiredNesGridOptions.data.map(function(rne) {
          // TODO use filter! and avoid push?
          if (rne.name === ane['node-id']) {
            rne.connectionStatus = ane['netconf-node-topology:connection-status'];
            rne.ipaddress = ane['netconf-node-topology:host'];
            rne.port = ane['netconf-node-topology:port'];
            rne.client = ane.client;
            
            rne.onfCapabilities = ane.onfCapabilities;

            var extensions = ['webUri', 'cliAddress', 'appCommand'];
            extensions.map(function(extension){
              rne[extension] = undefined;
            });
            if (ane.onfCoreModelRevision) {
              $mwtnConnect.getActualNetworkElement(ane['node-id'], ane.onfCoreModelRevision).then(function(success){
                success = $mwtnConnect.yangifyObject(success);
                extensions.map(function(extension){
                  rne[extension] = getExtension(success['network-element'].extension, extension);
                });
              }, function(error){
                // ignore
              });
            }
          }
        });
      }
    };

    var getActualNetworkElements = function() {
      // aneHash = [];
      if ($scope.requiredNesGridOptions.data) {
        $scope.requiredNesGridOptions.data.map(function(ne) {
          // ne.connectionStatus = 'disconnected';
        });
      }
      $mwtnConnect.getMountPoints().then(function(mountpoints) {
        $scope.unknownNesGridOptions.data = [];
        mountpoints.map(function(mountpoint) {
            if (isRequired(mountpoint['node-id'])) {
              // setConnectionStatus(ne['node-id'], ne['netconf-node-topology:connection-status']);
              setValues(mountpoint);
            } else {
              // console.log('mountpoint', JSON.stringify(mountpoint));
              $scope.unknownNesGridOptions.data.push(mountpoint);
            }
        });
      }, function(error){
        $mwtnLog.info({component: COMPONENT, message: JSON.stringify(error)});
      });
    }; 
    
    $scope.netconfServer = {};

    /**
     * A function which inquires data from a netconf server and stores it in a database.
     * @param {{'node-id': string, ipAddress: string, port: number, username: string, password: string}} netconfServer - A netConf server object with all connectivity parameters.
     */
    $scope.addToRequiredNetworkElements = function(netconfServer) {

      $scope.netconfServer = netconfServer;
      var neId = netconfServer['node-id'];

      var index = $scope.unknownNesGridOptions.data.map(function(item) { 
        return item['node-id']; 
      }).indexOf(netconfServer['node-id']);

      if (index !== -1 ) {
        $mwtnConnect.getSingleDocument('mwtn', 'required-networkelement', neId).then(function(doc){
          // Network element alrady exists in database
          doc.required = true;
          $scope.unknownNesGridOptions.data[index].spinner = true;
          // add to aai
          // $onapAai.createPnf(neId, doc).then(function(success){
          //   // do nothing
          // }, function(error) {
          //   // do nothing
          // });
          // add to es
          $mwtnConnect.createSingleDocument('mwtn', 'required-networkelement', neId, doc).then(function(success){
            $timeout(function() {
              $scope.status.requiredNes =  true;
              $scope.unknownNesGridOptions.data[index].spinner = false;
            }, 1000); 
          }, function(error) {
            $timeout(function() {
              $scope.status.requiredNes =  true;
              $scope.unknownNesGridOptions.data[index].spinner = false;
            }, 1000); 
            console.log(JSON.stringify(error));
          });
        }, function(error) {
          // Network element does not exist in database, data inqured from real network element
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
            $scope.unknownNesGridOptions.data[index].spinner = true;
            $mwtnConnect.addRequiredNetworkElement(netconfServer).then(function(success){
              $mwtnLog.info({component: COMPONENT, message: 'Adding to database: ' + netconfServer['node-id']});

              // $onapAai.createPnf(netconfServer['node-id'], success.config.data).then(function(success){
              //   // do nothing
              // }, function(error) {
              //   // do nothing
              // });

              $timeout(function() {
                $scope.status.requiredNes =  true;
                $scope.unknownNesGridOptions.data[index].spinner = false;
              }, 1000); 
            }, function(error){
              $scope.unknownNesGridOptions.data[index].spinner = false;
              $mwtnLog.error({component: COMPONENT, message: JSON.stringify(error)});
            });
          }, function () {
            $mwtnLog.info({component: COMPONENT, message: 'Creation of new planned NetworkElement dismissed!'});
          });
        });
      }
    };
    
    $scope.newMountingPoint = {
        name: 'new-netconf-server',
        ipaddress: '127.0.0.1',
        port: 830,
        username: 'admin',
        password: 'admin'
    };
    
    $scope.mount = function() {
      $scope.mountError = undefined;
      $scope.mountSuccess = undefined;
      $scope.processing = true;
      $mwtnConnect.mount($scope.newMountingPoint).then(function(success){
        $scope.processing = false;
        $scope.mountSuccess = ['NETCONF server', $scope.newMountingPoint.name, 'successfully mounted.'].join(' ');
      }, function(error){
        $scope.processing = false;
        $scope.mountError = ['NETCONF server', $scope.newMountingPoint.name, 'could not be mounted.'].join(' ');
      });
    };
    
    $scope.connect = function(ne) {
      ne.connectionStatus = 'connecting...';
      $mwtnConnect.mount(ne).then(function(success){
        // ne.connectionStatus = 'connected';
      }, function(error){
        // ne.connectionStatus = 'connected';
      });
    };
    
    $scope.disconnect = function(ne) {
      ne.connectionStatus = 'connecting...';
      $mwtnConnect.unmount(ne.name).then(function(success){
        ne.connectionStatus = 'disconnected';
      }, function(error){
        ne.connectionStatus = 'unknown';
      });
    };
        
    $scope.showDetails = function(ne, required) {
      $scope.currentNetworkElement = ne;
      $scope.currentNetworkElement.required = required;
      if (required !== false) {
        $scope.currentNetworkElement.required = true;
      }
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'src/app/mwtnConnect/templates/mountPointDetails.tpl.html',
        controller: 'MountPointDetailsCtrl',
        size: 'lg',
        resolve: {
          currentNetworkElement: function () {
            return $scope.currentNetworkElement;
          }
        }
      });

      modalInstance.result.then(function(success) {
        if (success.hide || success.delete) {
          var nodeId = success.hide || success.delete;
          $scope.requiredNesGridOptions.data.map(function(item, index, array){
            if (item.name === nodeId) {
              array.splice(index, 1);
            }
          });
        }
        $mwtnLog.info({component: COMPONENT, message: 'Mointpoint details closed'});
      }, function (error) {
        $mwtnLog.info({component: COMPONENT, message: 'Mointpoint details dismissed!'});
      });
    };
                  
    var removeFromNodeList = function(nodeId) {
      var index = $scope.unknownNesGridOptions.data.length;
      while (index--) {
        if ($scope.unknownNesGridOptions.data[index]['node-id'] === nodeId) {
          $scope.unknownNesGridOptions.data.splice(index, 1);
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
    
    // Connection status log
    $scope.gridOptionsConnectionStatusLog = {
        paginationPageSizes: [25, 100, 1000, 10000],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enablePaginationControls: false,
        enableFiltering: true,
        useExternalFiltering: true,
        maxCount: 0,
        columnDefs : [
           // { field: 'id', type: 'number', displayName: 'No.',  headerCellClass: $scope.highlightFilteredHeader, width : 50, cellClass: 'number', pinnedLeft : true },
           { field: 'timestamp',  type: 'string', displayName: 'Timestamp',  headerCellClass: $scope.highlightFilteredHeader, width : 200, sort: {
           direction: uiGridConstants.DESC,
           priority: 1
           } },
           { field: 'nodeName',  type: 'string', displayName: 'Node name',  headerCellClass: $scope.highlightFilteredHeader, width: 200 },
           { field: 'connectionStatus',  type: 'string', displayName: 'Connection status',  headerCellClass: $scope.highlightFilteredHeader, width: 500, cellTemplate: requiredNesConnectionStatusCellTemplate }
        ],
        data: 'data',
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.core.on.filterChanged( $scope, $scope.filter);
          $scope.gridApi.core.on.sortChanged( $scope, $scope.sortChanged );
          $scope.sortChanged($scope.gridApi.grid, [ $scope.gridOptionsConnectionStatusLog.columnDefs[1] ] );

          $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            $scope.paginationOptions.pageNumber = newPage;
            $scope.paginationOptions.pageSize = pageSize;
            getPage();
          });
        }
    };

    // data visible in connection status log
    $scope.data = [];

    //stateobject
    $scope.state = {
      filter: false,
      sort: false,
      lastfilter: null,
      lastSort: null
    };

   //filter 
   $scope.filter = function() {
     var grid = this.grid;
     var columns=[];

     //get all columns where data was typed in
     angular.forEach(grid.columns, function(value, key) {
       if(value.filters[0].term) {

         var col = findColumn(value.displayName);
         var val = value.filters[0].term;
         
         switch (col) {
         case 'event.timeStamp':
           //convert timestamp to db format
           val = $mwtnConnect.TimeStampToONFFormat(value.filters[0].term);
           break;
         case 'event.type':
           if ('connected'.startsWith(value.filters[0].term.toLowerCase())) {
             val = 'ObjectCreationNotificationXml'.toLowerCase();
           }
           if ('disconnected'.startsWith(value.filters[0].term.toLowerCase())) {
             val = 'ObjectDeletionNotificationXml'.toLowerCase();
           }
           break;
         }       
         columns.push({ column: col, value: val }); //create column object
       }
    });

    if (columns.length ===0 ) { //all filter data cleared away
      $scope.state.filter = false;
      $scope.state.lastfilter = null;

      //get unfiltered data
      $mwtnConnect.getData(($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize,
                           $scope.paginationOptions.pageSize,
                           $scope.state.lastSort,
                           $scope.state.lastfilter).then(function(response) {
        if (response.data.hits.hits) { 
          processResponseRecreateList(response);
        }
      });
    } else {
      //base filter string
      var filter = {"query": {"bool":{"must":[]}}};
      //create filter objects
      var prefixs = columns.map(function(obj){
        var prefixObj={};
        prefixObj[obj.column] = obj.value;//add  like: {column: "fault.counter", value: "1"} => {"fault.counter":1}
        return {prefix:prefixObj}; // => {"prefix":{...}}
      });
      prefixs.push({"match":{"event.nodeName":"SDN-Controller"}});
      
      //add objects to must property
      filter.query.bool.must = prefixs;
      //save filter
      $scope.state.lastfilter=filter;
      $scope.state.filter=true;
     
      //send data to sdnevents/eventlog/_search
      $mwtnConnect.getData(($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize,
                            $scope.paginationOptions.pageSize,
                            $scope.state.lastSort,
                            $scope.state.lastfilter).then(function(response) {
        if (response.data.hits.total>0) { //only, when hits exist
          processResponseRecreateList(response);
          $scope.gridOptionsConnectionStatusLog.totalItems = response.data.hits.total;
        } else {
          //clear data from list
          $scope.data=[];
          $scope.gridOptionsConnectionStatusLog.totalItems = 0;
          $scope.gridOptionsConnectionStatusLog.maxCount = 0;
          $scope.state.filter=false;
          $scope.state.lastfilter=null;
        }
      });
    }
   };
  
    //sort
    $scope.sortChanged=function(grid, sortColumns){    // sortColumns is an array containing just the column sorted in the grid
      if (sortColumns.length > 0) {
        if (sortColumns[0].sort) {
          var name = sortColumns[0].displayName; // the name of the column sorted
          var direction = sortColumns[0].sort.direction; // the direction of the column sorted: "desc" or "asc"
          sort(direction, findColumn(name) );
        }
      } else {
         $scope.state.sort = false;
         $scope.state.lastSort=null;
         //get unsorted data
         $mwtnConnect.getData( ($scope.paginationOptions.pageNumber-1) * $scope.paginationOptions.pageSize,
                               $scope.paginationOptions.pageSize,
                               $scope.state.lastSort,
                               $scope.state.lastfilter).then(function(response) {
           processResponseRecreateList(response);
         }, function(error) {
           processResponseRecreateList([]);
         });
      }
    };

    var processResponseRecreateList = function(response) {
      if (!response.data || !response.data.hits) {
        $scope.data = [];
        $scope.gridOptionsConnectionStatusLog.totalItems = 0; // needed by ui-grid to calculate page number, always update!
        $scope.gridOptionsConnectionStatusLog.maxCount = 0;
        return;
      }
      
      if($scope.gridOptionsConnectionStatusLog.maxCount < response.data.hits.total){
        $scope.gridOptionsConnectionStatusLog.maxCount = response.data.hits.total; //only if total is higher (can be lower due to eg filtering)
      }
      var list = response.data.hits.hits.map(function(entry) {
        
        var status = 'unknown';
        if (entry._source.event.type === 'ObjectCreationNotificationXml' ) {
          status = 'connected';
        } else if (entry._source.event.type === 'ObjectDeletionNotificationXml' ) {
          status = 'disconnected';
        }
        return {
          id: entry._id,
          timestamp: $mwtnConnect.formatTimeStamp(entry._source.event.timeStamp),
          nodeName: entry._source.event.objectId,
          connectionStatus: status
        };
      });
      $scope.data=list;
      $scope.gridOptionsConnectionStatusLog.totalItems = response.data.hits.total; // needed by ui-grid to calculate page number, always update!
    };

    $scope.paginationOptions = {
      pageNumber: 1,
      pageSize: 25,
      sort: null
    };

    var getPage = function() {
       //from, how many, sort, filter
       $mwtnConnect.getData( ($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize, 
                 $scope.paginationOptions.pageSize,
                 $scope.state.lastSort,
                 $scope.state.lastfilter).then(function (success) {
         $scope.gridOptionsConnectionStatusLog.totalItems = success.data.hits.total;
         processResponseRecreateList(success);
       }, function(error) {
         $scope.gridOptionsConnectionStatusLog.totalItems = success.data.hits.total;
         processResponseRecreateList([]);
         $mwtnLog.info({component: COMPONENT, message: JSON.stringify(error)});
       });
     };
     
     var processResponseAddToList = function(response) {
       if (response.data.hits.hits) {
         if($scope.gridOptionsConnectionStatusLog.maxCount < response.data.hits.total) {
           $scope.gridOptionsConnectionStatusLog.maxCount = response.data.hits.total; //only if total is higher (can be lower due to eg filtering)
         }
         response.data.hits.hits.map(function(entry) {
           var status = 'disconnected';
           if (entry._source.event.type === 'ObjectCreationNotificationXml' ) {
             status = 'connected';
           }
           var log = {
             id: entry._id,
             timestamp: $mwtnConnect.formatTimeStamp(entry._source.event.timeStamp),
             nodeName: entry._source.event.objectId,
             connectionStatus: status
           };
           $scope.data.push(log);
         });
       }
       $scope.gridOptionsConnectionStatusLog.totalItems = response.data.hits.total; // needed by ui-grid to calculate page number, always update!
    };

    var sort = function (direction, columnName) {

      var sortObj={};
      var sort = [ sortObj ];
      switch (direction) {
        case uiGridConstants.ASC:
           //create sort object
           sortObj[columnName]={order : 'asc'};
           sort = [ sortObj ];
           //save last sort
           $scope.state.lastSort=sort;

           $mwtnConnect.getData(($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize,
                                 $scope.paginationOptions.pageSize,
                                 $scope.state.lastSort,
                                 $scope.state.lastfilter).then(function(response) {
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

          $mwtnConnect.getData(($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize,$scope.paginationOptions.pageSize,$scope.state.lastSort,$scope.state.lastfilter).then(function(response) {
            if (response.data.hits.hits) {
              processResponseRecreateList(response);
              $scope.state.sort=true;
            }
          });
          break;

        case undefined:
            
         $scope.state.sort=false;
         $scope.state.lastSort=null;

         $mwtnConnect.getData(($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize,
                               $scope.paginationOptions.pageSize,
                               $scope.state.lastSort,
                               $scope.state.lastfilter).then(function(response) {
              processResponseRecreateList(response);
         });
         break;
      }
    };

    var findColumn= function(name) {
      if(name === 'Timestamp'){ return 'event.timeStamp'; }
      else if(name === 'Node name'){ return 'event.objectId'; }
      else if(name === 'Connection status'){ return 'event.type'; }
    };

    $scope.paginationStatusMessage = function() {
      
      var startnum=($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize+1;
      var pagenednum=($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize+1+$scope.data.length;
      if(pagenednum>$scope.gridOptionsConnectionStatusLog.totalItems) pagenednum=pagenednum-1; //reduce by initial added 1
      
      if($scope.state.filter){
        var filterTpl = 'Showing {0} to {1} of {2} items (filtered from {3} total items)';
        return filterTpl.format(startnum, pagenednum, $scope.gridOptionsConnectionStatusLog.totalItems, $scope.gridOptionsConnectionStatusLog.maxCount);

      } else {
        var defaultTpl = 'Showing {0} to {1} of {2} total items';
        return defaultTpl.format( startnum, pagenednum, $scope.gridOptionsConnectionStatusLog.maxCount);
      }
    };

    $scope.refreshLog = function() {
       
      
       var from =  ($scope.paginationOptions.pageNumber-1)*$scope.paginationOptions.pageSize;
       var size = $scope.paginationOptions.pageSize;
       $scope.processing = true;
       $scope.spinner.connectionStatusLog = true;
       $mwtnConnect.getData(from, size, $scope.state.lastSort, $scope.state.lastfilter).then(function(logEntries){
         $scope.processing = false;
         $scope.spinner.connectionStatusLog = false;
         processResponseRecreateList(logEntries);
       }, function(error){
         $scope.processing = false;
         $scope.spinner.connectionStatusLog = false;
         console.error(JSON.stringify(error));
       });      
     };
    
    // browser events
    $scope.status = {requiredNes : true};
    $scope.separator = $mwtnConnect.separator; //'&nbsp;'
    $scope.$watch('status', function(status, oldValue) {
      Object.keys(status).map(function(key){
        if (status[key] && status[key] !== oldValue[key]) {
          switch (key) {
          case 'requiredNes':
            getRequiredNetworkElements();
            break;
          case 'unkownNes':
            getActualNetworkElements();
            break;
          case 'mount':
            $scope.mountSuccess = undefined;
            $scope.mountError = undefined;
            break;
          case 'connectionStatusLog':
            $window.dispatchEvent(new Event("resize"));
            $scope.refreshLog();
            break;
          }
        }
      });
    }, true);
    
    // odl events
    // actualNetworkElements - NE added/deleted
    var listenToActualNetworkElementsNotifications = function(socketLocation) {
      try {
        var notificatinSocket = new WebSocket(socketLocation);

        notificatinSocket.onmessage = function(event) {
          console.log('Event received.');
          setTimeout(function() {
            getActualNetworkElements();
          }, 1000);
        };
        notificatinSocket.onerror = function(error) {
          console.error("Socket error: " + error);
        };
        notificatinSocket.onopen = function(event) {
          console.info("Socket connection opened.");
        };
        notificatinSocket.onclose = function(event) {
          console.info("Socket connection closed.");
        };
      } catch (e) {
        console.error("Error when creating WebSocket" + e);
      }
    };
    
    // var path = '/network-topology:network-topology/network-topology:topology[network-topology:topology-id = "topology-netconf"]'; 
    // var path = "/opendaylight-inventory:nodes";  // [sko] works!
    var path = '/network-topology:network-topology'; // for whatever reason it does not work, but work in Lithium.
    $mwtnConnect.registerForOdlEvents(path, function(socketLocation) {
      listenToActualNetworkElementsNotifications(socketLocation);
    });
    
    var listenToEventManagerNotifications = function() {
      $mwtnConnect.getMwtnWebSocketUrl().then(function(success){
        try {
          var notificationSocket = new WebSocket(success);

          notificationSocket.onmessage = function(event) {
            // we process our received event here
            if (typeof event.data === 'string') {
              // console.log("Client Received:\n" + event.data);
              // console.log("---------------------------");
              $mwtnConnect.formatData(event).then(function(formated) {
                switch (formated.notifType) {
                case 'ProblemNotification':
                case 'AttributeValueChangedNotification':
                  // ignore
                  break;
                case 'ObjectCreationNotification':
                case 'ObjectDeletionNotification':
                  if (formated.nodeName === 'SDN-Controller') {
                    $timeout(function() {getActualNetworkElements();}, 500); 
                  }
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
                  'scopes' : [ 'ObjectCreationNotification', 'ObjectDeletionNotification' ]
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
    listenToEventManagerNotifications();
    
  }]);

  mwtnConnectApp.register.controller('AddToRequiredMessageCtrl', ['$scope', '$uibModalInstance', '$mwtnConnect', 'netconfServer', 
                                                         function ($scope, $uibModalInstance, $mwtnConnect, netconfServer) {

    $scope.netconfServer = netconfServer;
    
    $mwtnConnect.getMountPoint(netconfServer['node-id']).then(
      /**
       * @param {{'node-id':string, 'netconf-node-topology:tcp-only': boolean, 'netconf-node-topology:host', string, 'netconf-node-topology:keepalive-delay':number, 'netconf-node-topology:port':number, 'netconf-node-topology:username':string, 'netconf-node-topology:password': string}} mountpoint - The mointpoint form topology-netconf
       */
      function(mountpoint) {
        $scope.netconfServer.username = mountpoint['netconf-node-topology:username'];
        $scope.netconfServer.password = mountpoint['netconf-node-topology:password'];
      }, 
      function(error){
        console.log(JSON.stringify(error));
      }
    );

    $scope.sites = [];
    var sort = [ {
      id : {
        order : 'asc'
      }
    }];
    $mwtnConnect.getAllData('mwtn', 'site', 0, 20, sort).then(
      function(sites){
        // console.log(JSON.stringify(sites));
        if (sites.data.hits.hits) {
          sites.data.hits.hits.map(function(site){
            $scope.sites.push({id:site._source.id, name:site._source.name});
          });
          // console.log($scope.sites);
        }
      }, 
      function(error){
        $scope.sites = [];
      }
    );
  
    $scope.ok = function () {
      $uibModalInstance.close($scope.netconfServer);
    };
  
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.$watch('netconfServer.site', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        var sort = [ {
          id : {
            order : 'asc'
          }
        }];
        var query = {
          prefix: {
            name: newValue
          }
        };

        $mwtnConnect.getFilteredSortedData('mwtn', 'site', 0, 20, sort, query).then(
          function(sites){
            // console.log(JSON.stringify(sites));
            if (sites.data.hits.hits) {
              $scope.sites = sites.data.hits.hits.map(function(site){
                return {id:site._source.id, name:site._source.name};
              });
              // console.log($scope.sites);
            }
          }, 
          function(error){
            $scope.sites = [];
          }
        );
      }
    });
  }]);

  mwtnConnectApp.register.controller('MountPointDetailsCtrl', ['$scope', '$uibModalInstance', '$uibModal', '$mwtnConnect', '$mwtnLog', 'currentNetworkElement', 
                                                                  function ($scope, $uibModalInstance, $uibModal, $mwtnConnect, $mwtnLog, currentNetworkElement) {

    var COMPONENT = 'MountPointDetailsCtrl';
    // $mwtnLog.info({component: COMPONENT, message: 'MountPointDetailsCtrl started!'});

    $scope.data = {
        ne: currentNetworkElement,
        web: {
          supported: false,
          protocol: 'http',
          ipAddress: '127.0.0.1',
          port: 80,
          url: '/',
          getLink : function() {
            if (currentNetworkElement.webUri) {
              return currentNetworkElement.webUri;
            }
            return [this.protocol,'://', this.ipAddress, this.url ].join('');
          }
        },
        terminal: {
          supported: false,
          copied: false,
          protocol: 'ssh',
          user: 'cli',
          ipAddress: '127.0.0.1',
          getCommand : function() {
            if (currentNetworkElement.cliAddress) { 
              return currentNetworkElement.cliAddress;
            }
            return [this.protocol, ' ', this.user, '@', this.ipAddress].join('');
          },
          copyToClipboard : function () {
            $scope.data.application.copied = false;
            this.copied =  true;
            var message = 'Copied to clipboard! ' + this.getCommand();
            $mwtnLog.info({component: COMPONENT, message: message});
          }
        },
        application: {
          supported: false,
          copied: false,
          commandTemplate: 'VendorApp --ne {0}',
          ipAddress: '127.0.0.1',
          getCommand : function() {
            if (currentNetworkElement.appCommand) {
              return currentNetworkElement.appCommand;
            }
            return this.commandTemplate.format(this.ipAddress);
          },
          copyToClipboard : function () {
            $scope.data.terminal.copied = false;
            $scope.data.application.copied =  true;
            var message = 'Copied to clipboard! ' + this.getCommand();
            $mwtnLog.info({component: COMPONENT, message: message});
          }
        }
    };

    var nodeId = $scope.data.ne.name || $scope.data.ne['node-id'];
    $mwtnConnect.getMountPoint(nodeId).then(function(success){
      $scope.data.mountpoint = success;
    }, function(error){
      $scope.data.mountpoint = undefined;
    });
    
    if (currentNetworkElement.webUri && currentNetworkElement.webUri !== '') {
      $scope.data.web.supported = true;
      $scope.data.web.protocol = currentNetworkElement.webUri.split(':')[0];
      var matches = currentNetworkElement.webUri.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      $scope.data.web.ipAddress = matches && matches[1];  // ipAddress will be null if no match is found
    }
    if (currentNetworkElement.cliAddress && currentNetworkElement.cliAddress !== '') {
      $scope.data.terminal.supported = true;
      var matches = currentNetworkElement.cliAddress.match(/([^@]+)@([^@]+)/i);
      $scope.data.terminal.user = matches && matches[1];
      $scope.data.terminal.ipAddress = matches && matches[2];
    }
    if (currentNetworkElement.appCommand && currentNetworkElement.appCommand !== '') {
      $scope.data.application.supported = true;
      // [sko] TODO once a mediator supports it
    }

    $scope.yangCapabilitiesGridOptions = JSON.parse(JSON.stringify($mwtnConnect.gridOptions));
    $scope.yangCapabilitiesGridOptions.columnDefs = [
       { field: 'module', type: 'string', displayName: 'module',  headerCellClass: $scope.highlightFilteredHeader, width : 600 },
       { field: 'revision', type: 'string', displayName: 'Revision',  headerCellClass: $scope.highlightFilteredHeader, width : 150}
     ];
    $scope.yangCapabilitiesGridOptions.data = currentNetworkElement.onfCapabilities;
    
    // clipboard
    $scope.supported = false;
    $scope.error = function (err) {
      $mwtnLog.error({component: COMPONENT, message: err});
    };    
    
    $scope.ok = function () {
      $uibModalInstance.close({ne: currentNetworkElement});
    };
  
    $scope.hide = function (ne) {
      $scope.hideNe = ne;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'src/app/mwtnConnect/templates/confirmHide.tpl.html',
        controller: 'MountPointHideCtrl',
        size: 'lg',
        resolve: {
          hideNe: function () {
            return $scope.hideNe;
          }
        }
      });

      modalInstance.result.then(
        function(neId) {
          $mwtnConnect.getSingleDocument('mwtn', 'required-networkelement', neId).then(
            function(doc){
              doc.required = false;
              $mwtnConnect.createSingleDocument('mwtn', 'required-networkelement', neId, doc).then(
                function(success){
                  $uibModalInstance.close({hide: neId});
                }, 
                function(error) {
                  $uibModalInstance.close({hide: neId});
                }
              );
            },  
            function(error) {
              $uibModalInstance.close({hide: neId});
            }
          );
          $mwtnLog.info({component: COMPONENT, message: 'Confirm hide closed'});
        }, 
        function (error) {
          $mwtnLog.info({component: COMPONENT, message: 'Confirm hide dismissed!'});
        }
      );
    };
  
    $scope.delete = function (ne) {
      $scope.deleteNe = ne;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'src/app/mwtnConnect/templates/confirmDelete.tpl.html',
        controller: 'MountPointDeleteCtrl',
        size: 'lg',
        resolve: {
          deleteNe: function () {
            return $scope.deleteNe;
          }
        }
      });

      modalInstance.result.then(function(success) {
        // delete from AAi
        // $onapAai.deletePnf(success).then(function(deleted){
        //   $mwtnLog.info({component: COMPONENT, message: success + ' deleted from AAI.'});
        // }, function(error){
        //   $mwtnLog.info({component: COMPONENT, message: 'Deletion from AAI failed: ' + success + '\n' + error});
        // });
        // delete from ES
        $mwtnConnect.deleteSingleDocument('mwtn', 'required-networkelement', success).then(function(deleted){
          $mwtnLog.info({component: COMPONENT, message: success + ' deleted from database.'});
          $uibModalInstance.close({hide: success});
        }, function(error){
          $mwtnLog.info({component: COMPONENT, message: 'Deletion from database failed: ' + success + '\n' + error});
        });
      }, function (error) {
        $mwtnLog.info({component: COMPONENT, message: 'Confirm delete dismissed!'});
      });
    };
  
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);

  mwtnConnectApp.register.controller('MountPointHideCtrl', ['$scope', '$uibModalInstance', '$mwtnConnect', '$mwtnLog', 'hideNe', 
                                                   function ($scope, $uibModalInstance, $mwtnConnect, $mwtnLog, hideNe) {
    $scope.hideNe = hideNe;
    $scope.ok = function () {
      $uibModalInstance.close($scope.hideNe.name);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }]);

  mwtnConnectApp.register.controller('MountPointDeleteCtrl', ['$scope', '$uibModalInstance', '$mwtnConnect', '$mwtnLog', 'deleteNe', 
                                                   function ($scope, $uibModalInstance, $mwtnConnect, $mwtnLog, deleteNe) {
    $scope.deleteNe = deleteNe;
    $scope.ok = function () {
      $uibModalInstance.close($scope.deleteNe.name);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }]);

});