module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        uglify: {
            js: {
                files: {
                    'dist/angular-geohash.min.js': ['src/angular-geohash.js']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('default', ['karma', 'uglify:js']);
};
