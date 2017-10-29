declare var angular: angular.IAngularStatic; 

import { Equipment } from '../models/equipment';

const mwtnInventory = angular.module('app.mwtnInventory');

const EquipmentGroupDirective = ($compile) => {
  return {
    templateUrl: 'src/app/mwtnInventory/components/equipmentGroup.html',
    controller: 'mwtnEquipmentGroupCtrl',
    controllerAs: 'vm',
    scope: {
      equipments: "="
    },
    // HACK: for angular 1.4. compatibility
    compile: function (tElement, tAttr, transclude) {
      var contents = tElement.contents().remove();
      var compiledContents;
      return function (scope, iElement, iAttr) {
        if (!compiledContents) {
          compiledContents = $compile(contents, transclude);
        }
        compiledContents(scope, function (clone, scope) {
          iElement.append(clone);
        });
      };
    }
  }
};

mwtnInventory.directive('mwtnEquipmentGroup', ['$compile', EquipmentGroupDirective]);

export class EquipmentGroupController {
  constructor(private $scope: ng.IScope & { equipments: Equipment[] }) {
    //console.log("EquipmentGroupController", $scope.equipments);
    
  }

}

mwtnInventory.controller('mwtnEquipmentGroupCtrl', ['$scope', EquipmentGroupController]);