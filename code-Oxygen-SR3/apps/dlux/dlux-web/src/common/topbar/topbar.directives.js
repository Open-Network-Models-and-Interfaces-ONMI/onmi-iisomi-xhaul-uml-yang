define(['common/topbar/topbar.module'], function(topbar) {
   topbar.directive('mcTopBar', function () {
        return {
            replace: true,
            templateUrl: 'topbar/topbar.tpl.html',
        };
    });

    topbar.directive('mcTopBarTasks', function () {
        return {
            replace: true,
            controller: 'topBarTasksCtrl',
            templateUrl: 'topbar/tasks.tpl.html'
        };
    });

    topbar.directive('mcTopBarNotifications', function () {
        return {
            replace: true,
            controller: 'topBarNotifsCtrl',
            templateUrl: 'topbar/notifications.tpl.html'
        };
    });

    topbar.directive('mcTopBarMessages', function () {
        return {
            replace: true,
            controller: 'topBarMessagesCtrl',
            templateUrl: 'topbar/messages.tpl.html'
        };
    });

    topbar.directive('mcTopBarUserMenu', function () {
        return {
            replace: true,
            controller: 'topBarUserMenuCtrl',
            templateUrl: 'src/common/topbar/user_menu.tpl.html'
        };
    });
});
