var gulp = require('gulp'),
    del = require('del'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    install = require("gulp-install"),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    argv = require('yargs').argv,
    less = require('gulp-less'),
    debug = require('gulp-debug'),
    replace = require('gulp-replace-task');

var config = require( './build.config.js');


/**
 * Task for cleaning build directory
 */
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(config.build_dir);
});

/**
 * Copy assets
 */
gulp.task('copyAssetsCss', function () {
    return gulp.src(config.assets_files.css)
        .pipe(
            gulp.dest(
                (config.build_dir) + '/assets/css'
            )
        );
});

gulp.task('copyAssetsData', function () {
    return gulp.src(config.assets_files.data)
        .pipe(gulp.dest((config.build_dir) + '/assets/data'));
});

/**
 * Copy app files
 */
gulp.task('copyTemplates', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying APP Template files'));
    // Copy html
    return gulp.src(config.app_files.templates)
        .pipe(gulp.dest(config.build_dir));
});

gulp.task('copyAppJs', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying APP Controller JS files'));
    return gulp.src(config.app_files.js)
        .pipe(gulp.dest(config.build_dir));
});

gulp.task('copyRootJs', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying APP Root JS files'));
    return gulp.src(config.app_files.root_js)
        .pipe(gulp.dest(config.build_dir));
});

/**
 * Compile css from less files
 */
gulp.task('less', function () {
    gutil.log(gutil.colors.cyan('INFO :: compiling LESS file'));
    return gulp.src(config.app_files.less)
        .pipe(less())
        .pipe(gulp.dest((config.build_dir) + '/assets/css'));
});

/**
 * Copy app assets images
 */
gulp.task('copyAppImgs', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying image files'));
    return gulp.src(config.app_files.img)
        .pipe(gulp.dest((config.build_dir) + '/assets/img'));

});

/**
 * Copy vendor files
 */
gulp.task('copyVendorCss', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying VENDOR css'));
    return gulp.src(config.vendor_files.css, { cwd : 'node_modules/**' })
        .pipe(gulp.dest((config.build_dir) + '/vendor'));
});

gulp.task('copyVendorFonts', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying VENDOR fonts'));
    return gulp.src(config.vendor_files.fonts, { cwd : 'node_modules/**' })
        .pipe(gulp.dest((config.build_dir) + '/vendor'));
});

gulp.task('copyVendorJs', function () {
    gutil.log(gutil.colors.cyan('INFO :: copying VENDOR js files'));
    return gulp.src(config.vendor_files.js, { cwd : 'node_modules/**' })
        .pipe(gulp.dest((config.build_dir) + '/vendor'));
});

/**
 * Copy task aggregated
 */
gulp.task('copy', function() {
    runSequence('less', [
        'copyAssetsCss',
        'copyAssetsData',
        'copyTemplates',
        'copyAppJs',
        'copyRootJs',
        'copyVendorCss',
        'copyVendorFonts',
        'copyAppImgs'
    ], 'copyVendorJs');
});

/**
 * Build task
 */
gulp.task('build', function(){
    runSequence('clean', 'copy');
});


/**
 * Live preview main task for development
 * argument --live should be used to force build task to build only live preview
 */
gulp.task('default', function (){

    if (!argv.live) {
        gutil.log(gutil.colors.red('ERROR :: --live argument must be used for live preview!'));
    }

    gutil.log(gutil.colors.cyan('INFO :: opening new browser tab live:' + argv.live));

    runSequence('build');
});
