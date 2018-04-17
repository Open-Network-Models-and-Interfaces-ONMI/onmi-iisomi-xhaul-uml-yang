define([], function () {
  'use strict';

  var MDSalRestangular = function (Restangular, ENV) {
    return Restangular.withConfig(function (RestangularConfig) {
      RestangularConfig.setBaseUrl(ENV.getBaseURL('MD_SAL'));
    });
  };
  MDSalRestangular.$inject = ['Restangular', 'ENV'];

  return {
    MDSalRestangular: MDSalRestangular
  };
});
