const path = require('path');

const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  addWebpackModuleRule
} = require('customize-cra');
module.exports = override(
  addDecoratorsLegacy(),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  }),
  addWebpackModuleRule({
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'babel-loader'
      },
      {
        loader: '@svgr/webpack',
        options: {
          babel: false,
          icon: true
        }
      }
    ]
  })
);
