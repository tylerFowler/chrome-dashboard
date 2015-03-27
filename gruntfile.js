// Generated by CoffeeScript 1.8.0
(function() {
  module.exports = function(grunt) {
    grunt.initConfig({
      browserify: {
        vendor: {
          src: [],
          dest: 'public/js/vendor.js',
          options: {
            require: ['jquery', 'underscore', 'react']
          }
        },
        client: {
          src: ['src/app/_build/**/*.js', 'src/app/_build/*.js'],
          dest: 'public/js/app.js',
          options: {
            external: ['jquery', 'underscore', 'react']
          }
        }
      },
      react: {
        client: {
          files: [
            {
              expand: true,
              cwd: 'src/app',
              src: ['*.jsx', 'components/*.jsx'],
              dest: 'src/app/_build',
              ext: '.js'
            }
          ]
        }
      }
    });
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-browserify');
    return grunt.registerTask('default', 'Builds React components and loads JS', ['react', 'browserify']);
  };

}).call(this);
