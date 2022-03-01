import Layout from '@/layouts/Layout.vue';
import { commonRoutes } from './common-routes';
import { articleRoute } from './article.route';

const privateRoutes = [
  articleRoute,
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
