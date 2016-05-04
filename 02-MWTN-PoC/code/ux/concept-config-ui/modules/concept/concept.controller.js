/**
 * angular.js for concept
 */
var concept = angular.module('conceptCtrl', [
    'ui.bootstrap', 'base64', 'alert', 'translate'
]);
concept.config([
    '$stateProvider',
    function($stateProvider) {
        'use strict';
        $stateProvider.state('concept', {
            // abstract:
            // true,
            url : '/concept',
            templateUrl : 'modules/concept/concept.html',
            controller : [
                '$rootScope', 
                '$scope', 
                '$filter', 
                '$uibModal', 
                '$base64', 
                '$stateParams', 
                'alertService',
                '$header',
                function($rootScope, $scope, $filter, $uibModal, $base64, $stateParams, alertService, $header) {

                    $rootScope.title = '(' + 'Configuration example' + ') htServers';

                    $scope.object = {
                      id: 12345678,
                      name: 'ObjectName',
                      integer: 123,
                      unit: 13.9,
                      date: new Date(12345789)
                    };

                    $scope.objectgroup = [
                        {
                          id: 12345678,
                          name: 'ObjectName',
                          integer: 123,
                          unit: 13.9,
                          date: new Date(12345789)
                        },
                        {
                          id: 891343214,
                          name: 'some other',
                          integer: 234,
                          unit: 132314324.9,
                          date: new Date(11112011)
                        }
                    ];
                    
                    $scope.group1 = {
                      readonly: true
                    };

                    alertService.setMessage([
                        'LOADING', 'SUCCESS', 'FAILED'
                    ]);
                    $header.setStatus(alertService.clear());

                    $scope.oneAtATime = true;
                    $scope.groups = [
                      {
                        labelId : 'INFORMATION',
                        templateUrl : '/modules/concept/templates/info.html',
                        open : true
                      }, {
                        labelId : 'GEN_SITE',
                        templateUrl : '/modules/concept/templates/gensite.html',
                        open : true
                      }, {
                         labelId : 'a',
                         templateUrl : '/modules/concept/templates/dynamic_form.html',
                         open : true
                       }, {
                        labelId : 'RAW_DATA',
                        templateUrl : '/modules/concept/templates/rawData.html',
                        open : false
                      }
                    ];

                }
            ]
        });
    }
]);
