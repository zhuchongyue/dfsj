/** 基础事件*/
const BaseEventType = {
	ADD: 'add',
	REMOVE: 'remove',
	PRECOMPOSE: 'precompose', // 开始渲染之前
	POSTRENDER: 'postrender', // 开始渲染
	POSTCOMPOSE: 'postcompose', // 渲染完成
	PROPERTYCHANGE: 'propertychange', // 属性变化
	CHANGE: 'change', // change
	CHANGELAYERGROUP: 'change:layerGroup', // 图层组变化
	CHANGESIZE: 'change:size', // 大小变化
	CHANGETARGET: 'change:target', // target变化
	CHANGEVIEW: 'change:view' // 视图变化
}
const MapEventType = {
	MOVEEND: 'moveend', // 地图结束移动事件
	CHANGE: 'change',
	ERROR: 'error',
	BLUR: 'blur',
	CLEAR: 'clear',
	RESIZE: 'resize',
	LOAD: 'load',
	DRAGENTER: 'dragenter',
	DRAGOVER: 'dragover',
	DROP: 'drop',
	TOUCHMOVE: 'touchmove',
	FOCUS: 'focus',
	KEYDOWN: 'keydown',
	KEYPRESS: 'keypress',
	LOAD_SUCCESS: 'loadSuccess', // 地图初始化成功事件
	LOAD_FAILED: 'loadFailed', // 地图初始化成功事件
	TYPHOON: 'TYPHOON' //台风相关的事件
}

/** 鼠标事件*/
const MouseEventType = {
	CONTEXTMENU: 'contextmenu',
	CLICK: 'click',
	DB_CLICK: 'dblclick',
	SINGLE_CLICK: 'singleclick', // 单击事件
	WHEEL: 'wheel',
	POINTER_MOVE: 'pointermove' // 移动事件
}
/** overlay 事件*/
const OverlayEventType = {
	...BaseEventType,
	...MouseEventType,
	CLICK: 'click', // 点击事件
	DB_CLICK: 'dblclick', // 双击事件
	SINGLE_CLICK: 'singleclick', // 单击事件
	MOUSEOVER: 'mouseover', // 要素的鼠标移入事件
	MOUSEOUT: 'mouseout' // 要素的鼠标移出事件
}

const LayerEventType = {
	...BaseEventType
}
const LayerGroupEventType = BaseEventType
const PlotEventType = {
	DRAW_START: 'drawStart',
	DRAW_STOP: 'drawStop',
	EDIT_START: 'editStart',
	EDIT_STOP: 'editEnd',
	DRAW_ANCHOR: 'drawAnchor',
	CREATE_ANCHOR: 'createAnchor',
	UPDATE_ANCHOR: 'updateAnchor',
	ANCHOR_MOVING: 'anchorMoving',
	EDIT_ANCHOR_STOP: 'editAnchorStop',
	CLEAR_ANCHOR: 'clearAnchor'
}

export {
	PlotEventType,
	MouseEventType,
	BaseEventType,
	LayerEventType,
	OverlayEventType,
	LayerGroupEventType,
	MapEventType
}
