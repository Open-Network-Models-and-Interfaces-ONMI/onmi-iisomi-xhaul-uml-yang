define(['angular'], function (angular) {
  'use strict';

  var NavCtrl = function ($scope, NavHelper) {
    $scope.navList = NavHelper.getMenu();
  };
  NavCtrl.$inject = ['$scope', 'NavHelper'];

  var NavItemCtrl = function ($scope) {
    $scope.display = 'none';
    $scope.isOpen = false;

    $scope.isValid = function (value) {
      if (angular.isUndefined(value) || value === null) {
        return false;
      } else {
        return true;
      }
    };

    $scope.updateTemplate = function (e) {
      e.stopPropagation();
      e.preventDefault();

      $scope.isOpen = !$scope.isOpen;
      if ($scope.display === 'none') {
        $scope.display = 'block';
      } else {
        $scope.display = 'none';
      }
    };
  };
  NavItemCtrl.$inject = ['$scope', 'NavHelper'];

  return {
    NavCtrl: NavCtrl,
    NavItemCtrl: NavItemCtrl
  };

});
