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
        'app/mwtnCommons/mwtnCommons.module',
        'app/mwtnCommons/bower_components/angular-clipboard/angular-clipboard'], function(ng) {
  var mwtnTestApp = angular.module('app.mwtnTest', ['ui.grid', 'ui.bootstrap', 'app.core', 'ui.router.state', 'config', 'angular-clipboard']);

  mwtnTestApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnTestApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };

    NavHelperProvider.addControllerUrl('app/mwtnTest/mwtnTest.controller');
    NavHelperProvider.addToMenu('mwtnTest', {
     "link" : "#/mwtnTest/",
     "active" : "main.mwtnTest",
     "title" : "LTE RAN Test",
     "icon" : "fa fa-check-square-o",  // Add navigation icon css class here
     "page" : {
        "title" : "LTE RAN Test",
        "description" : "mwtnTest"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnTest', {
        url: 'mwtnTest/:nodeId',
        access: access.admin,
        views : {
            content : {
                templateUrl: 'src/app/mwtnTest/templates/frame.tpl.html',
                controller: 'mwtnTestCtrl'
            }
        }
    });

  });

  return mwtnTestApp;
});
