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
        'app/mwtnCommons/bower_components/angular-clipboard/angular-clipboard',
        'src/app/mwtnMediator/class.mediator.js'], function(ng) {
  var mwtnMediatorApp = angular.module('app.mwtnMediator', ['ui.grid', 'ui.bootstrap', 'app.core', 'ui.router.state', 'config', 'angular-clipboard']);

  mwtnMediatorApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnMediatorApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };

    NavHelperProvider.addControllerUrl('app/mwtnMediator/mwtnMediator.controller');
    NavHelperProvider.addToMenu('mwtnMediator', {
     "link" : "#/pnfMediator",
     "active" : "main.mwtnMediator",
     "title" : "pnf Mediator",
     "icon" : "fa fa-globe",  // Add navigation icon css class here
     "page" : {
        "title" : "pnf Mediator",
        "description" : "mwtnMediator"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnMediator', {
        url: 'pnfMediator',
        access: access.admin,
        views : {
            content : {
                templateUrl: 'src/app/mwtnMediator/templates/frame.tpl.html',
                controller: 'mwtnMediatorCtrl'
            }
        }
    });

  });

  return mwtnMediatorApp;
});
