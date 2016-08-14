/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var mwtnSpectrumApp = angular.module('app.mwtnSpectrum', ['app.core', 'ui.router.state','config']);

  mwtnSpectrumApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    mwtnSpectrumApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/mwtnSpectrum/mwtnSpectrum.controller');
    NavHelperProvider.addToMenu('mwtnSpectrum', {
     "link" : "#/mwtnSpectrum",
     "active" : "main.mwtnSpectrum",
     "title" : "MWTN Spectrum",
     "icon" : "fa fa-bar-chart",  // Add navigation icon css class here
     "page" : {
        "title" : "MWTN Spectrum",
        "description" : "mwtnSpectrum"
     }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.mwtnSpectrum', {
        url: 'mwtnSpectrum',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/mwtnSpectrum/mwtnSpectrum.tpl.html',
                controller: 'mwtnSpectrumCtrl'
            }
        }
    });

  });

  return mwtnSpectrumApp;
});
