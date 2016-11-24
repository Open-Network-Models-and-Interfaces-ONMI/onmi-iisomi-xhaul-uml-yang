/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'app/routingConfig', 'app/core/core.services', 'common/config/env.module'], function(ng) {
  var odlChatApp = angular.module('app.odlChat', ['app.core', 'ui.router.state','config']);

  odlChatApp.config(function($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $translateProvider) {
    odlChatApp.register = {
      controller : $controllerProvider.register,
      directive : $compileProvider.directive,
      factory : $provide.factory,
      service : $provide.service

    };


    NavHelperProvider.addControllerUrl('app/odlChat/odlChat.controller');
    NavHelperProvider.addToMenu('odlChat', {
      "link" : "#/odlChat",
      "active" : "main.odlChat",
      "title" : "Chat",
      "icon" : "icon-comments", // Add navigation icon css class here
      "page" : {
        "title" : "Chat",
        "description" : "odlChat"
      }
    });

    var access = routingConfig.accessLevels;

    $stateProvider.state('main.odlChat', {
        url: 'odlChat',
        access: access.admin,
        views : {
            'content' : {
                templateUrl: 'src/app/odlChat/odlChat.tpl.html',
                controller: 'odlChatCtrl'
            }
        }
    });

  });

  return odlChatApp;
});
