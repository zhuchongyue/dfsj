import {Polygon} from '../../overlay'
import Draw from './Draw'
import {Constants, distance, getBisectorNormals, getCubicValue, getThirdPoint, mid} from '../../utils/plot'

//集结地
export default class DrawGatheringPlace extends Draw {
	public t: number

	constructor(style) {
		super(style)
		this.t = 0.4
		this.fixPointCount = 3
	}

	_mountedHook() {
		this._delegate = new Polygon([this._positions], {})
		this._delegate.attr = {}
		this._delegate.setStyle(this._style)
		this._layer.addOverlay(this._delegate)
	}

	// _onAnchorMoving({position}) {
	//
	//     super._onAnchorMoving({position})
	//     // return
	//     this._delegate.setCoordinates([this._positions])
	// }

	/**
	 *
	 * @param position
	 * @public
	 */
	// _onDrawAnchor({position}) {
	//     this._positions.push(position)
	//     if (this._positions.length) {
	//         this._delegate.setCoordinates([this._positions])
	//         console.log('this._positions', this._delegate)
	//         this.drawTool.fire(new PlotEvent(PlotEventType.CREATE_ANCHOR, position))
	//     }
	// }

	generate() {
		let pnts = this.positions
		if (pnts.length < 2) {
			return
		}
		if (this.count == 2) {
			let m = mid(pnts[0], pnts[1])
			let d = distance(pnts[0], m) / 0.9
			let pnt = getThirdPoint(pnts[0], m, Constants.HALF_PI, d, true)
			pnts = [pnts[0], pnt, pnts[1]]
		}
		let m = mid(pnts[0], pnts[2])
		pnts.push(m, pnts[0], pnts[1])

		let normals = []
		for (let i = 0; i < pnts.length - 2; i++) {
			let pnt1 = pnts[i]
			let pnt2 = pnts[i + 1]
			let pnt3 = pnts[i + 2]
			let normalPoints = getBisectorNormals(this.t, pnt1, pnt2, pnt3)
			normals = normals.concat(normalPoints)
		}
		let count = normals.length
		normals = [normals[count - 1]].concat(normals.slice(0, count - 1))
		let pList = []
		let pnt1, pnt2
		for (let i = 0; i < pnts.length - 2; i++) {
			pnt1 = pnts[i]
			pnt2 = pnts[i + 1]
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
