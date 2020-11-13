import { Article, ArticleQuery, ArticleUpsert } from '@/models/Article.model';
import { http } from '@/utils/http';

export class ArticleApi {
  static getArticleList(params: Partial<ArticleQuery & PageQuery>): HttpTableResponseP<Article> {
    return http.get('/articles', { params });
  }

  static getArticleDetail(articleId: number): HttpResponseP<Article> {
    return http.get(`/article/${articleId}`);
  }

  static postArticle(data: ArticleUpsert): HttpResponseP<{ id: number }> {
    return http.post('/article', data);
  }

  static editArticle(
    articleId: number,
    data: Partial<ArticleUpsert>,
  ): HttpResponseP<{id: number}> {
    return http.patch(`/article/${articleId}`, data);
  }

  static upsertArticle(data: Partial<ArticleUpsert>) {
    const { id, ...other } = data;
    if (id === undefined) {
      return ArticleApi.postArticle(other as ArticleUpsert);
    }
    return ArticleApi.editArticle(id, other);
  }
}
