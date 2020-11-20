import {
  ComponentPublicInstance,
  computed, Ref, ref, SetupContext,
} from 'vue';

export function useSelectTable(
  data: Ref<Obj[]>,
  tableRef: Ref<ComponentPublicInstance>,
  ctx: SetupContext,
  highlightClassName = 'high-light',
) {
  const selectedIndex = ref(-1);
  const dataCount = computed(() => data.value.length);
  const tableEl = computed<HTMLElement>(() => tableRef.value.$el);

  function scrollTable(
    index: number,
    tableWrapper: HTMLElement,
    trs: NodeListOf<HTMLElement>,
  ) {
    if (dataCount.value === 0) {
      selectedIndex.value = -1;
    }
    selectedIndex.value = index;
    if (tableEl.value.querySelector('.ant-table-scroll')) {
      let scrollHeight = 0;

      for (let i = 0; i < index; i += 1) {
        scrollHeight += trs[i].offsetHeight;
      }

      // eslint-disable-next-line no-param-reassign
      tableWrapper.scrollTop = scrollHeight;
    }
  }

  function setHighlight(index: number) {
    if (dataCount.value === 0) {
      selectedIndex.value = -1;
    }
    selectedIndex.value = index;

    const tableWrapper = tableEl.value.querySelector('div.ant-table-body') as HTMLElement;
    const trs = tableWrapper.querySelectorAll('.ant-table-row') as NodeListOf<HTMLElement>;
    trs.forEach((tr, i) => {
      if (index === i) {
        tr.classList.add(highlightClassName);
      } else {
        tr.classList.remove(highlightClassName);
      }
    });

    scrollTable(index, tableWrapper, trs);
  }

  function preSelect(action: 'next' | 'previous') {
    if (dataCount.value === 0) {
      selectedIndex.value = -1;
      return;
    }
    selectedIndex.value = action === 'next'
      ? selectedIndex.value + 1
      : selectedIndex.value - 1;

    if (selectedIndex.value > dataCount.value - 1) {
      selectedIndex.value = 0;
    }

    if (selectedIndex.value < 0) {
      selectedIndex.value = dataCount.value - 1;
    }

    setHighlight(selectedIndex.value);
  }

  function onPreSelectNext() {
    preSelect('next');
  }

  function onPreSelectPrevious() {
    preSelect('previous');
  }

  function selectData(index: number) {
    selectedIndex.value = index;
    ctx.emit('select', {
      index,
      row: data.value[index],
    });
  }

  return {
    selectedIndex,
    onPreSelectNext,
    onPreSelectPrevious,
    selectData,
    setHighlight,
  };
}
