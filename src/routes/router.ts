import { createRouter, createWebHashHistory, Router } from 'vue-router';
import { routeService } from '@/services/Route.service';
import { commonRoutes, privateRoutes } from '.';

export function genRouter(base: string = process.env.BASE_URL): Router {
  const router = createRouter({
    history: createWebHashHistory(base),
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

  return router;
}
