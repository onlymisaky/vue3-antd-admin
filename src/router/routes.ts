import Layout from '@/layouts/Layout.vue';
import { constantRoutes } from './constant.route';
import { articleRoute } from './article.route';
import { logRoute } from './log.route';

const asyncRoutes = [
  articleRoute,
  logRoute,
];

asyncRoutes.forEach((route) => {
  if (!route.component) {
    // eslint-disable-next-line no-param-reassign
    route.component = Layout;
  }
});

export {
  constantRoutes,
  asyncRoutes,
};
