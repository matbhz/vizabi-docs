module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        assemble: {
            options: {
                flatten: true,
                assets: 'src/assets/',
                helpers: 'src/helpers/*.js',
                layout: 'src/templates/layouts/default.hbs',
                partials: 'src/templates/partials/*.hbs',
                data: 'src/config/*.{json,yml}'
            },
            files: {
                'preview/': ['src/content/*.md']
            }
        },
        clean: {
            files: ['dist']
        }
    });
    
    grunt.registerTask('default', ['clean', 'assemble']);

};