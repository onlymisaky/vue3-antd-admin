import {
  getCurrentInstance, computed, ComponentInternalInstance,
} from 'vue';

export function useVModel<P extends {}, K extends keyof P, >(
  props: Readonly<P>,
  name: K,
) {
  const { emit } = getCurrentInstance() as ComponentInternalInstance;
  return computed<P[K]>({
    get() {
      return props[name];
    },
    set(v) {
      emit(`update:${name}`, v);
    },
  });
}
