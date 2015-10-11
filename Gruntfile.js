'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  var pkgConfig = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkgConfig,

    clean: {
      options: {force: true},
      api_codegen: {
        dot: true,
        src: ['temp']
      },
      api_dependencies: {
        files: [{
          dot: true,
          src: [
            // build dependencies
            '<%= pkg.directories.api_ds %>/node_modules/<%= pkg.directories.api_util %>',
            '<%= pkg.directories.api %>/node_modules/<%= pkg.directories.api_util %>',
            '<%= pkg.directories.api %>/node_modules/<%= pkg.directories.api_ds %>'
          ]
        }]
      }
    },

    copy: {
      api_codegen: {
        files: [
          //swagger
          {
            src: ['temp/api/swagger.json'],
            dest: '<%= pkg.directories.api %>/swagger',
            filter: 'isFile',
            flatten: true,
            expand: true
          }
        ]
      }
    },

    exec: {
      util_validate: {
        cmd: 'npm test',
        cwd: '<%= pkg.directories.api_util%>'
      },
      ds_validate: {
        cmd: 'npm test',
        cwd: '<%= pkg.directories.api_ds%>'
      },
      api_validate: {
        cmd: 'npm test',
        cwd: '<%= pkg.directories.api%>'
      },
      util_install_dependencies: {
        cmd: 'npm install -i',
        cwd: '<%= pkg.directories.api_util%>'
      },
      ds_install_dependencies: {
        cmd: 'npm install -i',
        cwd: '<%= pkg.directories.api_ds%>'
      },
      api_install_dependencies: {
        cmd: 'npm install -i',
        cwd: '<%= pkg.directories.api%>'
      },
      api_swagger_codegen: {
        cmd: 'swagger-codegen generate -i api/swagger/swagger.yaml -l nodejs -o temp'
      }
    }
  });

  grunt.registerTask('api-gen-from-swagger-spec', [
    'clean:api_codegen',
    'exec:api_swagger_codegen',
    'copy:api_codegen',
    'clean:api_codegen'
  ]);

  grunt.registerTask('api-install-dependencies', [
    'clean:api_dependencies',
    'exec:util_install_dependencies',
    'exec:ds_install_dependencies',
    'exec:api_install_dependencies'
  ]);

  grunt.registerTask('api-validate', [
    'exec:util_validate',
    'exec:ds_validate',
    'exec:api_validate'
  ]);

  grunt.registerTask('default', []);
};
