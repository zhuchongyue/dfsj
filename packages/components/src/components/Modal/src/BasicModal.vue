<script lang="tsx">
import {computed, defineComponent, ref, toRefs, Transition, unref, watch} from 'vue';
import {toBodyStyle, toMainStyle} from './utils';
import {baseProps, footerProps, headerProps} from './props';
import {useModalDragMove} from './hooks/useModalDrag';
import ModalHeader from './components/ModalHeader.vue';
import Icon from '../../Icon/src/Icon.vue';
import ModalFooter from './components/ModalFooter.vue';
import {moverClass} from './config';
import {getSlot} from '../../../utils/tsxHelper';
import {isFunction} from '../../../utils/is';

export default defineComponent({
    components: { ModalFooter, ModalHeader, Icon, Transition },
    props: { ...baseProps, ...headerProps, ...footerProps },
    name: 'BasicModal',
    setup(props, { slots, emit, expose, attrs }) {
      const destroyOnClose = ref(true);
      const { visible } = toRefs(props);
      const innerVisible = ref(visible.value || false);
      const draggable = ref(true);
      const maximum = ref(props.maximum || false);
      watch(
        () => visible.value,
        (value) => {
          innerVisible.value = value;
        },
        { deep: true }
      );
      const { moving, locator, sign } = useModalDragMove({
        maximum: maximum,
        props: props,
        draggable: draggable,
        visible: innerVisible,
        destroyOnClose: destroyOnClose,
        moverEl: moverClass,
      });
      watch(
        () => props.offset,
        // 合并定位属性
        (v) => v && Object.assign(locator, v),
        { immediate: true }
      );

      /** 最大最小*/
      function onSwitch() {
        moving.value = false;
        emit('update:maximum', (maximum.value = !maximum.value));
        emit('resize');
      }
      function onClose() {
        innerVisible.value = false;
        console.log('关闭', visible.value);
        emit('close');
      }
      const mainClass = computed(() => {
        let cls = [
          unref(maximum) ? 'maximum' : '',
          props.modally ? 'modally' : '',
          props.modalClass,
        ];
        return cls.join(' ');
      });
      // 内联样式
      const mainStyle = computed(() => toMainStyle(props, locator, maximum));
      const bodyStyle = computed(() => toBodyStyle(props, locator, maximum));  
      const getBindValue = computed(() => {
        return {
          ...attrs,
          ...slots,
          ...props,
          onSwitch: onSwitch,
          onClose: onClose,
          maximum: unref(maximum),
        };
      });

      const getTitleBefore = () => {
        const _slot = getSlot(slots, 'titleBefore', { ...props });
        const _slotFn = props?.titleBefore;
        return _slot ?? _slotFn;
      };
      const getTitleAfter = () => {
        const _slot = getSlot(slots, 'titleAfter', { ...props });
        const _slotFn = props?.titleAfter;
        return _slot ?? _slotFn?.();
      };
      const getTitle = () => {
        const _slot = getSlot(slots, 'title', { ...props });
        const _slotFn = props?.title;
        return _slot ?? isFunction(_slotFn) ? _slotFn?.() : _slotFn;
      };
      //自定义mover区域
      const hasMover = computed(()=>{
         return !!slots?.['mover']
      })
      return () => {
        return innerVisible.value ? (
          <div
            class={`component modal dialog component-modal-page-wrap ${mainClass.value}`}
            style={mainStyle.value as any}
          >
            <transition
              enter-active-class={props.animation?.enter || 'window--enter-active'}
              leave-active-class={props.animation?.leave || 'window--leave-active'}
              appear
            >
              <div
                ref={'body'}
                style={bodyStyle.value as any}
                class="modal--body component-modal-body"
              >
                <ModalHeader {...unref(getBindValue)}>
                  {{
                    headerBefore: () => getTitleBefore(),
                    icon: () =>  props.headerIcon ? <Icon color='white' size={26} icon={props.headerIcon} /> : null,
                    title: () => getTitle(),
                    headerAfter: () => getTitleAfter(),
                  }}
                </ModalHeader>
                <div class="modal--content component-modal-content">
                  {
                      hasMover.value && <div class={`mover ${moverClass}`}>
                      {
                        slots.mover?.()
                      }
                    </div>
                  }
                  {
                    slots.default?.()
                  }
                </div>

                <ModalFooter v-bind={getBindValue} />
              </div>
            </transition>
          </div>
        ) : null;
      };
    },
  });
</script>
