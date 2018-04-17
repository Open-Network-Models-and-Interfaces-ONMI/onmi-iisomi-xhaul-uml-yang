define(['common/topbar/topbar.module', 'common/topbar/topbar.directives', 'common/authentification/auth.services'], function(topbar) {

    topbar.controller('TopbarCtrl', function() {
        $('#toggleMenu').click(function(e) {
            e.preventDefault();
            $('#wrapper').toggleClass('toggled');
        });
    });

    topbar.controller('topBarTasksCtrl', function($scope, taskFactory) {
        $scope.tasks = taskFactory.getTaskData();
    });

    topbar.controller('topBarNotifsCtrl', function($scope, notifsFactory) {
        $scope.notifs = notifsFactory.getNotifsData();
        $scope.isValid = function(value) {
            if (angular.isUndefined(value) || value === null) {
                return false;
            } else {
                return true;
            }
        };
    });

    topbar.controller('topBarMessagesCtrl', function($scope, messageFactory) {
        $scope.messages = messageFactory.getMessageData();
        $scope.isValid = function(value) {
            if (angular.isUndefined(value) || value === null) {
                return false;
            } else {
                return true;
            }
        };
    });

    // the authorization module is not converted yet
    topbar.controller('topBarUserMenuCtrl', function($scope, $cookieStore, Auth, $window) {
        $scope.logOut = logout;

        /**
         * Provides logout from application and redirects to login page
         * @return {[type]} [description]
         */
        function logout() {
            Auth.logout(function() {
                $window.location.href = 'index.html#/login';
            });
        }

        $scope.getUsername = function() {
            return $window.localStorage.odlUser;
        };
    });
});
