/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module', 'app/mwtnCommons/bower_components/angular-ui-grid/ui-grid.min'], function(ng) {
  var mwtnConnectApp = angular.module('app.mwtnConnect', [ 'app.core',
      'ui.router.state', 'config', 'ui.grid', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns' ]);

  mwtnConnectApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnConnectApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/mwtnConnect/mwtnConnect.controller');
    NavHelperProvider.addToMenu('mwtnConnect', {
     "link" : "#/mwtnConnect",
     "active" : "main.mwtnConnect",
     "title" : "MWTN Connect",
     "icon" : "fa fa-plug",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN Connect",
        "description" : "mwtnConnect"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnConnect', {
        url: 'mwtnConnect',
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
