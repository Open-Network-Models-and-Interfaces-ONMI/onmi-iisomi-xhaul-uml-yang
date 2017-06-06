/**
 * angular.js for htProfil
 */
var htMwrLinkRevision = angular.module('htMwrLinkRevision', [
    'ui.bootstrap', 'base64', 'htLogin', 'alert', 'translate'
]);
htMwrLinkRevision.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider.state('mwrLinkRevision', {
            // abstract:
            // true,
            url : '/mwrLinkRevision/:dbIndex/:low/:high/:mwrLinkId/:revision',
            templateUrl : 'modules/mwrLinkRevision/mwrLinkRevision.html',
            controller : [
                '$rootScope', 
                '$scope', 
                '$filter', 
                '$modal', 
                '$base64', 
                '$stateParams', 
                '$mwrLink', 
                'authenticationService', 
                'alertService',
                '$header',
                function($rootScope, $scope, $filter, $modal, $base64, $stateParams, $mwrLink, authenticationService, alertService, $header) {

                    $scope.dbIndex = $stateParams.dbIndex;
                    $scope.siteLinkIdLow = $stateParams.low;
                    $scope.siteLinkIdHigh = $stateParams.high;
                    $scope.mwrLinkId = $stateParams.mwrLinkId;
                    $scope.revision = $stateParams.revision;
                    // $scope.variant = $stateParams.variant;
                    $scope.displayId = $stateParams.low + '-' + $stateParams.high + '-' + $stateParams.mwrLinkId + '-' + $stateParams.revision; // + '-' + $stateParams.variant;
                    $rootScope.title = '(' + $scope.displayId + ') htMwrLinkRevision';

                    $scope.mwrLinkRevision = {};

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $header.setStatus(alertService.processing());

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
                            $header.setStatus(alertService.failed(err + ' ' + id));
                        } else {
                            $scope.mwrLinkRevision = mwrLink;
                            $header.setStatus(alertService.success());
                        }
                    });

                }
            ]
        });
    }
]);
