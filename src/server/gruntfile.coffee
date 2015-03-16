module.exports = (grunt) ->

  grunt.initConfig(
    # Note: most of the usual functionality will performed by CodeKit
    # this really just needs build from browserify & JSX

    browserify:
      vendor:
        src: [],
        dest: 'public/js/vendor.js',
        options:
          require: [ 'jquery' ]

      client:
        src: [ 'src/app/_build/**/*.js', 'src/app/_build/*.js' ],
        dest: 'public/js/app.js',
        options: { external: [ 'jquery' ] }

    react:
      client:
        files: [
          expand: true
          cwd: 'src/app'
          src: [ '*.jsx', 'components/*.jsx' ]
          dest: 'src/app/_build'
          ext: '.js'
        ]
  )

  grunt.loadNpmTasks 'grunt-react'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.registerTask(
    'default',
    'Builds React components and loads JS',
    [ 'react',  'browserify' ]
  )
