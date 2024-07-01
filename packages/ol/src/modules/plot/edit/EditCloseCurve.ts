import {Polygon} from '../../overlay'
import Edit from './Edit'
import {Constants, getBisectorNormals, getCubicValue, getCurvePoints} from "../../utils/plot";

//曲线面
export default class EditCloseCurve extends Edit {
	public t: number
	constructor(style) {
		super(style)
		this.t = 0.3
		this.hasControlPoint = true;
	}
	getControlPoints(geometry = this._overlay){
		return this._overlay.attr.fixPoints ?? []
	}
	_mountedHook() {
		this._positions = this.getControlPoints();
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { ...this.attr}
		this._delegate.setStyle(this.style, {standard:true});
		this._layer.addOverlay(this._delegate)
		this.generate()
	}

	generate(newPoints = this._positions) {
		let pnts = JSON.parse(JSON.stringify(newPoints))
		pnts.push(pnts[0], pnts[1])
		let normals = []
		for (let i = 0; i < pnts.length - 2; i++) {
			let normalPoints = getBisectorNormals(this.t, pnts[i], pnts[i + 1], pnts[i + 2])
			normals = normals.concat(normalPoints)
		}
		let count = normals.length
		normals = [normals[count - 1]].concat(normals.slice(0, count - 1))

		let pList = []
		for (let i = 0; i < pnts.length - 2; i++) {
			let pnt1 = pnts[i]
			let pnt2 = pnts[i + 1]
			pList.push(pnt1)
			for (let t = 0; t <= Constants.FITTING_COUNT; t++) {
				let pnt = getCubicValue(
					t / Constants.FITTING_COUNT,
					pnt1,
					normals[i * 2],
					normals[i * 2 + 1],
					pnt2
				)
				pList.push(pnt)
			}
			pList.push(pnt2)
		}
		this._delegate.setCoordinates([pList])
		this._delegate.attr.lastFixPoints = [...newPoints]
	}
}
