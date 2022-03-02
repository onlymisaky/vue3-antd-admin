/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

import { App as AppInstance, ComponentPublicInstance } from 'vue';
import { Router } from 'vue-router';

let router: Router | null;
let appInstance: AppInstance | null;
let componentPublicInstance: ComponentPublicInstance | null;

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

export async function bootstrap() {
  // eslint-disable-next-line prefer-rest-params
  console.log(arguments);
  console.log('[vue] vue app bootstraped');
}

export function mountWrap(
  init: (container: HTMLElement | string, base?: string) => any,
) {
  return async (props: { container: HTMLElement }) => {
    console.log('[vue] props from main framework', props);
    const instance = init(props.container, '/vue3');
    router = instance.router;
    appInstance = instance.appInstance;
    componentPublicInstance = instance.componentPublicInstance;
  };
}

export async function unmount() {
  // eslint-disable-next-line prefer-rest-params
  console.log(arguments);
  appInstance?.unmount();
  router = null;
  console.log(componentPublicInstance);
}
