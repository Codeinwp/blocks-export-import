/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { serialize } = wp.blocks;

const { compose } = wp.compose;

const { withSelect } = wp.data;

const { PluginBlockSettingsMenuItem } = wp.editPost;

const BlocksExporter = ({ blocks }) => {
	const exportBlocks = () => {
		if ( ! blocks ) {
			return;
		}

		let data = serialize( blocks );

		data = JSON.stringify({
			type: 'blocks_export',
			version: 2,
			content: data
		}, null, 2 );

		const blob = new Blob([ data ], { type: 'text/json' }),
			e = document.createEvent( 'MouseEvents' ),
			a = document.createElement( 'a' );

		a.download = 'blocks-export.json';
		a.href = window.URL.createObjectURL( blob );
		a.dataset.downloadurl =  [ 'text/json', a.download, a.href ].join( ':' );
		e.initMouseEvent( 'click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
		a.dispatchEvent( e );
	};

	return (
		<PluginBlockSettingsMenuItem
			icon="share-alt2"
			label={ __( 'Export as JSON' ) }
			onClick={ exportBlocks }
		/>
	);
};

export default compose([
	withSelect( ( select ) => {
		const { getSelectedBlockCount, getSelectedBlock, getMultiSelectedBlocks } = select( 'core/block-editor' );

		return {
			blocks: 1 === getSelectedBlockCount() ? getSelectedBlock() : getMultiSelectedBlocks()
		};
	})
])( BlocksExporter );
