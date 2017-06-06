/**
 * angular.js for htSiteManager
 */
var htSiteManager =
                angular.module('htSiteManager', [
                    'ngTouch', 'ui.bootstrap', 'ui.grid', 'ui.grid.exporter', 'ui.grid.moveColumns', 'ui.grid.pinning',
                    'ui.grid.selection', 'ui.grid.resizeColumns', 'angularFileUpload', 'htLogin', 'alert', 'translate'
                ]);

htSiteManager.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('siteManager', {
            // abstract:
            // true,
            url : '/siteManager/:dbIndex',
            templateUrl : '/ux/modules/siteManager/siteManager.html',
            controller : [
                '$rootScope',
                '$scope',
                '$stateParams',
                'uiGridConstants',
                '$siteManager',
                'authenticationService',
                'alertService',
                'translateService',
                '$translate',
                function($rootScope, $scope, $stateParams, uiGridConstants, $siteManager, authenticationService, alertService,
                                translateService, $translate) {
                    $scope.dbIndex = $stateParams.dbIndex;
                    $rootScope.title = 'htSiteManager';

                    var from = 0;
                    var maxSize = 1000;
                    var numSites = 0;

                    var fakeI18n = function(title) {
                        return title;
                    };

                    var actionCellTemplate = '<a class="vCenter" ng-class="{attention: grid.appScope.hover}" >' + 
                    '<span ng-mouseenter="grid.appScope.hover=true" ng-mouseleave="grid.appScope.hover=false" ng-show="!row.entity.siteLinks" title="{{grid.appScope.getTitle(row.entity, 0)}}"  ng-click="grid.appScope.delete(row.entity)" class="pointer glyphicon glyphicon-trash"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 1)}}" ng-click="grid.appScope.show(row.entity)" class="pointer glyphicon glyphicon-map-marker"></span>' +
                    '<span> </span>' +
                    '<span title="{{grid.appScope.getTitle(row.entity, 2)}}" ng-click="grid.appScope.open(row.entity)" class="pointer glyphicon glyphicon-info-sign"></span>' +
                    '</a>';

                    $siteManager.objectChangeListener(function(event, data) {
                        $scope.newSite = data._source;
                    });

                    $scope.cancelSite = function(){
                        $scope.newSite = undefined;
                    };
                    
                    $scope.createSite = function() {
                        console.info(JSON.stringify($scope.newSite));
                        $siteManager.createSite($scope.dbIndex, $scope.newSite, function(err, data){
                            if (err){
                                console.error('htLog: ', err, data);
                            } else {
                                $scope.gridOptions.data.push(reduce( {'_source': $scope.newSite} ));
                                $scope.newSite=undefined;
                            }
                        });
                    };
                    
                    $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                        if (col.filters[0].term) {
                            return 'header-filtered';
                        } else {
                            return '';
                        }
                    };

                    var message = ['Delete', 'Show in network map', 'Show details'];
                    $scope.getTitle = function(row, msgId) {
                        var info = message[msgId] + ': ' + row.name;
                        return info;
                    };
                    
                    $scope.show = function(row) {
                        var link = '/ux/modules/sites/map.html#/' + $scope.dbIndex + '?site=' + row.id;
                        window.open(link, 'htNetworkMap');
                    };
                        
                    $scope.open = function(row) {
                        var link = '/ux/#/sites/' + $scope.dbIndex + '/' + row.id;
                        window.open(link, 'htSolutions');
                    };
                    
                    $scope.delete = function(row) {
                        $siteManager.deleteSite($scope.dbIndex, row.id, function(data, status){
                            var index = $scope.gridOptions.data.map(function(obj) {return obj.id; }).indexOf(row.id);
                            $scope.gridOptions.data.splice(index,1);
                        });
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
                                width : 100,
                                pinnedLeft : true
                            }, {
                                field : 'name',
                                type: 'string',
                                headerCellClass : $scope.highlightFilteredHeader
                            }, {
                                field : 'latitude',
                                type: 'number',
                                displayName: 'Latitude [°]',
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, {
                                field : 'longitude',
                                displayName: 'Longitude [°]',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, {
                                field : 'amslGrd',
                                displayName : 'AMSL Ground [m]',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, {
                                field : 'siteLinks',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, {
                                field : 'networkElements',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, {
                                field : 'density',
                                displayName : 'Density [1/km²]',
                                type: 'number',
                                headerCellClass : $scope.highlightFilteredHeader,
                                cellClass: 'number'
                            }, {
                                name : 'actions',
                                enableSorting : false,
                                enableFiltering: false,
                                cellTemplate: actionCellTemplate,
                                width : 95,
                                pinnedRight : true
                            }
                        ];
                    var reduce = function(site) {
                        return {
                            id : site._source.id.siteId,
                            name : site._source.siteName,
                            latitude : site._source.geoLocation.location.lat.toFixed(6),
                            longitude : site._source.geoLocation.location.lon.toFixed(6),
                            amslGrd : parseFloat(site._source.geoLocation.amslGrd).toFixed(1),
                            siteLinks : site._source.siteLinks.length,
                            networkElements : site._source.networkElements.length,
                            density : parseFloat(site._source.densityBsPerSKm).toFixed(2)
                        };
                    };

                    
                    var checkForMore = function() {
                        // console.log(0, 'sdf');
                        var done = (from >= numSites);
                        //console.log(0, done);
                        if (!done) {
                            // console.log(1,'not done');
                            from = from + maxSize;
                            $siteManager.getSites($scope.dbIndex, from, maxSize, function(err, total, sites) {
                                if (err) {
                                    done = true;
                                    console.log('htLog:', err);
                                    return;
                                }
                                sites.map(function(site) {
                                    $scope.gridOptions.data.push(reduce(site));
                                });
                                // console.log(from, total, $scope.gridOptions.data.length);
                                // getPage();
                            });
                            checkForMore();
                        }
                    };
                    var initialize = function() {
                        $siteManager.getSites($scope.dbIndex, from, maxSize, function(err, total, sites) {
                            if (err) {
                                console.log('htLog:', err);
                                return;
                            }
                            numSites = total;
                            sites.map(function(site) {
                                $scope.gridOptions.data.push(reduce(site));
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
