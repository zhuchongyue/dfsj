import {h, ref} from 'vue';
import {watch} from 'vue';
import {defineComponent} from 'vue';
import './style.scss';

export default defineComponent({
    name: 'Legend',
    props: {
        modelValue: Number,
        title: String,
        items: Array,
        disable: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, context) {
        const index = ref<number | null | undefined>(props.modelValue);
        watch(
            () => props.modelValue,
            (value) => (index.value = value)
        );

        function onClick(value: number) {
            if (props.disable) return;
            if (index.value === value) {
                index.value = null;
            } else {
                index.value = value;
            }
            context.emit('update:model-value', index.value);
            //@ts-ignore
            context.emit('change', index.value, props?.items?.[index.value]);
        }

        return () =>
            h('div', {class: 'component legend'}, [
                h('label', {class: 'legend-title'}, props.title),
                h(
                    'ul',
                    props?.items?.map((e: any, i) => {
                        let [type, value] = e.style.split(':');
                        let style =
                            type === 'color'
                                ? h('span', {
                                    class: 'style color',
                                    style: {background: value},
                                })
                                : h('img', {class: 'style image', src: '/' + value});
                        return h(
                            'li',
                            {
                                key: i,
                                //@ts-ignore
                                class: {selected: i >= index.value},
                                onclick: () => onClick(i),
                            },
                            [
                                h('span', {
                                    class: [
                                        'index',
                                        i === index.value && !props.disable ? 'cursor' : '',
                                    ],
                                }),
                                style,
                                h('span', {class: 'label'}, e.label),
                            ]
                        );
                    })
                ),
            ]);
    },
});
