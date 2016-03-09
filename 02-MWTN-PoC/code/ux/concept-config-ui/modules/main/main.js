var main = angular.module('main', [
    'ngRoute', 'ngCookies', 'ui.router', 'conceptCtrl'
]);

main.run(function($rootScope, $state, $stateParams) {

  // It's very handy to add references to $state and $stateParams to
  // the
  // $rootScope
  // so that you can access them from any scope within your
  // applications.
  // For example,
  // <li ng-class="{ active: $state.includes('contacts.list') }"> will
  // set
  // the <li>
  // to active whenever 'contacts.list' or one of its decendents is
  // active.
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.title = 'htSolutions';
});

main.config([
    '$routeProvider', function($routeProvider) {
        $routeProvider.when('/concept', {
            templateUrl : '/modules/concept/concept.html',
            controller : 'conceptCtrl'
        }).otherwise({
            redirectTo : '/concept'
        });
    }
]);

main.directive('htHeader', function() {
  'use strict';
  return {
      restrict : 'E',
      // replace: true, // important! do not un-comment
      templateUrl : '/modules/directives/header/header.html',
      scope : {
          headline : '@headline',
          objectId : '@objectId',
          objectName : '@objectName'
      },
      controller : function($scope, translateService, $header) {
        console.log('initheader');
        $scope.languages = {
          en_US : {
            title: 'English US',
            flag : 'us'
          },
          pt_BR : {
            title: 'Português Brasileiro',
            flag: 'br'
          }, 
          es_ES : {
            title: 'Español',
            flag: 'es'
          },
          it_IT : {
            title: 'Italiano',
            flag: 'it'
          },
          fr_FR : {
            title: 'Français',
            flag: 'fr'
          },
          de_DE : {
            title: 'Deutsch',
            flag: 'de'
          }
        };
        
          $scope.changeLanguage = translateService.changeLanguage;
          $scope.status = $header.status;
          $scope.previous = $header.previous;
          $scope.next = $header.next;
          $header.attributeValueChangeListener(function() {
              $scope.status = $header.status;
              $scope.previous = $header.previous;
              $scope.next = $header.next;               
          });
      }
  };
});

main.factory('$header', function($rootScope) {
  
  var notificationId = 'headerChanged';
  var service = {};

  service.status = {};
  service.previous = {link: '/#/', title: '', active: false};
  service.next = {link: '/#/', title: '', acrive: false};
  
  service.setNavigation = function(nav) {
    service.navigation = nav;
    this.attributeValueChangeNotification(notificationId);
  };
  service.setStatus = function(status) {
    service.status = status;
    this.attributeValueChangeNotification(notificationId);
  };
  service.setPrevious = function(previous) {
      service.previous = previous;
      this.attributeValueChangeNotification(notificationId);
  };
  service.setNext = function(next) {
      service.next = next;
      this.attributeValueChangeNotification(notificationId);
  };
  service.attributeValueChangeNotification = function(handle) {
      $rootScope.$broadcast(handle);
  };
  service.attributeValueChangeListener = function(callback) {
      $rootScope.$on(notificationId, callback);
  };
  return service;
});