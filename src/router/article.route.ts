export const articleRoute: RouteConfig = {
  name: 'Article',
  path: '/article',
  component: () => import('@/layouts/Layout.vue'),
  meta: {
    title: '文章管理',
    abstract: true,
    alwaysShow: true,
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
        permissions: ['article:edit'],
        hiddenMenu: true,
      },
      component: () => import('@/views/article/ArticleDetail.vue'),
    },
  ],
};
