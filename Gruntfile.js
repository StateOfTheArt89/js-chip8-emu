module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jasmine: {
          test: {
          src: 'scripts/*.js',
          options: {
              specs: 'test/*.spec.js'
          }
          }
        },

        connect: {

          server: {
            options: {
              keepalive:true,
              port: 3000,
              hostname: '*'
            }
          }
  }

    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-connect');
};
