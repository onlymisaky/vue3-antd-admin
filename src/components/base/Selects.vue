<template>
  <a-select style="min-width:80px"
    v-model:value="vModel"
    v-bind="attrs"
    v-on="attrs">
    <a-select-option v-for="item in options"
      :key="getKey(item)"
      :label="getLabel(item)"
      :title="getLabel(item)"
      :disabled="isDisabled(item)">
      {{getLabel(item)}}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import {
  computed, defineComponent, PropType, onBeforeMount,
} from 'vue';
import { useProp2VModel } from '@/hooks/base/useVModel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type fn<T = string> = (item: any) => T;

export default defineComponent({
  name: 'Selects',
  props: {
    value: {
      type: [String, Number, Array],
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    optionsProps: {
      type: Object as PropType<{
        key: string | fn;
        label: string | fn;
        disabled: boolean | fn<boolean>;
      }>,
      required: true,
    },
  },
  setup(props, ctx) {
    const { vModel } = useProp2VModel(props, 'value', ctx);

    const getKey = computed(() => {
      if (typeof props.optionsProps.key === 'function') {
        return props.optionsProps.key;
      }
      if (typeof props.optionsProps.key === 'string') {
        return (item: Obj) => item[props.optionsProps.key as string];
      }
      return (item: Obj) => item;
    });

    const getLabel = computed(() => {
      if (typeof props.optionsProps.label === 'function') {
        return props.optionsProps.label;
      }
      if (typeof props.optionsProps.label === 'string') {
        return (item: Obj) => item[props.optionsProps.label as string];
      }
      return (item: Obj) => item;
    });

    const isDisabled = computed(() => {
      if (typeof props.optionsProps.disabled === 'function') {
        return props.optionsProps.disabled;
      }
      return () => !!props.optionsProps.disabled;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function filterOption(inputValue: string, option: Obj) {
      return (option.props.label as string)
        .toLowerCase()
        .includes(inputValue.trim());
    }

    const attrs = computed(() => ({
      placeholder: '请选择',
      allowClear: true,
      showArrow: true,
      showSearch: true,
      optionFilterProp: 'label',
      // filterOption,
      ...ctx.attrs,
    }));

    onBeforeMount(() => {
      // 修复下拉框板顶的值为 '' 不显示 placeholder
      if (vModel.value === '') {
        vModel.value = undefined;
      }
    });

    return {
      vModel,
      attrs,
      getKey,
      getLabel,
      isDisabled,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
