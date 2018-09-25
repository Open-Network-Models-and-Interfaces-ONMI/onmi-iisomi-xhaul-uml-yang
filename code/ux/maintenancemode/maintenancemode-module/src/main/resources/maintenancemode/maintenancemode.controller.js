
define(['app/maintenancemode/maintenancemode.module',
  'app/maintenancemode/maintenancemode.services',
  'app/mwtnCommons/mwtnCommons.module'],
  function (maintenancemodeApp) {

    maintenancemodeApp.register.controller('maintenancemodeCtrl', ['$scope', '$rootScope', '$timeout', '$window', '$q', 'uiGridConstants', '$uibModal', '$maintenancemode', '$mwtnLog',
      function ($scope, $rootScope, $timeout, $window, $q, uiGridConstants, $uibModal, $maintenancemode, $mwtnLog) {

        var COMPONENT = 'maintenancemodeCtrl';
        $mwtnLog.info({ component: COMPONENT, message: 'maintenancemodeCtrl started!' });
        $rootScope.section_logo = 'src/app/maintenancemode/images/maintenancemode.png'; // Add your topbar logo location here such as 'assets/images/logo_topology.gif'
        $scope.highlightFilteredHeader = $maintenancemode.highlightFilteredHeader;

        $scope.oneAtATime = true;
        $scope.status = { requiredNes: true };
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

        var manageMaintenenceTemplate = [
          '<span>&nbsp;&nbsp;</span>',
          '<div class="btn-group">',
          '  <button class="btn btn-primary" ng-click="grid.appScope.setonehrmaintenance(row.entity)" title="Set Maintenance for next 1 hours">+1h</button>',
          '  <button class="btn btn-primary" ng-click="grid.appScope.seteighthrmaintenance(row.entity)" title="Set Maintenance for next 8 hours">+8h</button>',
          '  <button class="btn btn-warning" ng-click="grid.appScope.addmaintenance(row.entity)" title="Set Maintenance Start and End Dates"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>',
          '  <button class="btn btn-danger" ng-click="grid.appScope.disablemaintenance(row.entity)" title="Disable Maintenance Mode"><i class="fa fa-ban" aria-hidden="true"></i></button>',
          '<div class="btn-group">',
          '<span>&nbsp;</span>'].join('');

        $scope.maintainNesGridOptions = JSON.parse(JSON.stringify($maintenancemode.gridOptions));
        $scope.maintainNesGridOptions.rowHeight = 44;
        $scope.maintainNesGridOptions.columnDefs = [
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
          { field: 'maintenancemode', type: 'boolean', displayName: 'Maintenance Mode', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false },
          { field: 'startdate', type: 'date', displayName: 'Start Date', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false },
          { field: 'enddate', type: 'date', displayName: 'End Date', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false },
          { field: 'actstate', type: 'string', displayName: 'Activation State', headerCellClass: $scope.highlightFilteredHeader, width: 180, enableCellEdit: false },
          {
            name: 'Manage',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: manageMaintenenceTemplate,
            width: 400,
            pinnedRight: true
          }
        ];

        /**
        * Request all defined (maintenance) network elements from database and
        * update the corresponding table in the ui.
        */

        var getMaintenanceNetworkElements = function () {
          $maintenancemode.getMaintenanceNetworkElements().then(function (maintenancenetworkElements) {
            $scope.maintainNesGridOptions.data = maintenancenetworkElements;
          }, function (error) {
            $scope.maintainNesGridOptions.data[maintenancenetworkElements];
          });
        };
        getMaintenanceNetworkElements();

        $scope.setonehrmaintenance = function (ne) {
          console.log("im here2", ne);
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'src/app/maintenancemode/templates/setonehrmaintenance.tpl.html',
            controller: 'setOnehrMaintenanceModeCtrl',
            size: 'lg',
            resolve: {
              currentNetworkElement: function () {
                return ne;
              }
            }
          });
          modalInstance.result.then(function (success) {
            console.log("success: ", success);
            if (success) {
              ne.maintenancemode = true;
              ne.startdate = success[0].start;
              ne.enddate = success[0].end;
              ne.actstate = 'Active';
              var doc = {
                node: ne.name,
                filter: success,
                active: 'true'
              };
              $maintenancemode.createSingleDocument('mwtn', 'maintenancemode', ne.name, doc).then(
                function (success) {
                  console.info(success);
                },
                function (error) {
                  console.error(error);
                }
              );
            }
          }, function (error) {
            console.log("dismissed: ", error);
            $mwtnLog.info({ component: COMPONENT, message: 'Maintenance  details dismissed !' });
          });

        };

        $scope.seteighthrmaintenance = function (ne) {
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'src/app/maintenancemode/templates/seteighthrmaintenance.tpl.html',
            controller: 'setEighthrMaintenanceModeCtrl',
            size: 'lg',
            resolve: {
              currentNetworkElement: function () {
                return ne;
              }
            }
          });
          modalInstance.result.then(function (success) {
            console.log("success: ", success);
            if (success) {
              ne.maintenancemode = true;
              ne.startdate = success[0].start;
              ne.enddate = success[0].end;
              ne.actstate = 'Active';
              var doc = {
                node: ne.name,
                filter: success,
                active: 'true'
              };
              $maintenancemode.createSingleDocument('mwtn', 'maintenancemode', ne.name, doc).then(
                function (success) {
                  console.info(success);
                },
                function (error) {
                  console.error(error);
                }
              );
            }
          }, function (error) {
            console.log("dismissed: ", error);
            $mwtnLog.info({ component: COMPONENT, message: 'Maintenance  details dismissed !' });
          });

        };

        $scope.addmaintenance = function (ne) {
          $scope.currentNetworkElement = ne;
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'src/app/maintenancemode/templates/maintenanceDates.tpl.html',
            controller: 'AddMaintenanceModeCtrl',
            size: 'lg',
            resolve: {
              currentNetworkElement: function () {
                return ne;
              }
            }
          });

          modalInstance.result.then(function (success) {
            var setmaintenance;
            ne.startdate = success.filter[0].start;
            ne.enddate = success.filter[0].end;
            var newact = success.state;

            var currentdate = new Date(new Date().toDateString() + ' ' + new Date().toTimeString()).toISOString();
            if (ne.startdate > currentdate || ne.enddate < currentdate) {
              setmaintenance = false;
            }
            else {
              setmaintenance = true;
            }
            if (newact) {
              ne.actstate = 'Active';
            } else {
              ne.actstate = 'Inactive';
              setmaintenance = false;
            }
            ne.maintenancemode = setmaintenance;


            var doc = {
              node: ne.name,
              filter: success.filter,
              active: success.state
            };
            $maintenancemode.createSingleDocument('mwtn', 'maintenancemode', ne.name, doc).then(
              function (success) {
                console.info(success);
              },
              function (error) {
                console.error(error);
              }
            );
            $mwtnLog.info({ component: COMPONENT, message: 'Mountpoint details added to M database' });
          }, function (error) {
            console.log("dismissed: ", error);
            $mwtnLog.info({ component: COMPONENT, message: 'Mountpoint details dismissed!' });
          });

        };

        $scope.disablemaintenance = function (ne) {
          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'src/app/maintenancemode/templates/disablemaintenancemode.tpl.html',
            controller: 'disableMaintenanceModeCtrl',
            size: 'lg',
            resolve: {
              currentNetworkElement: function () {
                return ne;
              }
            }
          });
          modalInstance.result.then(function (success) {
            console.log("success: ", success);
            ne.maintenancemode = false;
            ne.actstate = 'Inactive'
            var newfil = [{
              start: ne.startdate,
              end: ne.enddate
            }];
            var doc = {
              node: ne.name,
              filter: newfil,
              active: false
            };

            $maintenancemode.createSingleDocument('mwtn', 'maintenancemode', ne.name, doc).then(
              function (success) {
                console.info(success);
              },
              function (error) {
                console.error(error);
              }
            );
          }, function (error) {
            console.log("dismissed: ", error);
            $mwtnLog.info({ component: COMPONENT, message: 'Maintenance  details dismissed !' });
          });
        }; 

        $scope.status = {requiredNes: true };
        $scope.spinner = {requiredNes: false };
        $scope.$watch('status', function (status, oldValue) {
          Object.keys(status).map(function (key) {
            if (status[key] !== oldValue[key]) {
              $scope.spinner[key] = status[key];
              switch (key) {
                case 'requiredNes':
                  if (status[key]) {
                    $timeout(function(){ getMaintenanceNetworkElements();}, 200);
                  }
                  break;
                default:
                  $mwtnLog.error({ component: COMPONENT, message: key + ' is not implemented!' });
              }
            }
          });
        }, true);
      }]);

    maintenancemodeApp.register.controller('setOnehrMaintenanceModeCtrl', ['$scope', '$uibModalInstance', 'currentNetworkElement',
      function ($scope, $uibModalInstance, currentNetworkElement) {

        var COMPONENT = 'setOnehrMaintenanceModeCtrl';
        $scope.data = {
          ne: currentNetworkElement
        }

        $scope.getDateFormat = function (newtime) {
          newtime = newtime.replace(/\.[0-9]{3}/, '');
          return newtime
        };

        $scope.currentNetworkElement = currentNetworkElement;

        $scope.ok = function () {
          $scope.confirmError = undefined;
          $scope.confirmSuccess = undefined;

          var newcurrtime = new Date();
          newcurrtime.setSeconds(0);
          var newaftereighthours = new Date(newcurrtime);
          newaftereighthours.setHours(newcurrtime.getHours() + 1);
          newaftereighthours.setSeconds(0);

          var newsetstart = new Date(newcurrtime.toDateString() + " " + newcurrtime.toTimeString()).toISOString();
          var newsetend = new Date(newaftereighthours.toDateString() + " " + newaftereighthours.toTimeString()).toISOString();
          var newupdsetstart = $scope.getDateFormat(newsetstart);
          var newupdsetend = $scope.getDateFormat(newsetend);
          var filter = [{
            start: newupdsetstart,
            end: newupdsetend
          }];
          $uibModalInstance.close(filter);

        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]);

    maintenancemodeApp.register.controller('setEighthrMaintenanceModeCtrl', ['$scope', '$uibModalInstance', 'currentNetworkElement',
      function ($scope, $uibModalInstance, currentNetworkElement) {

        var COMPONENT = 'setEighthrMaintenanceModeCtrl';
        $scope.data = {
          ne: currentNetworkElement
        }

        $scope.getDateFormat = function (newtime) {
          newtime = newtime.replace(/\.[0-9]{3}/, '');
          return newtime
        };

        $scope.currentNetworkElement = currentNetworkElement;

        $scope.ok = function () {
          $scope.confirmError = undefined;
          $scope.confirmSuccess = undefined;

          var newcurrtime = new Date();
          newcurrtime.setSeconds(0);
          var newaftereighthours = new Date(newcurrtime);
          newaftereighthours.setHours(newcurrtime.getHours() + 8);
          newaftereighthours.setSeconds(0);

          var newsetstart = new Date(newcurrtime.toDateString() + " " + newcurrtime.toTimeString()).toISOString();
          var newsetend = new Date(newaftereighthours.toDateString() + " " + newaftereighthours.toTimeString()).toISOString();
          var newupdsetstart = $scope.getDateFormat(newsetstart);
          var newupdsetend = $scope.getDateFormat(newsetend);
          var filter = [{
            start: newupdsetstart,
            end: newupdsetend
          }];
          $uibModalInstance.close(filter);

        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]);

    maintenancemodeApp.register.controller('AddMaintenanceModeCtrl', ['$scope', '$uibModalInstance', 'currentNetworkElement',
      function ($scope, $uibModalInstance, currentNetworkElement) {
        if (currentNetworkElement.startdate && currentNetworkElement.enddate) {
          var existstartdate = new Date(currentNetworkElement.startdate);
          var existenddate = new Date(currentNetworkElement.enddate);
          var nexiststartdate = new Date(existstartdate.toDateString() + ' ' + existstartdate.toTimeString());
          var nexistenddate = new Date(existenddate.toDateString() + ' ' + existenddate.toTimeString());

          $scope.addstarttime = nexiststartdate;
          $scope.startdate = nexiststartdate;
          $scope.addendtime = nexistenddate;
          $scope.enddate = nexistenddate;
        }
        else {
          var startdate = new Date(new Date().toDateString() + ' ' + '06:00');
          var enddate = new Date(new Date().toDateString() + ' ' + '06:00');
          $scope.addstarttime = startdate;
          $scope.startdate = startdate;
          enddate.setYear(enddate.getFullYear() + 5);
          $scope.addendtime = enddate;
          $scope.enddate = enddate;
        }
        if (currentNetworkElement.actstate === 'Active') {
          $scope.setstate = true;
        }
        else {
          $scope.setstate = false;
        }

        var COMPONENT = 'AddMaintenanceModeCtrl';
        $scope.data = {
          ne: currentNetworkElement
        }

        $scope.getDateFormat = function (newtime) {
          newtime = newtime.replace(/\.[0-9]{3}/, '');
          return newtime
        };

        $scope.currentNetworkElement = currentNetworkElement;
        $scope.ok = function () {
          $scope.confirmError = undefined;
          $scope.confirmSuccess = undefined;

          if (!$scope.startdate) {
            $scope.confirmError = 'Please enter the Start Date';
            return;
          }
          if (!$scope.addstarttime) {
            $scope.confirmError = 'Please enter the Start Time';
            return;
          }
          if (!$scope.enddate) {
            $scope.confirmError = 'Please enter the End Date';
            return;
          }
          if (!$scope.addendtime) {
            $scope.confirmError = 'Please enter the End Time';
            return;
          }

          var updstartdate1 = new Date($scope.startdate.toDateString() + " " + $scope.addstarttime.toTimeString());
          var updenddate1 = new Date($scope.enddate.toDateString() + " " + $scope.addendtime.toTimeString());
          var now1 = new Date();
          if ((updstartdate1.getTime() - updenddate1.getTime()) >= 0) {
            $scope.confirmError = 'Please enter the End Date and Time greater than Start Date and Time.';
            return;
          }

          var addupdstartdate = new Date($scope.startdate.toDateString() + " " + $scope.addstarttime.toTimeString()).toISOString();
          var addupdenddate = new Date($scope.enddate.toDateString() + " " + $scope.addendtime.toTimeString()).toISOString();
          var addupdstartdatenew = $scope.getDateFormat(addupdstartdate);
          var addupdenddatenew = $scope.getDateFormat(addupdenddate);
          var filter = [{
            start: addupdstartdatenew,
            end: addupdenddatenew
          }];
          var result = {
            filter: filter,
            state: $scope.setstate
          }
          $uibModalInstance.close(result);

        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]);

    maintenancemodeApp.register.controller('disableMaintenanceModeCtrl', ['$scope', '$uibModalInstance', 'currentNetworkElement',
      function ($scope, $uibModalInstance, currentNetworkElement) {

        var COMPONENT = 'disableMaintenanceModeCtrl';
        $scope.data = {
          ne: currentNetworkElement
        }
        $scope.currentNetworkElement = currentNetworkElement;

        $scope.ok = function () {
          $scope.confirmError = undefined;
          $scope.confirmSuccess = undefined;
          $uibModalInstance.close();

        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }]);
  });