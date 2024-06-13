//
// import OverlayType from './OverlayType'
// import Marker from './plots/Marker'
// import Polyline from './plots/Polyline'
// import Polygon from './plots/Polygon'
// import Circle from './plots/Circle'
// import Ellipse from './plots/Ellipse'
// import Rectangle from './plots/Rectangle'
// import AttackArrow from './plots/AttackArrow'
// import ClosedCurve from './plots/ClosedCurve'
// import Curve from './plots/Curve'
// import DoubleArrow from './plots/DoubleArrow'
// import FineArrow from './plots/FineArrow'
// import AssaultDirection from './plots/AssaultDirection'
// import FreehandLine from './plots/FreehandLine'
// import FreehandPolygon from './plots/FreehandPolygon'
// import GatheringPlace from './plots/GatheringPlace'
// import Lune from './plots/Lune'
// import Sector from './plots/Sector'
// import SquadCombat from './plots/SquadCombat'
// import StraightArrow from './plots/StraightArrow'
// import TailedAttackArrow from './plots/TailedAttackArrow'
// import TailedSquadCombat from './plots/TailedSquadCombat'
//
// import Arc from './plots/Arc'

import {OverlayType} from '../../overlay'
import Polyline from './Polyline'

/**
 * @classdesc 创建图元的基类
 * @author
 */
class GraphicsFactory {
	/**
	 * @static
	 * @param {OverlayType} type
	 * @param {ol.Coordinate} points
	 */
	static createPlot(type, points) {
		switch (type) {
			// case OverlayType.MARKER:
			// 	return new Marker(points);
			case OverlayType.POLYLINE:
				return new Polyline(points)
			// case OverlayType.POLYGON:
			// 	return new Polygon(points);
			// case OverlayType.CIRCLE:
			// 	return new Circle(points);
			// case OverlayType.ELLIPSE:
			// 	return new Ellipse(points);
			// case OverlayType.RECTANGLE:
			// 	return new Rectangle(points);
			// case OverlayType.ARC:
			// 	return new Arc(points);
			// case OverlayType.ATTACK_ARROW:
			// 	return new AttackArrow(points);
			// case OverlayType.CLOSED_CURVE:
			// 	return new ClosedCurve(points);
			// case OverlayType.CURVE:
			// 	return new Curve(points);
			// case OverlayType.DOUBLE_ARROW:
			// 	return new DoubleArrow(points);
			// case OverlayType.FINE_ARROW:
			// 	return new FineArrow(points);
			// case OverlayType.ASSAULT_DIRECTION:
			// 	return new AssaultDirection(points);
			// case OverlayType.FREEHAND_LINE:
			// 	return new FreehandLine(points);
			// case OverlayType.FREEHAND_POLYGON:
			// 	return new FreehandPolygon(points);
			// case OverlayType.GATHERING_PLACE:
			// 	return new GatheringPlace(points);
			// case OverlayType.LUNE:
			// 	return new Lune(points);
			// case OverlayType.SECTOR:
			// 	return new Sector(points);
			// case OverlayType.SQUAD_COMBAT:
			// 	return new SquadCombat(points);
			// case OverlayType.STRAIGHT_ARROW:
			// 	return new StraightArrow(points);
			// case OverlayType.TAILED_ATTACK_ARROW:
			// 	return new TailedAttackArrow(points);
			// case OverlayType.TAILED_SQUAD_COMBAT:
			// 	return new TailedSquadCombat(points);
		}
		return null
	}
}

export default GraphicsFactory
