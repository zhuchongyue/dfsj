import DrawFineArrow from './DrawFineArrow'
//突击方向
export default class DrawAssaultDirection extends DrawFineArrow {
	constructor(style) {
		super(style)
		// this.type = PlotTypes.ASSAULT_DIRECTION;
		this.tailWidthFactor = 0.2
		this.neckWidthFactor = 0.25
		this.headWidthFactor = 0.3
		this.headAngle = Math.PI / 4
		this.neckAngle = Math.PI * 0.17741
	}
}
