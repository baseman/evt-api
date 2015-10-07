'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var pkgConfig = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkgConfig,

    env: {
      ds_coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../<%= pkg.directories.coverage %>'
      }
    },

    clean: {
      options: { force: true },
      ds_coverage: {
        files: [{
          dot: true,
          src: [
            '<%= pkg.directories.coverage %>'
          ]
        }]
      }
    },

    copy: {
      ds_coverage: {
        files: [
          //root
          { src: ['<%= pkg.directories.test %>/*'], dest: '<%= pkg.directories.coverage %>/test/spec/', filter: 'isFile', flatten: true, expand: true },
          //libs
          { src: ['<%= pkg.directories.test %>/spec/libs/*'], dest: '<%= pkg.directories.coverage %>/test/spec/libs/', filter: 'isFile', flatten: true, expand: true },
          { src: ['<%= pkg.directories.test %>/spec/libs/util/*'], dest: '<%= pkg.directories.coverage %>/test/spec/libs/util/', filter: 'isFile', flatten: true, expand: true },
          //system
          { src: ['<%= pkg.directories.test %>/spec/system/*'], dest: '<%= pkg.directories.coverage %>/test/spec/system/', filter: 'isFile', flatten: true, expand: true }
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

  grunt.registerTask('ds-test', ['jasmine_node']);

  grunt.registerTask('ds-cover', [
    'clean:ds_coverage',
    'copy:ds_coverage',
    'instrument',
    'env:ds_coverage',
    'jasmine_node',
    'storeCoverage',
    'makeReport'
  ]);

  grunt.registerTask('default', []);
};
