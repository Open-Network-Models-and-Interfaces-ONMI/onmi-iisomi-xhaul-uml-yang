/**
 * angular.js for htProfil
 */
var htRevisionStatus = angular.module('htRevisionStatus', [
    'ui.bootstrap', 'base64', 'htLogin', 'alert', 'translate'
]);

htRevisionStatus.filter('username', function() {
    return function(input) {
        input = input || '';
        var out = input;
        var index = out.indexOf('@');
        if (index > -1) {
            out = out.substring(0, index);
        }
        return out;
    };
});

htRevisionStatus.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('revisionStatus', {
            // abstract:
            // true,
            url : '/revisionStatus/:index/:low/:high/:mwrLinkId/:revision',
            templateUrl : 'modules/revisionStatus/revisionStatus.html',
            controller : [
                '$rootScope',
                '$scope',
                '$filter',
                '$modal',
                '$base64',
                '$stateParams',
                '$mwrLink',
                '$revisionStatus',
                'authenticationService',
                'alertService',
                '$header',
                function($rootScope, $scope, $filter, $modal, $base64, $stateParams, $mwrLink, $revisionStatus, authenticationService, alertService,
                                $header) {

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $header.setStatus(alertService.processing());
                    
                    var isInit = false;
                    var loadingStati = {
                        mwrLinkLoaded : false,
                        revisionStatesLoaded : false,
                        revisionTypesLoaded : false,
                        getInitStatus : function() {
                            return this.mwrLinkLoaded && this.revisionStatesLoaded && this.revisionTypesLoaded;
                        }
                    };
                    var createTableModel = function() {
                        var tableModel = [];
                        $scope.revisionStates.map(function(revState) {
                            var row = {
                                revisionState : revState,
                                required : null,
                                plan : null,
                                actual : null,
                                planner : null,
                                comment : null
                            };
                            tableModel.push(row);
                        });

                        if ($scope.mwrLink.lifeCycle.revisionFlags !== undefined) {
                            $scope.mwrLink.lifeCycle.revisionFlags.map(function(flag) {
                                tableModel.map(function(row) {
                                    // console.log(JSON.stringify(flag));
                                    if (flag.revisionState.id === row.revisionState.id) {
                                        // console.log('yippi');
                                        row.required = flag.required;
                                        row.plan = flag.plan;
                                        row.actual = flag.actual;
                                        row.planner = flag.planner;
                                        row.comment = flag.comment;
                                    }
                                });
                            });
                        }
                        $scope.tableModel = tableModel;
                    };

                    $scope.dbIndex = $stateParams.index;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    $scope.mwrLinkId = $stateParams.mwrLinkId;
                    $scope.revision = $stateParams.revision;
                    $scope.displayId = $stateParams.low + '-' + $stateParams.high + '-' + $stateParams.mwrLinkId + '-' + $stateParams.revision;
                    $rootScope.title = '(' + $scope.displayId + ') htRevisionStatus';

                    var profileId = authenticationService.getProfileName();
                    $scope.username = authenticationService.getUsername(profileId);
                    $scope.revisionStatus = {};

                    $scope.editRow = function(revisionStatusId) {
                        $scope.selectedRow = {};
                        $scope.tableModel.map(function(row) {
                            if (row.revisionState.id === revisionStatusId) {
                                $scope.selectedRow = JSON.parse(JSON.stringify(row));}
                        });
                        if ($scope.selectedRow.planner === null || $scope.selectedRow.planner === undefined) {
                            $scope.selectedRow.planner = $scope.username;
                        }

                        if ($scope.selectedRow.required !== null) {
                            $scope.selectedRow.required = new Date($scope.selectedRow.required);}

                        if ($scope.selectedRow.plan !== null) {
                            $scope.selectedRow.plan = new Date($scope.selectedRow.plan);}

                        if ($scope.selectedRow.actual !== null) {
                            $scope.selectedRow.actual = new Date($scope.selectedRow.actual);}

                        var modalInstance = $modal.open({
                            animation : $scope.animationsEnabled,
                            templateUrl : '/ux/modules/revisionStatus/revisionStatus.modify.html',
                            controller : 'ModifyCtrl',
                            size : 'lg',
                            resolve : {
                                selectedRow : function() {
                                    return $scope.selectedRow;
                                }
                            }
                        });

                        modalInstance.result.then(function(selectedRow) {
                            selectedRow.$$hashKey = undefined;
                            var rs = {};
                            rs.id = $scope.mwrLink.id;
                            rs.lifeCycle = {};
                            rs.lifeCycle.revisionFlags = [];
                            rs.lifeCycle.revisionFlags.push(selectedRow);
                            $revisionStatus.set($scope.dbIndex, rs, function(err, data) {
                                if (err) {
                                    console.log('htLog: ' + err);
                                } else {
                                    $scope.tableModel.map(function(row) {
                                        if (row.revisionState.id === selectedRow.revisionState.id) {
                                            row.required = selectedRow.required;
                                            row.plan = selectedRow.plan;
                                            row.actual = selectedRow.actual;
                                            row.planner = selectedRow.planner;
                                            row.comment = selectedRow.comment;
                                        }
                                    });
                                }
                            });

                        }, function() {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                    };

                    $scope.status = alertService.processing();

                    $revisionStatus.getRevisionStates($scope.dbIndex, function(revisionStates) {

                        $scope.revisionStates = revisionStates;
                        loadingStati.revisionStatesLoaded = true;
                        isInit = loadingStati.getInitStatus();
                        if (isInit) {
                            $header.setStatus(alertService.success());
                            createTableModel();
                        }
                    });

                    $revisionStatus.getRevisionTypes($scope.dbIndex, function(revisionTypes) {
                        $scope.revisionTypes = revisionTypes;
                        loadingStati.revisionTypesLoaded = true;
                        isInit = loadingStati.getInitStatus();
                        if (isInit) {
                            $header.setStatus(alertService.success());
                            createTableModel();
                        }
                    });

                    var id = {
                        siteLinkId : {
                            low : $scope.siteLinkIdLow,
                            high : $scope.siteLinkIdHigh
                        },
                        mwrLinkId : $scope.mwrLinkId,
                        revision : $scope.revision,
                        variant : 0
                    };
                    $mwrLink.get($scope.dbIndex, id, function(err, mwrLink) {
                        if (err) {
                            $scope.status = alertService.failed(err);
                        } else {
                            $scope.mwrLink = mwrLink;
                            loadingStati.mwrLinkLoaded = true;
                            isInit = loadingStati.getInitStatus();
                            if (isInit) {
                                $header.setStatus(alertService.success());
                                createTableModel();
                            }
                        }
                    });
                }
            ]
        });
    }
]);

htRevisionStatus.controller('ModifyCtrl', function($scope, $modalInstance, selectedRow) {

    $scope.selectedRow = selectedRow;

    $scope.ok = function() {
        $modalInstance.close($scope.selectedRow);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});