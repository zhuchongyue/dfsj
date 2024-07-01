import {Billboard, Point} from '../../overlay'
import OverlayType from "../../overlay/OverlayType";
import DrawPoint from "./DrawPoint";

const DEF_STYLE = {
	zIndex: 8,
	scale:0.5,
	image:'http://10.10.12.217:8078/images/layer/1/0.png',
	rotation:0,
	label:{
		font: '16px arial',
		color: '#ff00ff',
		offset: [0, 30],
		outlineWidth: 3,
		outlineColor: 'white',
		text:'测试的文字',
		textAlign:'center',
		outlineLineCap: 'round', // 设置线的两端为圆头
	}
}
export default class DrawBillboard extends DrawPoint {
	constructor(config) {
		super(config);
		const style = config?.style ?? {}
		this._style = {
			...DEF_STYLE,
			...style
		}
		console.log('this._style',this._style)
	}

	_mountedHook() {
		this._delegate = new Billboard(this._positions, {})
		this._delegate.attr = { id: this._id ,type:OverlayType.BILLBOARD,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}
}
