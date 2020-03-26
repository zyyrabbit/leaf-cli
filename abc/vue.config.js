const path = require('path');
const isProd = process.env.NODE_ENV === 'production';

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  
  configureWebpack: {
    name: require('./src/setting.ts').title
  },

  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude
      .add(path.resolve(__dirname, './src/assets/svg/'))
      .end();
    config.module
      .rule('svg-icon')
      .test(/\.svg$/)
      .include
      .add(path.resolve(__dirname, './src/assets/svg/'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]',
      });
    // 生成环境css文件提取到单个文件
    if (isProd) {
      config
        .plugin('extract-css')
        .tap(args => [
          { filename: 'static/css/[name].[contenthash:8].css' },
        ]);
      config.optimization.merge({
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: (m, c, entry = 'app') =>
                m.constructor.name === 'CssModule' &&
                recursiveIssuer(m) === entry,
              chunks: 'all',
              priority: -11,
              minChunks: 1,
              enforce: true,
            },
          },
        },
      });
    }
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.plugins.delete('fork-ts-checker');
  },
  productionSourceMap: false,
  outputDir: 'dist',
  baseUrl: '',
  assetsDir: isProd ? 'static' : '',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    hot: true,
    public: '',
    logLevel: 'debug',
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      '/demoapp': {
        ws: false,
        target: 'http://192.168.91.5:8123/mock/99',
        changeOrigin: true,
      }
    },
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        data: 
        `@import "@/assets/style/variables.scss";`
      },
    },
  },
};
