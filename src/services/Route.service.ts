/**
 * @author zhushiqi
 * @description 路由
 */

import {
  computed, Ref, ref,
} from 'vue';
import { GeedStorage } from 'geed-storage';
import { RouteLocationNormalized, Router } from 'vue-router';
import { cloneDeep } from 'lodash';
import { singleton } from '@/utils/singleton';
import { privateRoutes, commonRoutes } from '@/routes';
import { userService } from './User.service';
import { permissionService } from './Permission.service';

const storage = new GeedStorage({ type: 'session' });

export class RouteService {
  whiteRouteNames = this.flatRoutes(commonRoutes).map((item) => item.name);

  /** 权限路由表 */
  routes: Ref<RouteConfig[]> = ref([]);

  /** 平铺路由表 */
  tileRoutes = computed(() => this.flatRoutes(this.routes.value));

  routeNames = computed(() => [
    ...this.tileRoutes.value.map((item) => item.name),
    ...this.whiteRouteNames,
  ]);

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
    const promise = this.genRoutesSuccess
      ? Promise.resolve(this.routes.value)
      : userService.getUserInfo().then(() => this.genRoutes(privateRoutes));

    return promise
      .then(() => {
        const replace = false;
        const name = to.name as string;
        storage.remove('redirectCount');

        if (router.hasRoute(name)) {
          if (this.routeNames.value.includes(name)) {
            return replace ? { ...to, replace } : to;
          }
          return { name: 'Result', params: { status: '403' } };
        }
        return { name: 'Result', params: { status: '404' } };
      })
      .catch(() => {
        const redirectCount = Number(storage.get('redirectCount'));
        if (redirectCount < 7) {
          storage.set('redirectCount', `${redirectCount + 1}`);
          window.location.href = window.location.origin;
        } else {
          router.push({
            name: 'Result',
            params: { status: 'warning' },
            query: {
              title: '跳转次数过多',
              subTitle: '请尝试隐身模式打开',
            },
          });
        }
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

export const routeService = singleton(RouteService).getInstance();
