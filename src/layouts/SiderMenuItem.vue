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
      ref="SiderMenuItemRef">
      <AppstoreOutlined v-if="!hasParent" />
      <router-link :to="{ name: menu.name}"
        v-if="!collapsed"
        :style="{ display: hasParent ? 'block' : 'inline'}">
        {{menu.title}}
      </router-link>
    </a-menu-item>
  </template>
</template>

<script lang="ts">
/**
 * @author zhushiqi
 */

import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  Ref,
  ref,
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
        return childMenu;
      }
      return props.menuItem;
    });

    const isSubMenu = computed(
      () => Array.isArray(menu.value.children) && !!menu.value.children.length,
    );

    function findParent(el: HTMLElement) {
      let parent = el.parentNode as HTMLElement;
      while (
        parent
        && parent.classList
        && !parent.classList.contains('sider-menu')
        && !parent.classList.contains('ant-menu-sub')
      ) {
        parent = parent.parentNode as HTMLElement;
      }
      return parent;
    }

    // todo 用查找 dom 的方式实现，真的好蛋疼
    const hasParent = ref(true);

    const SiderMenuItemRef = ref() as Ref<ComponentPublicInstance>;

    onMounted(() => {
      nextTick(() => {
        if (SiderMenuItemRef.value?.$el) {
          const el = SiderMenuItemRef.value.$el as HTMLElement;
          const parentEl = findParent(el);
          if (
            !parentEl
            || (parentEl.classList && !parentEl.classList.contains('ant-menu-sub'))
          ) {
            hasParent.value = false;
          }
        }
      });
    });

    return {
      menu,
      isSubMenu,
      hasParent,
      SiderMenuItemRef,
    };
  },
});
</script>
