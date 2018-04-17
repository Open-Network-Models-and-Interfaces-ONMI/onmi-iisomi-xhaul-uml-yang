require.config({
  baseUrl : 'src',
  packages: [{
    name: 'codemirror',
    location: '../assets/js/codemirror',
    main: 'lib/codemirror',
  }],
  paths : {
    'angular' : '../vendor/angular/angular',
    'ui-bootstrap' : '../vendor/angular-bootstrap/ui-bootstrap-tpls.min',
    'Restangular' : '../vendor/restangular/dist/restangular.min',
    'underscore' : '../vendor/underscore/underscore',
    'angular-ui-router' : '../vendor/angular-ui-router/release/angular-ui-router',
    'angular-css-injector' : '../vendor/angular-css-injector/angular-css-injector',
    'angular-cookies' : '../vendor/angular-cookies/angular-cookies.min',
    'angular-translate' : '../vendor/angular-translate/angular-translate.min',
    'angular-sanitize' : '../vendor/angular-sanitize/angular-sanitize.min',
    'angular-translate-loader-static-files' : '../vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min',
    'jquery' : '../vendor/jquery/jquery.min',
    'jquery-ui' : '../vendor/jquery-ui/jquery-ui.min',
    'footable' : '../vendor/footable/dist/footable.min',
    'pixi': '../vendor/pixi/bin/pixi',
    'd3' : '../vendor/d3/d3.min',
    'ocLazyLoad' : '../vendor/ocLazyLoad/dist/ocLazyLoad',
    'vis' : '../vendor/vis/dist/vis.min',
    'sigma' : '../vendor/sigma/sigma.min',
    'sigma-parsers-gexf' : '../vendor/sigma/plugins/sigma.parsers.gexf.min',
    'sigma-forceAtlas2' : '../vendor/sigma/plugins/sigma.layout.forceAtlas2.min',
    'sigma-dragNodes' : '../vendor/sigma/plugins/sigma.plugins.dragNodes.min',
    'sigma-customShapes' : '../vendor/sigma/plugins/sigma.renderers.customShapes.min',
    'ngSlider' : '../vendor/ng-slider/dist/ng-slider.min',
    'ZeroClipboard' : '../vendor/zeroclipboard/dist/ZeroClipboard',
    'ngClip' : '../vendor/ng-clip/src/ngClip',
    'angular-translate-loader-partial' : '../vendor/angular-translate-loader-partial/angular-translate-loader-partial',
    'ngAnimate': '../vendor/angular-animate/angular-animate.min',
    'ngAria': '../vendor/angular-aria/angular-aria.min',
    'ngMaterial': '../vendor/angular-material/angular-material.min',
    'ngMessages': '../vendor/angular-messages/angular-messages.min',
    'codeMirror-showHint' : '../assets/js/codemirror/addon/hint/show-hint',
    'codeMirror-jsonParametersHint' : '../assets/js/codemirror/addon/hint/json-parameters-hint',
    'codeMirror-javascriptMode' : '../assets/js/codemirror/mode/javascript/javascript',
    'codeMirror-matchBrackets' : '../assets/js/codemirror/addon/edit/matchbrackets',
  },
  map: {
    '*': {
      'angularAMD': 'angular'
    }
  },
  shim : {
    'ocLazyLoad' : ['angular'],
    'Restangular' : ['angular', 'underscore'],
    'ui-bootstrap' : ['angular'],
    'angular-css-injector' : ['angular'],
    'angular-ui-router' : ['angular'],
    'angular-cookies' : ['angular'],
    'angular-translate': ['angular'],
    'angular-sanitize': ['angular'],
    'angular-translate-loader-static-files' : ['angular-translate'],
    'vis' : {
        exports: 'vis'
    },
    'jquery' : {
      exports : '$'
    },
    'jquery-ui' : ['jquery'],
    'angular' : {
        deps: ['jquery','jquery-ui'],
        exports: 'angular'
    },
    'footable' : ['jquery'],
    'undescore' : {
      exports : '_'
    },
    'sticky' : ['jquery', 'angular'],
    'sigma-parsers-gexf' : ['sigma'],
    'sigma-forceAtlas2' : ['sigma'],
    'sigma-dragNodes' : ['sigma'],
    'sigma-customShapes' : ['sigma'],
    'ngSlider' : ['angular'],
    'ZeroClipboard': ['angular'],
    'ngClip' : ['angular','ZeroClipboard'],
    'angular-translate-loader-partial': ['angular-translate'],
    'ngAnimate': ['angular'],
    'ngAria': ['angular'],
    'ngMaterial': {
      deps: ['ngAnimate', 'ngAria']
    },
    'codeMirros_showHint': ['codemirror'],
    'codeMirros_javascriptHint': ['codemirror'],
    'codeMirror_javascriptMode': ['codemirror'],
    'codeMirror_matchBrackets': ['codemirror'],
  },

  deps : ['app/app.module']

});
