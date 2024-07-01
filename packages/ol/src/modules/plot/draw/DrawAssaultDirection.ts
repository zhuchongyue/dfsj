import DrawFineArrow from './DrawFineArrow';
import {Polygon} from '../../overlay'
import OverlayType from "../../overlay/OverlayType";
//突击方向
export default class DrawAssaultDirection extends DrawFineArrow {
	constructor(style) {
		super(style)
		this.tailWidthFactor = 0.2
		this.neckWidthFactor = 0.25
		this.headWidthFactor = 0.3
		this.headAngle = Math.PI / 4
		this.neckAngle = Math.PI * 0.17741
	}
	_mountedHook() {
		this._delegate = new Polygon(this._positions, {});
		this._delegate.attr = { id: this._id ,type:OverlayType.ASSAULT_DIRECTION,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}
}
