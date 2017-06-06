(function() {
    'use strict';

    // jezz order of modules matters :(
    var app =
                    angular.module('htSolutions', [
                        'htLogin', 'htSites', 'htSiteLinkDetails', 'htSiteDetails', 'htRacklayout', 'htRevisionStatus', 'htLinkcalculator', 'htProfile',
                        'htMwrLinkRevision', 'htEngineer', 'htSiteManager', 'htPathManager', 'ui.router'
                    ]);

    app.run([
        '$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

            // It's very handy to add references to $state and $stateParams to
            // the
            // $rootScope
            // so that you can access them from any scope within your
            // applications.
            // For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will
            // set
            // the <li>
            // to active whenever 'contacts.list' or one of its decendents is
            // active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.title = 'htSolutions';
        }
    ]);

    app.config([
        '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            // ///////////////////////////
            // Redirects and Otherwise //
            // ///////////////////////////

            // Use $urlRouterProvider to configure any redirects (when) and
            // invalid
            // urls (otherwise).
            $urlRouterProvider

            // The `when` method says if the url is ever the 1st param, then
            // redirect to the 2nd param
            // Here we are just setting up some convenience urls.
            // .when('/c?id', '/contacts/:id')
            // .when('/user/:id', '/contacts/:id')

            // If the url is ever invalid, e.g. '/asdf', then redirect to '/'
            // aka
            // the home state
            .otherwise('/');

            // Use $stateProvider to configure your states.
            $stateProvider.state("home", {
                url : "/",
                templateUrl : 'modules/app/app.html',
                controller : [
                    '$rootScope', '$scope', '$app', 'translateService', function($rootScope, $scope, $app, translateService) {
                        $rootScope.title = 'htSolutions';
                        $app.getDbIndex(function(dbIndex){
                            $scope.dbIndex = dbIndex;
                            $scope.apps = [
                                           {
                                               label : 'NETWORK_MAP',
                                               link : '/ux/modules/sites/map.html#/' + $scope.dbIndex,
                                               image: '/ux/modules/sites/images/networkMap.png',
                                               target : 'htNetworkMap'
                                           },
                                           {
                                               label : 'SITE_MANAGER',
                                               link : '/ux/#/siteManager/' + $scope.dbIndex,
                                               image: '/ux/modules/siteManager/images/siteManager.png',
                                               target : 'htSiteManager'
                                           },
                                           {
                                               label : 'LINK_CALCULATOR',
                                               link : '/ux/#/linkcalculator/sandbox/0/0/0/0/0',
                                               image: '/ux/modules/linkcalculator/images/linkcalculator.png',
                                               target : 'htSolutions'
                                           },
                                           {
                                               label : 'LINK_ENGINEER',
                                               link : '/ux/#/engineer',
                                               image: '/ux/modules/engineer/images/linkEngineer.png',
                                               target : 'htSolutions'
                                           },
                                           {
                                               label : 'MBH_PLANNER',
                                               link : '/ux/#/mbhPlanner',
                                               image: '/ux/modules/mbhPlanner/images/mbhPlanner.png',
                                               target : 'htSolutions'
                                           },
                                           {
                                               label : 'PATH_MANAGER',
                                               link : '/ux/#/pathManager/' + $scope.dbIndex,
                                               image: '/ux/modules/pathManager/images/pathManager.png',
                                               target : 'htPathManager'
                                           },
                                           {
                                               label : 'INVENTORY',
                                               link : '/ux/#/inventory',
                                               image: '/ux/modules/inventory/images/inventory.png',
                                               target : 'htSolutions'
                                           }
                            ];
                        });
                        $scope.utilities = [
                            {
                                label : 'PROFILE',
                                link : '/ux/#/profile',
                                icon: 'fa fa-user',
                                target : 'htSolutions'
                            }, {
                                label : 'LOGOUT',
                                icon: 'fa fa-power-off',
                                link : '/#/login',
                                target : 'htSolutions'
                            }, {
                                label : 'USERS',
                                icon: 'fa fa-users',
                                link : '/#/users',
                                target : 'htSolutions'
                            }, {
                                label : 'SECURITY',
                                icon: 'fa fa-lock',
                                link : '/#/security',
                                target : 'htSolutions'
                            }, {
                                label : 'SERVERS',
                                icon: 'fa fa-server',
                                link : '/#/servers',
                                target : 'htSolutions'
                            // }, {
                            // label : 'DATABASE',
                            // link : '/ux/modules/database/database.html',
//                                    image: '/ux/modules/inventory/images/inventory.png',
                            // target : 'htDatabase'
                            }, {
                                label : 'RAW_DATA',
                                link : '/db/_plugin/head',
                                icon: 'fa fa-database',
                              target : 'htDatabase'
                            }
                        ];
                    }
                ]
            }).state('about', {
                url : '/about',

                // Showing off how you could return a promise from
                // templateProvider
                templateProvider : [
                    '$timeout', function($timeout) {
                        return $timeout(function() {
                            return '<p class="lead">About box </p>';
                        }, 100);
                    }
                ]
            });
        }
    ]);
})();