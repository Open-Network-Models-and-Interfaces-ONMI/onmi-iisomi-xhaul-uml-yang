declare var angular: angular.IAngularStatic; 

import { SecurityService, Role } from "./security.service"; 

import "./security.service";

const security = angular.module('app.security');

class UserDetailsCtrl {
  constructor($scope, private $uibModalInstance, public userid: string, public roles: Role[]) {

  }

  public ok = () => {
    this.$uibModalInstance.close(/* Parameter*/);
  };

  public cancel = () => {
    this.$uibModalInstance.dismiss('cancel');
  };
}

security.controller('userDetailsCtrl', ['$scope', '$uibModalInstance', 'userid', 'roles', UserDetailsCtrl]);

class SecurityCtrl {
  constructor($scope, $timeout, private $q: ng.IQService, private $uibModal, private $document : ng.IDocumentService,  $mwtnCommons, private securityService: SecurityService) {
    $scope.message = "Empty";
    $scope.users = [];
    $scope.roles = [];
    $scope.currentUser = {};

    $scope.getCurrentUserById = function (id: string) {
      id !== null && securityService.getRolesForDomainUser(id).then(roles => {
        const parentElem = angular.element($document[0].querySelector('#security'));
        const modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'src/app/security/templates/userDetails.html',
          controller: 'userDetailsCtrl',
          controllerAs: 'vm',
          appendTo: parentElem,
          size: 'sm',
          resolve: {
            roles: () => roles,
            userid: () => id,
          }
        })
      })
    };  

    securityService.token.then(res => {
      $q.all([
        securityService.getAllUsers(),
        securityService.getAllRoles()]).then(([users, roles]) => {
          $scope.users = users;
          $scope.roles = roles;
      })
    });
  }
}

security.controller('securityCtrl', ['$scope', '$timeout', '$q', '$uibModal','$document', '$mwtnCommons', 'securityService', SecurityCtrl ]);