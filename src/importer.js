/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { parse } = wp.blocks;

const { Placeholder } = wp.components;

const { compose } = wp.compose;

const {
	DropZone,
	DropZoneProvider,
	FormFileUpload
} = wp.components;

const {
	withDispatch,
	withSelect
} = wp.data;

const { useEffect } = wp.element;

const BlocksImporter = ({
	attributes,
	importBlock
}) => {
	useEffect( () => {
		if ( attributes.file ) {
			uploadImport( attributes.file );
		}
	}, []);

	const uploadImport = files => {
		const fileTobeRead = files[0];

		if ( 'application/json' !== fileTobeRead.type ) {
			return;
		}

		const fileReader = new FileReader();

		fileReader.onload = () => {
			let data = JSON.parse( fileReader.result );
			if ( data.__file && 'wp_export' === data.__file ) {
				data = parse( data.content );
			}
			importBlock( data );
		};

		fileReader.readAsText( fileTobeRead );
	};

	return (
		<Placeholder
			label={ 'Import Blocks from JSON' }
			instructions={ 'Upload JSON file from your device.' }
			icon="category"
		>
			<DropZoneProvider>
				<FormFileUpload
					accept="text/json"
					onChange={ e => uploadImport( e.target.files ) }
					isSecondary
				>
					{ __( 'Upload' ) }
				</FormFileUpload>

				<DropZone
					label={ __( 'Import from JSON' ) }
					onFilesDrop={ uploadImport }
				/>
			</DropZoneProvider>
		</Placeholder>
	);
};

export default compose([
	withSelect( ( select, { clientId }) => {
		const { canUserUseUnfilteredHTML } = select( 'core/editor' );
		const { getBlock } = select( 'core/block-editor' ) || select( 'core/editor' );
		const block = getBlock( clientId );

		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML()
		};
	}),

	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML }) => ({
		importBlock: ( content ) => dispatch( 'core/block-editor' ).replaceBlocks(
			block.clientId,
			content
		)
	}) )
])( BlocksImporter );
