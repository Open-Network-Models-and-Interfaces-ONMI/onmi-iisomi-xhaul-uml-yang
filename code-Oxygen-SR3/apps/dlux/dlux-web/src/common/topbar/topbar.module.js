define(['angularAMD', 'angular-cookies', 'app/core/core.services'], function(ng) {
  var topbar = angular.module('app.common.topbar', ['ngCookies', 'app.core']);

  topbar.config(function($compileProvider, TopBarHelperProvider) {

    TopBarHelperProvider.addToView('src/common/topbar/topbar.tpl.html');
    TopBarHelperProvider.addControllerUrl('common/topbar/topbar.controller');
  });

  return topbar;
});
