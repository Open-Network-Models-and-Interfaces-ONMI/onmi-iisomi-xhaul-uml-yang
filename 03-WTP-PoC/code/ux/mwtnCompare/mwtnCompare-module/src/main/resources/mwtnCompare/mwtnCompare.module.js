/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var mwtnCompareApp = angular.module('app.mwtnCompare', ['app.core', 'ui.router.state','config']);

  mwtnCompareApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnCompareApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/mwtnCompare/mwtnCompare.controller');
    NavHelperProvider.addToMenu('mwtnCompare', {
     "link" : "#/mwtnCompare",
     "active" : "main.mwtnCompare",
     "title" : "MWTN Compare",
     "icon" : "fa fa-tags",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN Compare",
        "description" : "mwtnCompare"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnCompare', {
        url: 'mwtnCompare',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnCompare/mwtnCompare.tpl.html',
                controller: 'mwtnCompareCtrl'
            }
        }
    });

  });

  return mwtnCompareApp;
});
