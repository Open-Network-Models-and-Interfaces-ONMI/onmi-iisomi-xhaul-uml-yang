define(['angularAMD', 'Restangular', 'common/config/env.module'], function(ng) {
  var general = angular.module('app.common.general', ['restangular', 'config']);

  return general;
});
