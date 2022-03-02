import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import { genRouter } from './routes/router';
import '@/styles/main.scss';
import { bootstrap, mountWrap, unmount } from './micro-app';

function init(container: HTMLElement | string, base?: string) {
  const router = genRouter(base);
  const appInstance = createApp(App);
  appInstance
    .use(Antd)
    .use(router);
  const componentPublicInstance = appInstance.mount(container);

  return {
    router,
    appInstance,
    componentPublicInstance,
  };
}

// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  init('#app', '');
}

const mount = mountWrap(init);

export { bootstrap, mount, unmount };
