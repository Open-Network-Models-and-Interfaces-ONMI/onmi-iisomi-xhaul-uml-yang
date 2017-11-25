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
  var mwtnPerformanceLinkApp = angular.module('app.mwtnPerformanceLink', ['ui.grid','chart.js', 'ui.bootstrap', 'app.core', 'ui.router.state', 'config', 'ui.router.state','ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.pagination']);

  mwtnPerformanceLinkApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnPerformanceLinkApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };

    NavHelperProvider.addControllerUrl('app/mwtnPerformanceLink/mwtnPerformanceLink.controller');
    NavHelperProvider.addToMenu('mwtnPerformanceLink', {
     "link" : "#/pnfPerformanceLink",
     "active" : "main.mwtnPerformanceLink",
     "title" : "pnf PM Link",
     "icon" : "fa fa-bar-chart",  // Add navigation icon css class here
     "page" : {
        "title" : "pnf PM Link",
        "description" : "mwtnLinkPerformance"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnPerformanceLink', {
        url: 'pnfPerformanceLink',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnPerformanceLink/mwtnPerformanceLink.tpl.html',
                controller: 'mwtnPerformanceLinkCtrl'
            }
        }
    });

  });

  return mwtnPerformanceLinkApp;
});
