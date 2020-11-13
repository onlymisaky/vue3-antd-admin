import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import { router } from './router/index';
import '@/styles/main.scss';

createApp(App)
  .use(Antd)
  .use(router)
  .mount('#app');
