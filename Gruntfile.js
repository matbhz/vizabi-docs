module.exports = function(grunt) {

    grunt.initConfig({
        assemble: {
            options: {
                flatten: true,
                assets: 'src/assets/',
                helpers: 'src/helpers/*.js',
                layout: 'src/templates/layouts/default.hbs',
                partials: 'src/templates/partials/*.hbs',
                data: 'src/config/*.{json,yml}',
            },
            dist: {
                files: {
                    'dist/': ['src/pages/*.hbs']
                }
            }
        },
        clean: {
            files: ['dist']
        },
        copy: {
            dist: {
                files: [{
                    cwd: 'src/assets',
                    src: ['**/*'],
                    dest: 'dist/assets/',
                    expand: true
                }, {
                    cwd: 'bower_components/font-awesome/',
                    src: ['css/font-awesome.min.css', 'fonts/*'],
                    dest: 'dist/assets/',
                    expand: true
                }, {
                    cwd: 'bower_components/d3/',
                    src: ['d3.min.js'],
                    dest: 'dist/assets/js/',
                    expand: true
                }, {
                    cwd: 'bower_components/vizabi/dist/',
                    src: ['vizabi.min.js'],
                    dest: 'dist/assets/js/',
                    expand: true
                }, {
                    cwd: 'bower_components/vizabi/dist/',
                    src: ['vizabi.css'],
                    dest: 'dist/assets/css/',
                    expand: true
                }]
            }
        }
    });

    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean', 'copy', 'assemble']);

};