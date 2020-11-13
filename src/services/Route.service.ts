/**
 * @author zhushiqi
 * @description 路由 菜单 导航 等等
 */

import {
  computed, ComputedRef, Ref, ref,
} from 'vue';
import { Singleton } from '@/utils/singleton';
import { RouteLocationNormalized, Router, useRoute } from 'vue-router';
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

  /** 左侧菜单栏，根据路由生成 */
  menus: ComputedRef<Menu[]> = computed(() => this.genMenus(this.routes.value));

  /** 根据当前路径生成的面包屑导航 */
  routeBreadcrumb: ComputedRef<Breadcrumb[]> = computed(() => this.getRouteBreadcrumb());

  /** 自定义的面包屑导航 */
  customBreadcrumb: Ref<Breadcrumb[]> = ref([]);

  /** 实际显示的面包屑导航 */
  breadcrumb: ComputedRef<Breadcrumb[]> = computed(() => (this.customBreadcrumb.value.length
    ? this.customBreadcrumb.value
    : this.routeBreadcrumb.value));

  genMenus(routes: RouteConfig[]) {
    const visibilityRoutes = this.getVisibilityRoutes(routes);
    const menus = visibilityRoutes.map((route) => this.route2Menu(route));
    return menus;
  }

  getVisibilityRoutes(routes: RouteConfig[]): RouteConfig[] {
    const visibilityRoutes = [];
    for (const route of routes) {
      const { meta: { hiddenMenu }, children } = route;
      if (!hiddenMenu) {
        const cloneRoute = cloneDeep(route);
        if (children && children.length) {
          cloneRoute.children = this.getVisibilityRoutes(children);
        }
        visibilityRoutes.push({ ...cloneRoute });
      }
    }
    return visibilityRoutes;
  }

  route2Menu(route: RouteConfig): Menu {
    return {
      name: route.name,
      title: route.meta.title,
      children: route.children && route.children.length
        ? route.children.map((item) => this.route2Menu(item as RouteConfig))
        : [],
    };
  }

  getRouteBreadcrumb(): Breadcrumb[] {
    const route = useRoute();
    const breadcrumb: Breadcrumb[] = [];
    for (const item of route.matched) {
      const {
        name,
        meta: { title, abstract = false, hiddenMenu = false },
      } = item;
      if (!hiddenMenu || hiddenMenu) {
        if (abstract || name === route.name) {
          breadcrumb.push({ title });
        } else {
          breadcrumb.push({ title, route: item });
        }
      }
    }
    return breadcrumb;
  }

  setCustomBreadcrumb(breadcrumb: Breadcrumb[] = []) {
    this.customBreadcrumb.value = breadcrumb;
  }

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
      const permissions = cloneRoute.meta?.permissions || ['*'];
      const { children } = cloneRoute;
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
      .catch(() => {
        // window.location.href = window.location.origin;
        console.log(111);
        return Promise.reject();
      });
  }

  findFirstVisitableRoute(parentRoute: RouteConfig[]): RouteConfig {
    const currentRoute = parentRoute;
    for (const item of currentRoute) {
      if (!item.meta.abstract) {
        return item;
      }

      if (item?.children?.length) {
        return this.findFirstVisitableRoute(item.children as RouteConfig[]);
      }
    }
    return { name: 'Result', params: { status: '403' } } as unknown as RouteConfig;
  }

  getFirstRoute(params?: { router: Router; parentRouteName: string }) {
    const authRoutes = this.routes.value;
    let result;

    // 如果有传入父路由
    if (params) {
      const { router, parentRouteName } = params;
      const designatedMatchedRoutes = router.resolve({ name: parentRouteName }).matched;
      const designatedRoute = (designatedMatchedRoutes?.length && designatedMatchedRoutes[
        designatedMatchedRoutes.length - 1]) as unknown as RouteConfig;

      if (!(designatedRoute?.meta?.abstract === true)) {
        return designatedRoute;
      }

      result = (designatedRoute?.children?.length
        && this.findFirstVisitableRoute(designatedRoute?.children || []));
    }

    // 如果未传入或者传入的路由没找到可访问路由
    if ((!result || (result as RouteConfig)?.name === 'Result') && authRoutes.length) {
      return this.findFirstVisitableRoute(authRoutes);
    }

    return result as RouteConfig;
  }
}

export const routeService = RouteService.getInstance();
