// import * as angular from 'angularAMD';
declare var angular: angular.IAngularStatic; 

export const mwtnInventory = angular.module('app.mwtnInventory', ['app.core']);

mwtnInventory.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {

  //$translatePartialLoaderProvider.addPart('app/mwtnInventory/locale/locale');

  NavHelperProvider.addControllerUrl('app/mwtnInventory/mwtnInventory.controller');
  NavHelperProvider.addToMenu('mwtnInventory', {
    "link": "#/pnfInventory/",
    "active": "main.mwtnInventory",
    "title": "pnf Inventory",
    "icon": "fa  fa-book",  // Add navigation icon css class here
    "page": {
      "title": "pnf Inventory",
      "description": "mwtnInventory"
    }
  });

  $stateProvider.state('main.mwtnInventory', {
    url: 'pnfInventory/:nodeId?',
    access: 2,
    views: {
      'content': {
        templateUrl: 'src/app/mwtnInventory/mwtnInventory.tpl.html',
        controller: 'mwtnInventoryCtrl'
      }
    }
  });
});

/* non ES6 export */
// export = mwtnInventory;   
// export default mwtnInventory;