import { createRouter, createWebHashHistory } from 'vue-router';
import { routeService } from '@/services/Route.service';
import { constantRoutes } from './routes';

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: [
    ...constantRoutes,
  ],
});

export function getWhiteRouteList(routeList: RouteConfig[]): string[] {
  const routes: string[] = [];
  routeList.forEach((item) => {
    routes.push(item.name);
    if (item.children && item.children.length) {
      routes.concat(getWhiteRouteList(item.children));
    }
  });
  return routes;
}

const whiteRoutes = getWhiteRouteList(constantRoutes);

router.beforeEach((to, from, next) => {
  const { name, meta: { title = '' } } = to;
  if (whiteRoutes.includes(name as string)) {
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
  document.title = title;
});

export { router };
