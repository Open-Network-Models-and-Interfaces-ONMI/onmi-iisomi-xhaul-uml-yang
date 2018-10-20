/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'target/generated-resources/pages',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/main/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'  ],
    jsunit: [ 'src/**/*.spec.js' ],
    js_common: [ 'src/common/**/*.js', '!src/common/**/*.spec.js', '!src/common/assets/**/*.js'  ],
    js_app: [ 'src/app/**/*.js', '!src/app/**/*.spec.js', '!src/app/assets/**/*.js'  ],
    app_assets: [ '! src/app/yangui/assets/js/**/*.js', '! src/app/yangman/assets/js/**/*.js' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html'],
    less: 'src/less/main.less',
    css: ['src/app/**/*.css'],
    lang: ['src/app/**/assets/data/*.json'],
    templates: ['src/**/*.tpl.html'],
    images: ['src/app/**/assets/images/*.*']
  },

  /**
   * This is a collection of files used during testing only.
   */


  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/vis/dist/vis.min.js',
      'vendor/jquery/jquery.min.js',
      'vendor/jquery/jquery.min.map',
      'vendor/jquery-ui/jquery-ui.min.js',
      'vendor/bootstrap/js/dropdown.js',
      'vendor/angular/angular.js',
      'vendor/requirejs/requirejs.js',
      'vendor/ocLazyLoad/dist/ocLazyLoad.js',
      'vendor/angular-css-injector/angular-css-injector.js',
      'vendor/angular-route/angular-route.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/modules/route/route.js',
      'vendor/angular-cookies/angular-cookies.min.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/requirejs/require.js',
      'vendor/angular-ui-select2/index.js',
      'vendor/ng-grid/build/ng-grid.min.js',
      'vendor/restangular/dist/restangular.min.js',
      'vendor/underscore/underscore.js',
      'vendor/underscore.string/dist/underscore.string.min.js',
      'vendor/d3/d3.min.js',
      'vendor/select2/select2.js',
      'vendor/footable/dist/footable.min.js',
      'vendor/footable/dist/footable.paginate.min.js',
      'vendor/footable/dist/footable.sort.min.js',
      'vendor/angular-translate/angular-translate.min.js',
      'vendor/angular-sanitize/angular-sanitize.min.js',
      'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'vendor/ng-slider/dist/ng-slider.min.js',
      'vendor/sigma/sigma.min.js',
      'vendor/sigma/plugins/sigma.parsers.gexf.min.js',
      'vendor/sigma/plugins/sigma.layout.forceAtlas2.min.js',
      'vendor/sigma/plugins/sigma.plugins.dragNodes.min.js',
      'vendor/sigma/plugins/sigma.renderers.customShapes.min.js',
      'vendor/ng-clip/src/ngClip.js',
      'vendor/zeroclipboard/dist/ZeroClipboard.js',
      'vendor/angular-translate-loader-partial/angular-translate-loader-partial.js',
      'vendor/angular-animate/angular-animate.min.js',
      'vendor/angular-aria/angular-aria.min.js',
      'vendor/angular-material/angular-material.min.js',
      'vendor/angular-messages/angular-messages.min.js',
    ],
    css: [
    'vendor/ng-grid/ng-grid.min.css',
    'vendor/select2/select2.css',
    'vendor/select2-bootstrap-css/select2-bootstrap.css',
    'vendor/footable/css/footable.core.min.css',
    'vendor/footable/css/footable.standalone.min.css',
    'vendor/vis/dist/vis.min.css',
    'vendor/ng-slider/dist/css/ng-slider.min.css',
    'vendor/angular-material/angular-material.css',
    'vendor/material-design-icons/iconfont/*',
    ],
    images: [
    'vendor/select2/select2.png',
    'vendor/select2/select2-spinner.gif',
    'vendor/select2/select2x2.png'
    ],
    assets: [
    'vendor/zeroclipboard/dist/ZeroClipboard.swf',
    ],
    font: [
      'vendor/font-awesome/font/*',
      'vendor/footable/css/fonts/*',

    ]
  }
};
