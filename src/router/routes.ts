import Layout from '@/layouts/Layout.vue';
import { constantRoutes } from './constant.route';
import { articleRoute } from './article.route';

const asyncRoutes = [
  articleRoute,
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
