 

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
        $scope.oneAtATime = true;
        $scope.connectedNetworkElements = [];
  
      };
      init();

    }]);
});