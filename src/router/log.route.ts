export const logRoute: RouteConfig = {
  name: 'Log',
  path: '/Log',
  component: () => import('@/layouts/Layout.vue'),
  meta: {
    title: '操作日志',
    abstract: true,
  },
  children: [
    {
      name: 'Log.List',
      path: 'list',
      meta: {
        title: '操作日志',
        permissions: ['*'],
      },
      component: () => import('@/views/Log.vue'),
    },
  ],
};
