/**
 * WordPress dependencies.
 */

const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const {
	Button,
	Placeholder
} = wp.components;

const { compose } = wp.compose;

const {
	withDispatch,
	withSelect
} = wp.data;

const { Component } = wp.element;

class BlocksImporter extends Component {
	constructor() {
		super( ...arguments );

		this.uploadInput = React.createRef();
		this.uploadImport = this.uploadImport.bind( this );
	}

	uploadImport( e ) {
		const fileTobeRead = e.current.files[0];
		const fileReader = new FileReader();
		fileReader.onload = () => {
			this.props.import( JSON.parse( fileReader.result ) );
		};
		fileReader.readAsText( fileTobeRead );
	}

	render() {
		return (
			<Placeholder
				label={ 'Import Blocks from JSON' }
				icon="share-alt2"
			>
				<input
					type="file"
					accept="text/json"
					ref={ this.uploadInput }
				/>

				<Button
					isPrimary
					onClick={ () => this.uploadImport( this.uploadInput ) }
				>
					{ __( 'Upload' ) }
				</Button>
			</Placeholder>
		);
	}
}

const Impoter = compose([
	withSelect( ( select, { clientId }) => {
		const { getBlock, canUserUseUnfilteredHTML } = select( 'core/editor' );
		const block = getBlock( clientId );
		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML()
		};
	}),

	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML }) => ({
		import: ( content ) => dispatch( 'core/editor' ).replaceBlocks(
			block.clientId,
			content,
		)
	}) )
])( BlocksImporter );

registerBlockType( 'blocks-export-import/importer', {
	title: __( 'Import Blocks from JSON' ),
	description: __( 'Allows you import blocks from a JSON file.' ),
	icon: 'share-alt2',
	category: 'widgets',
	keywords: [
		__( 'JSON' ),
		__( 'Importer' ),
		__( 'Import' )
	],

	edit: Impoter,

	save: () => {
		return null;
	}
});

