/**
 * @author zhushiqi
 * @description 菜单 面包屑 导航
 */

import {
  computed, ComputedRef, Ref, ref,
} from 'vue';
import { Singleton } from '@/utils/singleton';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash';
import { routeService } from './Route.service';

@Singleton
export class MenuService {
  static instance: MenuService;

  static getInstance: () => MenuService;

  /** 左侧菜单栏，根据路由生成 */
  menus: ComputedRef<Menu[]> = computed(() => this.genMenus(routeService.routes.value));

  openKeys = ref<string[]>([]);

  selectedKeys = ref<string[]>([]);

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
}

export const menuService = MenuService.getInstance();
