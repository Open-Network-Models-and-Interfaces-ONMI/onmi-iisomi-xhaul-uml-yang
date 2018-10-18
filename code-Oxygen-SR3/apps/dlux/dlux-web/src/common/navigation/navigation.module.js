define(['angular', './navigation.controller', './navigation.services', 'app/core/core.module',
  'Restangular', 'common/config/env.module'], function (angular, controller, services) {

  'use strict';
  var nav = angular.module('app.common.nav', ['app.core', 'restangular', 'config']);

  nav.config(function (NavHelperProvider) {
    NavHelperProvider.addToView('src/common/navigation/navigation.tpl.html');
    NavHelperProvider.addControllerUrl('common/navigation/navigation.controller');
  });

  // controllers
  nav.controller('NavCtrl', controller.NavCtrl);
  nav.controller('NavItemCtrl', controller.NavItemCtrl);

  // services
  nav.factory('MDSalRestangular', services.MDSalRestangular);

  return nav;
});
