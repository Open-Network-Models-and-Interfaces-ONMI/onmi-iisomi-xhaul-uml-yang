define( ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.emergency = angular.module('app.emergency', ['app.core']);
    exports.emergency.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {
        //$translatePartialLoaderProvider.addPart('app/emergency/locale/locale');
        NavHelperProvider.addControllerUrl('app/emergency/emergency.controller');
        NavHelperProvider.addToMenu('emergency', {
            "link": "#/emergency",
            "active": "main.emergency",
            "title": "Emergency",
            "icon": "fa fa-medkit",
            "page": {
                "title": "Emergency",
                "description": "Emergency"
            }
        });
        $stateProvider.state('main.emergency', {
            url: 'emergency',
            access: 2,
            views: {
                'content': {
                    templateUrl: 'src/app/emergency/emergency.tpl.html',
                    controller: 'emergencyCtrl'
                }
            }
        });
    });
});
/* non ES6 export */
// export = emergency;
// export default emergency;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1lcmdlbmN5Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9hcHAvZW1lcmdlbmN5L2VtZXJnZW5jeS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR2EsUUFBQSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRXZFLGlCQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsK0JBQStCO1FBRS9LLHlFQUF5RTtRQUV6RSxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3pFLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7WUFDdkMsTUFBTSxFQUFFLGFBQWE7WUFDckIsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixPQUFPLEVBQUUsV0FBVztZQUNwQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsV0FBVztnQkFDcEIsYUFBYSxFQUFFLFdBQVc7YUFDM0I7U0FDRixDQUFDLENBQUM7UUFFSCxjQUFjLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQ3JDLEdBQUcsRUFBRSxXQUFXO1lBQ2hCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsS0FBSyxFQUFFO2dCQUNMLFNBQVMsRUFBRTtvQkFDVCxXQUFXLEVBQUUsc0NBQXNDO29CQUNuRCxVQUFVLEVBQUUsZUFBZTtpQkFDNUI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDOztBQUVILG9CQUFvQjtBQUNwQixzQkFBc0I7QUFDdEIsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICdhbmd1bGFyQU1EJztcbmRlY2xhcmUgdmFyIGFuZ3VsYXI6IGFuZ3VsYXIuSUFuZ3VsYXJTdGF0aWM7IFxuXG5leHBvcnQgY29uc3QgZW1lcmdlbmN5ID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5lbWVyZ2VuY3knLCBbJ2FwcC5jb3JlJ10pO1xuXG5lbWVyZ2VuY3kuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlciwgJGNvbnRyb2xsZXJQcm92aWRlciwgJHByb3ZpZGUsIE5hdkhlbHBlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCAkdHJhbnNsYXRlUHJvdmlkZXIsICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyUHJvdmlkZXIpIHtcblxuICAvLyR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyUHJvdmlkZXIuYWRkUGFydCgnYXBwL2VtZXJnZW5jeS9sb2NhbGUvbG9jYWxlJyk7XG5cbiAgTmF2SGVscGVyUHJvdmlkZXIuYWRkQ29udHJvbGxlclVybCgnYXBwL2VtZXJnZW5jeS9lbWVyZ2VuY3kuY29udHJvbGxlcicpO1xuICBOYXZIZWxwZXJQcm92aWRlci5hZGRUb01lbnUoJ2VtZXJnZW5jeScsIHtcbiAgICBcImxpbmtcIjogXCIjL2VtZXJnZW5jeVwiLFxuICAgIFwiYWN0aXZlXCI6IFwibWFpbi5lbWVyZ2VuY3lcIixcbiAgICBcInRpdGxlXCI6IFwiRW1lcmdlbmN5XCIsXG4gICAgXCJpY29uXCI6IFwiZmEgIGZhLWFtYnVsYW5jZVwiLCAgLy8gQWRkIG5hdmlnYXRpb24gaWNvbiBjc3MgY2xhc3MgaGVyZVxuICAgIFwicGFnZVwiOiB7XG4gICAgICBcInRpdGxlXCI6IFwiRW1lcmdlbmN5XCIsXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiRW1lcmdlbmN5XCJcbiAgICB9XG4gIH0pO1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluLmVtZXJnZW5jeScsIHtcbiAgICB1cmw6ICdlbWVyZ2VuY3knLFxuICAgIGFjY2VzczogMixcbiAgICB2aWV3czoge1xuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FwcC9lbWVyZ2VuY3kvZW1lcmdlbmN5LnRwbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2VtZXJnZW5jeUN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuXG4vKiBub24gRVM2IGV4cG9ydCAqL1xuLy8gZXhwb3J0ID0gZW1lcmdlbmN5O1xuLy8gZXhwb3J0IGRlZmF1bHQgZW1lcmdlbmN5OyJdfQ==