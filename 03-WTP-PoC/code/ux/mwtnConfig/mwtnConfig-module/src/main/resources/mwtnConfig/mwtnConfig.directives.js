/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define([ 'app/mwtnConfig/mwtnConfig.module',], function(mwtnConfigApp) {

  mwtnConfigApp.register.directive('parameters', function() {
    return {
      restrict : 'A',
      scope: {
        parameters: '=parameters',
        path: '=path'
      },
      templateUrl : 'src/app/mwtnConfig/templates/show.tpl.html',
      windowClass: 'app-modal-window',
      size: 'mysize',
      controller :  ['$uibModal', '$scope', 'orderByFilter', '$mwtnConfig', function($uibModal, $scope, orderBy, $mwtnConfig){
        
        $scope.schema = {initDirectiveCtrl:false};
        var update = function() {
          if (!$scope.parameters) {
              return;
          }
          if ((typeof $scope.parameters) === 'string') {
             $scope.info = $scope.parameters; 
          } else {
            var attributes = $mwtnConfig.getAttributes($scope.parameters, $scope.schema);
            $scope.attributes =  orderBy(attributes, 'order', false);
          }
        };
        
        $mwtnConfig.getSchema().then(function(schema){
          $scope.schema = schema;
          update();
          $scope.$watch('parameters', function(nv, ov){
            if (nv && nv !== ov) {
              update();
            }
          });
        }, function(error){
          console.error(error);
        });
        
        $scope.getType = function(value) {
          var result = typeof value;
          if (result === 'object' && JSON.stringify(value).substring(0,1) === '[') {
            result = 'array';
          }
          return result;
        };

        $scope.showArray = function(path, attribute) {
          $scope.path = path;
          $scope.path.attribute = attribute.name,
          $scope.listData = attribute.value; // which is an array
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'src/app/mwtnConfig/templates/showArray.html',
            controller: 'ShowListCtrl',
            size: 'huge',
            resolve: {
              listData: function () {
                return {path:$scope.path, listData:$scope.listData};
              }
            }
          });

          modalInstance.result.then(function (listData) {
            
            // $mwtnLog.info({component: COMPONENT, message: 'Mount result: ' + JSON.stringify(netconfServer)});
          }, function () {
            // $mwtnLog.info({component: COMPONENT, message: 'Creation of new planned NetworkElement dismissed!'});
          });
        };

        $scope.showObject = function(value) {
          console.log(JSON.stringify(value));
        };
      }]
    };
  });
  
});