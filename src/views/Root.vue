<template>
  <router-view :key="viewKey" />
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { routeService } from '@/services/Route.service';
import { appService } from '@/services/App.service';

export default defineComponent({
  name: 'Root',
  setup() {
    const router = useRouter();
    const route = useRoute();
    onMounted(() => {
      routeService.routerSetup(router, route).then((to) => {
        if (to.name === route.name) {
          router.push(routeService.getFirstRoute());
        } else {
          router.push(to);
        }
      });
    });
    return {
      viewKey: appService.viewKey,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
