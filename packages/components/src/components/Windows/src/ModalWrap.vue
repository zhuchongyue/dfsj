<script lang="ts">
import type {PropType, Ref} from 'vue';
import {defineAsyncComponent, defineComponent, h, onUnmounted, ref, watch} from 'vue';
import {BasicModal} from '../../Modal';
import {Options} from './props';

export default defineComponent({
    name: 'ModalWrap',
    props: {
      zIndex: Number,
      options: Object as PropType<Options>,
    },
    emits: ['close'],
    setup(props, context) {
      const options: any = props.options;
      const properties: Ref = ref(null);
      const zIndex = ref(props.zIndex);
      let isClosed = false;
      function onAction(name, ...args) {
        if (options.onAction) options.onAction(name, ...args);
        if (options.prevent !== true) context.emit('close');
      }
      function onSubmit(...args) {
        if (options.onSubmit) options.onSubmit(...args);
        if (options.prevent !== true) context.emit('close');
      }
      function onCancel(e?) {
        if (isClosed === true || e && e.type === 'cancel') return;
        if (options.onCancel) options?.onCancel();
        if (options.prevent !== true) context.emit('close');
        isClosed = true;
      }
      context.expose({
        setZIndex: (v) => (zIndex.value = v),
        getZIndex: () => zIndex.value,
      });
      watch(
        () => props.options.props,
        (v) => (properties.value = v),
        { immediate: true }
      );
      onUnmounted(onCancel);
      const isComponent = options.content instanceof Function;
      let component: any = isComponent
        ? defineAsyncComponent({
            loader: options.content,
            // loadingComponent: Loading,
            // errorComponent: Failed,
          })
        : undefined;

      if (options.directly === true) {
        component = isComponent ? defineAsyncComponent(options.content) : undefined;
        return () =>
          h(component, { ...properties.value, zIndex: zIndex.value, onSubmit, onCancel });
      }
      return () =>
        h(
          BasicModal,
          {
            ...options,
            visible: true,
            zIndex: zIndex.value,
            onSubmit,
            onCancel,
            onClose:onCancel,
            key: options.item?.id,
          },
          () =>
            isComponent
              ? h(component, {
                  ...properties.value,
                  onSubmit,
                  onCancel,
                  onAction,
                })
              : h('div', { class: 'html-content', innerHTML: options.content })
        );
    },
  });
</script>
