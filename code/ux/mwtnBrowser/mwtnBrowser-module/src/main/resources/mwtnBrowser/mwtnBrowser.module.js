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
  var mwtnBrowserApp = angular.module('app.mwtnBrowser', ['ui.grid', 'ui.bootstrap', 'app.core', 'ui.router.state', 'config', 'angular-clipboard']);

  mwtnBrowserApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnBrowserApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };

    NavHelperProvider.addControllerUrl('app/mwtnBrowser/mwtnBrowser.controller');
    NavHelperProvider.addToMenu('mwtnBrowser', {
     "link" : "#/pnfBrowser/",
     "active" : "main.mwtnBrowser",
     "title" : "pnf Config",
     "icon" : "fa fa-cogs",  // Add navigation icon css class here
     "page" : {
        "title" : "pnf Config",
        "description" : "mwtnBrowser"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnBrowser', {
        url: 'pnfBrowser/:nodeId',
        access: access.admin,
        views : {
            content : {
                templateUrl: 'src/app/mwtnBrowser/templates/frame.tpl.html',
                controller: 'mwtnBrowserCtrl'
            }
        }
    });

  });

  return mwtnBrowserApp;
});
