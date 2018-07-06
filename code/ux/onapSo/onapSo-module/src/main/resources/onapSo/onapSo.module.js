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
  var onapSoApp = angular.module('app.onapSo', ['ui.grid', 'ui.bootstrap', 'app.core',
      'ui.router.state', 'config', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.infiniteScroll','ui.grid.pagination' ]);

  onapSoApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    onapSoApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };


    NavHelperProvider.addControllerUrl('app/onapSo/onapSo.controller');
    NavHelperProvider.addToMenu('onapSo', {
     "link" : "#/onapSo/",
     "active" : "main.onapSo",
     "title" : "ONAP SO",
     "icon" : "fa fa-music",  // Add navigation icon css class here
     "page" : {
        "title" : "ONAP SO",
        "description" : "Open Network Automation Platform (ONAP) - Master Service Orchestrator (MSO)"
    }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.onapSo', {
        url: 'onapSo/:nodeId',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/onapSo/onapSo.tpl.html',
                controller: 'onapSoCtrl'
            }
        }
    });

  });

  return onapSoApp;
});
