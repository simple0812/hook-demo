const path = require('path');
const webpack = require('webpack');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const getStyleLoaders = (cssOptions, preProcessor, lessOptions) => {
  // 这个是use里要设置的，封装了下
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          })
        ]
      }
    }
  ];
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: lessOptions
    });
  }
  return loaders;
};

const {
  override,
  addDecoratorsLegacy,
  addWebpackAlias,
  addWebpackModuleRule,
  addWebpackPlugin,
  addLessLoader,
  addWebpackExternals,
  disableEsLint
} = require('customize-cra');
module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    lessOptions: {
      relativeUrls: false,
      javascriptEnabled: true,
      strictMath: true,
      noIeCompat: true,
      modifyVars: {
        // '@primary-color': '#1DA57A' // for example, you use Ant Design to change theme color.
      },
      cssLoaderOptions: {}, // .less file used css-loader option, not all CSS file.
      cssModules: {
        localIdentName: getCSSModuleLocalIdent // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
      }
    }
  }),

  // 装饰器
  addDecoratorsLegacy(),
  disableEsLint(),

  //路由简写
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  }),

  addWebpackPlugin(
    new webpack.DefinePlugin({
      process: { env: {} }
    })
  ),

  addWebpackExternals({
    jQuery: 'jQuery'
  }),

  // svg loader
  addWebpackModuleRule({
    test: /\.svg$/,
    use: ['@svgr/webpack']
  })
  // (config) => {
  //   console.log(config);
  //   return config;
  // }

  // (config) => {
  //   // 增加处理less module配置 customize-cra 不提供 less.module 只提供css.module
  //   const oneOf_loc = config.module.rules.findIndex((n) => n.oneOf); // 这里的config是全局的
  //   config.module.rules[oneOf_loc].oneOf = [
  //     {
  //       test: /\.less$/,
  //       use: getStyleLoaders(
  //         {
  //           importLoaders: 2
  //           // modules: {
  //           //   getLocalIdent: getCSSModuleLocalIdent
  //           // }
  //         },
  //         'less-loader'
  //       )
  //     },
  //     ...config.module.rules[oneOf_loc].oneOf
  //   ];

  //   return config;
  // }
);
