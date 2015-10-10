'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var pkgConfig = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkgConfig,

        env: {
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '../<%= pkg.directories.coverage %>'
            }
        },

        clean: {
            options: { force: true },
            coverage: {
                files: [{
                    dot: true,
                    src: [
                        '<%= pkg.directories.coverage %>'
                    ]
                }]
            }
        },

        copy: {
            coverage: {
                files: [
                    //root
                    { src: ['<%= pkg.directories.test %>/*'], dest: '<%= pkg.directories.coverage %>/test/spec/', filter: 'isFile', flatten: true, expand: true },
                    //spec
                    { src: ['<%= pkg.directories.test %>/spec/*'], dest: '<%= pkg.directories.coverage %>/test/spec/', filter: 'isFile', flatten: true, expand: true }
                ]
            }
        },

        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: ['spec/']
        },

        instrument: {
            files: '<%= pkg.directories.src %>/**/*.js',
            options: {
                lazy: true,
                basePath: '<%= pkg.directories.coverage %>/'
            }
        },

        storeCoverage: {
            options: {
                dir: '<%= pkg.directories.coverage %>/reports'
            }
        },

        makeReport: {
            src: '<%= pkg.directories.coverage %>/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: '<%= pkg.directories.coverage %>/reports',
                print: 'detail'
            }
        }

    });

    grunt.registerTask('utils-test', ['jasmine_node']);

    grunt.registerTask('utils-cover', [
        'clean:coverage',
        'copy:coverage',
        'instrument',
        'env:coverage',
        'jasmine_node',
        'storeCoverage',
        'makeReport'
    ]);

    grunt.registerTask('default', []);
};
