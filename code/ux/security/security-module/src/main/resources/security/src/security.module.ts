// import * as angular from 'angularAMD';
declare var angular: angular.IAngularStatic; 

export const security = angular.module('app.security', ['app.core']);

security.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {

  //$translatePartialLoaderProvider.addPart('app/security/locale/locale');

  NavHelperProvider.addControllerUrl('app/security/security.controller');
  NavHelperProvider.addToMenu('security', {
    "link": "#/security",
    "active": "main.security",
    "title": "Security",
    "icon": "fa  fa-shield",  // Add navigation icon css class here
    "page": {
      "title": "Security",
      "description": "security"
    }
  });

  $stateProvider.state('main.security', {
    url: 'security',
    access: 2,
    views: {
      'content': {
        templateUrl: 'src/app/security/security.tpl.html',
        controller: 'securityCtrl'
      }
    }
  });
});

/* non ES6 export */
// export = security;
// export default security;