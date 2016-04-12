/*
 * Copyright (c) 2016 Tech Mahindra Limited, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
 var mwsdnconfigAppApp = angular.module('app.mwsdnconfigApp', ['app.core', 'ui.router.state', 'config']);

 mwsdnconfigAppApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
  mwsdnconfigAppApp.register = {
   controller: $controllerProvider.register,
   directive: $compileProvider.directive,
   factory: $provide.factory,
   service: $provide.service

  };


  NavHelperProvider.addControllerUrl('app/mwsdnconfigApp/mwsdnconfigApp.controller');
  NavHelperProvider.addToMenu('mwsdnconfigApp', {
   "link": "#/mwsdnconfigApp",
   "active": "main.mwsdnconfigApp",
   "title": "MWTN Config",
   "icon": "icon-cog", // Add navigation icon css class here
   "page": {
    "title": "MWTN Config",
    "description": "A configuration UI for microwave devices."
   }
  });

  var access = routingConfig.accessLevels;

  //Start:  controllers defined for different configuration tabs
  //Below state providers controls the root state of application
  $stateProvider.state('main.mwsdnconfigApp', {
   url: 'mwsdnconfigApp',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/index.html',
     controller: 'mwsdnconfigAppCtrl'
    }
   }
  });

  $stateProvider.state('main.mwsdnconfigApp.index', {
   url: '/index',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/root.html',
     controller: 'mwsdnconfigAppCtrl'
    }
   }
  });
  //Below state provider controls Network Element tab
  $stateProvider.state('main.mwsdnconfigApp.networkElement', {
   url: '/networkElement',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/networkElement.html',
     controller: 'networkAppCtrl'
    }
   }
  });

  //Below state provider controls Termination Point tab
  $stateProvider.state('main.mwsdnconfigApp.ltp', {
   url: '/mwltp',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/ltp.html',
     controller: 'ltpAppCtrl'
    }
   }
  });
  //Below state provider controls Layer Protocol tab
  $stateProvider.state('main.mwsdnconfigApp.lp', {
   url: '/mwlp',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/lp.html',
     controller: 'lpAppCtrl'
    }
   }
  });
  //Below state provider controls air-interface Configuration tab
  $stateProvider.state('main.mwsdnconfigApp.airInterfaceConfiguration', {
   url: '/mwairInterfaceConfiguration',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/aiconfig.html',
     controller: 'aiAppCtrl'
    }
   }
  });
  //Below state provider controls MW Structure tab
  $stateProvider.state('main.mwsdnconfigApp.mwStructurePac', {
   url: '/mwstructure',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/mwStructurePac.html',
     controller: 'mwStAppCtrl'
    }
   }
  });
  //Below state provider controls MW Container tab
  $stateProvider.state('main.mwsdnconfigApp.mwContainerPac', {
   url: '/mwcontainer',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/mwContainerPac.html',
     controller: 'mwContAppCtrl'
    }
   }
  });

  //Below state provider controls MW AI Config Filtering tab
  $stateProvider.state('main.mwsdnconfigApp.mwAIFilter', {
   url: '/aiFilter',
   access: access.admin,
   views: {
    'content': {
     templateUrl: 'src/app/mwsdnconfigApp/aiFilter.html',
     controller: 'mwAIFilterAppCtrl'
    }
   }
  });

  //End: controllers defined for different configuration tabs

 });

 return mwsdnconfigAppApp;
});