const StyleLintPlugin = require('stylelint-webpack-plugin');

/** @type {import('@vue/cli-service').ProjectOptions} */
const vueConfig = {
  devServer: {
    proxy: {
      '/ajax': {
        https: true,
        target: 'http://localhost:3000/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/ajax': '/',
        },
      },
    },
  },
  // chainWebpack(config) {
  //   config
  //     .plugin('stylelint-webpack-plugin')
  //     .use(StyleLintPlugin);
  // },
};

module.exports = vueConfig;
