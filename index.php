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
 * Version:           1.2.0
 * Author:            ThemeIsle
 * Author URI:        https://themeisle.com
 * License:           GPL-3.0+
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       blocks-export-import
 * Domain Path:       /languages
 * WordPress Available:  yes
 * Requires License:    no
 */

define( 'BLOCKS_EXPORT_IMPORT_VERSION', '1.2.0' );

/**
 * Load all translations for our plugin from the MO file.
 */
function blocks_export_import_load_textdomain() {
	load_plugin_textdomain( 'blocks-export-import', false, plugin_dir_path( __FILE__ ) . 'languages' );
}

add_action( 'init', 'blocks_export_import_load_textdomain' );

/**
 * Registers all block assets.
 */
function blocks_export_import_enqueue() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'blocks-export-import',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_set_script_translations( 'blocks-export-import', 'blocks-export-import' );
}

add_action( 'enqueue_block_editor_assets', 'blocks_export_import_enqueue' );

add_filter(
	'themeisle_sdk_products',
	function ( $products ) {
		$products[] = __FILE__;
		return $products;
	}
);
