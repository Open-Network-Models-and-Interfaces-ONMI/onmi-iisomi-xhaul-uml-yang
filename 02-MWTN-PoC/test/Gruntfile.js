/*
 * Gruntfile.js - ONF Microwave Transport Network Test Framework
 *
 * Copyright (C) 2016 HCL Technologies
 *
 * Author: Paolo Rovelli <paolo.rovelli@hcl.com> 
 */

module.exports = function(grunt) {

    /* load npm tasks (shell, mochaTest, ...) */
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: grunt.file.readJSON('config.json'),

        /* config shell task */
        shell: {           
            'controller-odl': {
                command: function() {
                    var path = './test-env/controller-odl/';
                    var cmd = path + 'controller-spawn.sh config.json';
                    return 'gnome-terminal -x sh -c "' + cmd + ' ; sh"';
                }
            },
            'controller-odl-build': {
                command: function() {
                    var path = './test-env/controller-odl/';
                    var cmd = path + 'controller-build.sh config.json';
                    return cmd;
                }
            },
            'controller-wipro': {
                command: function() {
                    var path = './test-env/controller-wipro/';
                    var cmd = path + 'controller-spawn.sh config.json';
                    return 'gnome-terminal -x sh -c "' + cmd + ' ; sh"';
                }
            },
            'controller-wipro-build': {
                command: function() {
                    var path = './test-env/controller-wipro/';
                    var cmd = path + 'controller-build.sh config.json';
                    return cmd;
                },
                options: {
                    execOptions: {
                        maxBuffer: Infinity
                    }
                }
            },
            'mediator-hcl': {
                command: function() {
                    var path = './test-env/mediator-hcl/';
                    var cmd = path + 'mediator-spawn.sh config.json && ' +
                              path + 'mediator-mount.sh config.json && ' +
                              path + 'mediator-attach.sh config.json ';
                    return 'gnome-terminal -x sh -c "' + cmd + ' ; sh"';
                }
            },
            'mediator-hcl-build': {
                command: function() {
                    var path = './test-env/mediator-hcl/';
                    var cmd = path + 'mediator-build.sh config.json';
                    return cmd;
                },
                options: {
                    execOptions: {
                        maxBuffer: Infinity
                    }
                }
            },
            'mediator-ceragon': {
                command: function() {
                    var path = './test-env/mediator-ceragon/';
                    var cmd = path + 'mediator-spawn.sh config.json && ' +
                              path + 'mediator-mount.sh config.json && ' +
                              path + 'mediator-attach.sh config.json ';
                    return 'gnome-terminal -x sh -c "' + cmd + ' ; sh"';
                }
            },
            'mediator-ceragon-build': {
                command: function() {
                    var path = './test-env/mediator-ceragon/';
                    var cmd = path + 'mediator-build.sh config.json';
                    return cmd;
                },
                options: {
                    execOptions: {
                        maxBuffer: Infinity
                    }
                }
            }
        },

        /* config mochaTest task */
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: './test-result/results.txt', 
                    bail: false,
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['./test/{,*/}*.js']
            }
        },

        /* Make sure there are no obvious mistakes */
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    './test/{,*/}*.js'
                ]
            }
        },

        /* Make sure code styles are up to par */
        jscs: {
            options: {
                config: '.jscsrc',
                verbose: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    './test/{,*/}*.js'
                ]
            }
        }

    });

    grunt.registerTask('build-test-env', [
        'shell:controller-odl-build',
        'shell:controller-wipro-build',
        'shell:mediator-hcl-build',
        'shell:mediator-ceragon-build'
    ]);
    grunt.registerTask('test-env', [
    //  'shell:controller-odl',
        'shell:controller-wipro',
    //  'shell:mediator-hcl',
        'shell:mediator-ceragon'
    ]);
    grunt.registerTask('test-env-controller', [
    //  'shell:controller-odl',
        'shell:controller-wipro'
    ]);
    grunt.registerTask('test-env-mediator', [
    //  'shell:mediator-hcl',
        'shell:mediator-ceragon'
    ]);
    grunt.registerTask('build-test', [
        'newer:jshint',
        'newer:jscs'
    ]);
    grunt.registerTask('test', [
        'newer:jshint',
        'newer:jscs',
        'mochaTest'
    ]);

};

