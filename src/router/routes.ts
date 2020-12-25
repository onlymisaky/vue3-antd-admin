import Layout from '@/layouts/Layout.vue';
import { commonRoutes } from './common-routes';
import { articleRoute } from './article.route';
import { logRoute } from './log.route';

const privateRoutes = [
  articleRoute,
  logRoute,
];

privateRoutes.forEach((route) => {
  if (!route.component) {
    // eslint-disable-next-line no-param-reassign
    route.component = Layout;
  }
});

export {
  commonRoutes,
  privateRoutes,
};
