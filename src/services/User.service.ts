/**
 * @author zhushiqi
 * @description 用户信息
 */

import {
  computed, Ref, ref,
} from 'vue';
import { singleton } from '@/utils/singleton';
import { UserApi } from '@/api/User.api';
import { User } from '@/models/User.model';

export class UserService {
  userInfo = ref() as Ref<User>;

  permissions = computed<string[]>(() => {
    if (this.userInfo.value?.permissions?.length) {
      return this.userInfo.value.permissions;
    }
    return [];
  });

  getUserInfo(): Promise<{ name: string; permissions: string[] }> {
    if (this.userInfo.value) {
      return Promise.resolve(this.userInfo.value);
    }
    return UserApi.getUserInfo().then((response) => {
      this.userInfo.value = response.data.data;
      return response.data.data;
    });
  }

  logout() {
    window.location.href = '/logout';
  }
}

export const userService = singleton(UserService).getInstance();
