/**
 * WordPress dependencies.
 */
const { kebabCase } = lodash;

const { __ } = wp.i18n;

const apiFetch = wp.apiFetch;

const { serialize } = wp.blocks;

const { compose } = wp.compose;

const { withSelect } = wp.data;

const { PluginBlockSettingsMenuItem } = wp.editPost;

const BlocksExporter = ({
	blocks,
	count
}) => {
	const download = ( fileName, content, contentType ) => {
		const file = new window.Blob([ content ], { type: contentType });

		// IE11 can't use the click to download technique
		// we use a specific IE11 technique instead.
		if ( window.navigator.msSaveOrOpenBlob ) {
			window.navigator.msSaveOrOpenBlob( file, fileName );
		} else {
			const a = document.createElement( 'a' );
			a.href = URL.createObjectURL( file );
			a.download = fileName;

			a.style.display = 'none';
			document.body.appendChild( a );
			a.click();
			document.body.removeChild( a );
		}
	};

	const exportBlocks = async() => {
		if ( ! blocks ) {
			return;
		}

		let data, fileName;

		if ( 1 === count && 'core/block' === blocks.name ) {
			const id = blocks.attributes.ref;

			const postType = await apiFetch({ path: '/wp/v2/types/wp_block' });

			const post = await apiFetch({
				path: `/wp/v2/${ postType.rest_base }/${ id }?context=edit`
			});

			const title = post.title.raw;
			const content = post.content.raw;
			fileName = kebabCase( title ) + '.json';

			data = {
				__file: 'wp_block',
				title,
				content
			};
		} else {
			fileName = 'blocks-export.json';

			data = {
				__file: 'wp_export',
				version: 2,
				content: serialize( blocks )
			};
		}

		const fileContent = JSON.stringify({ ...data }, null, 2 );

		download( fileName, fileContent, 'application/json' );
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
			blocks: 1 === getSelectedBlockCount() ? getSelectedBlock() : getMultiSelectedBlocks(),
			count: getSelectedBlockCount()
		};
	})
])( BlocksExporter );
