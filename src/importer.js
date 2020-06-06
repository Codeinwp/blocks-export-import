/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const apiFetch = wp.apiFetch;

const { parse } = wp.blocks;

const {
	Placeholder,
	Spinner
} = wp.components;

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

const {
	useEffect,
	useState
} = wp.element;

const BlocksImporter = ({
	attributes,
	importBlock
}) => {
	useEffect( () => {
		if ( attributes.file ) {
			uploadImport( attributes.file );
		}
	}, []);

	const [ isLoading, setLoading ] = useState( false );

	const uploadImport = files => {
		setLoading( true );
		const fileTobeRead = files[0];

		if ( 'application/json' !== fileTobeRead.type ) {
			return;
		}

		const fileReader = new FileReader();

		fileReader.onload = async() => {
			let data = JSON.parse( fileReader.result );

			if ( data.__file && 'wp_export' === data.__file ) {
				data = parse( data.content );
			}

			if ( data.__file && 'wp_block' === data.__file ) {
				const postType = await apiFetch({ path: '/wp/v2/types/wp_block' });

				const reusableBlock = await apiFetch({
					path: `/wp/v2/${ postType.rest_base }`,
					data: {
						title: data.title,
						content: data.content,
						status: 'publish'
					},
					method: 'POST'
				});

				data = `<!-- wp:block { "ref": ${ reusableBlock.id } } /-->`;
				data = parse( data );
			}

			importBlock( data );
			setLoading( false );
		};

		fileReader.readAsText( fileTobeRead );
	};

	if ( isLoading ) {
		return (
			<Placeholder>
				<Spinner/>
			</Placeholder>
		);
	}

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
		const { getBlock } = select( 'core/block-editor' );
		const block = getBlock( clientId );

		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML()
		};
	}),

	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML }) => ({
		importBlock: content => dispatch( 'core/block-editor' ).replaceBlocks(
			block.clientId,
			content
		)
	}) )
])( BlocksImporter );
