<template>
  <a-row v-bind="attrs"
    class="flex-row">
    <slot></slot>
  </a-row>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import { computed, defineComponent, nextTick } from 'vue';

export default defineComponent({
  name: 'FlexRow',
  setup(props, ctx) {
    const attrs = computed(() => ({
      type: 'flex',
      ...ctx.attrs,
    }));
    return attrs;
  },
  mounted() {
    nextTick(() => {
      (this.$el as HTMLElement).childNodes.forEach((childNode) => {
        if (childNode.nodeType === 1) {
          // eslint-disable-next-line no-param-reassign
          (childNode as HTMLElement).style.flex = '1';
        }
      });
    });
  },
});
</script>
