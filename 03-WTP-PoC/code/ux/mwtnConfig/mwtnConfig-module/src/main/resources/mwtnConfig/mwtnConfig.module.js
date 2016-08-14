/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var mwtnConfigApp = angular.module('app.mwtnConfig', ['app.core', 'ui.router.state','config']);

  mwtnConfigApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnConfigApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/mwtnConfig/mwtnConfig.controller');
    NavHelperProvider.addToMenu('mwtnConfig', {
     "link" : "#/mwtnConfig",
     "active" : "main.mwtnConfig",
     "title" : "MWTN Config",
     "icon" : "fa fa-cogs",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN Config",
        "description" : "mwtnConfig"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnConfig', {
        url: 'mwtnConfig',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnConfig/mwtnConfig.tpl.html',
                controller: 'mwtnConfigCtrl'
            }
        }
    });

  });

  return mwtnConfigApp;
});
