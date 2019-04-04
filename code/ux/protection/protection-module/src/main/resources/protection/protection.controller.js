define(['app/protection/protection.module',
  'app/protection/protection.services',
  'app/mwtnCommons/mwtnCommons.module'],
  (protectionApp) => {

    protectionApp.register.directive('protectionGroupWorking', () => {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          direction: '='
        },
        templateUrl: 'src/app/protection/templates/protection-group-working.tpl.html',
        replace: true
      };
    });

    protectionApp.register.directive('protectionGroupProtection', () => {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          direction: '='
        },
        templateUrl: 'src/app/protection/templates/protection-group-protection.tpl.html',
        replace: true
      };
    });

    protectionApp.register.directive('protectionGroupProtected', () => {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        templateUrl: 'src/app/protection/templates/protection-group-protected.tpl.html',
        replace: true
      };
    });

    protectionApp.register.directive('protectionGroupGraph', () => {
      return {
        restrict: 'E',
        scope: {
          data: '='
        },
        templateUrl: 'src/app/protection/templates/protection-group-graph.tpl.html',
        replace: true
      };
    });

    protectionApp.register.directive('protectionGroup', () => {
      return {
        restrict: 'E',
        scope: {
          uuid: '=',
          networkElement: '='
        },
        controller: 'protectionGroupCtrl',
        controllerAs: 'vm',
        templateUrl: 'src/app/protection/templates/protection-group.tpl.html'
      };
    });

    protectionApp.register.controller('protectionGroupCtrl', ['$scope', '$protection', '$mwtnLog',
      function ($scope, $protection, $mwtnLog) {

        const COMPONENT = 'protectionGroupCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'protectionGroupCtrl started!' });

        const LAYERS = ['MWS', 'MWPS'];
        const PACS = ['microwave-model:mw-pure-ethernet-structure-pac', 'microwave-model:mw-air-interface-pac'];
        const PREFIX = ['pure-ethernet-structure-', 'air-interface-'];

        $scope.protectionGroupGraphData = {
          position: null,
          direction: null
        }

        const init = () => {
          $protection.getForwardingConstruct(
            $scope.networkElement.getId(),
            $scope.uuid
          ).then(
            (fc) => {
              // TODO make robust
              if (fc['forwarding-construct'] && fc['forwarding-construct'][0]) {
                $scope.data = fc['forwarding-construct'][0];
                const selectedFcPortId = $scope.data['fc-switch'][0]['selected-fc-port'][0];
                $scope.protectionGroupGraphData.direction = $scope.data.uuid.substring(0, 2).toLowerCase();
                $scope.terminationPoints = {};
                $scope.data['fc-port'].forEach((fcPort) => {
                  if (selectedFcPortId === fcPort.uuid) {
                    $scope.protectionGroupGraphData.position = fcPort.role;
                  }
                  const ltp = $scope.networkElement.getLtp(fcPort.ltp[0]);
                  const layerIndex = LAYERS.indexOf(ltp.getLayer());
                  const lpUuid = ltp.getLayerProtocols()[0].getId();
                  $scope.terminationPoints[fcPort.role] = {};
                  $scope.terminationPoints[fcPort.role].label = ltp.getPortLabel();
                  $scope.terminationPoints[fcPort.role].ltpUuid = ltp.getId();
                  $scope.terminationPoints[fcPort.role].layer = ltp.getLayer();
                  ['capability', 'configuration', 'status'].forEach((part) => {
                    const spec = {
                      nodeId: $scope.networkElement.getId(),
                      revision: $scope.revision,
                      pacId: PACS[layerIndex],
                      layerProtocolId: lpUuid,
                      partId: PREFIX[layerIndex] + part
                    };
                    $protection.getPacParts(spec).then(
                      (success) => {
                        $scope.terminationPoints[fcPort.role] = Object.assign($protection.yangifyObject(success), $scope.terminationPoints[fcPort.role]);
                      },
                      (error) => {
                        $mwtnLog.info({ component: COMPONENT, message: spec.partId + ': ' + JSON.stringify(error) });
                      });
                  });
                });
              } else {
                $scope.data = null;
                $mwtnLog.error({
                  component: COMPONENT,
                  message: 'Unexpected date received for forwarding construct ' + $scope.uuid + '. ' + JSON.stringify(error)
                });
              }
            },
            (error) => {
              $scope.data = null;
              $mwtnLog.error({
                component: COMPONENT,
                message: 'Reading forwarding construct ' + $scope.uuid + ' failed! ' + JSON.stringify(error)
              });
            });
        }
        init();

      }
    ]);

    protectionApp.register.controller('protectionCtrl', ['$scope', '$rootScope', '$timeout', '$window', '$q', 'uiGridConstants', '$uibModal', '$protection', '$mwtnLog', 'OnfNetworkElement',
      function ($scope, $rootScope, $timeout, $window, $q, uiGridConstants, $uibModal, $protection, $mwtnLog, OnfNetworkElement) {

        var COMPONENT = 'protectionCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'protectionCtrl started!' });
        $rootScope.section_logo = 'src/app/protection/images/protection.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'

        /**
         * @function updateNe 
         * A function, which updates onfNetworkElement by new data.
         * @param {*} data New data recieved from OpenDaylight via RestConf
         */
        var updateNe = function (data) {
          if (!data) return;
          // update onfNetworkElement
          switch ($scope.mountpoint.onfCoreModelRevision) {
            case '2016-03-23':
              $scope.onfNetworkElement = {};
              break;
            case '2016-08-09':
            case '2016-08-11':
            case '2017-02-17':
            case '2017-03-20':
            case '2017-03-24':
            case '2017-10-20':
              if (data['network-element']) {
                $scope.onfNetworkElement = new OnfNetworkElement(data['network-element']);

                // oops
                if ($scope.onfNetworkElement.getId() === undefined) {
                  $scope.onfNetworkElement.data.uuid = $scope.networkElement;
                }

                // Protection
                $scope.protectionGroups = {};
                if ($scope.onfNetworkElement.getProtectionGroups() && $scope.onfNetworkElement.getProtectionGroups().length > 0) {
                  $scope.protectionGroups = $scope.onfNetworkElement.getProtectionGroups()[0];
                }
              } else {
                $scope.protectionGroups = { error: 'Error in the communictaion with the NetConf server.' }
              }
              break;
            default:
              $mwtnLog.info({ component: COMPONENT, message: ['The ONF CoreModel revision', $scope.mountpoint.onfCoreModelRevision, ' is not supported (yet)!'].join(' ') });
              $scope.onfNetworkElement = {};
          }

          data.revision = undefined;
        };

        var init = () => {
          $scope.oneAtATime = false;
          $scope.protectionGroups = null;

          if ($scope.networkElement) {
            $scope.processing = true;
            $scope.revision = $scope.mountPoints.filter((mountpoint) => {
              return mountpoint['node-id'] === $scope.networkElement;
            }).map((mountpoint) => {
              $scope.mountpoint = mountpoint;
              return mountpoint.onfCoreModelRevision;
            })[0];

            var spec = {
              nodeId: $scope.networkElement,
              revision: $scope.revision,
              pacId: 'ne'
            };
            $protection.getPacParts(spec).then(
              (success) => {
                $scope.processing = false;
                updateNe($protection.yangifyObject(success));
              },
              (error) => {
                $scope.processing = false;
                updateNe(error);
              });
          }
        };
        init();

        $scope.$watch(function (scope) { return scope.networkElement },
          function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
              init();

            }
          }
        );

      }]);
  });