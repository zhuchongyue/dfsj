import {Polygon} from '../../overlay'
import Draw from './Draw'
import {Constants, getBisectorNormals, getCubicValue} from '../../utils/plot'
import OverlayType from "../../overlay/OverlayType";

export default class DrawClosedCurve extends Draw {
	private t: number

	constructor(style) {
		super(style)
		this.t = 0.3
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = { id: this._id ,type:OverlayType.CLOSED_CURVE,plot:true }
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}
	generate(position = this.positions) {
		let count = position.length
		if (count < 2) {
			return
		}
		if (count == 2) {
			this._delegate.setCoordinates([position])
		} else {
			let pnts = position
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
		}
	}
}
