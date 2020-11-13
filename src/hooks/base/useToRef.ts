/* eslint-disable no-param-reassign */
import {
  computed, isRef, Ref, unref,
} from 'vue';

/**
 * 将一个 ref 或 reactive 转为 ref 。
 * ! 注意 它和 toRef toRefs 完全不一样
 * @param data
 */
export function useToRef<T extends object>(data: T | Ref<T>) {
  const refData = computed<T>({
    get() {
      return unref(data) as T;
    },
    set(val) {
      /**
       * todo 当修改某个属性值的时候，并不会触发 setter
       * 例如 refData.xxx = 123 可能代码的结果可能会像预期一样
       * 但是实际确实没有走 setter
       * 可能是因为 引用类型在内存中指向同一个地址的原因吧
       */
      if (isRef(data)) {
        data.value = {
          ...unref(data),
          ...val,
        };
      } else {
        for (const key in val) {
          const k = key as keyof T;
          data[k] = val[k];
        }
      }
    },
  });
  return refData;
}
