<template>
  <a-form layout="inline"
    class="m-t-10">
    <a-form-item label="标题">
      <a-input v-model:value="searchOptions.title" />
    </a-form-item>
    <a-form-item label="日期">
      <a-range-picker v-model:value="searchOptions.dateRange"
        valueFormat="YYYY-MM-DD hh:mm:ss" />
    </a-form-item>
    <a-form-item label="状态:">
      <SelectEnum v-model:value="searchOptions.status"
        enumName="status" />
    </a-form-item>
    <a-form-item>
      <a-button class="m-r-5"
        v-if="articleAddAuth"
        @click="onAddArticle">
        添加文章
      </a-button>
      <a-button type="primary"
        class="m-r-5"
        :loading="loading"
        @click="getArticleList(1)">
        搜索
      </a-button>
      <a-button @click="onResetSearchOptions">
        重置
      </a-button>
    </a-form-item>
  </a-form>

  <a-table :dataSource="articleList"
    :pagination="false"
    :loading="loading"
    class="m-t-10"
    rowKey="id">
    <a-table-column title="标题"
      dataIndex="title">
    </a-table-column>
    <a-table-column title="创建时间"
      dataIndex="created"
      v-slot="{text}">
      {{formatDate(text, 'yyyy-MM-dd')}}
    </a-table-column>
    <a-table-column title="状态"
      dataIndex="status"
      v-slot="{text}">
      {{getEnumVal(text, 'name')}}
    </a-table-column>
    <a-table-column title="操作"
      dataIndex="id"
      v-slot="{text: id}">
      <a-button type="link"
        @click="$router.push({
          name: 'Article.Detail',
          params: { articleId: id },
        })">
        详情
      </a-button>
    </a-table-column>
  </a-table>

  <a-pagination v-model:current="pagination.currentPage"
    v-model:pageSize="pagination.pageSize"
    class="m-t-20"
    :total="pagination.total"
    showSizeChanger
    :showTotal="false"
    @showSizeChange="onChangePageSize"
    @change="onChangePage" />

  <ModalUpsertArticle v-if="addArticleVisible"
    v-model:visible="addArticleVisible" />

</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import {
  defineComponent, onMounted, ref, unref,
} from 'vue';
import { ArticleApi } from '@/api/Article.api';
import { ArticleQuery } from '@/models/Article.model';
import { useTable } from '@/hooks/base/useTable';
import { date2Timestamp, formatDate } from '@/utils/date';
import { getEnumVal } from '@/utils/index';
import SelectEnum from '@/components/base/SelectEnum.vue';
import { useToggleBool } from '@/hooks/base/useToggleBool';
import { permissionService } from '@/services/Permission.service';
import ModalUpsertArticle from './components/ModalUpsertArticle.vue';

export default defineComponent({
  name: 'ArticleList',
  components: { SelectEnum, ModalUpsertArticle },
  setup() {
    const searchOptions = ref({
      title: '',
      dateRange: [],
      status: '',
    });

    function buildParams(
      page: number,
      size: number,
    ): [Partial<ArticleQuery & PageQuery>] {
      const {
        dateRange: [startTime, endTime],
        ...other
      } = unref(searchOptions);
      return [
        {
          ...other,
          startTime: startTime ? date2Timestamp(startTime) : '',
          endTime: endTime ? date2Timestamp(endTime) : '',
          size,
          page: page - 1,
        },
      ] as [Partial<ArticleQuery & PageQuery>];
    }

    const {
      list: articleList,
      pagination,
      loading,
      fetchList: fetchArticleList,
      onChangePage,
      onChangePageSize,
    } = useTable(ArticleApi.getArticleList, {
      buildParams,
    });

    function getArticleList(page = 1) {
      return fetchArticleList(page);
    }

    function onResetSearchOptions() {
      searchOptions.value = {
        title: '',
        dateRange: [],
        status: '',
      };
    }

    const { bool: addArticleVisible, toggle: onAddArticle } = useToggleBool(
      false,
    );

    onMounted(() => {
      getArticleList();
    });

    return {
      searchOptions,
      loading,
      articleList,
      pagination,
      onChangePage,
      onChangePageSize,
      getArticleList,
      onResetSearchOptions,
      formatDate,
      getEnumVal,
      addArticleVisible,
      onAddArticle,
      articleAddAuth: permissionService.articleAdd,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
