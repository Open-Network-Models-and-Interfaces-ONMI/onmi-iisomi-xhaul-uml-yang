/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

define(['app/mwtnCompare/mwtnCompare.module','app/mwtnCompare/mwtnCompare.services'], function(mwtnCompareApp) {

  mwtnCompareApp.register.controller('mwtnCompareCtrl', ['$scope', '$rootScope', '$modal', '$mwtnCompare', function($scope, $rootScope, $modal, $mwtnCompare) {

    $rootScope['section_logo'] = 'src/app/mwtnCompare/images/logo_mwtn_compare.png'; 

    $scope.mwtnCompareInfo = {};


    $scope.oneAtATime = true;
    $scope.getKeys = function(object) {
        return Object.keys(object);
    };
    $scope.getUnit = function(key) {
        if ($scope.descriptionKeys) {
	var index = $scope.descriptionKeys.indexOf(key);
	if (index === -1) {return '';}
        return $scope.descriptions[index].unit;
        }
    };
    $scope.getDescription = function(key) {
        if ($scope.descriptionKeys) {
	var index = $scope.descriptionKeys.indexOf(key);
	if (index === -1) {return '';}
        return $scope.descriptions[index].p;
        }
    };

    $scope.data = "mwtnCompare";
    $mwtnCompare.getNetworkElements(function(networkElements){
        $scope.networkElements = networkElements;
        $scope.networkElements.network.networkElement.map(function(ne) {
            ne.connectionStatus = 'disconnected';
        });
    });
    $mwtnCompare.getReferenceValues(function(referenceValues){
        $scope.referenceValues = referenceValues;
        //console.log(JSON.stringify($scope.referenceValues.network.networkElement));
        $scope.referenceValues.network.networkElement.map(function(ne){
            var mwsCount = ne.MW_Structure_Pac.length;
	    ne.MW_Container_Pac.map(function(pac) {
                var length = pac.containerConfiguration.container.numberOfTimeSlotsRequired;
                pac.containerConfiguration.timeSlotIDList = [];
                for (var mws = 0; mws < mwsCount; mws++) {
                    var serverId = ne.MW_Structure_Pac[mws].structureConfiguration.serverID;
                    for (var timeSlot = 0; timeSlot < length/mwsCount; timeSlot++) {
                        pac.containerConfiguration.timeSlotIDList.push([serverId, timeSlot+1].join('.'));
                    }
                }
            });
        });
    });
    $mwtnCompare.getDescriptions(function(descriptions){
        $scope.descriptions = descriptions;
	$scope.descriptionKeys = descriptions.map(function(desc){return desc.id});
    });


    var messages = {
       connect: {
         messageId: 'connect',
         title: 'Connect',
         description: ['Attention: Please be careful! Qualified user expected! ', 'However, the "Connect" feature is not yet implemented.']
       },
       disconnect: {
         messageId: 'disconnect',
         title: 'Disconnect',
         description: ['Attention: Please be careful! Qualified user expected! ', 'However, the "Disconnect" feature is not yet implemented.']
       },
       changeNetworkElementName: {
         messageId: 'changeNetworkElementName',
         title: 'Change network element name',
         description: ['Attention: Please be careful! Qualified user expected! ', 'However, the "Change network element name" feature is not yet implemented.']
       },
       operation2Planning: {
         messageId: 'operation2Planning',
         title: 'Operation to planning',
         description: ['Attention: Please be careful! Qualified user expected! ', 'However, the "Operation to planning" feature is not yet implemented.']
       },
       planning2Operation: {
         messageId: 'planning2Operation',
         title: 'Planning to operation',
         description: ['Attention: Please be careful! Qualified user expected! ', 'The follwing values will be configured in the network element.', 'However, the "Planning to operation" feature is not yet implemented.']
       }
    };
    $scope.message = function (messageId, info) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'src/app/mwtnCompare/templates/message.html',
        controller: 'messageInstanceCtrl',
        resolve: {
          model: function () {
            var msg = messages[messageId];
            msg.info = info;
            return msg;
          }
        }
      });

      modalInstance.result.then(function (result) {
        console.log(result);
      }, function () {
        console.info('Message dismissed at: ' + new Date());
      });
    };

  }]);

  mwtnCompareApp.register.controller('messageInstanceCtrl', function ($scope, $modalInstance, model) {

    $scope.model = model;
    $scope.ok = function () {
      $modalInstance.close('OK');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
});


});
