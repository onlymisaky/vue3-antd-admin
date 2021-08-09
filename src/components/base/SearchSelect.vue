<template>
  <div class="search-select"
    ref="elRef">
    <div class="input-area">
      <slot name="input-area">
        <a-input v-model:value="keyword"
          :placeholder="placeholder"
          @focus="fetchListDebounce"
          @input="fetchListDebounce"
          @keydown.up.prevent="onPreSelectPrevious"
          @keydown.down.prevent="onPreSelectNext"
          @keydown.enter.prevent="onSelectData(selectedIndex)" />
      </slot>
    </div>
    <div class="result-area"
      :style="[resultAreaStyle?resultAreaStyle:'']"
      v-show="resultVisible">
      <a-table ref="tabelRef"
        :dataSource="resultList"
        :pagination="false"
        :loading="loading"
        :scroll="{ y: 300 }"
        :customRow="customRow">
        <slot />
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import {
  ComponentPublicInstance,
  defineComponent,
  nextTick,
  PropType,
  Ref,
  ref,
} from 'vue';
import { debounce } from 'lodash';
import { useSelectTable } from '@/hooks/base/useSelectTable';
import { useDocumentClick } from '@/hooks/base/useDocumentClick';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FetchData<T = any> = (keyword: string) => Promise<T[]>;

export default defineComponent({
  name: 'search-select',
  props: {
    fetchData: {
      type: Function as PropType<FetchData>,
      required: true,
    },
    debounce: {
      type: [Number, String] as PropType<number>,
      default: 1000,
    },
    size: {
      type: String,
      default: 'small',
    },
    placeholder: {
      type: String,
      default: '',
    },
    resultAreaStyle: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const keyword = ref('');
    const loading = ref(false);
    const resultVisible = ref(false);
    const resultList = ref<Obj[]>([]);
    const tabelRef = ref() as Ref<ComponentPublicInstance>;
    const elRef = ref() as Ref<HTMLElement>;

    const {
      onPreSelectNext,
      onPreSelectPrevious,
      selectData,
      setHighlight,
      selectedIndex,
    } = useSelectTable(resultList, tabelRef, ctx);

    function onSelectData(index: number) {
      selectData(index);
      resultVisible.value = false;
    }

    const fetchListDebounce = debounce(() => {
      resultList.value = [];
      selectedIndex.value = -1;
      if (keyword.value && keyword.value.trim()) {
        loading.value = true;
        resultVisible.value = true;
        props
          .fetchData(keyword.value)
          .then((data) => {
            resultList.value = data;
            if (data.length) {
              nextTick(() => {
                setHighlight(0);
              });
            }
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }, props.debounce);

    function customRow(record: Obj, index: number) {
      return {
        onClick() {
          onSelectData(index);
        },
        onMouseEnter() {
          setHighlight(index);
        },
      };
    }

    useDocumentClick(elRef, () => {
      resultVisible.value = false;
    });

    return {
      keyword,
      loading,
      resultVisible,
      resultList,
      tabelRef,
      elRef,
      fetchListDebounce,
      onPreSelectNext,
      onPreSelectPrevious,
      onSelectData,
      selectedIndex,
      customRow,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-select {
  display: inline-block;
  position: relative;

  .input-area {
    display: block;
  }

  .result-area {
    position: absolute;
    z-index: 10;
    border: 1px solid #87bdeb;
    width: 100%;
    background: #fff;
    text-align: center;

    & ::v-deep tr.high-light {
      &:hover > td {
        background-color: #409eff;
        color: #fff;
      }

      & > td {
        background-color: #409eff;
        color: #fff;
      }
    }
  }
}
</style>
