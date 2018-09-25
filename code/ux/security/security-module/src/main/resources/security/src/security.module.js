define( ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.security = angular.module('app.security', ['app.core']);
    exports.security.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {
        //$translatePartialLoaderProvider.addPart('app/security/locale/locale');
        NavHelperProvider.addControllerUrl('app/security/security.controller');
        NavHelperProvider.addToMenu('security', {
            "link": "#/security",
            "active": "main.security",
            "title": "Security",
            "icon": "fa  fa-shield",
            "page": {
                "title": "Security",
                "description": "security"
            }
        });
        $stateProvider.state('main.security', {
            url: 'security',
            access: 2,
            views: {
                'content': {
                    templateUrl: 'src/app/security/security.tpl.html',
                    controller: 'securityCtrl'
                }
            }
        });
    });
});
/* non ES6 export */
// export = security;
// export default security;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHkubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2FwcC9zZWN1cml0eS9zZWN1cml0eS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR2EsUUFBQSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRXJFLGdCQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsK0JBQStCO1FBRTlLLHdFQUF3RTtRQUV4RSxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ3ZFLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7WUFDdEMsTUFBTSxFQUFFLFlBQVk7WUFDcEIsUUFBUSxFQUFFLGVBQWU7WUFDekIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsTUFBTSxFQUFFLGVBQWU7WUFDdkIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixhQUFhLEVBQUUsVUFBVTthQUMxQjtTQUNGLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ3BDLEdBQUcsRUFBRSxVQUFVO1lBQ2YsTUFBTSxFQUFFLENBQUM7WUFDVCxLQUFLLEVBQUU7Z0JBQ0wsU0FBUyxFQUFFO29CQUNULFdBQVcsRUFBRSxvQ0FBb0M7b0JBQ2pELFVBQVUsRUFBRSxjQUFjO2lCQUMzQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7O0FBRUgsb0JBQW9CO0FBQ3BCLHFCQUFxQjtBQUNyQiwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXJBTUQnO1xuZGVjbGFyZSB2YXIgYW5ndWxhcjogYW5ndWxhci5JQW5ndWxhclN0YXRpYzsgXG5cbmV4cG9ydCBjb25zdCBzZWN1cml0eSA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuc2VjdXJpdHknLCBbJ2FwcC5jb3JlJ10pO1xuXG5zZWN1cml0eS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCAkY29udHJvbGxlclByb3ZpZGVyLCAkcHJvdmlkZSwgTmF2SGVscGVyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsICR0cmFuc2xhdGVQcm92aWRlciwgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXJQcm92aWRlcikge1xuXG4gIC8vJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXJQcm92aWRlci5hZGRQYXJ0KCdhcHAvc2VjdXJpdHkvbG9jYWxlL2xvY2FsZScpO1xuXG4gIE5hdkhlbHBlclByb3ZpZGVyLmFkZENvbnRyb2xsZXJVcmwoJ2FwcC9zZWN1cml0eS9zZWN1cml0eS5jb250cm9sbGVyJyk7XG4gIE5hdkhlbHBlclByb3ZpZGVyLmFkZFRvTWVudSgnc2VjdXJpdHknLCB7XG4gICAgXCJsaW5rXCI6IFwiIy9zZWN1cml0eVwiLFxuICAgIFwiYWN0aXZlXCI6IFwibWFpbi5zZWN1cml0eVwiLFxuICAgIFwidGl0bGVcIjogXCJTZWN1cml0eVwiLFxuICAgIFwiaWNvblwiOiBcImZhICBmYS1zaGllbGRcIiwgIC8vIEFkZCBuYXZpZ2F0aW9uIGljb24gY3NzIGNsYXNzIGhlcmVcbiAgICBcInBhZ2VcIjoge1xuICAgICAgXCJ0aXRsZVwiOiBcIlNlY3VyaXR5XCIsXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwic2VjdXJpdHlcIlxuICAgIH1cbiAgfSk7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haW4uc2VjdXJpdHknLCB7XG4gICAgdXJsOiAnc2VjdXJpdHknLFxuICAgIGFjY2VzczogMixcbiAgICB2aWV3czoge1xuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FwcC9zZWN1cml0eS9zZWN1cml0eS50cGwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdzZWN1cml0eUN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuXG4vKiBub24gRVM2IGV4cG9ydCAqL1xuLy8gZXhwb3J0ID0gc2VjdXJpdHk7XG4vLyBleHBvcnQgZGVmYXVsdCBzZWN1cml0eTsiXX0=