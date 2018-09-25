declare var angular: angular.IAngularStatic; 

import { EmergencyService, LteRanCellRestriction, FabControlLte } from "./emergency.service"; 

import "./emergency.service";

const emergency = angular.module('app.emergency');

interface IEmergencyCtrlScope {
  message: string;
  equipmentIds: string[];
  selectedEquipmentId: string;
  adminState: boolean;
  emergency: boolean;
  toggleAdminState: () => void;
  toggleEmergencyState: () => void;
  isBusy: boolean;
  currentLteRanCellRestriction: LteRanCellRestriction
}

class EmergencyCtrl {
  private lastSelectedEquipmentId: string = undefined;

  constructor($rootScope: ng.IRootScope, $scope: ng.IScope & IEmergencyCtrlScope, $timeout, private $q: ng.IQService, $mwtnCommons, private emergencyService: EmergencyService) {
    $rootScope.section_logo = 'src/app/emergency/images/emergency.png'; 
    $scope.message = "Empty";
    $scope.equipmentIds = [];
    $scope.selectedEquipmentId = undefined;
    $scope.adminState = undefined;
    $scope.emergency = undefined;
    $scope.isBusy = false;
    $scope.currentLteRanCellRestriction = undefined;

    // get all avaliable equipments from the emegercy service
    emergencyService.getEquiomentIds().then(equipmentIds => {
      $scope.equipmentIds = equipmentIds;
    });

    // selected equiment has changed
    $scope.$watch("selectedEquipmentId", (newVal: string, oldVal: string) => {
      if (newVal === oldVal || !newVal) return;
      this.$q.all([
        emergencyService.getAdminUpState(newVal),
        emergencyService.getBarringFactor(newVal),
        emergencyService.getLteRanCellRestriction(newVal)
      ]).then(results => {
        $scope.adminState = results[0];
        $scope.emergency = results[1] == 0;
        $scope.currentLteRanCellRestriction = results[2];
      });
    });

    // toggles the admin state
    $scope.toggleAdminState = () => {
      $scope.isBusy = true;
      emergencyService.setAdminUpState(!$scope.adminState, $scope.selectedEquipmentId)
        .then(r => {
          $scope.isBusy = false;
          $scope.adminState = r; 
        })
        .catch(err => {
          $scope.isBusy = false;
          console.error(err);
        });
    };

    // toggles the emergency state
    $scope.toggleEmergencyState = () => {
      emergencyService.setBarringFactor($scope.emergency ? 95 : 0, $scope.selectedEquipmentId)
        .then(r => {
          $scope.emergency = r == 0;
          emergencyService.getLteRanCellRestriction($scope.selectedEquipmentId).then(res => {
            $scope.isBusy = false;
            $scope.currentLteRanCellRestriction = res;
          });
        })
        .catch(err => {
          $scope.isBusy = false;
          console.error(err);
        });
    };

  }
}

emergency.controller('emergencyCtrl', ['$scope', '$timeout', '$q', '$mwtnCommons', 'emergencyService', EmergencyCtrl ]);