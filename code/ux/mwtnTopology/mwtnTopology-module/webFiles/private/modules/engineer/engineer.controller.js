/**
 * angular.js for htEngineer
 */
var htEngineer = angular.module('htEngineer', [
    'ui.bootstrap', 'htLogin', 'alert', 'translate'
]);

htEngineer.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('engineer', {
            // abstract:
            // true,
            url : '/engineer/:dbIndex/:low/:high',
            templateUrl : 'modules/engineer/engineer.html',
            controller : [
                '$rootScope', 
                '$scope', 
                '$window', 
                '$revisionStatus', 
                '$stateParams', 
                '$engineer', 
                'authenticationService', 
                'alertService', 
                '$header', 
                function($rootScope, $scope, $window, $revisionStatus, $stateParams, $engineer, authenticationService, alertService, $header) {

                    $scope.dbIndex = $stateParams.dbIndex;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    var displayId = $stateParams.low + '-' + $stateParams.high;
                    var id = {
                        low : $stateParams.low,
                        high : $stateParams.high
                    };

                    $rootScope.title = '(' + displayId + ') htEngineer';

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $header.setStatus(alertService.processing());
                    $scope.results = [];
                    $scope.select = function(mwrLink) {
                        console.log(JSON.stringify(mwrLink));
                        $scope.selectedVariant = mwrLink;
                    };


                    var mwrLinkCreated = function(mwrLinkRevision) {
                        var profile = authenticationService.getProfileName();
                        var flag = {
                            revisionState: {
                                orderId: 5,
                                id: 'created',
                                name: 'Created',
                                isMain: true
                            },
                            required:new Date(),
                            plan:new Date(),
                            actual:new Date(),
                            planner:authenticationService.getUsername(profile),
                            comment:'Creation via htEngineer.'
                        };
                        var rs = {};
                        rs.id = mwrLinkRevision.id;
                        rs.lifeCycle = {};
                        rs.lifeCycle.revisionFlags = [];
                        rs.lifeCycle.revisionFlags.push(flag);
                        
//                        // create first revisionstatus
                        $revisionStatus.set($scope.dbIndex, rs, function(err, data){
                            // console.log('htLog: ', err, data);
                            var url = '/ux/#/mwrLinkRevision/';
                            url += $scope.dbIndex;
                            url += '/';
                            url += $scope.siteLinkIdLow;
                            url += '/';
                            url += $scope.siteLinkIdHigh;
                            url += '/';
                            url += mwrLinkRevision.id.mwrLinkId;
                            url += '/';
                            url += mwrLinkRevision.id.revision;
                            $window.location.href =  url;
                        });
                    };
                    $scope.createMwrLinkRevision = function() {
                        $header.setStatus(alertService.processing());
                        $scope.selectedVariant.id.siteLinkId = {
                            low: $scope.siteLinkIdLow,
                            high: $scope.siteLinkIdHigh
                        };
                        $engineer.createMwrLinkRevision($scope.dbIndex, $scope.selectedVariant, function(err, mwrLink) {
                            if (err) {
                                console.log('htLog: ', mwrLink, status);
                                $header.setStatus(alertService.error(err));
                                $scope.selectedVariant = undefined;
                            } else {
                                console.log(JSON.stringify(mwrLink.mwrlinkrevision));
                                $header.setStatus(alertService.success());
                                mwrLinkCreated(mwrLink.mwrlinkrevision);
                                $scope.selectedVariant = undefined;
                            }
                        });
                    };

                    $engineer.getResults(id, function(err, results) {
                        if (err) {
                            $scope.results = [];
                            $header.setStatus(alertService.error(err));
                            $scope.selectedVariant = undefined;
                        } else {
                            $scope.results = results.output.linkEngineering;
                            $header.setStatus(alertService.success());
                            if ($scope.results.length > 1) {
                                $scope.selectedVariant = $scope.results[$scope.results.length - 2];
                            }
                        }
                    });

                }
            ]
        });
    }
]);