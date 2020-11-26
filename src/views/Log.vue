<template>
  <iframe :src="url"></iframe>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import { defineComponent } from 'vue';
import { serializedParams } from '@/utils/index';
import { LOG } from '@/constants/env';

export default defineComponent({
  name: 'Log',
  setup() {
    const url = `${
      LOG.logOrigin
    }/rapp/operate-record/logs${serializedParams({
      appId: LOG.logAppId,
      appCode: LOG.logAppCode,
      sso2bPlatformId: '',
      sso2bAppId: '',
    })}`;

    return { url };
  },
});
</script>

<style lang="scss" scoped>
iframe {
  border: 0;
  width: 100%;
  min-height: 800px;
}
</style>
