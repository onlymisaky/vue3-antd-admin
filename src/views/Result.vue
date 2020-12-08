<template>
  <a-result :status="status"
    :title="title"
    :sub-title="subTitle">
    <template #extra>
      <a-button type="primary"
        @click="$router.push({name: 'Index'})">
        回到首页
      </a-button>
      <a-button @click="logout">
        退出登陆
      </a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import { defineComponent, PropType } from 'vue';
import { userService } from '@/services/User.service';

export default defineComponent({
  name: 'Result',
  props: {
    status: {
      type: String as PropType<'404' | '403' | '500'>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {
      logout: userService.logout,
    };
  },
});
</script>
