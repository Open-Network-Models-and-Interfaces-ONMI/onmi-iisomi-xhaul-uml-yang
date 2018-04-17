define(['angular', './core.services'], function (angular, services) {
  'use strict';
  var core = angular.module('app.core', []);

  core.provider('ContentHelper', services.ContentHelper);
  core.provider('NavHelper', services.NavHelper);
  core.provider('TopBarHelper', services.TopBarHelper);

  return core;
});
