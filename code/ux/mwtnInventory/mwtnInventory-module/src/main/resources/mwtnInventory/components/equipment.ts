declare var angular: angular.IAngularStatic;  

import { Equipment } from '../models/equipment';

const mwtnInventory = angular.module('app.mwtnInventory');

const EquipmentDirective = () => {
  return {
    templateUrl: 'src/app/mwtnInventory/components/equipment.html',
    controller: 'mwtnEquipmentCtrl',
    controllerAs: 'vm',
    scope: {
      equipment: "="
    }
  }
};

mwtnInventory.directive('mwtnEquipment', EquipmentDirective);

export class EquipmentController {
  constructor(private $scope: ng.IScope & { equipment: Equipment }) {
   
  }

 
}

mwtnInventory.controller('mwtnEquipmentCtrl', ['$scope', EquipmentController]);
