<script lang="ts">
import {defineComponent, ref, Ref, watch} from 'vue';
import {WindowsProps} from './props';
import ModalWrap from './ModalWrap.vue';

export default defineComponent({
    name: 'Windows',
    props: WindowsProps,
    components: { ModalWrap },
    setup(props) {
      let zIndex = props.layer || 1000000000;
      const refs = ref([]) as Ref<HTMLElement[]>;
      const setRefs = (index: number) => (el: HTMLElement) => {
        refs.value[index] = el;
      };

      /**
       * 将id指定的组件放置到最前面（靠近用户）。
       * @param id 组件id
       * @param force 强制更新zIndex
       */
      function onFront(id: string, force: boolean = false) {
        console.log('refs', refs);
        const window = refs[id];
        if (window != null) {
          const _zIndex = window?.getZIndex();
          if (_zIndex < zIndex) {
            window?.setZIndex(++zIndex);
          }
        }
      }

      /**
       * 关闭组件。
       * @param id 组件id
       */
      function onClose(id: string) {
        const index = props.items.findIndex((e: any) => e.id === id);
        console.log('dddd',id,index)
        if (index >= 0) props.items.splice(index, 1);
        delete refs[id];
      }

      watch(
        () => props.front,
        (id) => onFront(id, true)
      );

      return {
        setRefs,
        zIndex,
        onClose,
      };
    },
  });
</script>

<template>
  <div class="component windows">
    <ModalWrap
      v-for="(item, index) in items"
      :key="item.id"
      :ref="setRefs(index)"
      :zIndex="item.zIndex || zIndex++"
      :options="item"
      @close="() => onClose(item.id)"
    />
  </div>
</template>
