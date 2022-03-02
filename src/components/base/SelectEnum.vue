<template>
  <Selects v-model:value="val"
    v-bind="attrs"
    :options="types"
    :optionsProps="{ key: getKey, label: getLabel, }" />
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import { computed, defineComponent, PropType } from 'vue';
import { useVModel } from '@/hooks/base/useVModel';
import { getEnumVal } from '@/utils/index';
import Selects from '@/components/base/Selects.vue';

/** todo 全局所有的枚举 自己写 */
type enumName = 'status' | 'xxx';

export default defineComponent({
  name: 'SelectEnum',
  components: { Selects },
  props: {
    value: {
      type: [String, Number, Array],
      required: true,
    },
    enumName: {
      type: String as PropType<enumName>,
      required: true,
    },
    enumKey: {
      type: String as PropType<'name' | 'enName' | 'value'>,
      default: 'enName',
    },
  },
  setup(props, ctx) {
    const val = useVModel(props, 'value');
    const attrs = computed(() => ({
      placeholder: '请选择',
      ...ctx.attrs,
    }));

    // 自己实现
    const types = computed<ArrayEnum[]>(() => [
      ['SSS', '启用', 0],
      ['AAA', '禁用', 2],
    ]);

    function getKey(item: ArrayEnum) {
      return getEnumVal(item, props.enumKey);
    }

    function getLabel(item: ArrayEnum) {
      return getEnumVal(item, 'name');
    }

    return {
      val,
      types,
      attrs,
      getKey,
      getLabel,
    };
  },
});
</script>
