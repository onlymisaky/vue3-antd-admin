import { onMounted, onUnmounted, Ref } from 'vue';

export function useDocumentClick(el: Ref<HTMLElement>, cb: () => void) {
  function documentClick(event: MouseEvent) {
    const { target } = event;
    if (!el.value.contains(target as Node)) {
      cb();
    }
  }

  onMounted(() => {
    window.document.addEventListener('click', documentClick);
  });
  onUnmounted(() => {
    window.document.removeEventListener('click', documentClick);
  });
}
