/** @type {import('@vue/cli-service').ProjectOptions} */
const vueConfig = {
  devServer: {
    proxy: {
      '/ajax': {
        https: true,
        target: '',
        ws: true,
        changeOrigin: true,
      },
    },
  },
};

module.exports = vueConfig;
