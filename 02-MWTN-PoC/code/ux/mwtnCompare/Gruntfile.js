module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    jshint : {
      files: ['Gruntfile.js', './mwtnCompare-module/src/**/*.js'],
      options : {
        browser : true
      }
    },
    shell : {
      options : {
        stderr : false
      },
      mvn : 'mvn clean install',
      copy : 'cp ./mwtnCompare-bundle/target/mwtnCompare-bundle-1.0-SNAPSHOT.jar ~/applications/odl/distribution-karaf-0.3.4-Lithium-SR4/deploy/grunt'
    },
    watch: {
      files: ['./mwtnCompare-module/src/**/*.js', 
              './mwtnCompare-module/src/**/*.json', 
              './mwtnCompare-module/src/**/*.css',
              './mwtnCompare-module/src/**/*.html'],
      tasks: ['default']
    },
  }); 

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['jshint', 'shell']);

};
