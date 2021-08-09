import { createRouter, createWebHashHistory } from 'vue-router';
import { routeService } from '@/services/Route.service';
import { commonRoutes, privateRoutes } from './routes';

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: [
    ...commonRoutes,
    ...privateRoutes,
  ],
});

router.beforeEach((to, from, next) => {
  const { name, meta: { title = '' } } = to;
  if (routeService.whiteRouteNames.includes(name as string)) {
    next();
  } else {
    routeService.routerSetup(router, to).then((route) => {
      if (to === route) {
        next();
      } else {
        next(route);
      }
    });
  }
  if (title) {
    document.title = title as string;
  }
});

export { router };
