define( ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.help = angular.module('app.help', ['app.core']);
    exports.help.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {
        //$translatePartialLoaderProvider.addPart('app/help/locale/locale');
        NavHelperProvider.addControllerUrl('app/help/help.controller');
        NavHelperProvider.addToMenu('help', {
            "link": "#/help/",
            "active": "main.help",
            "title": "Help",
            "icon": "fa fa-question-circle",
            "page": {
                "title": "Help",
                "description": "help"
            }
        });
        $stateProvider.state('main.help', {
            url: 'help/*path',
            access: 2,
            views: {
                'content': {
                    templateUrl: 'src/app/help/help.tpl.html',
                    controller: 'helpCtrl as vm'
                }
            }
        });
    });
});
/* non ES6 export */
// export = help;   
// export default help;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvYXBwL2hlbHAvaGVscC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBRWEsUUFBQSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRTdELFlBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSwrQkFBK0I7UUFFMUssb0VBQW9FO1FBRXBFLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDL0QsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUNsQyxNQUFNLEVBQUUsU0FBUztZQUNqQixRQUFRLEVBQUUsV0FBVztZQUNyQixPQUFPLEVBQUUsTUFBTTtZQUNmLE1BQU0sRUFBRSx1QkFBdUI7WUFDL0IsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxXQUFXO2dCQUNwQixhQUFhLEVBQUUsTUFBTTthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ2hDLEdBQUcsRUFBRSxZQUFZO1lBQ2pCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsS0FBSyxFQUFFO2dCQUNMLFNBQVMsRUFBRTtvQkFDVCxXQUFXLEVBQUUsNEJBQTRCO29CQUN6QyxVQUFVLEVBQUUsZ0JBQWdCO2lCQUM3QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7O0FBRUgsb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQix1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBhbmd1bGFyOiBhbmd1bGFyLklBbmd1bGFyU3RhdGljO1xuXG5leHBvcnQgY29uc3QgaGVscCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuaGVscCcsIFsnYXBwLmNvcmUnXSk7XG5cbmhlbHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlciwgJGNvbnRyb2xsZXJQcm92aWRlciwgJHByb3ZpZGUsIE5hdkhlbHBlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCAkdHJhbnNsYXRlUHJvdmlkZXIsICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyUHJvdmlkZXIpIHtcblxuICAvLyR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyUHJvdmlkZXIuYWRkUGFydCgnYXBwL2hlbHAvbG9jYWxlL2xvY2FsZScpO1xuXG4gIE5hdkhlbHBlclByb3ZpZGVyLmFkZENvbnRyb2xsZXJVcmwoJ2FwcC9oZWxwL2hlbHAuY29udHJvbGxlcicpO1xuICBOYXZIZWxwZXJQcm92aWRlci5hZGRUb01lbnUoJ2hlbHAnLCB7XG4gICAgXCJsaW5rXCI6IFwiIy9oZWxwL1wiLFxuICAgIFwiYWN0aXZlXCI6IFwibWFpbi5oZWxwXCIsXG4gICAgXCJ0aXRsZVwiOiBcIkhlbHBcIixcbiAgICBcImljb25cIjogXCJmYSBmYS1xdWVzdGlvbi1jaXJjbGVcIiwgIC8vIEFkZCBuYXZpZ2F0aW9uIGljb24gY3NzIGNsYXNzIGhlcmVcbiAgICBcInBhZ2VcIjoge1xuICAgICAgXCJ0aXRsZVwiOiBcIk1XVE4gRGVtb1wiLFxuICAgICAgXCJkZXNjcmlwdGlvblwiOiBcImhlbHBcIlxuICAgIH1cbiAgfSk7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haW4uaGVscCcsIHtcbiAgICB1cmw6ICdoZWxwLypwYXRoJyxcbiAgICBhY2Nlc3M6IDIsXG4gICAgdmlld3M6IHtcbiAgICAgICdjb250ZW50Jzoge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hcHAvaGVscC9oZWxwLnRwbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2hlbHBDdHJsIGFzIHZtJ1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59KTtcblxuLyogbm9uIEVTNiBleHBvcnQgKi9cbi8vIGV4cG9ydCA9IGhlbHA7ICAgXG4vLyBleHBvcnQgZGVmYXVsdCBoZWxwOyJdfQ==
