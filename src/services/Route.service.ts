/**
 * @author zhushiqi
 * @description 路由
 */

import {
  computed, Ref, ref,
} from 'vue';
import { Singleton } from '@/utils/singleton';
import { RouteLocationNormalized, Router } from 'vue-router';
import { cloneDeep } from 'lodash';
import { asyncRoutes } from '@/router/routes';
import { userService } from './User.service';
import { permissionService } from './Permission.service';

@Singleton
export class RouteService {
  static instance: RouteService;

  static getInstance: () => RouteService;

  /** 动态路由表 */
  routes: Ref<RouteConfig[]> = ref([]);

  /** 平铺路由表 */
  tileRoutes = computed(() => this.flatRoutes(this.routes.value));

  /** 标示，用于判断是否生成路由成功 */
  genRoutesSuccess = false;

  genRoutes(routes: RouteConfig[]) {
    if (this.genRoutesSuccess) {
      return Promise.resolve(this.routes.value);
    }
    return userService.getUserInfo()
      .then(() => {
        this.routes.value = this.filterRoutes(routes);
        this.genRoutesSuccess = true;
        return this.routes.value;
      });
  }

  filterRoutes(routes: RouteConfig[]): RouteConfig[] {
    const authRoutes: RouteConfig[] = [];
    for (const route of routes) {
      const cloneRoute = cloneDeep(route);
      let permissions = cloneRoute.meta?.permissions;
      const { children } = cloneRoute;
      if (!Array.isArray(permissions)) {
        const flatChildren = this.flatRoutes(children || []);
        permissions = this.mergePermissions(flatChildren);
      }
      const accessed = permissionService.hasPermission(permissions);
      if (accessed) {
        if (children?.length) {
          cloneRoute.children = this.filterRoutes(children);
        }
        authRoutes.push({ ...cloneRoute });
      }
    }
    return authRoutes;
  }

  mergePermissions(routes: RouteConfig[]): string[] {
    const p = routes.map(({ meta: { permissions = [] } }) => permissions);
    const flatP = p.flat();
    return Array.from(new Set(flatP));
  }

  flatRoutes(routes: RouteConfig[]): RouteConfig[] {
    let flat: RouteConfig[] = [];
    for (const route of routes) {
      flat.push(route);
      if (route.children?.length) {
        const children = this.flatRoutes(route.children);
        flat = [...flat, ...children];
      }
    }
    return flat;
  }

  getChildren(routeName: string): RouteConfig[] {
    const route = this.tileRoutes.value.find((item) => item.name === routeName);
    return route?.children?.length ? route.children : [];
  }

  routerSetup(
    router: Router,
    to: RouteLocationNormalized,
  ) {
    if (this.genRoutesSuccess) {
      const route = router.hasRoute(to.name as string)
        ? to
        : { name: 'Result', params: { status: '404' } };
      return Promise.resolve(route);
    }
    return userService.getUserInfo()
      .then(() => this.genRoutes(asyncRoutes))
      .then(() => {
        const routes = this.routes.value;
        routes.forEach((route) => {
          router.addRoute(route);
        });
        let replace = false;
        let routeLocation = to;

        // 首次进入，没有 addRoute ，name为空，需要手动解析下
        if (to.name === undefined) {
          routeLocation = router.resolve(to);
          replace = true;
        }
        if (router.hasRoute(routeLocation.name as string)) {
          return replace ? { ...to, replace } : to;
        }
        return { name: 'Result', params: { status: '404' } };
      })
      .catch((err) => {
        console.log('routerSetup', err);
        return Promise.reject();
      });
  }

  findFirstRoute(routes: RouteConfig[]): RouteConfig {
    const routess: RouteConfig[] = [];
    for (const item of routes) {
      if (!item.meta.abstract) {
        routess.push(item);
      }

      if (item?.children?.length) {
        routess.push(this.findFirstRoute(item.children as RouteConfig[]));
      }
    }
    return routess.find((item) => !item.meta.hiddenMenu)
      || routess[0]
      || { name: 'Result', params: { status: '403' } } as unknown as RouteConfig;
  }

  getFirstRoute(
    router?: Router,
    parentRouteName?: string,
  ) {
    // 如果有传入父路由
    if (router && parentRouteName) {
      const routes = router.resolve({ name: parentRouteName }).matched;
      if (routes.length !== 0) {
        const route = routes[routes.length - 1] as unknown as RouteConfig;
        if (!route.meta.abstract) {
          return route;
        }
        const firstRoute = this.findFirstRoute(route.children || []);
        return firstRoute;
      }
    }

    const authRoutes = this.routes.value;
    if (authRoutes.length) {
      const firstRoute = this.findFirstRoute(authRoutes);
      return firstRoute;
    }

    return { name: 'Result', params: { status: '403' } } as unknown as RouteConfig;
  }
}

export const routeService = RouteService.getInstance();
