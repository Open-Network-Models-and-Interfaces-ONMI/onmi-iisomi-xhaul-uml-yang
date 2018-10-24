 

define(['app/protection/protection.module',
'app/protection/protection.services',
'app/mwtnCommons/mwtnCommons.module'],
function (protectionApp) {

  protectionApp.register.controller('protectionCtrl', ['$scope', '$rootScope', '$timeout', '$window', '$q', 'uiGridConstants', '$uibModal', '$protection', '$mwtnLog',
    function ($scope, $rootScope, $timeout, $window, $q, uiGridConstants, $uibModal, $protection, $mwtnLog) {

      var COMPONENT = 'protectionCtrl';
      $mwtnLog.info({ component: COMPONENT, message: 'protectionCtrl started!' });
      $rootScope.section_logo = 'src/app/protection/images/protection.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
      
      var init = function() {
        $scope.oneAtATime = false;
        $scope.protectionGroups = [{uuid:'1.23.4 RX'},{uuid:'1.23.4 TX'}];
      };
      init();

      $scope.$watch(function(scope) { return scope.networkElement },
        function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            init();
          }
          console.info(newValue, oldValue, newValue !== oldValue);
        }
      );
        
    }]);
});