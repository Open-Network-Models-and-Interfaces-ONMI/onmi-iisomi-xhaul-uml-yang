/**
 * angular.js for htSiteManager
 */
var htSiteManager =
                angular.module('htPathManager', [
                    'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning',
                    'ui.grid.selection', 'ui.grid.resizeColumns', 'htLogin', 'alert', 'translate'
                ]);



htSiteManager.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('pathManager', {
            // abstract:
            // true,
            url : '/pathManager/:dbIndex',
            templateUrl : '/ux/modules/pathManager/pathManager.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                'uiGridConstants',
                '$pathManager',
                'authenticationService',
                'alertService',
                'translateService',
                '$translate',
                function($rootScope, $scope, $stateParams, uiGridConstants, $pathManager, authenticationService, alertService,
                                translateService, $translate) {
                    $scope.dbIndex = $stateParams.dbIndex;
                    $rootScope.title = 'htPathManager';

                    var from = 0;
                    var maxSize = 1000;
                    var numSites = 0;

                    var fakeI18n = function(title) {
                        return title;
                    };

                    var actionCellTemplate = '<a class="vCenter" >' + 
                    '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>' +
                    '</a>';
                    
                    $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                        if (col.filters[0].term) {
                            return 'header-filtered';
                        } else {
                            return '';
                        }
                    };

                    var message = ['Delete', 'Show in network map', 'Show details'];
                    $scope.getTitle = function(row, msgId) {
                        var info = message[msgId] + ': ' + row.id;
                        return info;
                    };
                    
                    $scope.show = function(row) {
                        var link = '/ux/modules/sites/map.html#/' + $scope.dbIndex + '?path=' + row.id;
                        window.open(link, 'htNetworkMap');
                    };
                        
                    $scope.open = function(row) {
                        var link = '/ux/#/path/' + $scope.dbIndex + '/' + row.id;
                        window.open(link, 'htSolutions');
                    };
                    
                    $scope.gridOptions = {};
                    $scope.gridOptions.data = [];
                    $scope.gridOptions.enableColumnResizing = true;
                    $scope.gridOptions.enableSorting = true;
                    $scope.gridOptions.enableFiltering = true;
                    $scope.gridOptions.enableGridMenu = true;
                    $scope.gridOptions.showGridFooter = true;
                    // $scope.gridOptions.showColumnFooter = true;
                    $scope.gridOptions.fastWatch = true;
                    $scope.gridOptions.enableRowSelection = true;
                    $scope.gridOptions.enableRowHeaderSelection = true;
                    $scope.gridOptions.multiSelect = false;

                    $scope.gridOptions.gridMenuCustomItems = [
                                           {
                                               title : 'Rotate Grid',
                                               action : function($event) {
                                                   this.grid.element.toggleClass('rotated');
                                               },
                                               order : 210
                                           }
                                       ];
                    
                    $scope.gridOptions.columnDefs =  [
                            {
                                field : 'id',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                width: 80,
                                pinnedLeft : true
                            }, {
                                field : 'status',
                                type: 'string',
                                width: 120,
                                headerCellClass : $scope.highlightFilteredHeader
                            }, {
                                field : 'type',
                                type: 'string',
                                width: 80,
                                headerCellClass : $scope.highlightFilteredHeader
                            }, {
                                field : 'startNetworkElement',
                                displayName : 'Start NE',
                                width: 100,
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader
                            }, {
                                field : 'endNetworkElement',
                                displayName : 'End NE',
                                width: 100,
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader
                            }, {
                                field : 'countE1',
                                displayName : 'E1 count',
                                type: 'number',
                                width: 70,
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, {
                                field : 'countSegments',
                                displayName : 'Segments count',
                                type: 'number',
                                width: 80,
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, { 
                                field : 'path',
                                displayName : 'Path (Site Ids)',
                                width: 600,
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader,
                                enableSorting : false
                            }, {
                                name : 'actions',
                                enableSorting : false,
                                enableFiltering: false,
                                cellTemplate: actionCellTemplate,
                                width : 95,
                                pinnedRight : true
                            }
                        ];
                    var geNetworkElementId = function(networkElement) {
                        if (!networkElement) {
                            return 'undefined';
                        }
                        return networkElement.id.networkElementId;
                    };
                    
                    var reduce = function(path) {
                        return {
                            id : path._source.id,
                            type : path._source.eType,
                            status : path._source.summaryStatus,
                            startNetworkElement : geNetworkElementId(path._source.startNe),
                            endNetworkElement : geNetworkElementId(path._source.endNe),
                            countE1 : parseInt(path._source.e1Anzahl),
                            countSegments : path._source.pathSegments.length,
                            path : $pathManager.getPath(path).toString().replace(/"/g, '')
                        };
                    };

                    var checkForMore = function() {
                        // console.log(0, 'sdf');
                        var done = (from >= numSites);
                        //console.log(0, done);
                        if (!done) {
                            // console.log(1,'not done');
                            from = from + maxSize;
                            $pathManager.getPaths($scope.dbIndex, from, maxSize, function(err, total, paths) {
                                if (err) {
                                    done = true;
                                    console.log('htLog:', err);
                                    return;
                                }
                                paths.map(function(path) {
                                    $scope.gridOptions.data.push(reduce(paths));
                                });
                            });
                            checkForMore();
                        }
                    };
                    var initialize = function() {
                        $pathManager.getPaths($scope.dbIndex, from, maxSize, function(err, total, paths) {
                            if (err) {
                                console.log('htLog:', err);
                                return;
                            }
                            numSites = total;
                            paths.map(function(path) {
                                $scope.gridOptions.data.push(reduce(path));
                            });
                            checkForMore();
                        });
                    };
                    initialize();
                }
            ]
        });
    }
]);
