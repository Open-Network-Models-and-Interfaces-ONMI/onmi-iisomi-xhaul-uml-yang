/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    build_dir: 'build',
    app_dir: 'app',

    app_files: {
        js: [
            'src/*/**/*.js',
            '!node/**/*.*',
            '!node_modules/**/*.*',
            '!src/vendor/**/*.*'
        ],
        root_js: [
            'src/*.js'
        ],
        less: [
            'src/assets/less/*.less'
        ],
        img: [
            'src/assets/img/*.*'
        ],

        templates: [
            'src/*/**/*.tpl.html',
            'src/*.tpl.html'
        ]
    },

    assets_files: {
        less: [],
        css: [],
        data: []
    },

    vendor_files: {
        js: [],
        css: [],
        fonts: []
    }
};
