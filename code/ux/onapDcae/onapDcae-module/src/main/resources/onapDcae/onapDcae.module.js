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
  var onapDcaeApp = angular.module('app.onapDcae', ['ui.grid', 'ui.bootstrap', 'app.core',
      'ui.router.state', 'config', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.infiniteScroll','ui.grid.pagination' ]);

  onapDcaeApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    onapDcaeApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };


    NavHelperProvider.addControllerUrl('app/onapDcae/onapDcae.controller');
    NavHelperProvider.addToMenu('onapDcae', {
     "link" : "#/onapDcae/",
     "active" : "main.onapDcae",
     "title" : "ONAP DCAE",
     "icon" : "fa fa-line-chart",  // Add navigation icon css class here
     "page" : {
        "title" : "ONAP DCAE",
        "description" : "Open Network Automation Platform (ONAP) - Data Collection, Analytics and Events (DCAE)"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.onapDcae', {
        url: 'onapDcae/:nodeId',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/onapDcae/onapDcae.tpl.html',
                controller: 'onapDcaeCtrl'
            }
        }
    });

  });

  return onapDcaeApp;
});
