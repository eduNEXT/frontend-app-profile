const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { createConfig } = require('@edx/frontend-build');

const path = require('path');

const ASSET_PATH = "/profile/";
module.exports = createConfig('webpack-prod', {
  output: {
    path: path.resolve(__dirname, 'dist/profile'),
    publicPath: ASSET_PATH,
  },
  plugins: [
    // Scan files for class names and ids and remove unused css
    new PurgecssPlugin({
      paths: [].concat(
        // Scan files in this app
        glob.sync('src/**/*', { nodir: true }),
        // Scan files in any edx frontend-component
        glob.sync('node_modules/@edx/frontend-component*/**/*', { nodir: true }),
        // Scan files in paragon
        glob.sync('node_modules/@edx/paragon/**/*', { nodir: true }),
      ),
      // Protect react-css-transition class names
      whitelistPatterns: [/-enter/, /-appear/, /-exit/],
    }),
  ],
});
