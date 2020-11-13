import {
  computed, SetupContext,
} from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useProp2VModel<VM, P extends {} = any>(
  props: Readonly<P>,
  key: keyof P,
  ctx: SetupContext,
) {
  const vModel = computed<VM>({
    get() {
      return props[key] as unknown as VM;
    },
    set(val) {
      ctx.emit(`update:${key}`, val);
    },
  });
  return { vModel };
}
