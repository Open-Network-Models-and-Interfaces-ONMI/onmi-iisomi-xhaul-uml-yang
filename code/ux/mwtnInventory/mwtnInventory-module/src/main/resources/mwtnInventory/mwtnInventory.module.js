define( ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mwtnInventory = angular.module('app.mwtnInventory', ['app.core']);
    exports.mwtnInventory.config(function ($stateProvider, $compileProvider, $controllerProvider, $provide, NavHelperProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {
        //$translatePartialLoaderProvider.addPart('app/mwtnInventory/locale/locale');
        NavHelperProvider.addControllerUrl('app/mwtnInventory/mwtnInventory.controller');
        NavHelperProvider.addToMenu('mwtnInventory', {
            "link": "#/pnfInventory/",
            "active": "main.mwtnInventory",
            "title": "pnf Inventory",
            "icon": "fa  fa-book",
            "page": {
                "title": "pnf Inventory",
                "description": "mwtnInventory"
            }
        });
        $stateProvider.state('main.mwtnInventory', {
            url: 'pnfInventory/:nodeId?',
            access: 2,
            views: {
                'content': {
                    templateUrl: 'src/app/mwtnInventory/mwtnInventory.tpl.html',
                    controller: 'mwtnInventoryCtrl'
                }
            }
        });
    });
});
/* non ES6 export */
// export = mwtnInventory;   
// export default mwtnInventory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXd0bkludmVudG9yeS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvYXBwL213dG5JbnZlbnRvcnkvbXd0bkludmVudG9yeS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR2EsUUFBQSxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFL0UscUJBQWEsQ0FBQyxNQUFNLENBQUMsVUFBVSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSwrQkFBK0I7UUFFbkwsNkVBQTZFO1FBRTdFLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDakYsaUJBQWlCLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRTtZQUMzQyxNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixNQUFNLEVBQUUsYUFBYTtZQUNyQixNQUFNLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLGFBQWEsRUFBRSxlQUFlO2FBQy9CO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsY0FBYyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtZQUN6QyxHQUFHLEVBQUUsd0JBQXdCO1lBQzdCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsS0FBSyxFQUFFO2dCQUNMLFNBQVMsRUFBRTtvQkFDVCxXQUFXLEVBQUUsOENBQThDO29CQUMzRCxVQUFVLEVBQUUsbUJBQW1CO2lCQUNoQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7O0FBRUgsb0JBQW9CO0FBQ3BCLDZCQUE2QjtBQUM3QixnQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXJBTUQnO1xuZGVjbGFyZSB2YXIgYW5ndWxhcjogYW5ndWxhci5JQW5ndWxhclN0YXRpYzsgXG5cbmV4cG9ydCBjb25zdCBtd3RuSW52ZW50b3J5ID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5td3RuSW52ZW50b3J5JywgWydhcHAuY29yZSddKTtcblxubXd0bkludmVudG9yeS5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkY29tcGlsZVByb3ZpZGVyLCAkY29udHJvbGxlclByb3ZpZGVyLCAkcHJvdmlkZSwgTmF2SGVscGVyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsICR0cmFuc2xhdGVQcm92aWRlciwgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXJQcm92aWRlcikge1xuXG4gIC8vJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXJQcm92aWRlci5hZGRQYXJ0KCdhcHAvbXd0bkludmVudG9yeS9sb2NhbGUvbG9jYWxlJyk7XG5cbiAgTmF2SGVscGVyUHJvdmlkZXIuYWRkQ29udHJvbGxlclVybCgnYXBwL213dG5JbnZlbnRvcnkvbXd0bkludmVudG9yeS5jb250cm9sbGVyJyk7XG4gIE5hdkhlbHBlclByb3ZpZGVyLmFkZFRvTWVudSgnbXd0bkludmVudG9yeScsIHtcbiAgICBcImxpbmtcIjogXCIjL213dG5JbnZlbnRvcnkvXCIsXG4gICAgXCJhY3RpdmVcIjogXCJtYWluLm13dG5JbnZlbnRvcnlcIixcbiAgICBcInRpdGxlXCI6IFwiTVdUTiBJbnZlbnRvcnlcIixcbiAgICBcImljb25cIjogXCJmYSAgZmEtYm9va1wiLCAgLy8gQWRkIG5hdmlnYXRpb24gaWNvbiBjc3MgY2xhc3MgaGVyZVxuICAgIFwicGFnZVwiOiB7XG4gICAgICBcInRpdGxlXCI6IFwiTVdUTiBEZW1vXCIsXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwibXd0bkludmVudG9yeVwiXG4gICAgfVxuICB9KTtcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFpbi5td3RuSW52ZW50b3J5Jywge1xuICAgIHVybDogJ213dG5JbnZlbnRvcnkvOm5vZGVJZD8nLFxuICAgIGFjY2VzczogMixcbiAgICB2aWV3czoge1xuICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FwcC9td3RuSW52ZW50b3J5L213dG5JbnZlbnRvcnkudHBsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnbXd0bkludmVudG9yeUN0cmwnXG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuXG4vKiBub24gRVM2IGV4cG9ydCAqL1xuLy8gZXhwb3J0ID0gbXd0bkludmVudG9yeTsgICBcbi8vIGV4cG9ydCBkZWZhdWx0IG13dG5JbnZlbnRvcnk7Il19