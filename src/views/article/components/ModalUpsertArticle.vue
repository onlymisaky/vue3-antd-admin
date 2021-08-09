<template>
  <a-modal v-model:visible="display"
    :title="title"
    okText="保存"
    :width="500"
    :confirmLoading="loading"
    @ok="onSubmit">
    <a-form :model="form"
      :rules="rules"
      ref="formRef"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }">
      <a-form-item label="标题"
        name="title">
        <a-input v-model:value="form.title"
          placeholder="请输入标题" />
      </a-form-item>
      <a-form-item label="内容"
        name="content">
        <a-textarea v-model:value="form.content" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */
import {
  computed, defineComponent, PropType, ref, Ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { useVModel } from '@/hooks/base/useVModel';
import { useRequest } from '@/hooks/base/useRequest';
import { Article, ArticleUpsert } from '@/models/Article.model';
import { ArticleApi } from '@/api/Article.api';

export default defineComponent({
  name: 'ModalUpsertArticle',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    article: {
      type: Object as PropType<Article>,
    },
  },
  setup(props) {
    const display = useVModel(props, 'visible');
    const title = computed(() => {
      if (props.article) {
        return '编辑文章';
      }
      return '添加文章';
    });

    // todo antd 把类型提示文件给搞没了，等待后续更新
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formRef = ref() as Ref<{ validate(...args: any[]): Promise<any> }>;
    const form = ref<Partial<ArticleUpsert>>({
      title: '',
      content: '',
    });
    const { data, loading, requestFn } = useRequest(ArticleApi.upsertArticle, {
      msg: '保存成功！',
    });

    const rules: FormRules = {
      title: [
        {
          required: true,
          trigger: 'blur',
          message: '标题不能为空',
        },
      ],
      content: [
        {
          required: true,
          trigger: 'blur',
          message: '内容不能为空',
        },
      ],
    };

    const router = useRouter();

    function onSubmit() {
      formRef.value
        .validate()
        .then(() => requestFn(form.value))
        .then(() => {
          display.value = false;
          router.push({
            name: 'Article.Detail',
            params: {
              articleId: data.value.id,
            },
            replace: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    watch(
      display,
      () => {
        if (display.value) {
          form.value = {
            title: '',
            content: '',
          };
          if (props.article) {
            form.value = {
              id: props.article.id,
              title: props.article.title,
              content: props.article.content,
            };
          }
        }
      },
      {
        immediate: true,
      },
    );

    return {
      display,
      title,
      formRef,
      form,
      rules,
      loading,
      onSubmit,
    };
  },
});
</script>
