const { defineConfig } = require('@vue/cli-service');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

const localmode = !!process.env.npm_config_localmode;
const microapp = !!process.env.npm_config_microapp;

const port = '8090';
const target = localmode ? `http://localhost:${port}/` : 'http://localhost:3000/';

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      if (localmode) {
        devServer.app.post('/ajax/login', (req, res) => {
          res.json({
            success: false,
            data: 'todo',
          });
        });
        devServer.app.get('/ajax/user', (req, res) => {
          res.json({
            success: true,
            data: {
              permissions: [
                'article:view',
                'article:add',
                'article:edit',
              ],
              id: 2379,
              name: 'Onlymisaky',
              nickname: 'misaky',
              phone: '150xxxx5277',
              email: 'onlymisaky@gmail.com',
              channelIds: [],
              isBinding: true,
              bindStatus: true,
            },
          });
        });
      }

      return middlewares;
    },
    proxy: {
      '/ajax': {
        target,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/ajax': '/',
        },
      },
    },
  },
  chainWebpack(config) {
    if (microapp) {
      // config.entry('main').clear().add('./src/micro-app.ts');
      config.output
        .library('vueApp')
        .libraryTarget('umd');
    }
    // Unknown word  CssSyntaxError
    // config
    //   .plugin('stylelint-webpack-plugin')
    //   .use(StylelintWebpackPlugin);
  },
});
