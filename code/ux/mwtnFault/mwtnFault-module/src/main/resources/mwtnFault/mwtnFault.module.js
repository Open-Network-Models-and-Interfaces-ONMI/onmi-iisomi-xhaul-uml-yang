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
  var mwtnFaultApp = angular.module('app.mwtnFault', ['ui.grid', 'ui.bootstrap', 'app.core',
      'ui.router.state', 'config', 'ui.grid.exporter',
      'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.grid.selection',
      'ui.grid.resizeColumns', 'ui.grid.infiniteScroll','ui.grid.pagination' ]);

  mwtnFaultApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnFaultApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service
    };


    NavHelperProvider.addControllerUrl('app/mwtnFault/mwtnFault.controller');
    NavHelperProvider.addToMenu('mwtnFault', {
     "link" : "#/pnfFault/",
     "active" : "main.mwtnFault",
     "title" : "pnf Fault",
     "icon" : "fa fa-bell",  // Add navigation icon css class here
     "page" : {
        "title" : "pnf Fault",
        "description" : "mwtnFault"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnFault', {
        url: 'pnfFault/:nodeId',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnFault/mwtnFault.tpl.html',
                controller: 'mwtnFaultCtrl'
            }
        }
    });

  });

  return mwtnFaultApp;
});
