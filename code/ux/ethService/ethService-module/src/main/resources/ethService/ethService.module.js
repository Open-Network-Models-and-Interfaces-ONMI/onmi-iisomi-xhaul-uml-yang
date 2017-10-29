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
  var ethServiceApp = angular.module('app.ethService', ['ui.grid', 'ui.bootstrap', 'app.core',
      'ui.router.state', 'config', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.infiniteScroll','ui.grid.pagination' ]);

  ethServiceApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    ethServiceApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };


    NavHelperProvider.addControllerUrl('app/ethService/ethService.controller');
    NavHelperProvider.addToMenu('ethService', {
     "link" : "#/ethService/",
     "active" : "main.ethService",
     "title" : "ETH Service",
     "icon" : "fa fa-arrows-h",  // Add navigation icon css class here
     "page" : {
        "title" : "ETH Service",
        "description" : "Ethernet Service Provisioning"
    }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.ethService', {
        url: 'ethService/:nodeId',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/ethService/ethService.tpl.html',
                controller: 'ethServiceCtrl'
            }
        }
    });

  });

  return ethServiceApp;
});
