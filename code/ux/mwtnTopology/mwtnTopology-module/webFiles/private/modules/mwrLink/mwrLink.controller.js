/**
 * angular.js for htProfil
 */
var htRevisionStatus = angular.module('htMwrLink', [
    'ui.bootstrap', 'htLogin', 'alert', 'translate'
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
            url : '/mwrLink/:index/:low/:high/:mwrLinkId',
            templateUrl : 'modules/mwrLink/mwrLink.html',
            controller : [
                '$rootScope', '$scope', '$filter', '$modal', '$stateParams', '$mwrLink', '$revisionStatus', 'authenticationService', 'alertService',
                'translateService',
                function($rootScope, $scope, $filter, $modal, $stateParams, $mwrLink, $revisionStatus, authenticationService, alertService, translateService) {

                    $scope.dbIndex = $stateParams.index;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    $scope.mwrLinkId = $stateParams.mwrLinkId;
                    $scope.displayId = $stateParams.low + '-' + $stateParams.high + '-' + $stateParams.mwrLinkId + '-' + $stateParams.revision;
                    $rootScope.title = '(' + $scope.displayId + ') htMwrLink';

                    var profileId = authenticationService.getProfileName();
                    $scope.username = authenticationService.getUsername(profileId);
                    $scope.revisionStatus = {};
                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $scope.changeLanguage = translateService.changeLanguage;

                    $scope.editRow = function(revisionStatusId) {
                        $scope.selectedRow = {};
                        $scope.tableModel.map(function(row) {
                            if (row.revisionState.id === revisionStatusId) {
                                $scope.selectedRow = JSON.parse(JSON.stringify(row));
                            }
                        });
                        if ($scope.selectedRow.planner === null || $scope.selectedRow.planner === undefined) {
                            $scope.selectedRow.planner = $scope.username;
                        }

                        if ($scope.selectedRow.required !== null) {
                            $scope.selectedRow.required = new Date($scope.selectedRow.required);
                        }

                        if ($scope.selectedRow.plan !== null) {
                            $scope.selectedRow.plan = new Date($scope.selectedRow.plan);
                            }
                        
                        if ($scope.selectedRow.actual !== null) {
                        $scope.selectedRow.actual = new Date($scope.selectedRow.actual);
                        }
                        
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
                            rs.revisionflags = [];
                            rs.revisionflags.push(selectedRow);
                            $revisionStatus.set($scope.dbIndex, rs, function(err, data){
                                if (err){
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

                    var isInit = false;
                    var loadingStati = {};
                    loadingStati.revisionStatesLoaded = false;
                    loadingStati.revisionTypesLoaded = false;
                    loadingStati.getInitStatus = function() {
                        return loadingStati.revisionStatesLoaded && loadingStati.revisionTypesLoaded;
                    };
                    var createTableModel = function(){
                        console.info('not implemented!!!');
                    };
                    $revisionStatus.getRevisionStates($scope.dbIndex, function(revisionStates) {
                        
                        $scope.revisionStates = revisionStates;
                        loadingStati.revisionStatesLoaded = true;
                        isInit = loadingStati.getInitStatus();
                        if (isInit) {
                            $scope.status = alertService.success();
                            createTableModel();
                        }
                    });

                    $revisionStatus.getRevisionTypes($scope.dbIndex, function(revisionTypes) {
                        $scope.revisionTypes = revisionTypes;
                        loadingStati.revisionTypesLoaded = true;
                        isInit = loadingStati.getInitStatus();
                        if (isInit) {
                            $scope.status = alertService.success();
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
                            $scope.status = alertService.failure(err);
                        } else {
                            $scope.mwrLink = mwrLink;
                            loadingStati.mwrLinkLoaded = true;
                            isInit = loadingStati.getInitStatus();
                            if (isInit) {
                                $scope.status = alertService.success();
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