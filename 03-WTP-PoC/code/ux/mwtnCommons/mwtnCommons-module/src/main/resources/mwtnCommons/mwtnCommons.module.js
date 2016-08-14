/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var mwtnCommonsApp = angular.module('app.mwtnCommons', ['app.core', 'ui.router.state','config']);

  mwtnCommonsApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnCommonsApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };


//    NavHelperProvider.addControllerUrl('app/mwtnCommons/mwtnCommons.controller');
//    NavHelperProvider.addToMenu('mwtnCommons', {
//     "link" : "#/mwtnCommons",
//     "active" : "main.mwtnCommons",
//     "title" : "MWTN Commons",
//     "icon" : "",  // Add navigation icon css class here
//     "page" : {
//        "title" : "MWTN Commons",
//        "description" : "mwtnCommons"
//     }
//    });

    var access = routingConfig.accessLevels;

//    $stateProvider.state('main.mwtnCommons', {
//        url: 'mwtnCommons',
//        access: access.admin,
//        views : {
//            'content' : {
//                templateUrl: 'src/app/mwtnCommons/mwtnCommons.tpl.html',
//                controller: 'mwtnCommonsCtrl'
//            }
//        }
//    });

  });

  return mwtnCommonsApp;
});
