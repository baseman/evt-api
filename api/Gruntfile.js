'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  var pkgConfig = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkgConfig,

    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ['spec/']
    }
  });

  grunt.registerTask('api-test', ['jasmine_node']);

  grunt.registerTask('default', []);
};
