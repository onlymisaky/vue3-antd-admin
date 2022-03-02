import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import { genRouter } from './routes/router';
import '@/styles/main.scss';

createApp(App)
  .use(Antd)
  .use(genRouter())
  .mount('#app');
