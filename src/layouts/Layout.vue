<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <a-button @click="collapsed = !collapsed">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
      <h1 class="m-l-20 m-y-0">ADMIN</h1>

      <div style="margin-left:auto">
        <a-dropdown>
          <a-avatar :size="48">
            {{userInfo?.nickname}}
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <span @click="logout">退出登陆</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

    </a-layout-header>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed"
        width="200">
        <SiderMenu :menus="menus"
          :collapsed="collapsed" />
      </a-layout-sider>
      <a-layout style="padding: 0 12px">
        <a-breadcrumb class="breadcrumb">
          <a-breadcrumb-item v-for="item in breadcrumb"
            :key="item.name">
            <router-link v-if="item.route"
              :to="item.route">
              {{item.title}}
            </router-link>
            <template v-else>
              {{item.title}}
            </template>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */
import { defineComponent, ref } from 'vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
// eslint-disable-next-line import/no-cycle
import { routeService } from '@/services/Route.service';
import { userService } from '@/services/User.service';
import SiderMenu from './SiderMenu.vue';

export default defineComponent({
  name: 'Layout',
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SiderMenu,
  },
  setup() {
    const collapsed = ref(false);

    return {
      collapsed,
      menus: routeService.menus,
      breadcrumb: routeService.breadcrumb,
      userInfo: userService.userInfo,
      logout: userService.logout,
    };
  },
});
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  .header {
    background: #fff;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
  .breadcrumb {
    margin: 12px 0;
  }
  .content {
    background: #fff;
    padding: 0 12px;
    margin: 0;
    min-height: 280px;
  }
}
</style>
