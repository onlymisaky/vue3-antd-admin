/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import defineEnv from 'vite-plugin-define-env';
import htmlTemplate from 'vite-plugin-html-template';

export default defineConfig(({ command, mode }) => {
  console.log(command, mode);
  return {
    plugins: [
      vue(),
      defineEnv(),
      // todo 我要自己写一个
      htmlTemplate(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});

/**
 * 后记
 * 1. 安装 vite 和相关 plugin
 * 2. 在根目录创建 index.html
 * 3. 创建 vite.config.ts
 * 4. 定义环境变量，别名
 */
