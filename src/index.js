/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const {
	createBlock,
	registerBlockType
} = wp.blocks;

/**
 * Internal dependencies.
 */
import './exporter.js';
import edit from './importer.js';

registerBlockType( 'blocks-export-import/importer', {
	title: __( 'Import Blocks from JSON' ),
	description: __( 'Allows you import blocks from a JSON file.' ),
	icon: 'category',
	category: 'widgets',
	keywords: [
		__( 'JSON' ),
		__( 'Importer' ),
		__( 'Import' )
	],
	attributes: {
		file: {
			type: 'object'
		}
	},
	transforms: {
		from: [
			{
				type: 'files',
				isMatch: file => 'application/json' === file[ 0 ].type,
				transform: file => createBlock( 'blocks-export-import/importer', { file })
			}
		]
	},
	edit,
	save: () => null
});
