<template>
  <a-spin :spinning="loading"
    :delay="500">
    <Panel :title="article.title">
      <template #tool>
        <div style="margin-left:auto">
          发布时间：{{formatDate(article.created)}}
          最后修改时间：{{formatDate(article.updated)}}
          <a-button type="primary"
            v-if="articleEditAuth"
            @click="onEditArticle">
            修改
          </a-button>
        </div>
      </template>
      <template #body>
        <div>{{article.content}}</div>
      </template>
    </Panel>
  </a-spin>
  <ModalUpsertArticle v-if="editArticleVisible"
    v-model:visible="editArticleVisible"
    :article="article" />
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import { defineComponent, onMounted, PropType } from 'vue';

import Panel from '@/components/base/Panel.vue';
import { useRequest } from '@/hooks/base/useRequest';
import { ArticleApi } from '@/api/Article.api';
import { Article } from '@/models/Article.model';
import { formatDate } from '@/utils/date';
import { useToggleBool } from '@/hooks/base/useToggleBool';
import { permissionService } from '@/services/Permission.service';
import ModalUpsertArticle from './components/ModalUpsertArticle.vue';

export default defineComponent({
  name: 'ArticleEdit',
  components: {
    Panel,
    ModalUpsertArticle,
  },
  props: {
    articleId: {
      type: [Number, String] as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    const {
      data: article,
      loading,
      requestFn,
    } = useRequest(ArticleApi.getArticleDetail, { initData: {} as Article });

    const { bool: editArticleVisible, toggle: onEditArticle } = useToggleBool(
      false,
    );

    function getArticle() {
      return requestFn(props.articleId);
    }

    onMounted(() => {
      getArticle();
    });

    return {
      article,
      loading,
      formatDate,
      editArticleVisible,
      onEditArticle,
      articleEditAuth: permissionService.articleEdit,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
