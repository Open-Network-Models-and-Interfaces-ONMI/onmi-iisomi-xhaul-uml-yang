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
  var onapAaiApp = angular.module('app.onapAai', ['ui.grid', 'ui.bootstrap', 'app.core',
      'ui.router.state', 'config', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.infiniteScroll','ui.grid.pagination' ]);

  onapAaiApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    onapAaiApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };


    NavHelperProvider.addControllerUrl('app/onapAai/onapAai.controller');
    NavHelperProvider.addToMenu('onapAai', {
     "link" : "#/onapAai/",
     "active" : "main.onapAai",
     "title" : "ONAP AAI",
     "icon" : "fa fa-th",  // Add navigation icon css class here
     "page" : {
        "title" : "ONAP AAI",
        "description" : "Open Network Automation Platform (ONAP) - Active and Available Inventory (AAI)"
    }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.onapAai', {
        url: 'onapAai/:nodeId',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/onapAai/onapAai.tpl.html',
                controller: 'onapAaiCtrl'
            }
        }
    });

  });

  return onapAaiApp;
});
