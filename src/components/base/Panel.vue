<template>
  <div class="panel">
    <div class="panel-header"
      v-if="title || $slots.tool">
      <h2 class="panel-title"
        v-if="title">{{title}}</h2>
      <slot name="tool"
        v-if="$slots.tool">
      </slot>
    </div>
    <div class="panel-body"
      v-if="$slots.body">
      <slot name="body" />
    </div>
    <div class="panel-footer"
      v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * @author zhushiqi
 */
export default defineComponent({
  name: 'Panel',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.panel {
  padding: 16px;
  background-color: #fff;

  .panel-header {
    display: flex;
    align-items: center;
    border-bottom: 2px dashed #008080;
    padding-bottom: 5px;

    .panel-title {
      padding-left: 12px;
      color: #008080;
      font-size: 14px;
      font-weight: bold;
      position: relative;

      &::before {
        content: '';
        border-left: 4px solid #008080;
        position: absolute;
        top: 2px;
        bottom: 0;
        left: 0;
        height: 16px;
      }
    }
  }

  .panel-body {
    margin-top: 16px;
  }

  .panel-footer {
  }
}
</style>
