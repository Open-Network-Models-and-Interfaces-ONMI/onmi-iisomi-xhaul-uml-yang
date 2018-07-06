declare var angular: angular.IAngularStatic;

import * as marked from "./lib/marked";  

import "./help.tree";
import "./help.service";

import { IHelpService , TocNodeCollection } from "./help.service";
import { resolvePath } from './help.utilities';
import { Node } from  "./help.tree";

let currentPath = '/help';
let currentDoc = '';

const renderer = new marked.Renderer();

renderer.link = (href: string, title: string, text: string) => {
  // check if href is rel or abs
  const absUrlMatch = href.trim().match(/^https?:\/\//i);
  return `<a href="${absUrlMatch ? href : resolvePath('#/help/', currentDoc, href)}" title="${title}" >${text}</a>`
};

renderer.image = (href: string, title: string, text: string) => {
  return `<img src="${resolvePath(currentPath, href)}" alt="${title}" />`
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

const help = angular.module('app.help');

const HelpDirective = () => {

  return {
    restrict: 'AE',
    template: `<div class="global-help" ><a href="{{ '#/help/'+ link }}"><i class="fa fa-question-circle"></i> Help</a></div>`,
    scope: {
      link: '@'
    },
    replace: true
  };
}

help.directive('help', [HelpDirective]);

const MarkdownItDirective = ($sanitize: angular.sanitize.ISanitizeService) => {
  const attribute = 'markdownIt';
  
  const render = function (value) {
    const md2html = (marked instanceof Function) ? marked : marked.default;
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
      } else {
        element.html(render(element.text()));
      }
    }
  };
}

help.directive('markdownIt', ['$sanitize', MarkdownItDirective]);

interface IHelpScope extends angular.IScope {
  toc: TocNodeCollection
}

const mapNode = (tocNode: TocNodeCollection): Node[] => {
  return tocNode && Object.keys(tocNode).map(key => {
    return {
      ...tocNode[key],
      href: `#/help/${tocNode[key]['versions']['current']['path']}`,
      nodes: mapNode(tocNode[key].nodes)
    };
  });
};

class HelpController {
  private _content = "## Loading";
  private _path = '';
  private _toc : Node = { }; 

  constructor(private $scope: IHelpScope, private $state, private $timeout: angular.ITimeoutService, private helpService: IHelpService) {
  
    helpService.getTableOfContents().then(toc => {
      this._toc = { nodes: mapNode(toc) } ;
      if (!$state.params.path) {
        $state.go('main.help', { path: toc['sdnr']['versions']['current']['path'] })
      } else {
        this.navigateTo($state.params.path);
      }
    });
  }

  public get content() { return this._content; }
  public get path() { return this._path; }
  public get toc() { return this._toc; }

  private navigateTo(path: string): void {
    this.helpService.getDocument(path).then((result) => {
      currentDoc = path;
      currentPath = result.basePath;
      this._content = result.document;
    });
  }

}

help.controller('helpCtrl', ['$scope', '$state', '$timeout', 'helpService', HelpController ]);