export enum EventEnum {
    DRAW = 'draw', //开始标绘
    DRAW_STOP = 'drawStop', //结束标绘
    DRAW_PAUSE = 'drawPause', //标绘-暂停

    EDIT = 'edit', //开始编辑
    EDIT_STOP = 'editStop', //编辑结束
    EDIT_PAUSE = 'editPause', //编辑-暂停

    SAVE = 'save', //保存
    CLEAN = 'clean', //清除
}