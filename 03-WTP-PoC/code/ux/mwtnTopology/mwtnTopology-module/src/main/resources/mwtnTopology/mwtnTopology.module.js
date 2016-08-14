/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var mwtnTopologyApp = angular.module('app.mwtnTopology', ['app.core', 'ui.router.state','config']);

  mwtnTopologyApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnTopologyApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/mwtnTopology/mwtnTopology.controller');
    NavHelperProvider.addToMenu('mwtnTopology', {
     "link" : "#/mwtnTopology",
     "active" : "main.mwtnTopology",
     "title" : "MWTN Topology",
     "icon" : "fa fa-heart",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN Topology",
        "description" : "mwtnTopology"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnTopology', {
        url: 'mwtnTopology',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnTopology/mwtnTopology.tpl.html',
                controller: 'mwtnTopologyCtrl'
            }
        }
    });

  });

  return mwtnTopologyApp;
});
