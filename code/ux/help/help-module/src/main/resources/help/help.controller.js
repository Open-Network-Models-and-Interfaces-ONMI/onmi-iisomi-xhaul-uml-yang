var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define("help.tree", ["require", "exports", "angularAMD"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var help = angular.module('app.help');
    // class HelpTreeController implements ng.IController {
    //   constructor(private $scope: ng.IScope & { rootNode: Node, data: Node[]}) {
    //     $scope.$watch("rootNode", (n, o) => {
    //       $scope.data = Object.keys($scope.rootNode).map(key => $scope.rootNode[key]);
    //     });
    //   }
    // }
    // help.controller("treeCtrl", ["$scope", HelpTreeController]);
    var helpTree = function ($compile) {
        return {
            restrict: "E",
            transclude: true,
            scope: { rootNode: '=' },
            //controller: 'treeCtrl',
            template: '<ul>' +
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
});
define("help.service", ["require", "exports", "angularAMD"], function (require, exports, angular) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var help = angular.module('app.help');
    var Helpservice = /** @class */ (function () {
        function Helpservice($q, $http, env) {
            this.$q = $q;
            this.$http = $http;
            this.env = env;
            this.tocNodeCollection = null;
            this.documents = {};
        }
        Helpservice.prototype.getTableOfContents = function () {
            var _this = this;
            if (this.tocNodeCollection) {
                return this.$q.resolve(this.tocNodeCollection);
            }
            return this.$http({
                method: "GET",
                url: window.location.origin + "/help/?meta"
            }).then(function (result) {
                if (result.status === 200) {
                    _this.tocNodeCollection = result.data;
                    return result.data;
                }
            });
        };
        Helpservice.prototype.getDocument = function (path) {
            var _this = this;
            if (this.documents[path] != null) {
                return this.$q.resolve(this.documents[path]);
            }
            return this.$http({
                method: "GET",
                url: window.location.origin + "/help/" + path
            }).then(function (result) {
                if (result.status === 200) {
                    return _this.documents[path] = {
                        basePath: result.config && result.config.url && result.config.url,
                        document: result.data
                    };
                }
            });
        };
        return Helpservice;
    }());
    help.service('helpService', ['$q', '$http', Helpservice]);
});
define("help.utilities", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolvePath = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        console.log(paths);
        function resolve(pathA, pathB) {
            //  ‘a’     => ['a']
            //  'a/b'   => ['a', 'b']
            //  '/a/b'  => ['', 'a', 'b']
            //  '/a/b/' => ['', 'a', 'b', '']
            pathB = pathB.split('/');
            if (pathB[0] === '') {
                return pathB.join('/');
            }
            pathA = pathA.split('/');
            var aLastIndex = pathA.length - 1;
            if (pathA[aLastIndex] !== '') {
                pathA[aLastIndex] = '';
            }
            var part;
            var i = 0;
            while (typeof (part = pathB[i]) === 'string') {
                switch (part) {
                    case '..':
                        pathA.pop();
                        pathA.pop();
                        pathA.push('');
                        break;
                    case '.':
                        pathA.pop();
                        pathA.push('');
                        break;
                    default:
                        pathA.pop();
                        pathA.push(part);
                        pathA.push('');
                        break;
                }
                i++;
            }
            if (pathB[pathB.length - 1] !== '')
                pathA.pop();
            return pathA.join('/');
        }
        var i = 0;
        var path;
        var r = location.pathname;
        var urlRegex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i;
        var multiSlashReg = /\/\/+/g;
        while (typeof (path = paths[i]) === 'string') {
            // debugger;
            var matches = path && path.match(urlRegex);
            if (matches || !i) {
                r = path;
            }
            else {
                path = path.replace(multiSlashReg, '/');
                r = resolve(r, path);
            }
            i++;
        }
        return r;
    };
});
define( ["require", "exports", "./lib/marked", "help.utilities", "help.tree", "help.service"], function (require, exports, marked, help_utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var currentPath = '/help';
    var currentDoc = '';
    var renderer = new marked.Renderer();
    renderer.link = function (href, title, text) {
        // check if href is rel or abs
        var absUrlMatch = href.trim().match(/^https?:\/\//i);
        return "<a "+(absUrlMatch ? "target=\"_blank\"":"")+" href=\"" + (absUrlMatch ? href : help_utilities_1.resolvePath('#/help/', currentDoc, href)) + "\" title=\"" + title + "\" >" + text + "</a>";
    };
    renderer.image = function (href, title, text) {
        return "<img src=\"" + help_utilities_1.resolvePath(currentPath, href) + "\" alt=\"" + title + "\" />";
    };
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });
    var help = angular.module('app.help');
    var HelpDirective = function () {
        return {
            restrict: 'AE',
            template: "<div class=\"global-help\" ><a href=\"{{ '#/help/'+ link }}\"><i class=\"fa fa-question-circle\"></i> Help</a></div>",
            scope: {
                link: '@'
            },
            replace: true
        };
    };
    help.directive('help', [HelpDirective]);
    var MarkdownItDirective = function ($sanitize) {
        var attribute = 'markdownIt';
        var render = function (value) {
            var md2html = (marked instanceof Function) ? marked : marked.default;
            return value
                ? $sanitize(md2html(value.trim()))
                : '';
        };
        return {
            restrict: 'AE',
            scope: {
                markdownIt: '='
            },
            replace: true,
            link: function (scope, element, attrs) {
                if (attrs[attribute]) {
                    scope.$watch(attribute, function (value) {
                        element.html(render(value));
                    });
                }
                else {
                    element.html(render(element.text()));
                }
            }
        };
    };
    help.directive('markdownIt', ['$sanitize', MarkdownItDirective]);
    var mapNode = function (tocNode) {
        return tocNode && Object.keys(tocNode).map(function (key) {
            return __assign({}, tocNode[key], { href: "#/help/" + tocNode[key]['versions']['current']['path'], nodes: mapNode(tocNode[key].nodes) });
        });
    };
    var HelpController = /** @class */ (function () {
        function HelpController($scope, $rootScope, $state, $timeout, helpService) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$timeout = $timeout;
            this.helpService = helpService;
            this._content = "## Loading";
            this._path = '';
            this._toc = {};

            $rootScope.section_logo = 'src/app/help/images/help.png';

            helpService.getTableOfContents().then(function (toc) {
                _this._toc = { nodes: mapNode(toc) };
                if (!$state.params.path) {
                    $state.go('main.help', { path: toc['sdnr']['versions']['current']['path'] });
                }
                else {
                    _this.navigateTo($state.params.path);
                }
            });
        }
        Object.defineProperty(HelpController.prototype, "content", {
            get: function () { return this._content; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HelpController.prototype, "path", {
            get: function () { return this._path; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HelpController.prototype, "toc", {
            get: function () { return this._toc; },
            enumerable: true,
            configurable: true
        });
        HelpController.prototype.navigateTo = function (path) {
            var _this = this;
            this.helpService.getDocument(path).then(function (result) {
                currentDoc = path;
                currentPath = result.basePath;
                _this._content = result.document;
            });
        };
        return HelpController;
    }());
    help.controller('helpCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'helpService', HelpController]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3JjL2FwcC9oZWxwL2hlbHAudHJlZS50cyIsInNyYy9hcHAvaGVscC9oZWxwLnNlcnZpY2UudHMiLCJzcmMvYXBwL2hlbHAvaGVscC51dGlsaXRpZXMudHMiLCJzcmMvYXBwL2hlbHAvaGVscC5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBY0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUV4Qyx1REFBdUQ7SUFDdkQsK0VBQStFO0lBQy9FLDRDQUE0QztJQUM1QyxxRkFBcUY7SUFDckYsVUFBVTtJQUNWLE1BQU07SUFDTixJQUFJO0lBRUosK0RBQStEO0lBRS9ELElBQU0sUUFBUSxHQUFHLFVBQVUsUUFBUTtRQUNqQyxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsR0FBRztZQUNiLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDeEIseUJBQXlCO1lBQ3pCLFFBQVEsRUFDTixNQUFNO2dCQUNOLHlCQUF5QjtnQkFDekIsMENBQTBDO2dCQUMxQywwREFBMEQ7Z0JBQzFELE9BQU87Z0JBQ1AsT0FBTztZQUNULE9BQU8sRUFBRSxVQUFVLFFBQVEsRUFBRSxLQUFLLEVBQUUsVUFBVTtnQkFDNUMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUM1QyxJQUFJLGdCQUFnQixDQUFDO2dCQUNyQixNQUFNLENBQUMsVUFBVSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUs7b0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixnQkFBZ0IsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNwRCxDQUFDO29CQUNELGdCQUFnQixDQUFDLEtBQUssRUFBRSxVQUFVLEtBQUssRUFBRSxLQUFLO3dCQUM1QyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUM7WUFDSixDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Ozs7O0lDcEQvQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBMkN4QztRQUtDLHFCQUFvQixFQUFxQixFQUFVLEtBQTJCLEVBQVUsR0FBUztZQUE3RSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtZQUFVLFVBQUssR0FBTCxLQUFLLENBQXNCO1lBQVUsUUFBRyxHQUFILEdBQUcsQ0FBTTtZQUM5RixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFTSx3Q0FBa0IsR0FBekI7WUFBQSxpQkFjQztZQWJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2hCLEdBQUcsRUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsZ0JBQWE7YUFDaEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQWdEO2dCQUN2RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO29CQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDakIsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVNLGlDQUFXLEdBQWxCLFVBQW1CLElBQVk7WUFBL0IsaUJBaUJDO1lBaEJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQyxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsR0FBRyxFQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFTLElBQU07YUFDckQsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQXFDO2dCQUM1QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLE1BQU0sQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHO3dCQUM1QixRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUc7d0JBQ2pFLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSTtxQkFDdEIsQ0FBQztnQkFDSixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFTCxDQUFDO1FBQ0gsa0JBQUM7SUFBRCxDQUFDLEFBNUNELElBNENDO0lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRyxXQUFXLENBQUMsQ0FBQyxDQUFDOzs7OztJQzNGdkQsUUFBQSxXQUFXLEdBQUc7UUFBVSxlQUFrQjthQUFsQixVQUFrQixFQUFsQixxQkFBa0IsRUFBbEIsSUFBa0I7WUFBbEIsMEJBQWtCOztRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLGlCQUFpQixLQUFLLEVBQUUsS0FBSztZQUMzQixvQkFBb0I7WUFDcEIseUJBQXlCO1lBQ3pCLDZCQUE2QjtZQUM3QixpQ0FBaUM7WUFDakMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN6QixDQUFDO1lBRUQsSUFBSSxJQUFJLENBQUM7WUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixPQUFPLE9BQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2IsS0FBSyxJQUFJO3dCQUNQLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDWixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ1osS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDZixLQUFLLENBQUM7b0JBQ1IsS0FBSyxHQUFHO3dCQUNOLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDWixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNmLEtBQUssQ0FBQztvQkFDUjt3QkFDRSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ1osS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDZixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxDQUFDLEVBQUUsQ0FBQztZQUNOLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLElBQUksQ0FBQztRQUNULElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFFMUIsSUFBTSxRQUFRLEdBQUcsc0NBQXNDLENBQUM7UUFDeEQsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDO1FBRS9CLE9BQU8sT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM3QyxRQUFRLENBQUM7WUFDVCxJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUNELENBQUMsRUFBRSxDQUFDO1FBQ04sQ0FBQztRQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUM7Ozs7O0lDbkRGLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQztJQUMxQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFFcEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFdkMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsSUFBWTtRQUN4RCw4QkFBOEI7UUFDOUIsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsZ0JBQVksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLDRCQUFXLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsb0JBQVksS0FBSyxZQUFNLElBQUksU0FBTSxDQUFBO0lBQ25ILENBQUMsQ0FBQztJQUVGLFFBQVEsQ0FBQyxLQUFLLEdBQUcsVUFBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLElBQVk7UUFDekQsTUFBTSxDQUFDLGdCQUFhLDRCQUFXLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBVSxLQUFLLFVBQU0sQ0FBQTtJQUN6RSxDQUFDLENBQUM7SUFFRixNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ2hCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLEdBQUcsRUFBRSxJQUFJO1FBQ1QsTUFBTSxFQUFFLElBQUk7UUFDWixNQUFNLEVBQUUsS0FBSztRQUNiLFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLEtBQUs7UUFDZixVQUFVLEVBQUUsSUFBSTtRQUNoQixXQUFXLEVBQUUsS0FBSztRQUNsQixLQUFLLEVBQUUsS0FBSztLQUNiLENBQUMsQ0FBQztJQUVILElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFeEMsSUFBTSxhQUFhLEdBQUc7UUFFcEIsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsNEhBQXNIO1lBQ2hJLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsR0FBRzthQUNWO1lBQ0QsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDO0lBQ0osQ0FBQyxDQUFBO0lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBRXhDLElBQU0sbUJBQW1CLEdBQUcsVUFBQyxTQUE0QztRQUN2RSxJQUFNLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFFL0IsSUFBTSxNQUFNLEdBQUcsVUFBVSxLQUFLO1lBQzVCLElBQU0sT0FBTyxHQUFHLENBQUMsTUFBTSxZQUFZLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdkUsTUFBTSxDQUFDLEtBQUs7Z0JBQ1YsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDVCxDQUFDLENBQUM7UUFFRixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsSUFBSTtZQUNkLEtBQUssRUFBRTtnQkFDTCxVQUFVLEVBQUUsR0FBRzthQUNoQjtZQUNELE9BQU8sRUFBRSxJQUFJO1lBQ2IsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFVLEtBQUs7d0JBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztZQUNILENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFBO0lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBTWpFLElBQU0sT0FBTyxHQUFHLFVBQUMsT0FBMEI7UUFDekMsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7WUFDNUMsTUFBTSxjQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFDZixJQUFJLEVBQUUsWUFBVSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFHLEVBQzdELEtBQUssRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUNsQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUY7UUFLRSx3QkFBb0IsTUFBa0IsRUFBVSxNQUFNLEVBQVUsUUFBaUMsRUFBVSxXQUF5QjtZQUFwSSxpQkFVQztZQVZtQixXQUFNLEdBQU4sTUFBTSxDQUFZO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBQTtZQUFVLGFBQVEsR0FBUixRQUFRLENBQXlCO1lBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWM7WUFKNUgsYUFBUSxHQUFHLFlBQVksQ0FBQztZQUN4QixVQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ1gsU0FBSSxHQUFVLEVBQUcsQ0FBQztZQUl4QixXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHO2dCQUN2QyxLQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFO2dCQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDdEYsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxzQkFBVyxtQ0FBTztpQkFBbEIsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUM5QyxzQkFBVyxnQ0FBSTtpQkFBZixjQUFvQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ3hDLHNCQUFXLCtCQUFHO2lCQUFkLGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFFOUIsbUNBQVUsR0FBbEIsVUFBbUIsSUFBWTtZQUEvQixpQkFNQztZQUxDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE1BQU07Z0JBQzdDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUM5QixLQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUgscUJBQUM7SUFBRCxDQUFDLEFBN0JELElBNkJDO0lBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnYW5ndWxhckFNRCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZSB7XG4gIGxhYmVsPzogc3RyaW5nLFxuICBub2Rlcz86IE5vZGVbXSxcbiAgdmVyc2lvbnM/OiB7XG4gICAgW3ZlcnNpb246IHN0cmluZ106IHsgXG4gICAgICBsYWJlbDogc3RyaW5nLFxuICAgICAgZGF0ZTogc3RyaW5nLFxuICAgICAgcGF0aDogc3RyaW5nXG4gICAgfVxuICB9IFxufVxuXG5jb25zdCBoZWxwID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5oZWxwJyk7XG5cbi8vIGNsYXNzIEhlbHBUcmVlQ29udHJvbGxlciBpbXBsZW1lbnRzIG5nLklDb250cm9sbGVyIHtcbi8vICAgY29uc3RydWN0b3IocHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSAmIHsgcm9vdE5vZGU6IE5vZGUsIGRhdGE6IE5vZGVbXX0pIHtcbi8vICAgICAkc2NvcGUuJHdhdGNoKFwicm9vdE5vZGVcIiwgKG4sIG8pID0+IHtcbi8vICAgICAgICRzY29wZS5kYXRhID0gT2JqZWN0LmtleXMoJHNjb3BlLnJvb3ROb2RlKS5tYXAoa2V5ID0+ICRzY29wZS5yb290Tm9kZVtrZXldKTtcbi8vICAgICB9KTtcbi8vICAgfVxuLy8gfVxuXG4vLyBoZWxwLmNvbnRyb2xsZXIoXCJ0cmVlQ3RybFwiLCBbXCIkc2NvcGVcIiwgSGVscFRyZWVDb250cm9sbGVyXSk7XG5cbmNvbnN0IGhlbHBUcmVlID0gZnVuY3Rpb24gKCRjb21waWxlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgc2NvcGU6IHsgcm9vdE5vZGU6ICc9JyB9LFxuICAgIC8vY29udHJvbGxlcjogJ3RyZWVDdHJsJyxcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8dWw+JyArXG4gICAgICAnPGxpIG5nLXRyYW5zY2x1ZGU+PC9saT4nICtcbiAgICAgICc8bGkgbmctcmVwZWF0PVwiY2hpbGQgaW4gcm9vdE5vZGUubm9kZXNcIj4nICtcbiAgICAgICc8dHJlZSByb290LW5vZGU9XCJjaGlsZFwiPjxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj48L3RyZWU+JyArXG4gICAgICAnPC9saT4nICtcbiAgICAgICc8L3VsPicsXG4gICAgY29tcGlsZTogZnVuY3Rpb24gKHRFbGVtZW50LCB0QXR0ciwgdHJhbnNjbHVkZSkge1xuICAgICAgdmFyIGNvbnRlbnRzID0gdEVsZW1lbnQuY29udGVudHMoKS5yZW1vdmUoKTtcbiAgICAgIHZhciBjb21waWxlZENvbnRlbnRzO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgaUVsZW1lbnQsIGlBdHRyKSB7XG4gICAgICAgIGlmICghY29tcGlsZWRDb250ZW50cykge1xuICAgICAgICAgIGNvbXBpbGVkQ29udGVudHMgPSAkY29tcGlsZShjb250ZW50cywgdHJhbnNjbHVkZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsZWRDb250ZW50cyhzY29wZSwgZnVuY3Rpb24gKGNsb25lLCBzY29wZSkge1xuICAgICAgICAgIGlFbGVtZW50LmFwcGVuZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG59O1xuXG5oZWxwLmRpcmVjdGl2ZShcInRyZWVcIiwgW1wiJGNvbXBpbGVcIiwgaGVscFRyZWVdKTsiLCJpbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXJBTUQnO1xuXG5jb25zdCBoZWxwID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5oZWxwJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvbkluZm8ge1xuICBsYWJlbDogc3RyaW5nLFxuICBwYXRoOiBzdHJpbmcsXG4gIGRhdGU6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRvY05vZGUge1xuICBsYWJlbDogc3RyaW5nOyBcbiAgdmVyc2lvbnM6IHtcbiAgICBbdmVyc2lvbktleTogc3RyaW5nXTogVmVyc2lvbkluZm9cbiAgfTtcbiAgbm9kZXM/OiBUb2NOb2RlQ29sbGVjdGlvbjtcbn1cblxuZXhwb3J0IHR5cGUgVG9jTm9kZUNvbGxlY3Rpb24gPSB7IFt0b2NOb2RlS2V5OiBzdHJpbmddOiBUb2NOb2RlIH07XG5cblxuaW50ZXJmYWNlIElFbnYge1xuICBnZXRCYXNlVVJMOiAoc2FsVHlwZTogJ0FEX1NBTCcgfCAnTURfU0FMJykgPT4gc3RyaW5nO1xufVxuXG4vKiogUmVwcmVzZW50cyBhIHNlcnZpY2UgdXNlZCBmb3IgdGhlIGhlbHAgYXBwbGljYXRpb24uICovXG5leHBvcnQgaW50ZXJmYWNlIElIZWxwU2VydmljZSB7XG5cbiAgLyoqXG4gICAqIFF1ZXJpZXMgdGhlIHRhYmxlIG9mIGNvbnRlbnRzIGZvciBhIHNwZWNpZmljIHZlcnNpb24uXG4gICAqIEBwYXJhbSB2ZXJzaW9uIFRoZSB2ZXJzaW9uIHRoZSB0YWJsZSBvZiBjb250ZW50cyBzaGFsbCBiZSByZXF1ZXN0ZWQgZm9yLlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgY29udGFpbmluZyB0aGUgcmVxdWVzdGVkIHRhYmxlIG9mIGNvbnRlbnRzLlxuICAgKiBcbiAgICovXG4gIGdldFRhYmxlT2ZDb250ZW50cyh2ZXJzaW9uPzogc3RyaW5nKTogYW5ndWxhci5JUHJvbWlzZTxUb2NOb2RlQ29sbGVjdGlvbj47XG5cbiAgLyoqXG4gICAqIEdldCBhIHNwZWNpdGljIGRvY3VtZW50IGJ5IGl0cyBwYXRoLlxuICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCBvZiB0aGUgZG9jdW1lbnQgdG8gZ2V0LlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgY29udGFpbmluZyB0aGUgcmVxdWVzdGVkIGRvY3VtZW50LlxuICAgKiBcbiAgICovXG4gIGdldERvY3VtZW50KHBhdGg6IHN0cmluZyk6IGFuZ3VsYXIuSVByb21pc2U8eyBiYXNlUGF0aDogc3RyaW5nLCBkb2N1bWVudDogc3RyaW5nIH0+O1xufVxuXG5jbGFzcyBIZWxwc2VydmljZSBpbXBsZW1lbnRzIElIZWxwU2VydmljZSB7XG5cbiAgcHJpdmF0ZSB0b2NOb2RlQ29sbGVjdGlvbjogVG9jTm9kZUNvbGxlY3Rpb247XG4gIHByaXZhdGUgZG9jdW1lbnRzOiB7IFtwYXRoOiBzdHJpbmddOiB7IGJhc2VQYXRoOiBzdHJpbmcsIGRvY3VtZW50OiBzdHJpbmcgfSB9O1xuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlLCBwcml2YXRlICRodHRwOiBhbmd1bGFyLklIdHRwU2VydmljZSwgcHJpdmF0ZSBlbnY6IElFbnYpIHtcbiAgICB0aGlzLnRvY05vZGVDb2xsZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmRvY3VtZW50cyA9IHt9O1xuICB9XG4gXG4gIHB1YmxpYyBnZXRUYWJsZU9mQ29udGVudHMoKTogYW5ndWxhci5JUHJvbWlzZTxUb2NOb2RlQ29sbGVjdGlvbj4ge1xuICAgIGlmICh0aGlzLnRvY05vZGVDb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcS5yZXNvbHZlKHRoaXMudG9jTm9kZUNvbGxlY3Rpb24pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLiRodHRwKHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcblx0XHRcdHVybDogYCR7dGhpcy5lbnYuZ2V0QmFzZVVSTCgnTURfU0FMJyl9L2hlbHAvP21ldGFgXG4gICAgfSkudGhlbigocmVzdWx0OiBhbmd1bGFyLklIdHRwUmVzcG9uc2U8VG9jTm9kZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdHRoaXMudG9jTm9kZUNvbGxlY3Rpb24gPSByZXN1bHQuZGF0YTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5kYXRhO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldERvY3VtZW50KHBhdGg6IHN0cmluZyk6IGFuZ3VsYXIuSVByb21pc2U8e2Jhc2VQYXRoOiBzdHJpbmcsIGRvY3VtZW50OiBzdHJpbmd9PiB7XG4gICAgaWYgKHRoaXMuZG9jdW1lbnRzW3BhdGhdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLiRxLnJlc29sdmUodGhpcy5kb2N1bWVudHNbcGF0aF0pO1xuICAgIH1cblxuICAgcmV0dXJuIHRoaXMuJGh0dHAoe1xuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgdXJsOiBgJHt0aGlzLmVudi5nZXRCYXNlVVJMKCdNRF9TQUwnKX0vaGVscC8ke3BhdGh9YFxuICAgIH0pLnRoZW4oKHJlc3VsdDogYW5ndWxhci5JSHR0cFJlc3BvbnNlPHN0cmluZz4pID0+IHtcbiAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRzW3BhdGhdID0ge1xuICAgICAgICAgIGJhc2VQYXRoOiByZXN1bHQuY29uZmlnICYmIHJlc3VsdC5jb25maWcudXJsICYmIHJlc3VsdC5jb25maWcudXJsLFxuICAgICAgICAgIGRvY3VtZW50OiByZXN1bHQuZGF0YVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0gXG59XG5cbmhlbHAuc2VydmljZSgnaGVscFNlcnZpY2UnLCBbJyRxJywgJyRodHRwJywgJ0VOVicsICBIZWxwc2VydmljZV0pOyIsImV4cG9ydCB2YXIgcmVzb2x2ZVBhdGggPSBmdW5jdGlvbiAoLi4ucGF0aHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgY29uc29sZS5sb2cocGF0aHMpO1xuICBmdW5jdGlvbiByZXNvbHZlKHBhdGhBLCBwYXRoQikge1xuICAgIC8vICDigJhh4oCZICAgICA9PiBbJ2EnXVxuICAgIC8vICAnYS9iJyAgID0+IFsnYScsICdiJ11cbiAgICAvLyAgJy9hL2InICA9PiBbJycsICdhJywgJ2InXVxuICAgIC8vICAnL2EvYi8nID0+IFsnJywgJ2EnLCAnYicsICcnXVxuICAgIHBhdGhCID0gcGF0aEIuc3BsaXQoJy8nKTtcbiAgICBpZiAocGF0aEJbMF0gPT09ICcnKSB7XG4gICAgICByZXR1cm4gcGF0aEIuam9pbignLycpO1xuICAgIH1cbiAgICBwYXRoQSA9IHBhdGhBLnNwbGl0KCcvJyk7XG4gICAgdmFyIGFMYXN0SW5kZXggPSBwYXRoQS5sZW5ndGggLSAxO1xuICAgIGlmIChwYXRoQVthTGFzdEluZGV4XSAhPT0gJycpIHtcbiAgICAgIHBhdGhBW2FMYXN0SW5kZXhdID0gJyc7XG4gICAgfVxuXG4gICAgdmFyIHBhcnQ7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlICh0eXBlb2YgKHBhcnQgPSBwYXRoQltpXSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzd2l0Y2ggKHBhcnQpIHtcbiAgICAgICAgY2FzZSAnLi4nOlxuICAgICAgICAgIHBhdGhBLnBvcCgpO1xuICAgICAgICAgIHBhdGhBLnBvcCgpO1xuICAgICAgICAgIHBhdGhBLnB1c2goJycpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICBwYXRoQS5wb3AoKTtcbiAgICAgICAgICBwYXRoQS5wdXNoKCcnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBwYXRoQS5wb3AoKTtcbiAgICAgICAgICBwYXRoQS5wdXNoKHBhcnQpO1xuICAgICAgICAgIHBhdGhBLnB1c2goJycpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICBpZiAocGF0aEJbcGF0aEIubGVuZ3RoIC0gMV0gIT09ICcnKSBwYXRoQS5wb3AoKTsgXG4gICAgcmV0dXJuIHBhdGhBLmpvaW4oJy8nKTtcbiAgfVxuXG4gIHZhciBpID0gMDtcbiAgdmFyIHBhdGg7XG4gIHZhciByID0gbG9jYXRpb24ucGF0aG5hbWU7XG5cbiAgY29uc3QgdXJsUmVnZXggPSAvXmh0dHBzP1xcOlxcL1xcLyhbXlxcLz8jXSspKD86W1xcLz8jXXwkKS9pO1xuICBjb25zdCBtdWx0aVNsYXNoUmVnID0gL1xcL1xcLysvZztcblxuICB3aGlsZSAodHlwZW9mIChwYXRoID0gcGF0aHNbaV0pID09PSAnc3RyaW5nJykge1xuICAgIGRlYnVnZ2VyO1xuICAgIGNvbnN0IG1hdGNoZXMgPSBwYXRoICYmIHBhdGgubWF0Y2godXJsUmVnZXgpO1xuICAgIGlmIChtYXRjaGVzIHx8ICFpKSB7XG4gICAgICByID0gcGF0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZShtdWx0aVNsYXNoUmVnLCAnLycpO1xuICAgICAgciA9IHJlc29sdmUociwgcGF0aCk7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIHJldHVybiByO1xufTsiLCJkZWNsYXJlIHZhciBhbmd1bGFyOiBhbmd1bGFyLklBbmd1bGFyU3RhdGljO1xuXG5pbXBvcnQgKiBhcyBtYXJrZWQgZnJvbSBcIi4vbGliL21hcmtlZFwiOyAgXG5cbmltcG9ydCBcIi4vaGVscC50cmVlXCI7XG5pbXBvcnQgXCIuL2hlbHAuc2VydmljZVwiO1xuXG5pbXBvcnQgeyBJSGVscFNlcnZpY2UgLCBUb2NOb2RlQ29sbGVjdGlvbiB9IGZyb20gXCIuL2hlbHAuc2VydmljZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZVBhdGggfSBmcm9tICcuL2hlbHAudXRpbGl0aWVzJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICBcIi4vaGVscC50cmVlXCI7XG5cbmxldCBjdXJyZW50UGF0aCA9ICcvaGVscCc7XG5sZXQgY3VycmVudERvYyA9ICcnO1xuXG5jb25zdCByZW5kZXJlciA9IG5ldyBtYXJrZWQuUmVuZGVyZXIoKTtcblxucmVuZGVyZXIubGluayA9IChocmVmOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIHRleHQ6IHN0cmluZykgPT4ge1xuICAvLyBjaGVjayBpZiBocmVmIGlzIHJlbCBvciBhYnNcbiAgY29uc3QgYWJzVXJsTWF0Y2ggPSBocmVmLnRyaW0oKS5tYXRjaCgvXmh0dHBzPzpcXC9cXC8vaSk7XG4gIHJldHVybiBgPGEgaHJlZj1cIiR7YWJzVXJsTWF0Y2ggPyBocmVmIDogcmVzb2x2ZVBhdGgoJyMvaGVscC8nLCBjdXJyZW50RG9jLCBocmVmKX1cIiB0aXRsZT1cIiR7dGl0bGV9XCIgPiR7dGV4dH08L2E+YFxufTtcblxucmVuZGVyZXIuaW1hZ2UgPSAoaHJlZjogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIGA8aW1nIHNyYz1cIiR7cmVzb2x2ZVBhdGgoY3VycmVudFBhdGgsIGhyZWYpfVwiIGFsdD1cIiR7dGl0bGV9XCIgLz5gXG59O1xuXG5tYXJrZWQuc2V0T3B0aW9ucyh7XG4gIHJlbmRlcmVyOiByZW5kZXJlcixcbiAgZ2ZtOiB0cnVlLFxuICB0YWJsZXM6IHRydWUsXG4gIGJyZWFrczogZmFsc2UsXG4gIHBlZGFudGljOiBmYWxzZSxcbiAgc2FuaXRpemU6IGZhbHNlLFxuICBzbWFydExpc3RzOiB0cnVlLFxuICBzbWFydHlwYW50czogZmFsc2UsXG4gIHhodG1sOiBmYWxzZVxufSk7XG5cbmNvbnN0IGhlbHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwLmhlbHAnKTtcblxuY29uc3QgSGVscERpcmVjdGl2ZSA9ICgpID0+IHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImdsb2JhbC1oZWxwXCIgPjxhIGhyZWY9XCJ7eyAnIy9oZWxwLycrJHNjb3BlLmxpbmsgfX1cIj48aSBjbGFzcz1cImZhIGZhLXF1ZXN0aW9uLWNpcmNsZVwiPjwvaT4gSGVscDwvYT48L2Rpdj5gLFxuICAgIHNjb3BlOiB7XG4gICAgICBsaW5rOiAnQCdcbiAgICB9LFxuICAgIHJlcGxhY2U6IHRydWVcbiAgfTtcbn1cblxuaGVscC5kaXJlY3RpdmUoJ2hlbHAnLCBbSGVscERpcmVjdGl2ZV0pO1xuXG5jb25zdCBNYXJrZG93bkl0RGlyZWN0aXZlID0gKCRzYW5pdGl6ZTogYW5ndWxhci5zYW5pdGl6ZS5JU2FuaXRpemVTZXJ2aWNlKSA9PiB7XG4gIGNvbnN0IGF0dHJpYnV0ZSA9ICdtYXJrZG93bkl0JztcbiAgXG4gIGNvbnN0IHJlbmRlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGNvbnN0IG1kMmh0bWwgPSAobWFya2VkIGluc3RhbmNlb2YgRnVuY3Rpb24pID8gbWFya2VkIDogbWFya2VkLmRlZmF1bHQ7XG4gICAgcmV0dXJuIHZhbHVlXG4gICAgICA/ICRzYW5pdGl6ZShtZDJodG1sKHZhbHVlLnRyaW0oKSkpXG4gICAgICA6ICcnO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIG1hcmtkb3duSXQ6ICc9J1xuICAgIH0sXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBpZiAoYXR0cnNbYXR0cmlidXRlXSkge1xuICAgICAgICBzY29wZS4kd2F0Y2goYXR0cmlidXRlLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICBlbGVtZW50Lmh0bWwocmVuZGVyKHZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5odG1sKHJlbmRlcihlbGVtZW50LnRleHQoKSkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuaGVscC5kaXJlY3RpdmUoJ21hcmtkb3duSXQnLCBbJyRzYW5pdGl6ZScsIE1hcmtkb3duSXREaXJlY3RpdmVdKTtcblxuaW50ZXJmYWNlIElIZWxwU2NvcGUgZXh0ZW5kcyBhbmd1bGFyLklTY29wZSB7XG4gIHRvYzogVG9jTm9kZUNvbGxlY3Rpb25cbn1cblxuY29uc3QgbWFwTm9kZSA9ICh0b2NOb2RlOiBUb2NOb2RlQ29sbGVjdGlvbik6IE5vZGVbXSA9PiB7XG4gIHJldHVybiB0b2NOb2RlICYmIE9iamVjdC5rZXlzKHRvY05vZGUpLm1hcChrZXkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi50b2NOb2RlW2tleV0sXG4gICAgICBocmVmOiBgIy9oZWxwLyR7dG9jTm9kZVtrZXldWyd2ZXJzaW9ucyddWydjdXJyZW50J11bJ3BhdGgnXX1gLFxuICAgICAgbm9kZXM6IG1hcE5vZGUodG9jTm9kZVtrZXldLm5vZGVzKVxuICAgIH07XG4gIH0pO1xufTtcblxuY2xhc3MgSGVscENvbnRyb2xsZXIge1xuICBwcml2YXRlIF9jb250ZW50ID0gXCIjIyBMb2FkaW5nXCI7XG4gIHByaXZhdGUgX3BhdGggPSAnJztcbiAgcHJpdmF0ZSBfdG9jIDogTm9kZSA9IHsgfTsgXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSAkc2NvcGU6IElIZWxwU2NvcGUsIHByaXZhdGUgJHN0YXRlLCBwcml2YXRlICR0aW1lb3V0OiBhbmd1bGFyLklUaW1lb3V0U2VydmljZSwgcHJpdmF0ZSBoZWxwU2VydmljZTogSUhlbHBTZXJ2aWNlKSB7XG4gIFxuICAgIGhlbHBTZXJ2aWNlLmdldFRhYmxlT2ZDb250ZW50cygpLnRoZW4odG9jID0+IHtcbiAgICAgIHRoaXMuX3RvYyA9IHsgbm9kZXM6IG1hcE5vZGUodG9jKSB9IDtcbiAgICAgIGlmICghJHN0YXRlLnBhcmFtcy5wYXRoKSB7XG4gICAgICAgICRzdGF0ZS5nbygnbWFpbi5oZWxwJywgeyBwYXRoOiB0b2NbJ29wZW5kYXlsaWdodCddWyd2ZXJzaW9ucyddWydjdXJyZW50J11bJ3BhdGgnXSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvKCRzdGF0ZS5wYXJhbXMucGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNvbnRlbnQoKSB7IHJldHVybiB0aGlzLl9jb250ZW50OyB9XG4gIHB1YmxpYyBnZXQgcGF0aCgpIHsgcmV0dXJuIHRoaXMuX3BhdGg7IH1cbiAgcHVibGljIGdldCB0b2MoKSB7IHJldHVybiB0aGlzLl90b2M7IH1cblxuICBwcml2YXRlIG5hdmlnYXRlVG8ocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5oZWxwU2VydmljZS5nZXREb2N1bWVudChwYXRoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIGN1cnJlbnREb2MgPSBwYXRoO1xuICAgICAgY3VycmVudFBhdGggPSByZXN1bHQuYmFzZVBhdGg7XG4gICAgICB0aGlzLl9jb250ZW50ID0gcmVzdWx0LmRvY3VtZW50O1xuICAgIH0pO1xuICB9XG5cbn1cblxuaGVscC5jb250cm9sbGVyKCdoZWxwQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckdGltZW91dCcsICdoZWxwU2VydmljZScsIEhlbHBDb250cm9sbGVyIF0pOyJdfQ==