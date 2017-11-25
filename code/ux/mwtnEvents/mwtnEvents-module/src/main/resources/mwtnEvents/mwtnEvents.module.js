/*
 * Copyright (c) 2016 Tech Mahindra Ltd. and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([ 'angularAMD', 'app/routingConfig', 'app/core/core.services',
    'common/config/env.module' ,
    'app/mwtnCommons/mwtnCommons.module'], function(ng) {
  var mwtnEventsApp = angular.module('app.mwtnEvents', [ 'app.core',
      'ui.router.state', 'config' ]);

  mwtnEventsApp.config(function($stateProvider, $compileProvider,
      $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnEventsApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };

    NavHelperProvider.addControllerUrl('app/mwtnEvents/mwtnEvents.controller');
    NavHelperProvider.addToMenu('mwtnEvents', {
      "link" : "#/pnfEvents",
      "active" : "main.mwtnEvents",
      "title" : "pnf Events",
      "icon" : "fa fa-bolt", // Add navigation icon css class here
      "page" : {
        "title" : "pnf Events",
        "description" : "Events"
      }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnEvents', {
      url : 'mwtnEvents',
      access : access.admin,
      views : {
        'content' : {
          templateUrl : 'src/app/mwtnEvents/mwtnEvents.tpl.html',
          controller : 'mwtnEventsCtrl'
        }
      }
    });

  });

  return mwtnEventsApp;
});
