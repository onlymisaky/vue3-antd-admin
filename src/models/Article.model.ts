/**
 * @author zhushiqi
 * 命名方式建议 : 以 domain 开头 , domain + [动作 | 作用]
 */

export interface Article {
  id: number;
  title: string;
  content: string;
  created: number;
  updated: number;
  author: string;
  status: ArrayEnum;
}

export interface ArticleQuery {
  title: string;
  startTime: number | '';
  endTime: number | '';
  status: number | '';
}

export interface ArticleUpsert {
  id: number;
  title: string;
  content: string;
}
