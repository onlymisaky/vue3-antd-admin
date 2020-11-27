<template>
  <template v-if="isSubMenu">
    <a-sub-menu :key="menu.name">
      <template v-slot:title>
        <span>
          <AppstoreOutlined />
          <span>{{menu.title}}</span>
        </span>
      </template>
      <SiderMenuItem v-for="subMenu in menu.children"
        :key="subMenu.name"
        :menuItem="subMenu" />
    </a-sub-menu>
  </template>

  <template v-else>
    <a-menu-item :key="menu.name"
      :title="menu.hasParent ? menu.title : ''">
      <AppstoreOutlined v-if="menu.hasParent" />
      <router-link :to="{ name: menu.name}"
        :style="{ display: !menu.hasParent ? 'block' : 'inline'}">
        {{!collapsed ? menu.title : ''}}
      </router-link>
    </a-menu-item>
  </template>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import {
  computed,
  defineComponent,
  PropType,
} from 'vue';
import { AppstoreOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'SiderMenuItem',
  components: { AppstoreOutlined },
  props: {
    menuItem: { required: true, type: Object as PropType<Menu> },
    collapsed: { type: Boolean, default: false },
  },
  setup(props) {
    const menu = computed<Menu>(() => {
      const {
        children = [],
        meta: { alwaysShow },
      } = props.menuItem;
      if (children.length > 1) {
        return props.menuItem;
      }
      if (children.length === 1 && !alwaysShow) {
        const [childMenu] = children;
        return ({ ...childMenu, hasParent: true } as unknown) as Menu;
      }
      return props.menuItem;
    });

    const isSubMenu = computed(
      () => Array.isArray(menu.value.children) && !!menu.value.children.length,
    );

    return {
      menu,
      isSubMenu,
    };
  },
});
</script>
