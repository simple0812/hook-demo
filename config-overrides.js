const path = require('path');
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
  fixBabelImports,
  addLessLoader
} = require('customize-cra');
module.exports = override(
  addLessLoader({
    lessOptions: {
      relativeUrls: false,
      strictMath: true,
      noIeCompat: true,
      modifyVars: {
        '@primary-color': '#1DA57A' // for example, you use Ant Design to change theme color.
      },
      cssLoaderOptions: {}, // .less file used css-loader option, not all CSS file.
      cssModules: {
        localIdentName: '[path][name]__[local]--[hash:base64:5]' // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
      }
    }
  }),
  // addLessLoader({
  //   lessOptions: {
  //     relativeUrls: false,
  //     javascriptEnabled: true
  //     // modifyVars: theme
  //   }
  // }),
  // fixBabelImports('antd', {
  //   // libraryName: 'antd',
  //   libraryDirectory: 'es',
  //   style: true
  // }),
  // 装饰器
  addDecoratorsLegacy(),
  // addLessLoader({
  //   javascriptEnabled: true,
  //   relativeUrls: false,
  //   // modifyVars: {'@primary-color': '#16a951'},
  //   sourceMap: false
  // }),

  //路由简写
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  })

  // svg loader
  // addWebpackModuleRule({
  //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
  //   use: [
  //     {
  //       loader: '@svgr/webpack',
  //       options: {
  //         babel: false,
  //         icon: true
  //       }
  //     }
  //   ]
  // })
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
