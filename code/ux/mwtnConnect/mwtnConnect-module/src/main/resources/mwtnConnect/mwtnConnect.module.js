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
  var mwtnConnectApp = angular.module('app.mwtnConnect', [ 'ui.grid', 'ui.bootstrap', 'app.core',
      'ui.router.state', 'config', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'angular-clipboard' ]);

  mwtnConnectApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {

    mwtnConnectApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };

    NavHelperProvider.addControllerUrl('app/mwtnConnect/mwtnConnect.controller');
    NavHelperProvider.addToMenu('mwtnConnect', {
     "link" : "#/connect",
     "active" : "main.mwtnConnect",
     "title" : "Connect",
     "icon" : "fa fa-plug",  // Add navigation icon css class here
     "page" : {
        "title" : "Connect",
        "description" : "Connection supervision of physical network function to ONAP SDN-C-4-Wireless"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnConnect', {
        url: 'connect',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnConnect/mwtnConnect.tpl.html',
                controller: 'mwtnConnectCtrl'
            }
        }
    });

  });

  return mwtnConnectApp;
});
