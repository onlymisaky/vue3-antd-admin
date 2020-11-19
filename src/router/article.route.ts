export const articleRoute: RouteConfig = {
  name: 'Article',
  path: '/article',
  component: () => import('@/layouts/Layout.vue'),
  meta: {
    title: '文章管理',
    abstract: true,
    permissions: ['article:view'],
  },
  children: [
    {
      name: 'Article.List',
      path: 'list',
      meta: {
        title: '文章列表',
        permissions: ['article:view'],
      },
      component: () => import('@/views/article/ArticleList.vue'),
    },
    {
      name: 'Article.Detail',
      path: ':articleId',
      props(route) {
        return {
          articleId: route.params.articleId,
        };
      },
      meta: {
        title: '文章详情',
        permissions: ['article:view'],
        hiddenMenu: true,
      },
      component: () => import('@/views/article/ArticleDetail.vue'),
    },
  ],
};
