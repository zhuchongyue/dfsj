import {Point} from '../../overlay'
import OverlayType from "../../overlay/OverlayType";
import DrawPoint from "./DrawPoint";

const DEF_STYLE = {
	zIndex: 8,
	size:0,
	label:{
		font: '16px arial',
		color: '#ff00ff',
		offset: [0, 8],
		outlineWidth: 3,
		outlineColor: 'white',
		text:'测试的文字',
		textAlign:'center',
		outlineLineCap: 'round', // 设置线的两端为圆头
	}
}
export default class DrawText extends DrawPoint {
	constructor(style) {
		super(style);
		this._style = {
			...DEF_STYLE,
			...style
		}
	}

	_mountedHook() {
		this._delegate = new Point(this._positions, {})
		this._delegate.attr = { id: this._id ,type:OverlayType.TEXT,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	generate(position = this.positions) {
		const count = position.length
		if (count != 1) {
			return
		}
		this._delegate.setCoordinates(position?.[0])
	}
}
