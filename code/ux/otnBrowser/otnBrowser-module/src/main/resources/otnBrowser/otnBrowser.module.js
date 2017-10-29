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
        'app/mwtnCommons/mwtnCommons.module'], function(ng) {
  var otnBrowserApp = angular.module('app.otnBrowser', ['ui.grid', 'ui.bootstrap', 'app.core',
      'ui.router.state', 'config', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.infiniteScroll','ui.grid.pagination' ]);

  otnBrowserApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    otnBrowserApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };


    NavHelperProvider.addControllerUrl('app/otnBrowser/otnBrowser.controller');
    NavHelperProvider.addToMenu('otnBrowser', {
     "link" : "#/otnBrowser/",
     "active" : "main.otnBrowser",
     "title" : "OTN Config",
     "icon" : "fa fa-cogs",  // Add navigation icon css class here
     "page" : {
        "title" : "OTN Config",
        "description" : "Optical Transport Network (OTN) - Configuration"
    }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.otnBrowser', {
        url: 'otnBrowser/:nodeId',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/otnBrowser/otnBrowser.tpl.html',
                controller: 'otnBrowserCtrl'
            }
        }
    });

  });

  return otnBrowserApp;
});
