declare var angular: angular.IAngularStatic;

export const help = angular.module('app.help', ['app.core']);

help.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {

  //$translatePartialLoaderProvider.addPart('app/help/locale/locale');

  NavHelperProvider.addControllerUrl('app/help/help.controller');
  NavHelperProvider.addToMenu('help', {
    "link": "#/help/",
    "active": "main.help",
    "title": "Help",
    "icon": "fa fa-question-circle",  // Add navigation icon css class here
    "page": {
      "title": "MWTN Demo",
      "description": "help"
    }
  });

  $stateProvider.state('main.help', {
    url: 'help/*path',
    access: 2,
    views: {
      'content': {
        templateUrl: 'src/app/help/help.tpl.html',
        controller: 'helpCtrl as vm'
      }
    }
  });
});

/* non ES6 export */
// export = help;   
// export default help;