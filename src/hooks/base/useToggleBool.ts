import { ref } from 'vue';

export function useToggleBool(initVal = false) {
  const bool = ref(initVal);
  function toggle(val?: boolean) {
    if (typeof val === 'boolean') {
      bool.value = val;
    }
    bool.value = !bool.value;
  }

  return {
    bool, toggle,
  };
}
