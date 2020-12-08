/**
 * @author zhushiqi
 * @description 权限
 *  计划将所有的按钮权限都维护在这里，所以这个文件可能会很长很长
 *  从名称层面来分模块，比如 doctorAdd doctorExport
 */

import { computed } from 'vue';
import { Singleton } from '@/utils/singleton';
import { userService } from './User.service';

@Singleton
export class PermissionService {
  static instance: PermissionService;

  static getInstance: () => PermissionService;

  articleEdit = computed(() => this.hasPermission(['article:edit']));

  articleAdd= computed(() => this.hasPermission(['article:add']));

  hasPermission(permissions: string[]) {
    if (!permissions || permissions.length === 0) return true;
    const myPermissions = userService.permissions.value;
    return permissions.includes('*')
      ? true
      : myPermissions.some((permission) => permission === '*' || permissions.includes(permission));
  }
}

export const permissionService = PermissionService.getInstance();
