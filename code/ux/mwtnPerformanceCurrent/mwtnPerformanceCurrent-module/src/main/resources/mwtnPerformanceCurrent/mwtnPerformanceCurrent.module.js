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
  var mwtnPerformanceCurrentApp = angular.module('app.mwtnPerformanceCurrent', ['ui.grid', 'ui.bootstrap', 'app.core', 'ui.router.state', 'config', 'ui.router.state','ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.pagination','ui.grid.autoResize']);

  mwtnPerformanceCurrentApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnPerformanceCurrentApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };

    NavHelperProvider.addControllerUrl('app/mwtnPerformanceCurrent/mwtnPerformanceCurrent.controller');
    NavHelperProvider.addToMenu('mwtnPerformanceCurrent', {
     "link" : "#/pnfPerformanceCurrent",
     "active" : "main.mwtnPerformanceCurrent",
     "title" : "pnf PM Current",
     "icon" : "fa fa-bar-chart",  // Add navigation icon css class here
     "page" : {
        "title" : "pnf PM Current",
        "description" : "mwtnPerformanceCurrent"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnPerformanceCurrent', {
        url: 'pnfPerformanceCurrent',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnPerformanceCurrent/mwtnPerformanceCurrent.tpl.html',
                controller: 'mwtnPerformanceCurrentCtrl'
            }
        }
    });

  });

  return mwtnPerformanceCurrentApp;
});
