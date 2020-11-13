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
};

module.exports = vueConfig;
