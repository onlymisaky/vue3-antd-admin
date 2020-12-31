const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

const localmode = !!process.env.npm_config_localmode;
const target = localmode ? 'http://localhost:3000/' : 'https://xxx.xingrengo.com/';

/** @type {import('@vue/cli-service').ProjectOptions} */
const vueConfig = {
  devServer: {
    proxy: {
      '/mock/1859/ajax': {
        https: true,
        target: 'https://yapi.xrxr.xyz',
        ws: true,
        changeOrigin: true,
      },
      '/ajax': {
        target,
        ws: true,
        changeOrigin: true,
      },
      '/logout': {
        target,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  chainWebpack(config) {
    config
      .plugin('stylelint-webpack-plugin')
      .use(StylelintWebpackPlugin);
  },
};

module.exports = vueConfig;
