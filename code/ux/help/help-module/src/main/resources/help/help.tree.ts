import * as angular from 'angularAMD';

export interface Node {
  label?: string,
  nodes?: Node[],
  versions?: {
    [version: string]: { 
      label: string,
      date: string,
      path: string
    }
  } 
}

const help = angular.module('app.help');

// class HelpTreeController implements ng.IController {
//   constructor(private $scope: ng.IScope & { rootNode: Node, data: Node[]}) {
//     $scope.$watch("rootNode", (n, o) => {
//       $scope.data = Object.keys($scope.rootNode).map(key => $scope.rootNode[key]);
//     });
//   }
// }

// help.controller("treeCtrl", ["$scope", HelpTreeController]);

const helpTree = function ($compile) {
  return {
    restrict: "E",
    transclude: true,
    scope: { rootNode: '=' },
    //controller: 'treeCtrl',
    template:
      '<ul>' +
      '<li ng-transclude></li>' +
      '<li ng-repeat="child in rootNode.nodes">' +
      '<tree root-node="child"><div ng-transclude></div></tree>' +
      '</li>' +
      '</ul>',
    compile: function (tElement, tAttr, transclude) {
      var contents = tElement.contents().remove();
      var compiledContents;
      return function (scope, iElement, iAttr) {
        if (!compiledContents) {
          compiledContents = $compile(contents, transclude);
        }
        compiledContents(scope, function (clone, scope) {
          iElement.append(clone);
        });
      };
    }
  };
};

help.directive("tree", ["$compile", helpTree]);