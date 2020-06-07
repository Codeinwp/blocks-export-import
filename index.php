<?php
/**
 * Loader for the ThemeIsle\blocks-export-import
 *
 * @package     ThemeIsle\blocks-export-import
 * @copyright   Copyright (c) 2019, Hardeep Asrani
 * @license     http://opensource.org/licenses/gpl-3.0.php GNU Public License
 * @since       1.0.0
 *
 * Plugin Name:       Blocks Export Import
 * Plugin URI:        https://github.com/Codeinwp/blocks-export-import
 * Description:       Blocks Export Import allows to Export and Import blocks as JSON in Gutenberg Block Editor.
 * Version:           1.1.0
 * Author:            ThemeIsle
 * Author URI:        https://themeisle.com
 * License:           GPL-3.0+
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       blocks-export-import
 * Domain Path:       /languages
 * WordPress Available:  yes
 * Requires License:    no
 */

define( 'BLOCKS_EXPORT_IMPORT_VERSION', '1.1.0' );

add_action(
	'plugins_loaded',
	function () {
		// call this only if Gutenberg is active.
		if ( function_exists( 'register_block_type' ) ) {
			add_action(
				'enqueue_block_editor_assets',
				function() {
					wp_enqueue_script( 'blocks-export-import', plugins_url( '/', __FILE__ ) . 'build/build.js', array( 'wp-i18n', 'wp-plugins', 'wp-blocks', 'wp-components', 'wp-compose', 'wp-data', 'wp-edit-post', 'wp-element' ), BLOCKS_EXPORT_IMPORT_VERSION, true );
					wp_set_script_translations( 'blocks-export-import', 'blocks-export-import' );
				} 
			);
		}
	}
);

add_filter(
	'themeisle_sdk_products',
	function ( $products ) {
		$products[] = __FILE__;
		return $products;
	}
);
