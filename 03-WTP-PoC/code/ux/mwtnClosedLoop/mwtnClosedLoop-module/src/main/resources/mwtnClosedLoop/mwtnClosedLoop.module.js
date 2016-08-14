/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var mwtnClosedLoopApp = angular.module('app.mwtnClosedLoop', ['app.core', 'ui.router.state','config']);

  mwtnClosedLoopApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnClosedLoopApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/mwtnClosedLoop/mwtnClosedLoop.controller');
    NavHelperProvider.addToMenu('mwtnClosedLoop', {
     "link" : "#/mwtnClosedLoop",
     "active" : "main.mwtnClosedLoop",
     "title" : "MWTN Closed Loop Automation",
     "icon" : "fa fa-circle-o",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN Closed Loop Automation",
        "description" : "mwtnClosedLoop"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnClosedLoop', {
        url: 'mwtnClosedLoop',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnClosedLoop/mwtnClosedLoop.tpl.html',
                controller: 'mwtnClosedLoopCtrl'
            }
        }
    });

  });

  return mwtnClosedLoopApp;
});
