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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
};
