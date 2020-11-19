<template>
  <a-config-provider :locale="locale"
    :key="viewKey">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
/**
 * @author onlymisaky
 */

import { defineComponent } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { appService } from './services/App.service';

export default defineComponent({
  name: 'App',
  setup() {
    return {
      locale: zhCN,
      viewKey: appService.viewKey,
      loading: appService.loading,
    };
  },
});
</script>
