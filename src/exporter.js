/**
 * WordPress dependencies.
 */

const { __ } = wp.i18n;

const { registerPlugin } = wp.plugins;

const { serialize, parse } = wp.blocks;

const { compose } = wp.compose;

const { withSelect } = wp.data;

const { PluginBlockSettingsMenuItem } = wp.editPost;

const { Component } = wp.element;

class BlocksExporter extends Component {
	constructor() {
		super( ...arguments );

		this.parseBlocks = this.parseBlocks.bind( this );
		this.exportBlocks = this.exportBlocks.bind( this );
		this.saveJSON = this.saveJSON.bind( this );
	}

	parseBlocks( block ) {
		return parse( serialize( block ) );
	}

	exportBlocks() {
		this.saveJSON( this.parseBlocks( 1 === this.props.count ? this.props.block : this.props.blocks ), 1 === this.props.count ? 'block.json' : 'blocks.json' );
	}

	saveJSON( data, filename ) {
		if ( ! data ) {
			return;
		}

		if ( ! filename ) {
			filename = 'block.json';
		}

		if ( 'object' === typeof data ) {
			if ( 1 === this.props.count ) {
				data = JSON.stringify( data.shift(), undefined, 4 );
			} else {
				data = JSON.stringify( data, undefined, 4 );
			}
		}

		const blob = new Blob([ data ], { type: 'text/json' }),
			e = document.createEvent( 'MouseEvents' ),
			a = document.createElement( 'a' );

		a.download = filename;
		a.href = window.URL.createObjectURL( blob );
		a.dataset.downloadurl =  [ 'text/json', a.download, a.href ].join( ':' );
		e.initMouseEvent( 'click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
		a.dispatchEvent( e );
	}

	render() {
		return (
			<PluginBlockSettingsMenuItem
				icon='share-alt2'
				label={ __( 'Export as JSON' ) }
				onClick={ this.exportBlocks }
			/>
		);
	}
}

const Exporter = compose([
	withSelect( ( select ) => {
		const { getSelectedBlockCount, getSelectedBlock, getMultiSelectedBlocks } = select( 'core/editor' );

		return {
			count: getSelectedBlockCount(),
			block: getSelectedBlock(),
			blocks: getMultiSelectedBlocks()
		};
	})
])( BlocksExporter );

registerPlugin( 'blocks-export-import', {
	render: Exporter
});
