<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed"
      collapsible
      class="sider">
      <h1 class="m-l-20 m-y-0 app-name">ADMIN</h1>
      <SiderMenu :menus="menus"
        :collapsed="collapsed"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <a-button @click="collapsed = !collapsed">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
        <a-breadcrumb class="m-l-10">
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
        <div style="margin-left: auto;">
          <a-dropdown>
            <a-avatar :size="46">
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
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */
import {
  defineComponent, onMounted, ref, unref, watch,
} from 'vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { userService } from '@/services/User.service';
// eslint-disable-next-line import/no-cycle
import { menuService } from '@/services/Menu.service';
import { useRoute } from 'vue-router';
// eslint-disable-next-line import/no-cycle
import { routeService } from '@/services/Route.service';
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
    const route = useRoute();

    let oldOpenKeys: string[] = [];

    watch(
      () => collapsed.value,
      (val) => {
        if (val) {
          oldOpenKeys = [...unref(menuService.openKeys.value)];
          menuService.openKeys.value = [];
        } else {
          menuService.openKeys.value = oldOpenKeys;
        }
      },
    );

    onMounted(() => {
      menuService.selectedKeys.value = [
        routeService.getFirstRoute().name as string,
      ];
      menuService.openKeys.value = [route.matched[0]?.name as string];
    });

    return {
      collapsed,
      menus: menuService.menus,
      openKeys: menuService.openKeys,
      selectedKeys: menuService.selectedKeys,
      breadcrumb: menuService.breadcrumb,
      userInfo: userService.userInfo,
      logout: userService.logout,
    };
  },
});
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;

  .sider {
    min-height: 100vh;

    .app-name {
      background-color: rgb(2, 29, 60);
      max-height: 64px;
      overflow: hidden;
      line-height: 64px;
      color: #fff;
      letter-spacing: 1px;
      font-size: 17px;
      padding-left: 24px;
    }
  }

  .header {
    height: 58px;
    line-height: 58px;
    background: #fff;
    padding: 0 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .content {
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    height: 100%;
    background: #fff;
    padding: 0 12px;
    margin: 0;
    min-height: 280px;
  }
}
</style>
