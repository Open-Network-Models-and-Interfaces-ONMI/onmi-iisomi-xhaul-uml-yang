 

define(['app/protection/protection.module',
'app/protection/protection.services',
'app/mwtnCommons/mwtnCommons.module'],
function (protectionApp) {

  protectionApp.register.controller('protectionCtrl', ['$scope', '$rootScope', '$timeout', '$window', '$q', 'uiGridConstants', '$uibModal', '$protection', '$mwtnLog',
    function ($scope, $rootScope, $timeout, $window, $q, uiGridConstants, $uibModal, $protection, $mwtnLog) {

      var COMPONENT = 'protectionCtrl';
      $mwtnLog.info({ component: COMPONENT, message: 'protectionCtrl started!' });
      $rootScope.section_logo = 'src/app/protection/images/protection.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

      $scope.oneAtATime = true;
      $scope.spinner = {};
      $scope.spinner.TEST = true;

      var nameCellTemplate = [
        '<div class="ui-grid-cell-contents">',
        '  <a href="{{row.entity.webUri}}" target="_blank" title="Access NE web application" ng-show="row.entity.webUri">',
        '    <i class="fa fa-external-link" aria-hidden="true"></i>',
        '    <span>{{grid.getCellValue(row, col)}}</span>',
        '  </a>',
        '  <span ng-show="!row.entity.webUri">{{grid.getCellValue(row, col)}}</span>',
        '</div>'].join('');

      $scope.protectionGridOptions = JSON.parse(JSON.stringify($protection.gridOptions));
      $scope.protectionGridOptions.rowHeight = 44;
      $scope.protectionGridOptions.columnDefs = [
        {
          field: 'name',
          type: 'string', displayName: 'Name',
          headerCellClass: $scope.highlightFilteredHeader, width: 230,
          cellTemplate: nameCellTemplate,
          pinnedLeft: true,
          sort: {
            direction: uiGridConstants.ASC,
            ignoreSort: false,
            priority: 0
          },
          enableCellEdit: false
        },
      ];
    }]);
});