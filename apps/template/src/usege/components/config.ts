import {defineAsyncComponent} from "vue";

const menusConfig = [
    {
        title: '基础对话框',
        id: 'basic-modal',
        icon:'fluent:board-16-filled',
        components:defineAsyncComponent(()=>import('/src/usege/components/modal/UModal.vue'))
    },
    {
        title: '看板',
        id: 'board',
        icon:'fluent:board-16-filled',
        components:defineAsyncComponent(()=>import('/src/usege/components/board/UBoard.vue'))
    },
    {
        title: '弹窗',
        id: 'modal',
        icon:'vaadin:modal-list',
        children: [
            {
                title: '基础对话框',
                id: 'basic-modal',
                components:defineAsyncComponent(()=>import('/src/usege/components/modal/UModal.vue'))
            },
            {
                title: '全局弹窗',
                id: 'complex-modal',
                components:defineAsyncComponent(()=>import('/src/usege/components/modal/UComplexModal.vue'))
            },
        ]
    },
    {
        title: '时间选择器',
        id: 'date-pick',
        icon:'fluent-mdl2:date-time',
        components:defineAsyncComponent(()=>import('/src/usege/components/date-pick/UDatePicker.vue'))
    },
    {
        title: '表单',
        id: 'form',
        icon:'fluent:form-24-filled',
        children: [
            {
                title: '基础',
                id: 'basic-form',
                components:defineAsyncComponent(()=>import('/src/usege/components/form/UForm.vue'))
            },
            {
                title: '高级',
                id: 'complex-form',
                components:''
            },
        ]
    },
    {
        title: '表格',
        id: 'table',
        icon:'radix-icons:table',
        children: [
            {
                title: '基础',
                id: 'basic-table',
                components:defineAsyncComponent(()=>import('/src/usege/components/table/UTable.vue'))
            },
            {
                title: '高级',
                id: 'complex-table',
                components:''
            },
        ]
    }

]

export {
    menusConfig
}