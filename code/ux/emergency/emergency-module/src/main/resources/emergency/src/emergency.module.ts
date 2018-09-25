// import * as angular from 'angularAMD';
declare var angular: angular.IAngularStatic; 

export const emergency = angular.module('app.emergency', ['app.core']);

emergency.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {

  //$translatePartialLoaderProvider.addPart('app/emergency/locale/locale');

  NavHelperProvider.addControllerUrl('app/emergency/emergency.controller');
  NavHelperProvider.addToMenu('emergency', {
    "link": "#/emergency",
    "active": "main.emergency",
    "title": "Emergency",
    "icon": "fa  fa-medkit",  // Add navigation icon css class here
    "page": {
      "title": "Emergency",
      "description": "Emergency"
    }
  });

  $stateProvider.state('main.emergency', {
    url: 'emergency',
    access: 2,
    views: {
      'content': {
        templateUrl: 'src/app/emergency/emergency.tpl.html',
        controller: 'emergencyCtrl'
      }
    }
  });
});

/* non ES6 export */
// export = emergency;
// export default emergency;