/*
 * Copyright (c) 2014 Inocybe Technologies, and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['angularAMD', 'jquery', 'common/authentification/auth.module', 'ocLazyLoad'], function (ng, $) {
  var login = angular.module('app.common.login', ['app.common.auth', 'ui.router.state']);

  login.config(function ($stateProvider, $httpProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          'mainContent@': {
            templateUrl: 'src/common/login/login.tpl.html',
            controller: 'LoginCtrl'
          }
        },
        resolve: {
          loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              files: ['src/common/login/login.controller.js']
            });
          }]
        }
      });

    $httpProvider.interceptors.push('NbInterceptor');
  });

  login.run(function ($rootScope, $location, Auth) {

    // to avoid recursive loop
    var publicPath = ['/login'];

    var isPublicPath = function (route) {
      var found = false;
      $.each(publicPath, function (key, value) {
        found = found || route.match('^' + value);
      });
      return found;
    };

    $rootScope.$on('$stateChangeStart', function () {
      if (!isPublicPath($location.url()) && !Auth.isAuthed()) {
        $location.path('/login');
      }
    });

  });

  return login;
});
