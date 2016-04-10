/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
var modules = [ 'angularAMD', 'app/routingConfig',
    'common/yangutils/yangutils.services', 'ui-bootstrap', 'Restangular',
    'angular-translate', 'ngSlider' ];

define(
    modules,
    function(ng) {

      var mwtnCompareApp = angular.module('app.mwtnCompare', [ 'app.core',
          'ui.router.state', 'config', 'app.common.yangUtils', 'ui.bootstrap',
          'restangular', 'pascalprecht.translate', 'ngSlider' ]);

      mwtnCompareApp
          .config(function($stateProvider, $compileProvider,
              $controllerProvider, $provide, NavHelperProvider,
              $translateProvider) {
            mwtnCompareApp.register = {
              controller : $controllerProvider.register,
              directive : $compileProvider.directive,
              factory : $provide.factory,
              service : $provide.service

            };

            NavHelperProvider
                .addControllerUrl('app/mwtnCompare/mwtnCompare.controller');
            NavHelperProvider
                .addToMenu(
                    'mwtnCompare',
                    {
                      "link" : "#/mwtnCompare",
                      "active" : "main.mwtnCompare",
                      "title" : "MWTN Compare",
                      "icon" : "icon-tags", // Add navigation icon css class
                                            // here
                      "page" : {
                        "title" : "MWTN Compare",
                        "description" : "App to compare planning data and data from the network."
                      }
                    });

            var access = routingConfig.accessLevels;

            $stateProvider.state('main.mwtnCompare', {
              url : 'mwtnCompare',
              access : access.admin,
              views : {
                'content' : {
                  templateUrl : 'src/app/mwtnCompare/mwtnCompare.tpl.html',
                  controller : 'mwtnCompareCtrl'
                }
              }
            });

          });

      return mwtnCompareApp;
    });
