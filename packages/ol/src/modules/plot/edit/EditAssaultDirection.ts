//突击方向
import EditFineArrow from "./EditFineArrow";

export default class EditAssaultDirection extends EditFineArrow {
    constructor(style) {
        super(style)
        this.tailWidthFactor = 0.2
        this.neckWidthFactor = 0.25
        this.headWidthFactor = 0.3
        this.headAngle = Math.PI / 4
        this.neckAngle = Math.PI * 0.17741
    }
}
