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
  var mwtnTdmApp = angular.module('app.mwtnTdm', ['ui.grid', 'ui.bootstrap', 'app.core', 'ui.router.state', 'config', 'angular-clipboard']);

  mwtnTdmApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnTdmApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };

    NavHelperProvider.addControllerUrl('app/mwtnTdm/mwtnTdm.controller');
    NavHelperProvider.addToMenu('mwtnTdm', {
     "link" : "#/mwtnTdm",
     "active" : "main.mwtnTdm",
     "title" : "MWTN TDM",
     "icon" : "fa fa-cogs",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN TDM",
        "description" : "mwtnTdm"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnTdm', {
        url: 'mwtnTdm',
        access: access.admin,
        views : {
            content : {
                templateUrl: 'src/app/mwtnTdm/templates/frame.tpl.html',
                controller: 'mwtnTdmCtrl'
            }
        }
    });

  });

  return mwtnTdmApp;
});
