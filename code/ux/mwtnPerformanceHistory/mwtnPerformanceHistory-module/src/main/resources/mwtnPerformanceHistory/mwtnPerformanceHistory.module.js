/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 
        'app/routingConfig', 
        'app/core/core.services', 
        'common/config/env.module',
        'app/mwtnCommons/mwtnCommons.module'], function(ng) {
  var mwtnPerformanceHistoryApp = angular.module('app.mwtnPerformanceHistory', ['ui.grid', 'ui.bootstrap', 'app.core', 'ui.router.state', 'config', 'ui.router.state','ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.pagination']);

  mwtnPerformanceHistoryApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnPerformanceHistoryApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };

    NavHelperProvider.addControllerUrl('app/mwtnPerformanceHistory/mwtnPerformanceHistory.controller');
    NavHelperProvider.addToMenu('mwtnPerformanceHistory', {
     "link" : "#/mwtnPerformanceHistory",
     "active" : "main.mwtnPerformanceHistory",
     "title" : "MWTN PM History",
     "icon" : "fa fa-bar-chart",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN PM History",
        "description" : "mwtnHistoricalPerformance"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnPerformanceHistory', {
        url: 'mwtnPerformanceHistory',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnPerformanceHistory/mwtnPerformanceHistory.tpl.html',
                controller: 'mwtnPerformanceHistoryCtrl'
            }
        }
    });

  });

  return mwtnPerformanceHistoryApp;
});
