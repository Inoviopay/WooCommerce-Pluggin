const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const WooCommerceDependencyExtractionWebpackPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );

module.exports = {
    ...defaultConfig,
    plugins: [
        ...defaultConfig.plugins.filter(
            ( plugin ) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new WooCommerceDependencyExtractionWebpackPlugin(),
    ],
    externals: {
        '@woocommerce/blocks-registry': [ 'wc', 'wcBlocksRegistry' ],
        '@woocommerce/settings': [ 'wc', 'wcSettings' ],
    },
};
