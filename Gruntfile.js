/* jshint node:true */
/* global require */

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-wp-readme-to-markdown');
	grunt.initConfig({
		version: {
			json: {
				options: {
					flags: ''
				},
				src: [ 'package.json', 'composer.json', 'package-lock.json' ]
			},
			php: {
				options: {
					prefix: 'BLOCKS_EXPORT_IMPORT_VERSION\', \'',
					flags: ''
				},
				src: [ 'index.php' ]
			},
			metatag: {
				options: {
					prefix: 'Version:\\s*',
					flags: ''
				},
				src: [ 'index.php' ]
			}
		},
		wp_readme_to_markdown: {
			plugin: {
				files: {
					'readme.md': 'readme.txt'
				},
			},
		},
	});

};