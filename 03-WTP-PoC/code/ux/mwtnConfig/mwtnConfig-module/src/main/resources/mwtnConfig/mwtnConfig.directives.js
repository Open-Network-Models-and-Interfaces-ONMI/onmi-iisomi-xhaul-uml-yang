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
        schema: '=schema'
      },
      templateUrl : 'src/app/mwtnConfig/templates/show.tpl.html',
      controller :  ['$scope', 'orderByFilter', function($scope, orderBy){
        
        if ($scope.parameters) {
          
          if ((typeof $scope.parameters) === 'string') {
             $scope.attributes = $scope.parameters; 
          } else {
  
            var attributes = Object.keys($scope.parameters).map(function(parameter) {
              if ($scope.schema[parameter]) {
                return {
                  name: parameter,
                  value: $scope.parameters[parameter],
                  order: $scope.schema[parameter]['order-number'],
                  unit:  $scope.schema[parameter].unit,
                }
              } else {
                return {
                  name: parameter,
                  value: $scope.parameters[parameter],
                  order: 0,
                  unit:  'error',
                }
              }
            });
            
            $scope.attributes =  orderBy(attributes, 'order', false);
          }
        }
        
        $scope.getType = function(value) {
          var result = typeof value;
          if (result === 'object' && JSON.stringify(value).substring(0,1) === '[') {
            result = 'array';
          }
          return result;
        };
        $scope.showArray = function(value) {
          console.log(JSON.stringify(value));
        }
        $scope.showObject = function(value) {
          console.log(JSON.stringify(value));
        }
      }]
    };
  });
  
});