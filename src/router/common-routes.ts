/**
 * @author zhushiqi
 */
import Result from '@/views/Result.vue';

const commonRoutes: Array<RouteConfig> = [
  {
    name: 'Index',
    path: '',
    component: () => import('@/views/Index.vue'),
    meta: {
      title: '',
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登陆',
    },
  },
  {
    name: 'Result',
    path: '/result/:status',
    component: Result,
    props(route) {
      // 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'
      const { status } = route.params;
      let title = status;
      let subTitle = '';
      if ([404, 403, 500].includes(Number(status) as 404 | 403 | 500)) {
        subTitle = {
          403: '您没有权限访问该页面！',
          404: '您要访问的页面不存在！',
          500: '服务器错误！',
        }[Number(status) as 404 | 403 | 500];
      } else {
        title = route.query.title as string;
        subTitle = route.query.subTitle as string;
      }
      return {
        status,
        title,
        subTitle,
      };
    },
    meta: {
      title: '',
    },
  },
];

export { commonRoutes };
