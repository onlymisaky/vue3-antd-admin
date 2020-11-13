/**
 * @author zhushiqi
 * @description 存放一些和业务无关(或关系不大)的全局数据
 */

import { ref } from 'vue';
import { Singleton } from '@/utils/singleton';

@Singleton
export class AppService {
  static instance: AppService;

  static getInstance: () => AppService;

  loading = ref(false);

  viewKey = ref(0);

  reRenderApp() {
    this.viewKey.value += 1;
  }
}

export const appService = AppService.getInstance();
