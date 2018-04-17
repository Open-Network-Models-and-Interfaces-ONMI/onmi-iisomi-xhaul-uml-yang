declare var angular: angular.IAngularStatic; 

import { InventoryService } from "./mwtnInventory.service"; 
import "./mwtnInventory.service";
import "./components/equipment";
import "./components/equipmentGroup";

const mwtnInventory = angular.module('app.mwtnInventory');

interface IMwtnInventoryScope extends ng.IScope {
  message: string,
  equipments: {}[];
  loading: boolean;
  activeMountPoints: string[];
  selectedMountPoint: string;
}

class MwtnInventoryCtrl {
  constructor(private $rootScope, private $scope: IMwtnInventoryScope, private $state, private $timeout, private mwtnInventoryService: InventoryService) {
    // todo: change this
    $rootScope.section_logo = 'src/app/mwtnInventory/images/mwtnInventory.png';

    $scope.loading = false;
    $scope.message = "Empty";
    $scope.equipments = [];
    $scope.selectedMountPoint = null;

    $scope.activeMountPoints = [];

    const getAllChildEquipments = async (equipmentsRootId: string, equimentIds: string[]) => {
      if (!equimentIds || !equimentIds.length) {
        return [];
      }
      const equipmentObjects = (await Promise.all(equimentIds.map(id => {
        return mwtnInventoryService.getEquipmentDetails(equipmentsRootId, id);
      }))).map(eq => (eq["equipment"][0]));

      const equipmentConditionals = (await Promise.all(equimentIds.map(id => {
        return mwtnInventoryService.getEquipmentConditionals(equipmentsRootId, id);
      }))).map(eq => (eq["equipment-pac"][0]));
      
      let results = await Promise.all(equipmentObjects.map(eq => {
        let fruNames: string[] = (eq["contained-holder"] || []).map(ch => ch["occupying-fru"]).filter(fru => !!fru);
        return getAllChildEquipments(equipmentsRootId, fruNames);
      }));

      return equipmentObjects.reduce((acc, cur, ind, arr) => {
        let conditional = equipmentConditionals[ind] || null;
        // ensure ENVERY property can be null or undefined
        let manufacturedThing = cur['manufactured-thing'];
        let equipmentType = manufacturedThing && manufacturedThing['equipment-type'];
        let manufacturerProperties = manufacturedThing && manufacturedThing['manufacturer-properties'];
        let equipmentInstance = manufacturedThing && manufacturedThing['equipment-instance'];

        let card = {
          name: cur.name,
          label: cur.label,
          uuid: cur.uuid,
          manufacturer: {
            version: equipmentType && equipmentType["version"],
            description: equipmentType && equipmentType["description"],
            partTypeIdentifier: equipmentType && equipmentType["part-type-identifier"],
            modelIdentifier: equipmentType && equipmentType["model-identifier"],
            partTypeIdetypeNamentifier: equipmentType && equipmentType["type-name"],
            id: manufacturerProperties && manufacturerProperties['manufacturer-identifier'],
            date: equipmentInstance && equipmentInstance['manufacture-date'] && Date.parse(equipmentInstance && equipmentInstance['manufacture-date']),
            serial: equipmentInstance && equipmentInstance['serial-number']
          },
          conditional: conditional
        };
        (results[ind].length ? card['children'] = results[ind] : null);
        acc.push(card);
        return acc;
      }, []);
    }

    const pleaseSelect = "Please select a mount point";

    const refresh = async (equipmentsRootId: string) => {
      let rootIdentifiers = await mwtnInventoryService.getRootIdentifiers(equipmentsRootId);
      let equipments = rootIdentifiers && await getAllChildEquipments(equipmentsRootId, rootIdentifiers);
      $timeout(() => {
        $scope.equipments = equipments;
      });
    };

    mwtnInventoryService.getConnectedMountpoints().then(res => {
      $scope.activeMountPoints = [pleaseSelect, ...res] ;
      $scope.selectedMountPoint = $scope.selectedMountPoint || pleaseSelect;
    });

    $scope.$watch(() => ($state.params.nodeId), (newVal: string, oldVal: string) => {
      $scope.selectedMountPoint = newVal;
    });

    $scope.$watch("selectedMountPoint", async (newVal: string, oldVal: string) => {
      if (!newVal || newVal === pleaseSelect) {
        $scope.equipments = [];
        return;
      }
      if ($scope.activeMountPoints[0] === pleaseSelect) {
        [, ...$scope.activeMountPoints] = $scope.activeMountPoints;
      } 
      $scope.loading = true;
      if ($state.params.nodeId !== newVal) {
        $state.go('main.mwtnInventory', { nodeId: newVal }, { notify: false });
      }
      await refresh(newVal).catch(err => {
        $timeout(() => { $scope.equipments = null; });
      });
      $timeout(() => { $scope.loading = false; });
    });
  }
}

mwtnInventory.controller('mwtnInventoryCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'mwtnInventoryService', MwtnInventoryCtrl]);
